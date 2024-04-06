const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const TEMP_DIR = path.join(__dirname, "tmp");
const OUTPUT_JS = path.join(__dirname, "../src/data/parsedCountries.js");

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response.json();
}

function convertData(data) {
  return data.map((country) => ({
    cca2: country.cca2,
    currencies: country.currencies ? Object.keys(country.currencies) : [],
  }));
}

function saveData(data) {
  const formattedData = `export default ${JSON.stringify(data, null, 2)};`;
  fs.writeFileSync(OUTPUT_JS, formattedData);
}

(async () => {
  try {
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    console.log(`Downloading data from ${COUNTRIES_DATA_URL} ...`);
    const rawData = await download(COUNTRIES_DATA_URL);

    console.log("Parsing and save...");
    const processedData = convertData(rawData);
    saveData(processedData);

    console.log("\x1b[32m%s\x1b[0m", "Done");
  } catch (e) {
    console.log("\x1b[31m%s\x1b[0m", e.message);
  }
})();
