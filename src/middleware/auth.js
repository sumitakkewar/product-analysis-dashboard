import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the decoded user information to the request object
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired'
            });
        }
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}; 