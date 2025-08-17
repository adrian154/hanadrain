const fs = require("fs");

const filenames = fs.readdirSync("images/food");
const ids = Array.from(new Set(filenames.map(s => s.match(/(.*[a-zA-Z])(\d+)\.png/)[1]))); // ids may start with numbers but not end with them

fs.writeFileSync(
    "scripts/generated/food-index.js", 
    `const FOOD_IMAGES = ${JSON.stringify(Object.fromEntries(ids.map(id => [id, filenames.filter(s => s.includes(id)).map(s => 'images/food/'+s)])))}`
);