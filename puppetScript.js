const puppeteer = require("puppeteer");
require("dotenv").config();

const puppetScript = async (username) => {
  // Launch the browser and open a new blank page
  var jsonData = {};
  // delete this ASAP
  console.log(process.env.PUPPETEER_EXECUTABLE_PATH);
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://www.google.com");

  const pageTitle = await page.title();

  jsonData["title"] = pageTitle;

  return jsonData;

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await page.waitForSelector("#username");
  await page.type("#username", username);
  await page.waitForSelector("#password");
  await page.type("#password", "dhi001");

  await page.waitForSelector("#kc-login");
  await page.hover("#kc-login");

  await page.click("#kc-login");
  // const element = await page.waitForSelector("div > ");
  // console.log(element);

  // const kumar = await page.waitForSelector(
  //   "sidebar-menu.admin.d-md-block.d-none",
  // );
  //

  await page.waitForSelector("#mainlevel3");

  // await delay(8000);

  const attdSidebar = await page.$$("#mainlevel3");
  await attdSidebar[1].click();

  // await delay(8000);

  await page.waitForSelector("select");

  // Select the multi-select element
  const selectElements = await page.$$("select"); // Replace 'select' with the appropriate selector

  const selectElement = selectElements[0];

  if (selectElement) {
    // Get all options within the select element
    const options = await selectElement.$$eval("option", (options) =>
      options.map((option) => option.value),
    );

    const optionName = await selectElement.$$eval("option", (options) =>
      options.map((option) => option.textContent.trim()),
    );

    // Iterate over each option and select it
    var optNumber = 0;
    for (const optionValue of options) {
      if (optNumber > optionName.length) {
        return;
      }

      await selectElement.select(optionValue); // Select the option
      // Show the optionName
      await page.waitForSelector(".text-center.summary-card-item");

      await delay(1500);

      getPercentage(optionName[optNumber]);
      optNumber++;
    }
  } else {
    console.error("Select element not found");
  }

  // NOTE:
  // Need to do better way of getting the attendance percentages.
  // Now we can actually login and go to the attendance page and get the attendance details via the selector until that everything works fine.
  // We only need to improve the way of getting the attendance percentages. need to do only that. Thanks.

  async function getPercentage(Kumaruu) {
    // Use evaluate function to execute JavaScript code on the page
    const percentage = await page.evaluate(() => {
      // Select the element and return its innerText
      const element = document.querySelector(".text-center.summary-card-item");
      if (!element) {
        return "No data available";
      }

      return element.innerText; // Return the innerText of the element if found
    });

    const optionName = Kumaruu.toString();

    jsonData[optionName] = percentage;
  }

  await delay(1000);
  await browser.close();

  // the return of jsonData is not working.
  console.log("usernames Used: ", username);

  return jsonData;
};

module.exports = puppetScript;
