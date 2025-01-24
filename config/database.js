const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dotenv = require("dotenv");
dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URL
      // , {
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useUnifiedTopology: true,
      // serverSelectionTimeoutMS:30000
      // }
    );
    console.log(`Connected to Mongodb Data base ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in Mongodb database connection: ${error}`);
  }
};

module.exports = connectDb;
