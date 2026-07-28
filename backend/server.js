
import dotenv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/shared/db/db.js'

dotenv.config({
    path: './.env'
})
// connectDB()
// .then(() =>{
//       app.listen(process.env.PORT, () =>{
//       console.log(`Server is running on PORT : ${process.env.PORT}`)
// })
// })
// .catch( (err) =>{
//       console.log("MongoDB Connection failed :", err)
// });

app.listen(3000, () => {
      console.log("Server is running on port 3000")
})

