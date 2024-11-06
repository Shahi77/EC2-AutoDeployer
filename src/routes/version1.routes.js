const { Router } = require("express");
const repoLinkRouter = require("./repo.routes");

const v1Router = Router();

v1Router.use("/repo", repoLinkRouter);

module.exports = v1Router;
