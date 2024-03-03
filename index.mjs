// Import puppeteer
import puppeteer from "puppeteer";

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto("YOUR_SITE");

  // Query for an element handle.
  const element = await page.waitForSelector("div > .class-name");

  // Do something with element...
  await element.click(); // Just an example.

  // Dispose of handle
  await element.dispose();

  // Close browser.
  await browser.close();
})();
