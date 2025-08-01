import mongoose, {Schema} from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = mongoose.Schema({
    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: true,
            minlength: [3, 'Full name must be 3 letters long.'],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required:false
        },
        username: {
            type:String,
            minlength: [3, 'Username must be 3 letters long'],
            unique:true,
            index: true
        },
        bio: {
            type:String,
            maxlength: [200, 'Bio should not be more than 200.'],
            default: ""
        },
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
            }
        }
    },
    social_links: {
        youtube: {
            type:String,
            default: ""
        },
        instagram: {
            type:String,
            default: ""
        },
        facebook: {
            type:String,
            default: ""
        },
        twitter: {
            type:String,
            default: ""
        },
        github: {
            type:String,
            default: ""
        },
        website: {
            type:String,
            default: ""
        },
    },
    account_info: {
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default:0
        },
    },
    google_auth: {
        type:Boolean,
        default: false
    },
    blogs: {
        type: [Schema.Types.ObjectId],
        ref: 'Blogs',
        default: []
    },
    liked_blogs: {
        type: [Schema.Types.ObjectId],
        ref: 'Blogs',
        default: []
    }
}, {timestamps: {createdAt: 'joinedAt'}});

export default mongoose.model("Users", userSchema);