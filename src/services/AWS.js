const {
  EC2Client,
  RunInstancesCommand,
  DescribeInstancesCommand,
  waitUntilInstanceStatusOk,
} = require("@aws-sdk/client-ec2");
const {
  SSMClient,
  SendCommandCommand,
  GetCommandInvocationCommand,
} = require("@aws-sdk/client-ssm");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { aws } = require("../config/keys"); // Ensure aws config has correct keys for the region, AMI, etc.
const extractProjectName = require("../utils/extractProjectName"); // Import extractProjectName function if it exists

class Aws {
  static #instance = null;
  static #ec2Client = null;
  static #ssmClient = null;

  // Singleton instance for AWS clients
  static getInstance() {
    if (!Aws.#instance) {
      Aws.#instance = new Aws();
      Aws.#ec2Client = new EC2Client({
        region: aws.region,
        credentials: fromEnv(),
      });
      Aws.#ssmClient = new SSMClient({
        region: aws.region,
        credentials: fromEnv(),
      });
    }
    return Aws.#instance;
  }

  // Create an EC2 instance with optional title and instance type
  async createInstance(title = null, instanceType = "t2.micro") {
    try {
      const params = {
        ImageId: aws.ami,
        InstanceType: instanceType,
        MinCount: 1,
        MaxCount: 1,
        SecurityGroupIds: [aws.securityGroup],
        TagSpecifications: [],
        IamInstanceProfile: {
          Name: aws.iamRole,
        },
      };

      if (title) {
        params.TagSpecifications.push({
          ResourceType: "instance",
          Tags: [
            {
              Key: "Name",
              Value: title,
            },
          ],
        });
      }

      const createInstanceCommand = new RunInstancesCommand(params);
      const res = await Aws.#ec2Client.send(createInstanceCommand);
      return res;
    } catch (error) {
      console.log("Error creating an EC2 instance:", error);
    }
  }

  // Retrieve the public IP of an EC2 instance
  async getInstancePublicIp(instanceId) {
    try {
      const command = new DescribeInstancesCommand({
        InstanceIds: [instanceId],
      });
      const res = await Aws.#ec2Client.send(command);
      const instance = res.Reservations[0].Instances[0];
      return instance.PublicIpAddress;
    } catch (error) {
      console.log("Error in fetching instance details:", error);
    }
  }

  // Setup EC2 instance for Node.js
  async setupInstance(instanceId) {
    try {
      console.log(`Waiting for instance ${instanceId} to be running`);
      await waitUntilInstanceStatusOk(
        { client: Aws.#ec2Client, maxWaitTime: 600 },
        { InstanceIds: [instanceId] }
      );
      console.log(`Instance ${instanceId} is up and running`);

      const commands = [
        "cd /root",
        "sudo apt update -y && sudo apt upgrade -y",
        "sudo apt install -y nodejs",
        "sudo apt install -y npm",
        "npm install -g pm2",
      ];

      const params = {
        InstanceIds: [instanceId],
        DocumentName: "AWS-RunShellScript",
        Parameters: {
          commands: commands,
        },
      };

      const command = new SendCommandCommand(params);
      const res = await Aws.#ssmClient.send(command);
      const commandId = res.Command.CommandId;
      console.log(`Sent command ${commandId} to set up the instance`);

      let status;
      do {
        const invocationParams = {
          CommandId: commandId,
          InstanceId: instanceId,
        };

        const invocation = await Aws.#ssmClient.send(
          new GetCommandInvocationCommand(invocationParams)
        );
        status = invocation.Status;

        if (status === "Success") {
          console.log("Commands executed successfully");
          return res;
        }
        if (status === "Failed") {
          console.error("Commands failed to execute");
          return res;
        }

        // Wait before polling again
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } while (status === "InProgress" || status === "Pending");
    } catch (error) {
      console.log("Error setting up the environment for Node.js:", error);
    }
  }

  // Deploy project on EC2 instance
  async deployProject(instanceId, repositoryUrl, isTypescript, env) {
    try {
      const projectName = extractProjectName(repositoryUrl);
      console.log("Cloning", repositoryUrl);

      // Modified command format using template literals properly
      const commands = [
        "cd /root",
        `git clone ${repositoryUrl}`,
        `cd ${projectName}`,
        "touch .env",
        `echo "${env.join("\n")}" > .env`,
        "npm install",
      ];

      if (isTypescript) {
        commands.push(
          "npm i -g typescript",
          "tsc",
          "sudo pm2 start dist/index.js --name backend -i max"
        );
      } else {
        commands.push("sudo pm2 start src/index.js --name backend -i max");
      }

      console.log("Cloning and deploying project");

      const params = {
        InstanceIds: [instanceId],
        DocumentName: "AWS-RunShellScript",
        Parameters: {
          commands: commands,
        },
      };

      const command = new SendCommandCommand(params);
      const res = await Aws.#ssmClient.send(command);
      const commandId = res.Command.CommandId;
      console.log(`Sent command ${commandId} to deploy the project`);

      let status;
      do {
        const invocationParams = {
          CommandId: commandId,
          InstanceId: instanceId,
        };

        const invocation = await Aws.#ssmClient.send(
          new GetCommandInvocationCommand(invocationParams)
        );
        status = invocation.Status;

        if (status === "Success") {
          console.log("Commands executed successfully");
          return res;
        }
        if (status === "Failed") {
          console.error("Commands failed to execute");
          return res;
        }

        // Wait before polling again
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } while (status === "InProgress" || status === "Pending");
    } catch (error) {
      console.log("Error deploying the project:", error);
    }
  }
}

module.exports = Aws;
