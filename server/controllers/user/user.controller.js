import User from "../../models/user.model.js";

export const uploadPFP = async (req, res) => {

    try {
        
        const { userID, imageURL } = req.body;

        if (!userID || !imageURL) {
            return res.status(400).json({ message: "Missing required fields: userID and imageURL" });
        }

        const updatedUser = await User.findByIdAndUpdate(userID, 
            {
                pfp: imageURL
            });

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({message: error.message});
    }

};