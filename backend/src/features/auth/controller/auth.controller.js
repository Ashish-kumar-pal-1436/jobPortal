
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

const loginuser = asyncHandler (async (req, res) =>{

      // req body --> data
      // username or email --> login
      // find the user
      // password check
      // access and refresh token
      // send cookie
      // send responce 

       // req body --> data
       const {email, username, password} = req.body

       // username or email --> login

       if(!username && !email){
         throw new ApiError(401, "Username or password is required")
       }

     // find the user
     const user = userModel.findOne({
        $or:[{email}, {username}]
     })

     if(!user){
        throw new ApiError(404, "User doesn't exist")
     }

     // password check

     const isPasswordValid = await user.isPasswordCorrect(password)
     if(! isPasswordValid) {
        throw new ApiError(401, "Invalid user creadintial")
     }

     // access and refresh token

     const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
     const loggedinUser = await userModel.User.findById(user_id).select("-password -refreshToken")

     const options = {
        httpOnly: true,
        secure: true
     }

      // send cookie
      // send responce 

      return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponce( 201,

            {user: loggedinUser, accessToken, refreshToken},

            "Logged In Successfully"
         )
      )


})

const loggedoutUser = asyncHandler( async (req, res) =>{
     await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },

        {
            new: true
        }
     )

     const options = {
        httpOnly: true,
        secure: true
     }

     return res
     .status(200)
     .clearCookie("accessToken", accessToken, options)
     .clearCookie("refreshToken", refreshToken, options)
     .json(
        new ApiResponce(201, "User logged out successfully")
     )

})

const refreshAccessToken = asyncHandler( async (req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(! incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Access")
    }

    try {
        
        const decodedToken = jwt.verify(
           incomingRefreshToken,
           process.env.REFRESH_TOKEN_SECRET
        )

        const user = userModel.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options ={
            httpOnly: true,
            secure: true
        }

        const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

        return res
        .status(201)
        .cookie("AccessToken", accessToken, options)
        .cookie("newRefreshToken", newRefreshToken, options)
        .json(
            new ApiResponce(200,
              {
                 accessToken, refreshToken: newRefreshToken
              },
              "Access token refrshed successfuly"
            )
        )


    } catch (error) {
        throw new ApiError(401, error?.message, "Invalid refresh token")
    }
})

const forgotPassword = asyncHandler( async (req, res) =>{
     try {
        const {email} = req.body
        const user = User.findOne({email})
        if(!user){
            return res
            .status(201)
            .json({
                success: true,
                message: "If user exist reset link send the send"
            })
        }

     } catch (error) {
        throw new ApiError(401,"Something went wrong")
     }
})

module.exports = {
    userRegister,
    loginuser,
    refreshAccessToken,
    forgotPassword
}