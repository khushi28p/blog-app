import mongoose, {Schema} from "mongoose";

const notificationSchema = mongoose.Schema({
    type: {
        type:String,
        enum: ["like", "comment", "reply"],
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Blogs"
    },
    notificationFor:{
        type:Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    user: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Users"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref:"Comments",
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref:"Comments"
    },
    repliedOnComment: {
        type:Schema.Types.ObjectId,
        ref:"Comments"
    },
    seen: {
        type:Boolean,
        default: false
    }
}, {timestamps: true});

export default mongoose.model("Notifications", notificationSchema);