const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const statsRegex = /\s*{\/\* Statistikat me Charta \*\/}[\s\S]*?{\/\* Quick Actions \*\//;
const match = content.match(statsRegex);

if (match) {
  let statsBlock = match[0].replace('{/* Quick Actions */}', '').trim();
  
  // Remove the block from original position
  content = content.replace(statsRegex, '\n\n      {/* Quick Actions */}');
  
  // Apply the "modern" styles
  statsBlock = statsBlock.replace(
    /border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba\(0,0,0,0\.05\)'/g,
    "border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)'"
  );
  
  // Add outline: none to charts
  statsBlock = statsBlock.replace('<PieChart>', '<PieChart style={{ outline: \\'none\\' }}>');
  statsBlock = statsBlock.replace('<AreaChart ', '<AreaChart style={{ outline: \\'none\\' }} ');

  // Insert it before {/* ---- MODALS ---- */}
  content = content.replace(
    '      {/* ---- MODALS ---- */}',
    `      {/* Statistikat me Charta */}\n      ${statsBlock}\n\n      {/* ---- MODALS ---- */}`
  );

  fs.writeFileSync('src/app/page.tsx', content);
  console.log('Moved and styled successfully.');
} else {
  console.log('Could not find stats block.');
}
