import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

export const updateBio = asyncHandler(async (req, res) => {

    // Find the user by ID (using req.user.id if authenticated)
    const user = await User.findById(req.user.id).select("-password");
    console.log('user is: ', user);


    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update the bio with the value from the request body
    user.bio = req.body.bio;

    // Save the updated user data
    await user.save();


    // Send a success response
    res.status(200).json({
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
    });
});