const fs = require("fs");

const deleteImage = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log("user image was deleted");
  } catch (error) {
    console.error("User image does not exist", err.message);
    throw error;
  }
};

module.exports = { deleteImage };
