import {InferSchemaType, Schema, model} from "mongoose"

const UserSchema = new Schema({
    username: {type: String, require: true, unique:true},
    email : {type: String, require: true, unique:true},
    password : {type: String, require: true},
    
})

type User = InferSchemaType<typeof UserSchema>

export default model<User>("User", UserSchema)
