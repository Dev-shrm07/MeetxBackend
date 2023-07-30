import { RequestHandler } from "express";
import MeetModel from "../models/meet";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";

export const getMeet: RequestHandler = async (req, res, next) => {
  const authuserid = req.session.userId
  try {
    assertIsDefined(authuserid)
    const meet = await MeetModel.find({user: authuserid}).exec();
    
    res.status(200).json(meet);
  } catch (error) {
    next(error);
  }
};

export const getMeetbyID: RequestHandler = async (req, res, next) => {
  const id = req.params.meetid;
  const authuserid = req.session.userId
  try {
    assertIsDefined(authuserid)
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Not a valid meet");
    }
    const meet = await MeetModel.findById(id).exec();
    if (!meet) {
      throw createHttpError(404, "Not found");
    }
    assertIsDefined(meet.user)
    if(!meet.user.equals(authuserid)){
      throw createHttpError(401, "you are not allowed to acces the notes")
    }
    
    res.status(200).json(meet);
  } catch (error) {
    next(error);
  }
};

interface CreateMeetBody {
  name?: string;
  Date?: string;
  Time?: string;
  desc?: string;
  link?: string;
}

export const createMeet: RequestHandler<
  unknown,
  unknown,
  CreateMeetBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const dt = req.body.Date;
  const time = req.body.Time;
  const desc = req.body.desc;
  const link = req.body.link;
  const authuserid = req.session.userId
  try {
    assertIsDefined(authuserid)
    if (!name) {
      throw createHttpError(400, "Title is Necessary");
    }
    const newMeet = await MeetModel.create({
      user: authuserid,
      name: name,
      Date: dt,
      Time: time,
      desc: desc,
      link: link,
    });
    res.status(201).json(newMeet);
  } catch (error) {
    next(error);
  }
};

interface UpdateMeetparams {
  meetid: string;
}

interface UpdateMeetBody {
  name?: string;
  Date?: string;
  Time?: string;
  desc?: string;
  link?: string;
}

export const updateMeet: RequestHandler<
  UpdateMeetparams,
  unknown,
  UpdateMeetBody,
  unknown
> = async (req, res, next) => {
  const id = req.params.meetid;
  const Name = req.body.name;
  const dt = req.body.Date;
  const time = req.body.Time;
  const desc = req.body.desc;
  const link = req.body.link;
  const authuserid = req.session.userId

  try {
    assertIsDefined(authuserid)
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Not a valid meet");
    }
    if (!Name) {
      throw createHttpError(400, "Title is Necessary");
    }
    const meet = await MeetModel.findById(id).exec();
    if (!meet) {
      throw createHttpError(404, "Not found");
    }
    assertIsDefined(meet.user)
    if(!meet.user.equals(authuserid)){
      throw createHttpError(401, "you are not allowed to acces the notes")
    }

    meet.name = Name;
    meet.Date = dt;
    meet.Time = time;
    meet.desc = desc;
    meet.link = link;

    const updatemeet = await meet.save();
    res.status(200).json(updatemeet);
  } catch (error) {
    next(error);
  }
};
export const DeleteMeet: RequestHandler = async (req, res, next) => {
  const mid = req.params.meetid;

  try {
    if (!mongoose.isValidObjectId(mid)) {
      throw createHttpError(400, "Not a valid meet");
    }

    const meet = await MeetModel.findById(mid).exec();
    if (!meet) {
      throw createHttpError(404, "Not found");
    }

    await MeetModel.deleteOne({_id : mid})


    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
