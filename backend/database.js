const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose.connect(process.env.DB_URI).then(() => {
    console.log(`MongoDB connected with server.`);
  });
};
module.exports = connectToMongo;
