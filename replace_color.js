const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Replace exact color strings
            content = content.replace(/#8B2635/g, '#FA8231'); // main maroon to new primary/orange

            // Replace hover deep maroon strings
            content = content.replace(/#5A121E/gi, '#E62A4D');
            content = content.replace(/#6B1F2A/gi, '#E62A4D');

            // Replace secondary gold strings
            content = content.replace(/#CD853F/gi, '#E62A4D');

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated', fullPath);
            }
        }
    });
}

processDir(path.join(__dirname, 'frontend/src'));
