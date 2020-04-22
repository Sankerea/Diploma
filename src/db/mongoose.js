const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  //! for deprecation warning
  useFindAndModify: false
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Dulguun:<password>@cluster0-wulb1.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
