const Aws = require("../services/AWS");

const deployNewInstance = async (req, res) => {
  const { public_repository_url, is_typescript, env, title, instance_type } =
    req.body;

  try {
    const aws = Aws.getInstance();
    console.log("Creating a new EC2 instance");

    const instance = await aws.createInstance(title, instance_type);
    if (!instance || !instance.Instances || instance.Instances.length === 0) {
      throw new Error("Failed to create EC2 instance.");
    }

    const instanceId = instance.Instances[0].InstanceId;
    console.log(`Instance created: ${instanceId}`);

    console.log("Setting up instance");
    await aws.setupInstance(instanceId);

    console.log("Deploying project");
    await aws.deployProject(
      instanceId,
      public_repository_url,
      is_typescript,
      env
    );

    console.log("Fetching public IP");
    const publicIp = await aws.getInstancePublicIp(instanceId);
    if (!publicIp) {
      throw new Error("Failed to retrieve public IP of instance.");
    }

    res.status(200).json({ instanceId, publicIp });
  } catch (error) {
    console.error("Error deploying new instance:", error);
    res.status(500).json({ error: error.message });
  }
};

const deployExistingInstance = async (req, res) => {
  const { instance_id, public_repository_url, is_typescript, env } = req.body;

  try {
    const aws = Aws.getInstance();
    console.log(`Checking if instance ${instance_id} is running...`);
    const instanceStatus = await aws.getInstanceStatus(instance_id);

    if (instanceStatus !== "running") {
      console.log(
        `Instance ${instance_id} is not running. Attempting to start...`
      );
      await aws.startInstance(instance_id);
      await aws.waitForInstance(instance_id);
    }

    console.log("Setting up instance and deploying");
    await aws.setupInstance(instance_id);
    await aws.deployProject(
      instance_id,
      public_repository_url,
      is_typescript,
      env
    );

    console.log("Fetching public IP");
    const publicIp = await aws.getInstancePublicIp(instance_id);
    if (!publicIp) {
      throw new Error("Failed to retrieve public IP of instance.");
    }

    res.status(200).json({ instanceId: instance_id, publicIp });
  } catch (error) {
    console.error("Error deploying on existing instance:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deployNewInstance, deployExistingInstance };
