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

export const getPosts = async(req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find()
            .sort({ createdAt: -1, likesCount: 1 })
            .populate("userID", "username");

        const total = await Post.countDocuments();

        res.json({
            posts,
            total,
            page,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

export const likePost = async (req, res) => {
    try {
        const { postID, userID } = req.body;

        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const hasLiked = post.likedBy.includes(userID);

        if (hasLiked) {

            post.likedBy = post.likedBy.filter(id => id.toString() !== userID);
            post.likesCount -= 1;

        } else {

            post.likedBy.push(userID);
            post.likesCount += 1;

        }

        await post.save();

        res.status(200).json({
            postID: post._id,
            likesCount: post.likesCount
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "An error occurred while processing the request" });
        
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postID } = req.body;
    
        if (!postID) {
            return res.status(400).json({ error: 'Post ID is required' });
        }
    
        const deletedPost = await Post.findByIdAndDelete(postID);
    
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (deletedPost.imageDeleteURL) {
            try {
                const response = await fetch(deletedPost.deleteLink, {
                    method: 'POST',
                });

                if (!response.ok) {
                    console.error(`Failed to delete resource at: ${deletedPost.deleteLink}, Status: ${response.status}`);
                } else {
                    console.log(`Successfully visited delete link: ${deletedPost.deleteLink}`);
                }
                } catch (linkError) {
                console.error(`Error visiting delete link: ${deletedPost.deleteLink}`, linkError);
                }
            }
    
        return res.status(200).json({ message: 'Post deleted successfully', post: deletedPost });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
  };