// signup controller

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from 'bcrypt'

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    console.log('request body: ',req.body);
    console.log('request file: ',req.file);


    // Check for required fields
    if ([ email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Handle profile image upload
    const profileImageLocalPath = req.file.path;
    console.log('profile image local path: ',profileImageLocalPath);

    let profileImageUrl = null;
    let profileImagePublicId = null;


    if (profileImageLocalPath) {
        const response = await uploadOnCloudinary(profileImageLocalPath);
        console.log('profile image url: ',response);
        if (response) {
            profileImageUrl = response.url;
            profileImagePublicId = response.public_id;
            console.log('Profile image uploaded to Cloudinary');
        } else {
            throw new ApiError(500, "Failed to upload profile image");
        }
    }


    // Create the user
    const user = await User.create({
        profileImage: profileImageUrl,
        profileImagePublicId: profileImagePublicId,
        email,
        password: hashedPassword,
        username: username,
    });

    // Check if user creation was successful
    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Exclude sensitive information
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to retrieve created user");
    }

    // Return response with access token
    res.status(201).json({
        accessToken: process.env.ACCESS_TOKEN,
        user: createdUser,
    });
});

export { registerUser };