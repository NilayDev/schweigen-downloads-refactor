const fs = require('fs');
const path = require('path');

const categories = ["Brochures", "User Manuals", "Installation Guides", "Technical Specifications", "CAD Drawings"];
const productCategories = ["Silent Range", "Undermount", "Wallmount", "Island", "Ceiling Cassettes"];

const generateItems = (count) => {
    return Array.from({ length: count }).map((_, i) => {
        const catIndex = i % categories.length;
        const prodCatIndex = i % productCategories.length;

        return {
            id: `item-${i + 1}`,
            "display-name": `Document ${i + 1} - ${categories[catIndex]}`,
            "file": { "url": "#" },
            "download-type": categories[catIndex],
            "primary-download-category": categories[catIndex],
            "secondary-download-category": "General",
            "filetype": "PDF",
            "filesize": `${Math.floor(Math.random() * 5000) + 100} KB`,
            "product-category": productCategories[prodCatIndex]
        };
    });
};

const data = generateItems(100); // Generate 100 items
const jsonContent = JSON.stringify(data, null, 2);

fs.writeFileSync(path.join(__dirname, 'public/downloads-data.json'), jsonContent);
fs.writeFileSync(path.join(__dirname, 'dist/downloads-data.json'), jsonContent); // Copy to dist as well

console.log("Generated 100 mock items to public/downloads-data.json and dist/downloads-data.json");
