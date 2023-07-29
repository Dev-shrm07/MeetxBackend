import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import meetorute from "./routes/meets"
import morgan from "morgan"
import userRoute from "./routes/user"
import {requireAuth} from './middleware/auth'
import createHttpError, {isHttpError} from "http-errors"
import session from "express-session"
import env from './utils/validateEnv'
import MongoStore from "connect-mongo";
import cors from "cors"
const app = express();

app.set("trust proxy", 1)
app.use(morgan("dev"))

app.use(express.json())

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 60*60*1000
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING
  }),
}))


app.use('/api/users', userRoute)

app.use("/api/meets", requireAuth, meetorute)


app.use((req, res, next) => {
  next(createHttpError(404, "Not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errormsg = "An unknown error occurs";
  let statuscode = 500;
  if(isHttpError(error)){
    statuscode = error.status
    errormsg = error.message
  }
  res.status(statuscode).json({ error: errormsg });
});

export default app;
