import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: [true, "Please enter user ID"]
        },

        likesCount: {
            type: Number,
            required: true,
            default: 0
        },

        imageURL: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    },

);

const Post = mongoose.model("Post", PostSchema);
export default Post;