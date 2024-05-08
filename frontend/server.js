const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(cors());
const PORT = 3000;
const url = "mongodb://localhost:27017/scrape";

app.use(express.json());

// Endpoint to handle insertion
app.post("/insert", async (req, res) => {
  try {
    console.log("request initiated");
    const { email, password } = req.body;
    console.log(email, password);

    // Connect to MongoDB and perform insertion
    const client = new MongoClient(url);
    await client.connect();

    const database = client.db("scrape");
    const collection = database.collection("customers");

    // Create a document to insert
    const doc = { email: `${email}`, password: `${password}` };

    // Insert the document into the collection
    const result = await collection.insertOne(doc);

    console.log(`1 document inserted with ID: ${result.insertedId}`);

    // Close the MongoDB client connection
    await client.close();

    // Send a success response to the client
    return res.status(200).json({ message: "good things have good feel" });
  } catch (error) {
    console.error("Error inserting document:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
