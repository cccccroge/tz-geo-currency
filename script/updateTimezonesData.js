const https = require('https');
const fs = require('fs');
const zlib = require('zlib');
const tar = require('tar-fs');
const path = require('path');

// Step 1: Download the tzdata file
const TZ_DATA_URL = 'https://data.iana.org/time-zones/releases/tzdata2024a.tar.gz';
const DOWNLOAD_PATH = path.join(__dirname, 'tmp', 'tzdata2024a.tar.gz');

const downloadFile = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
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
  await downloadFile(TZ_DATA_URL, DOWNLOAD_PATH);

  fs.createReadStream(DOWNLOAD_PATH)
    .pipe(zlib.createGunzip())
    .pipe(tar.extract('./', {
      ignore: (name) => !name.includes('zone1970.tab'), // Only extract zone1970.tab
      finish: () => processZoneFile('./zone1970.tab') // Process after extraction
    }));
};

// Step 3: Process zone1970.tab and save to parsedZone1970.js
function processZoneFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const parsedData = [];

  lines.forEach(line => {
    if (line.startsWith('#') || line.trim() === '') return; // Skip comments and empty lines
    const parts = line.split('\t');
    const countryCode = parts[0];
    const timezone = parts[2];

    let countryEntry = parsedData.find(entry => entry.alpha2 === countryCode);
    if (!countryEntry) {
      countryEntry = { alpha2: countryCode, timezones: [] };
      parsedData.push(countryEntry);
    }
    countryEntry.timezones.push(timezone);
  });

  fs.writeFileSync('./parsedZone1970.js', `module.exports = ${JSON.stringify(parsedData, null, 2)};`);
}

extractAndProcessFile().then(() => console.log('Done processing tzdata.'));
