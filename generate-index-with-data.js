const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'dist/downloads-data.json');
const htmlPath = path.join(__dirname, 'dist/index.html');

if (!fs.existsSync(dataPath)) {
    console.error("Data file not found!");
    process.exit(1);
}

const data = fs.readFileSync(dataPath, 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schweigen Downloads Widget Preview</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #f0f0f0; }
        #schweigen-downloads-container { background: white; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>Widget Preview (Inline Data)</h1>
    <!-- Removed data-url to force global variable usage -->
    <div id="schweigen-downloads-container"></div>
    
    <script>
        window.SchweigenDownloadsData = ${data};
    </script>
    <script src="schweigen-downloads.umd.js"></script>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent);
console.log("Updated dist/index.html with inline data.");
