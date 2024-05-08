const express = require("express");
const puppeteer = require("puppeteer");

const PUPPETEER_OPTIONS = {
  // headless: false,
};

const app = express();

app.get("/scrape", async (req, res) => {
  var jsonData = {};
  var username = req.query.name;

  console.log("running user: ", username);
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 720 });

  await page.goto("https://srmgroup.dhi-edu.com/srmgroup_srmeec/");

  const pageTitle = await page.title();

  page.on("requestfailed", (request) => {
    console.error("Request failed:", request.url());
  });
  await page.waitForSelector("#username");
  await page.type("#username", username);
  await page.waitForSelector("#password");
  await page.type("#password", "dhi001");

  await page.waitForSelector("#kc-login");
  await page.hover("#kc-login");
  await page.click("#kc-login");

  await page.waitForSelector("#mainlevel3");

  const attdSidebar = await page.$$("#mainlevel3");
  await attdSidebar[1].click();

  await page.waitForSelector("select");

  const selectElements = await page.$$("select");
  const selectElement = selectElements[0];

  if (selectElement) {
    const options = await selectElement.$$eval("option", (options) =>
      options.map((option) => option.value),
    );

    const optionName = await selectElement.$$eval("option", (options) =>
      options.map((option) => option.textContent.trim()),
    );

    var optNumber = 0;
    for (const optionValue of options) {
      if (optNumber > optionName.length) {
        return;
      }

      await selectElement.select(optionValue);
      await page.waitForSelector(".text-center.summary-card-item");
      await delay(1500);

      await getPercentage(optionName[optNumber], page, jsonData);
      optNumber++;
    }
  } else {
    console.error("Select element not found");
  }

  await delay(1000);
  await browser.close();

  console.log("usernames Used: ", username);

  res.send(`Hello ${req.query.name} \nData: ${JSON.stringify(jsonData)} !`);
});

async function getPercentage(Kumaruu, page, jsonData) {
  const percentage = await page.evaluate(() => {
    const element = document.querySelector(".text-center.summary-card-item");
    if (!element) {
      return "No data available";
    }

    return element.innerText;
  });

  const optionName = Kumaruu.toString();
  jsonData[optionName] = percentage;
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

app.listen(8080, () => {
  console.log("Local server listening on port 8080");
});
