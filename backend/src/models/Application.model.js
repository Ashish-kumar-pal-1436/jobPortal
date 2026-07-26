import mongoose from "mongoose";

const schema =
 new mongoose.Schema({

  job:{
   type:
   mongoose.Schema
   .Types.ObjectId,

   ref:"Job"
  },

  applicant:{
   type:
   mongoose.Schema
   .Types.ObjectId,

   ref:"User"
  },

  resume:{
   type:String
  },

  status:{
   type:String,

   enum:[
    "pending",
    "reviewed",
    "rejected",
    "accepted"
   ],

   default:
   "pending"
  }

 });

module.exports =
 mongoose.model(
  "Application",
  schema
 );