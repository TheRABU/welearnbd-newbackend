const mongoose = require("mongoose");
const { DATABASE_NAME } = require("../constants.js");
const connectDATABASE = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DATABASE_NAME}`);
    console.log("Mongodb Connected successfully boss!");
  } catch (error) {
    console.log("Mongodb Connection error", error.message);
    throw new Error();
  }
};

module.exports = connectDATABASE;
