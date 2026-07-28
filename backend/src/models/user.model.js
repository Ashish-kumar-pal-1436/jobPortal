const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

           firstname: {
             type: String,
             required: true,
             trim: true,
             minLength: [3],
             maxLength: [25],
           },

           lastname: {
             type: String,
             required: true,
             trim: true,
             minLength: [3],
             maxLength: [25]
           },

           username: {
             type: String,
             required: true,
             trim: true,
             minLength: [3],
             maxLength: [25],
             unique: true,
           },

           email: {
             type: String,
             required: true,
             trim: true,
             unique: true,
             lowercase: true,
           },

           password: {
             type: String,
             required: [true, "Password is required"],

             select: false
           },

           role: {
             type: String,
             enum:[
                "candidate",
                "admin",
                "recruiter"
             ],

             default: "candidate"
           }, 

            avatar: {
                type: String,
                default: "",
              },

            coverImage: {
                type: String,
                default: ""
            },

             isEmailVerified: {
               type: Boolean,
               default: true,
             },

         refreshToken: {
           type: String,
           default: null,
          },

    lastLogin: Date,

}, {timestapms: true})


userSchema.pre("save", async function() {
      if(!this.isModified('password')) return 
       this.password = await bcrypt.hash(this.password, 12)  
} ) 

userSchema.methods.isPosswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         username: this.username,
         fullname: this.fullname
      },
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = async function(){
      return jwt.sign(
        {
          _id: this._id
        },
          process.env.REFRESH_TOKEN_SECRET,
          {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
       )
}

export const User = mongoose.model("User", userSchema)