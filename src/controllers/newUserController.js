const createError = require("http-errors");
const { successResponse } = require("./responseController.js");
const newUser = require("../models/newUserModel.js");
// new method to signup user
const newUserSignUpMethod = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const { email } = userInfo;

    const isAlreadyExist = await newUser.findOne({ email: email });
    if (isAlreadyExist) {
      throw new createError(409, "User with this email already exist");
    }

    const createNewUser = await newUser.create({ ...userInfo });

    return successResponse(res, {
      statusCode: 200,
      message: "User registered successfully",
      payload: createNewUser,
    });

    // const userIsExist = await User.exists({ email: email });
    // if (userIsExist) {
    //   throw new createError(409, "User with email already exists");
    // }

    // const newCreatedUserInDatabase = new User({
    //   name,
    //   email,
    //   password,
    // });

    // const savedUser = await newCreatedUserInDatabase.save();

    // const tokenPayload = {
    //   savedUser,
    // };

    // create jwt
    // const token = createJSONWebToken(
    //   tokenPayload,
    //   process.env.JWT_SECRET_TOKEN,
    //   "1hr"
    // );

    // return successResponse(res, {
    //   statusCode: 200,
    //   message: "User registered successfully",
    //   payload: savedUser,
    // });
  } catch (error) {
    console.error(
      "Error during creating user using new controller:",
      error.message
    );
    throw error;
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const getAll = await newUser.find({});

    return successResponse(res, {
      statusCode: 200,
      message: "Fetched All user",
      payload: getAll,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { newUserSignUpMethod, getAllUser };
