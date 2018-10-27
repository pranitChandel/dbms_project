const express = require("express");
const router = express.Router();

//@route   GET api/users/test
//@desc    Tests posts route
//@access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;
