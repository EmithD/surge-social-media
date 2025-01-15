import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please enter user ID"]
        },
        
        likesCount: {
            type: Number,
            required: true,
            default: 0
        },

        likedBy: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }],

        imageURL: {
            type: String,
            required: true
        },

        imageDeleteURL: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    },

);

const Post = mongoose.model("Post", PostSchema);
export default Post;