import jwt from "jsonwebtoken";

const genToken = (userId) => {
    const normalizedId = typeof userId === 'string' ? userId : String(userId);
    const payload = { sub: normalizedId };
    const key = process.env.JWT_SECRET;

    const options = {
      expiresIn: '7d',
      issuer: 'zentra-api'
    };
    return jwt.sign(payload, key, options);
}
export default genToken;