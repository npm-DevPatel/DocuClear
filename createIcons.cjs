const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// A 1x1 transparent PNG
const buf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), buf);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), buf);

console.log('Icons created successfully.');
