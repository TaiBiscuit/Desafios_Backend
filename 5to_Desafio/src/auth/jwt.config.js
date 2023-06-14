import jwt from 'jsonwebtoken';

const PRIVATE_KEY = 'abcdef123456';

const generateToken = (user) => {
    return jwt.sign(user, PRIVATE_KEY, { expiresIn: '24h' });
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization; 
    if (!authHeader) return res.status(403).send({ err: 'Se requiere autenticación' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
        if (err) return res.status(403).send({ err: 'Se requiere autenticación' });

        req.user = credentials.user;
        next();
    });
}

export { generateToken, authToken }