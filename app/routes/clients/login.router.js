const router = require("express").Router();
const loginController = require("../../controllers/clients/login.controller.js");

router.post("/", loginController.login);

module.exports = router;
