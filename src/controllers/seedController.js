const User = require("../models/userModel.js");
const data = require("../../dummyUserData.js");

const seedUser = async (req, res) => {
  try {
    const addUsers = await User.insertMany(data.users);
    return res.status(200).json(addUsers);
  } catch (error) {
    console.log(error.message);
    throw new Error();
  }
};

const removeUsers = async (req, res) => {
  try {
    const deleteUsers = await User.deleteMany({});
    return res.status(200).json(deleteUsers);
  } catch (error) {
    console.log(error.message);
    throw new Error();
  }
};

module.exports = { seedUser, removeUsers };
