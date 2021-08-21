const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const verify = require("../verifyToken");

// update user
router.put("/:id", verify, async(req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(15);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id, {
                    $set: req.body,
                }, { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can update only your account");
    }
});

// Delete account
router.delete("/:id", verify, async function(req, res) {
    if (req.params.id === req.body.userId) {
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted");
            } catch (error) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.state(404).json("User not found");
        }
    } else {
        res.status(401).json("You can delete only your accont");
    }
});

// get user
router.get("/:id", verify, async(req, res) => {
    try {
        const user = User.findById(req.params.id);
        const { password, ...infor } = user._doc;
        res.status(200).json(infor);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;