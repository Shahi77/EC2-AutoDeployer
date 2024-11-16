const express = require("express");
const {
  deployNewInstance,
  deployExistingInstance,
} = require("../controllers/deployController");
const router = express.Router();

router.post("/new-instance", deployNewInstance);
router.post("/existing-instance", deployExistingInstance);

module.exports = router;
