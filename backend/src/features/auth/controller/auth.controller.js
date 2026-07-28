
const userModel = require('../../../models/user.model')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../../../shared/uitls/asyncHandler')
const ApiError = require("../../../shared/uitls/ApiError")
const ApiResponce = require("../../../shared/uitls/ApiResponce")
const cloudinary = require('../../../shared/uitls/cloudinary')

const generateAccessTokenAndRefreshToken = async (userId) =>{
     try {
        const user = await userModel.findOne(userId)
   
        const accessToken =  user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

     } catch (error) {
        console.error(error)
     }


}

const userRegister = asyncHandler (async (req, res) =>{

     // get user details from frontend
     // validation - not empty
     // check if user already exists : username , email
     // check for images, check for avatar
     // upload them to clodinary
     // create user object - create entry in db
     // remove password and refresh token field from response
     // check for user creation
     // return res


     //get user details from frontend
    const {email,username,fullname,password} = req.body

    // validation - not empty


    //we can do one by one for all the fields 
    // if(username===""){
    //     throw new ApiError("username is required")
    // }


    //better way to handle

    if(
        [email,username,fullname,password].some((field) =>
            field.trim() === ""
        )
    ){
        throw new ApiError(400, "All fields are required")
    }

    //find existed user 

    const existedUser = () =>{
        await userModel.findOne({
            $:[{email}, {username}]
        })
    }

    if(existedUser){
        throw new ApiError(409, "User with this email or username already existed")
    }

    //check for image, avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    
    //upload on cloudinary

    const avatar = await cloudinary.uploadOnCloudinary(avatarLocalPath)
    const coverImage = await cloudinary.uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(404, "Avatar is required")
    }

    // create user object - create entry in db

    const user = userModel.create({
         fullname,
         avatar= avatar.url,
         coverImage = coverImage?.url || "",
         username,
         email,
         password,
         role  
    })

    // remove password and refresh token field from response

    const createdUser = await userModel.User.findById(user._id).some(
        "-password -refreshToken"
    )

    // check for user creation

    if(!createdUser){
        throw new ApiError(401, "Something went Wrong ")
    }

    // return res

    return res.status(201).json(
        new ApiResponce(201, createdUser, "User created Successfully")
    )


})