import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { unlinkFromCloudinary } from "../utils/cloudinary.js";

const updateProfile = asyncHandler(async (req, res) => {


    const userId = req.user.id;
    const { email, username } = req.body;


    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    let profileImageUrl = user.profileImage;
    console.log(profileImageUrl);

    if (req.file) {
        const profileImageLocalPath = req.file.path;
        console.log(profileImageLocalPath);

        if (user.profileImage) {
        await unlinkFromCloudinary(user.profileImage);
        }

        profileImageUrl = await uploadfOnCloudinary(profileImageLocalPath);
        console.log('profile image url :', profileImageUrl);
        
        if (!profileImageUrl) {
            throw new ApiError(500, "Failed to upload profile image");
        }
    }
    else{
        console.log("nothing");
    }


    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            email,
            username: username,
            profileImage: profileImageUrl,
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError(500, "Failed to update user profile");
    }

    // Exclude sensitive information from the response
    const { password, refreshToken, ...userWithoutSensitiveData } = updatedUser.toObject();

    // Return the updated user and profile image URL
    res.status(200).json({
        user: userWithoutSensitiveData,
        profileImage: profileImageUrl,
    });
});

export { updateProfile };