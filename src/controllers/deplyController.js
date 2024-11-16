const Aws = require("../services/AWS");

exports.deployNewInstance = async (req, res) => {
  const { public_repository_url, is_typescript, env, title, instance_type } =
    req.body;

  try {
    const aws = Aws.getInstance();
    const instance = await aws.createInstance(title, instance_type);
    const instanceId = instance.Instances[0].InstanceId;

    await aws.setupInstance(instanceId);
    await aws.deployProject(
      instanceId,
      public_repository_url,
      is_typescript,
      env
    );

    const publicIp = await aws.getInstancePublicIp(instanceId);
    res.status(200).json({ instanceId, publicIp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deployExistingInstance = async (req, res) => {
  const { instance_id, public_repository_url, is_typescript, env } = req.body;

  try {
    const aws = Aws.getInstance();
    await aws.setupInstance(instance_id);
    await aws.deployProject(
      instance_id,
      public_repository_url,
      is_typescript,
      env
    );

    const publicIp = await aws.getInstancePublicIp(instance_id);
    res.status(200).json({ instanceId: instance_id, publicIp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
