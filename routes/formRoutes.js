const express = require("express");
const { createForm } = require("../controllers/formController");

const router = express.Router();

router.post("/form", createForm);

module.exports = router;
