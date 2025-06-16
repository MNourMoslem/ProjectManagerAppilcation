import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	// Check for token in cookie or Authorization header
	const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
	
	if (!token) {
		console.log('No token found in request');
		return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			console.log('Token verification failed - no decoded data');
			return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
		}

		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken:", error.message);
		return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
	}
};