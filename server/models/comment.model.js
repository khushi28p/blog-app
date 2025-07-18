import mongoose, {Schema} from "mongoose";

const commentSchema = mongoose.Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        required:true,
        ref: "Blogs"
    },
    blog_author:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    comment: {
        type: String,
        required:true
    },
    children: {
        type:[Schema.Types.ObjectId],
        ref: "Comments"
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    isReply: {
        type:Boolean
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }
}, {timestamps: {createdAt: 'commentedAt'}});

export default mongoose.model("Comments", commentSchema);