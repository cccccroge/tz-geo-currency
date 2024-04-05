const https = require("https");
const fs = require("fs");
const zlib = require("zlib");
const tar = require("tar-fs");
const path = require("path");

const TZ_DATA_URL =
  "https://data.iana.org/time-zones/releases/tzdata2024a.tar.gz";
const TEMP = path.join(__dirname, "tmp");
const DOWNLOAD_PATH = path.join(TEMP, "tzdata2024a.tar.gz");
const TARGET_FILE = path.join(TEMP, "zone1970.tab");
const OUTPUT_JS = path.join(__dirname, "../src/data/parsedZone1970.js");

const download = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(response.statusMessage));
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(outputPath);
        reject(err.message);
      });
  });
};

const extract = async () => {
  return new Promise((resolve, reject) => {
    const gunzip = zlib.createGunzip();
    const extract = tar.extract(TEMP, {
      ignore: (name) => !name.includes(TARGET_FILE),
    });
    fs.createReadStream(DOWNLOAD_PATH)
      .on("error", reject)
      .pipe(gunzip)
      .on("error", reject)
      .pipe(extract)
      .on("error", reject);

    extract.on("finish", () => {
      try {
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
};

function parseAndSave(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const parsedData = [];

  lines.forEach((line) => {
    if (line.startsWith("#") || line.trim() === "") return; // Skip comments and empty lines
    const parts = line.split("\t");
    const countryCode = parts[0];
    const timezone = parts[2];

    let countryEntry = parsedData.find((entry) => entry.codes === countryCode);
    if (!countryEntry) {
      countryEntry = { codes: countryCode, tz: [timezone] };
      parsedData.push(countryEntry);
    } else {
      countryEntry.tz.push(timezone);
    }
  });

  fs.writeFileSync(
    OUTPUT_JS,
    `export const data = ${JSON.stringify(parsedData, null, 2)};`,
  );
}

(async () => {
  try {
    fs.mkdirSync(TEMP, { recursive: true });

    console.log(`Downloading data from ${TZ_DATA_URL} ...`);
    await download(TZ_DATA_URL, DOWNLOAD_PATH);

    console.log("Extracting data...");
    await extract();

    console.log("Parsing and save...");
    parseAndSave(TARGET_FILE);

    console.log("\x1b[32m%s\x1b[0m", "Done");
  } catch (e) {
    console.log("\x1b[31m%s\x1b[0m", e.message);
  }
})();
