const Router = require('express')

const {registerUser} = require('../controller/auth.controller')


const router = Router()

router.route("/register").post(registerUser)