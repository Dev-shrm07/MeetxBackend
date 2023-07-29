import {InferSchemaType, Schema, model} from "mongoose"

const MeetSchema = new Schema({
    user :{type: Schema.Types.ObjectId, require:true},
    name:{type: String, require:true},
    Date:{type:String},
    Time: {type: String},
    desc:{type: String},
    link:{type:String}
    
})

type Meet = InferSchemaType<typeof MeetSchema>

export default model<Meet>("Meet", MeetSchema)
