const express = require("express")();
const puppetScript = require("./puppetScript");

let chrome = {};
let puppeteer;

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
}

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
  } catch (err) {}
});

app.get("/scrape", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }
  try {
    // let browser = await puppeteer.launch(options);
    //
    // let page = await browser.newPage();
    //
    // await page.goto("https://www.google.com");
    //
    // res.send(await page.title());
    
    const { username } = req.query;

    const jsonData = await puppetScript(username);

    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
