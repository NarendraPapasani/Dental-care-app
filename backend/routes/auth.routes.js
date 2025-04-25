const router = require("express").Router();
const { login, signup } = require("../controllers/auth.controllers.js");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
