const https = require('https');
const fs = require('fs');
const zlib = require('zlib');
const tar = require('tar-fs');
const path = require('path');

// Step 1: Download the tzdata file
const TZ_DATA_URL = 'https://data.iana.org/time-zones/releases/tzdata2024a.tar.gz';
const TEMP = path.join(__dirname, 'tmp');
const DOWNLOAD_PATH = path.join(TEMP, 'tzdata2024a.tar.gz');
const TARGET_FILE = path.join(TEMP, 'zone1970.tab');
const OUTPUT_JS = path.join(__dirname, '../src/data/parsedZone1970.js');

const downloadFile = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log(`Downloading data from ${TZ_DATA_URL} ...`)

    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(response.statusMessage));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath);
      reject(err.message);
    });
  });
};

// Step 2: Uncompress and Extract zone1970.tab
const extractAndProcessFile = async () => {
  fs.mkdirSync(TEMP, { recursive: true });
  await downloadFile(TZ_DATA_URL, DOWNLOAD_PATH);

  console.log('Extracting data...');

  return new Promise((resolve, reject) => {
    const gunzip = zlib.createGunzip();
    const extract = tar.extract(TEMP, {
        ignore: (name) => !name.includes(TARGET_FILE),
    });
    fs.createReadStream(DOWNLOAD_PATH)
      .on('error', reject)
      .pipe(gunzip)
      .on('error', reject)
      .pipe(extract)
      .on('error', reject);

    extract.on('finish', () => {
      try {
        processZoneFile(TARGET_FILE);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  });
};

// Step 3: Process zone1970.tab and save to parsedZone1970.js
function processZoneFile(filePath) {
  console.log('Parsing and save...');

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const parsedData = [];

  lines.forEach(line => {
    if (line.startsWith('#') || line.trim() === '') return; // Skip comments and empty lines
    const parts = line.split('\t');
    const countryCode = parts[0];
    const timezone = parts[2];

    let countryEntry = parsedData.find(entry => entry.codes === countryCode);
    if (!countryEntry) {
      countryEntry = { codes: countryCode, tz: [timezone] };
      parsedData.push(countryEntry);
    } else {
      countryEntry.tz.push(timezone);
    }
  });

  fs.writeFileSync(OUTPUT_JS, `export const data = ${JSON.stringify(parsedData, null, 2)};`);
}

extractAndProcessFile()
  .then(() => console.log('\x1b[32m%s\x1b[0m', 'Done'))
  .catch((e) => console.log('\x1b[31m%s\x1b[0m', e.message));
