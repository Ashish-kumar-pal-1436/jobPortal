
import mongoose from 'mongoose'

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

export const User = mongoose.model("User", userSchema)

