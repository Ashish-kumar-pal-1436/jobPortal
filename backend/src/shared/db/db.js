import mongoose from "mongoose";


const connectDB = async() =>{
     try {
          const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
          console.log("MONGODB CONNECTED PORT :", connectionInstance.connection.host)

     } catch (error) {
        console.error("MONGODB ERROR :", error)
        process.exit(1)
     }
}

export default connectDB
