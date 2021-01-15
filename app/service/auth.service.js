const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");

exports.verifyToken = async (token) => {
    if (token) {
        try {
            let response = await jwt.verify(token, config.secret);
            return response.id;
        } catch (error) {
            return false;
        }
    } else {
        return false;
    }
}

exports.signToken = (id) => {
    let token = jwt.sign(
        { id: id },
        config.secret,
        { expiresIn: 3600 }
    );
    return token;
}
