import mongoose from "mongoose";


const connectDB = async() =>{
     try {
          console.log(process.env.MONGO_URI)
          const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
          console.log(process.env.MONGO_URI)
          console.log(connectionInstance)
          console.log("MONGODB CONNECTED PORT :", connectionInstance.connection.host)

     } catch (error) {
        
        console.log(error)
        process.exit(1)
     }
}

export default connectDB
