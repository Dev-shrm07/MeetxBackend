import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import phash from "password-hash";
import user from "../models/user";

export const getauthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    
    const user = await UserModel.findById(req.session.userId).select('email username').exec();
    req.session.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface signupBody {
  username?: string;
  email?: string;
  password?: string;
}

export const Signup: RequestHandler<
  unknown,
  unknown,
  signupBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordraw = req.body.password;
  try {
    if (!username || !passwordraw || !email) {
      throw createHttpError(400, "parameters are missing");
    }
    const existingusername = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingusername) {
      throw createHttpError(409, "Username already exists");
    }
    const existingemail = await UserModel.findOne({ email: email }).exec();
    if (existingemail) {
      throw createHttpError(409, "Email already exists");
    }
    const passwordHashed = phash.generate(passwordraw);

    const newUser = await UserModel.create({
      email: email,
      username: username,
      password: passwordHashed,
    });
    req.session.userId = newUser._id;
    req.session.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "parameters are missing");
    }

    const user = await UserModel.findOne({ username: username }).exec();
    if (!user) {
      throw createHttpError(401, "invalid credentials");
    }
    const p = user.password;
    if (!p) {
      throw createHttpError(403, "password not exist");
    }

    const matched = phash.verify(password, p);

    if (!matched) {
      throw createHttpError(401, "wrong password");
    }

    req.session.userId = user._id;
    req.session.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};


export const logout: RequestHandler = async(req,res,next)=>{
    req.session.destroy(error=>{
        if(error){
            next(error)
        }else{
            res.sendStatus(200)
        }
    });
    
}