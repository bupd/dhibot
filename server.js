const express = require("express");
const puppetScript = require("./puppetScript");

const app = express(); // Initialize Express application
const PORT = process.env.PORT || 3000;

// Your Puppeteer code goes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", async (req, res) => {
  try {
    res.json({
      Hello:
        "Go to the /scrape?username=<your Email Id> to get your attendance details.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/scrape", async (req, res) => {
  try {
    const { username } = req.query;
    const jsonData = await puppetScript(username);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
