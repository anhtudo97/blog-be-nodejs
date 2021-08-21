const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
    const autheHeader = req.header.token;

    if (autheHeader) {
        const token = autheHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) res.status(403).json("Token is invalid");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("Your are not authenticated");
    }
};

module.exports = verify;