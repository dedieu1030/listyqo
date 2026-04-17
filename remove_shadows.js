const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalLength = content.length;
            content = content.replace(/^\s*shadowColor:.*?\n/gm, '');
            content = content.replace(/^\s*shadowOffset:.*?\n/gm, '');
            content = content.replace(/^\s*shadowOpacity:.*?\n/gm, '');
            content = content.replace(/^\s*shadowRadius:.*?\n/gm, '');
            content = content.replace(/^\s*elevation:.*?\n/gm, '');
            if (content.length !== originalLength) {
                fs.writeFileSync(fullPath, content);
                console.log(`Removed shadows from ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src/screens'));
