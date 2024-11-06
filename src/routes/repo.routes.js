const { Router } = require("express");
const { getRepoLink } = require("../controllers/repo.controller");

const repoLinkRouter = Router();
repoLinkRouter.get("/deploy/:owner/:repo", getRepoLink);

module.exports = repoLinkRouter;
