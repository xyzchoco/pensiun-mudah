const fs = require('fs');
const path = require('path');

const dir = 'd:/PENSIUN MUDAH/pensiun-mudah/resources/js/Pages/Instansi';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        let modified = false;

        // 1. Rename exports
        let oldExport = content.match(/export default function\s+([a-zA-Z0-9]+)\s*\(/);
        if (oldExport) {
            let funcName = oldExport[1];
            if (!funcName.endsWith('Instansi')) {
                let newFuncName = funcName + 'Instansi';
                content = content.replace(new RegExp(`export default function ${funcName}`, 'g'), `export default function ${newFuncName}`);
                modified = true;
            }
        }

        // 2. Fix specific bad strings (korporat -> instansi)
        if (content.includes('@korporat.id')) {
            content = content.replace(/@korporat\.id/g, '@instansi.id');
            modified = true;
        }
        if (content.includes('Anggota Korporat')) {
            content = content.replace(/Anggota Korporat/g, 'Anggota Instansi');
            modified = true;
        }
        if (content.includes('href="/korporat/')) {
            content = content.replace(/href="\/korporat\//g, 'href="/instansi/');
            modified = true;
        }
        if (content.includes('akses ke fitur korporat.')) {
            content = content.replace(/akses ke fitur korporat\./g, 'akses ke fitur instansi.');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});
