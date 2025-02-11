const { Router } = require("express");
const repoLinkRouter = require("./deployRoutes");

const v1Router = Router();

v1Router.use("/deploy", repoLinkRouter);

module.exports = v1Router;
