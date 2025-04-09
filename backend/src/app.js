import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"

const app = express()

app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))



app.post('/test', (req, res) => {
    console.log('Request file:', req.file); // Log the file
    console.log('Request body:', req.body); // Log the body
    res.status(200).json({ message: "Success" });
});



// client
import userRouter from './routes/user.routes.js';
import signinRouter from './routes/signin.routes.js';
import logoutRouter from './routes/logout.routes.js'
import getprofileRouter from './routes/getprofile.routes.js'
import updateProfileRouter from './routes/updateprofile.routes.js'
import updateBioRouter from './routes/bio.routes.js'


// admin
import adminLoginRouter from './routes/adminlogin.routes.js'
import adminProfileRouter  from "./routes/adminprofile.routes.js";
import adminRegisterRouter from './routes/adminregister.routes.js'
import adminProductRouter from './routes/admindashboard.routes.js'
import adminProductFetchRouter from './routes/adminfetchproducts.routes.js'


// client
app.use("/api/v1/users", userRouter)
app.use("/api/v1/users", signinRouter)
app.use("/api/v1/users", logoutRouter)
app.use("/api/v1/users", getprofileRouter)
app.use("/api/v1/users", updateProfileRouter)
app.use("/api/v1/users", updateBioRouter)


// admin
app.use("/api/v1/admin", adminLoginRouter)
app.use("/api/v1/admin", adminProfileRouter)
app.use("/api/v1/admin", adminRegisterRouter)
app.use("/api/v1/admin", adminProductRouter)
app.use("/api/v1/admin", adminProductFetchRouter)


export { app }