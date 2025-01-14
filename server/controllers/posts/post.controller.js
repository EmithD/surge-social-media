import Post from '../../models/post.model.js';

export const createPost = async(req, res) => {
    try {

        const { userID, imageURL, imageDeleteURL } = req.body;
        
        if (!userID || !imageURL) {
            return res.status(400).json({ message: "Missing required fields: userID and imageURL" });
        }

        const post = await Post.create({
            userID,
            imageURL,
            imageDeleteURL,
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};