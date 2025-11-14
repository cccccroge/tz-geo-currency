const https = require("https");
const fs = require("fs");
const zlib = require("zlib");
const tar = require("tar-fs");
const path = require("path");

const TZ_DATA_URL =
  "https://data.iana.org/time-zones/releases/tzdata2025b.tar.gz";
const TEMP = path.join(__dirname, "tmp");
const DOWNLOAD_PATH = path.join(TEMP, "tzdata2025b.tar.gz");
const ZONE_1970_FILE = path.join(TEMP, "zone1970.tab");
const ZONE_FILE = path.join(TEMP, "zone.tab");
const BACKWARD_FILE = path.join(TEMP, "backward");
const OUTPUT_ZONE_1970_JS = path.join(
  __dirname,
  "../src/data/parsedZone1970.js",
);
const OUTPUT_ZONE_JS = path.join(__dirname, "../src/data/parsedZone.js");
const OUTPUT_BACKWARD_JS = path.join(
  __dirname,
  "../src/data/parsedBackward.js",
);

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
      ignore: (name) =>
        ![ZONE_1970_FILE, ZONE_FILE, BACKWARD_FILE].includes(name),
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

function parseAndSave(paths, linesProcessor) {
  const content = fs.readFileSync(paths.inputPath, "utf8");
  const lines = content.split("\n");
  const res = linesProcessor(lines);

  fs.writeFileSync(
    paths.outputPath,
    `export default ${JSON.stringify(res, null, 2)};`,
  );
}

function processZone1970(lines) {
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

  return parsedData;
}

function processBackward(lines) {
  const parsedData = {};
  lines.forEach((line) => {
    if (line.startsWith("#") || line.trim() === "") return; // Skip comments and empty lines
    const parts = line.split(/\s+/);
    if (parts[0] !== "Link") return; // Skip non-Link lines

    const targetTz = parts[1];
    parsedData[parts[2]] = targetTz;
    if (parts[3] === "#=" && parts[4]) {
      parsedData[parts[4]] = targetTz;
    }
  });

  return parsedData;
}

function processZone(lines) {
  const parsedData = {};
  lines.forEach((line) => {
    if (line.startsWith("#") || line.trim() === "") return; // Skip comments and empty lines
    const parts = line.split("\t");
    const countryCode = parts[0];
    const timezone = parts[2];

    parsedData[timezone] = countryCode;
  });

  return parsedData;
}

(async () => {
  try {
    fs.mkdirSync(TEMP, { recursive: true });

    console.log(`Downloading data from ${TZ_DATA_URL} ...`);
    await download(TZ_DATA_URL, DOWNLOAD_PATH);

    console.log("Extracting data...");
    await extract();

    console.log("Parsing and save...");
    parseAndSave(
      { inputPath: ZONE_1970_FILE, outputPath: OUTPUT_ZONE_1970_JS },
      processZone1970,
    );
    parseAndSave(
      { inputPath: ZONE_FILE, outputPath: OUTPUT_ZONE_JS },
      processZone,
    );
    parseAndSave(
      { inputPath: BACKWARD_FILE, outputPath: OUTPUT_BACKWARD_JS },
      processBackward,
    );

    console.log("\x1b[32m%s\x1b[0m", "Done");
  } catch (e) {
    console.log("\x1b[31m%s\x1b[0m", e.message);
  }
})();
