import mongoose from "mongoose";
import {DB_NAME} from '../../constant.js'


const connectDB = async() =>{
     try {
          const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
          console.log("MONGODB CONNECTED PORT :", connectionInstance.connection.host)

     } catch (error) {
        console.error("MONGODB ERROR :", error)
     }
}

export default connectDB
