import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const logoutUser = asyncHandler(async (req, res) => {
    // Get the token from headers or cookies
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    // If no token found, user is not authenticated
    if (token === null) {
        throw new ApiError(401, "User not authenticated");
    }

    // Clear the token cookie from the client (for future requests)
    res.clearCookie('token');

    // Send response
    res.status(200).json({ message: 'Logged out successfully' });
});

export { logoutUser };