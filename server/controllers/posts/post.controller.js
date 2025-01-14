import Post from '../../models/post.model.js';

// export const deletePost = async(req, res) => {
//     try {
//         const { id } = 
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

export const createPost = async(req, res) => {
    try {
        const post = await Post.create(req.body);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};