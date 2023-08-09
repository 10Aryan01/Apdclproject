const mongoose = require("mongoose");
const Connect_to_Database = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `Mongo Database connected Successfull to ${connect.connection.host}`
    );
  } catch (error) {
    console.log(`Error : ${error.message}`);
    process.exit();
  }
};

module.exports = Connect_to_Database;
