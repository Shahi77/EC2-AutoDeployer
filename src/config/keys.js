module.exports = {
  aws: {
    ami: process.env.AWS_AMI_ID,
    securityGroup: process.env.AWS_SECURITY_GROUP_ID,
    iamRole: process.env.AWS_IAM_ROLE_NAME,
    region: process.env.AWS_REGION,
  },
};
