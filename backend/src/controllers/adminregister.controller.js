// signup controller

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const adminRegister = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    console.log('request body: ',req.body);
    console.log('request file: ',req.file);


    // Check for required fields
    if ([ email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if admin already exists
    const existedAdmin = await Admin.findOne({
        $or: [{ username }, { email }]
    });

    if (existedAdmin) {
        throw new ApiError(409, "User already exists");
    }


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



    // Create the admin
    const admin = await Admin.create({
        profileImage: profileImageUrl,
        profileImagePublicId: profileImagePublicId,
        email,
        password,
        username: username,
    });

    // Check if admin creation was successful
    if (!admin) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Exclude sensitive information
    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    if (!createdAdmin) {
        throw new ApiError(500, "Failed to retrieve created user");
    }

    // Return response with access token
    res.status(201).json({
        accessToken: process.env.ACCESS_TOKEN,
        admi: createdAdmin,
    });
});

export { adminRegister };