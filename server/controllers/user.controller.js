import Users from "../models/user.model.js";

export const getUserDetails = async (req, res) => {
  const userId = req.user._id;

  try {
    const userDetails = await Users.findById(userId).select(
      "-personal_info.password -google_auth -blogs -liked_blogs"
    );

    if (!userDetails) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserDetails = async (req, res) => {
  const userId = req.user._id;
const { personal_info, social_links } = req.body;

  try {
    const updateFields = {};

    if (personal_info) {
      if (personal_info.fullname !== undefined) {
        updateFields["personal_info.fullname"] = personal_info.fullname;
      }
      if (personal_info.username !== undefined) {
        updateFields["personal_info.username"] = personal_info.username;
      }
      if (personal_info.bio !== undefined) {
        updateFields["personal_info.bio"] = personal_info.bio;
      }
      if (personal_info.profile_img !== undefined) {
        updateFields["personal_info.profile_img"] = personal_info.profile_img;
      }
    }

    if (social_links) {
      if (social_links.youtube !== undefined) {
        updateFields["social_links.youtube"] = social_links.youtube;
      }
      if (social_links.instagram !== undefined) {
        updateFields["social_links.instagram"] = social_links.instagram;
      }
      if (social_links.facebook !== undefined) {
        updateFields["social_links.facebook"] = social_links.facebook;
      }
      if (social_links.twitter !== undefined) {
        updateFields["social_links.twitter"] = social_links.twitter;
      }
      if (social_links.github !== undefined) {
        updateFields["social_links.github"] = social_links.github;
      }
      if (social_links.website !== undefined) {
        updateFields["social_links.website"] = social_links.website;
      }
    }

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const userToSend = updatedUser.toObject();

        res.status(200).json({
            status: 'success',
            message: 'User details updated successfully',
            user: userToSend 
        });
  } catch (error) {
    console.error("Error updating user details:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern["personal_info.username"]
    ) {
      return res.status(409).json({ message: "Username already taken." });
    }
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern["personal_info.email"]
    ) {
      return res.status(409).json({ message: "Email already registered." });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getBlogs = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await Users.findById(userId)
      .select("blogs")
      .populate({
        path: "blogs",
        select: "blog_id title content publishedAt",
        options: { sort: { publishedAt: -1 } },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userBlogs = user.blogs;

    res.status(200).json({ status: "success", blogs: userBlogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
