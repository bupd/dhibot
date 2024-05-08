var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/scrape";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("scrape");
  var defaultobj = { name: "bupdprasanth@gmail.com", password: "dhi001" };
  dbo.collection("customers").insertOne(defaultobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted\n", res);
    db.close();
  });
});
