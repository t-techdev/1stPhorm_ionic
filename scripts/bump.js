const fs = require('fs');
const file_content = fs.readFileSync('package.json');
const content = JSON.parse(file_content);
console.log('Updating config.xml versions to ' + content.version);
const Config = require('cordova-config');
var config = new Config('config.xml');
config.setVersion(content.version);
config.setIOSBundleVersion(1);
const bits = content.version.split('.');
if (parseInt(bits[1]) < 10) {
    bits[1] = bits[1].padStart(2, '0');
}
if (parseInt(bits[2]) < 10) {
    bits[2] = bits[2].padStart(2, '0');
}
bits[3] = '1'.padStart(2, '0');
config.setAndroidVersionCode(bits.join(''));
config.write();
