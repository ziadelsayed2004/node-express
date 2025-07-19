const jwt = require('jsonwebtoken');

module.exports = async (user) => {
    const token = await jwt.sign(
        {
            _id: user._id?.toString(),
            role: user.role
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1m' }
    );
    return token;
};
