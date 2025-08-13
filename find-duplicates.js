const fs = require('fs');

const content = fs.readFileSync('./lib/i18n/translations.ts', 'utf8');

// Extract Greek section
const greekStart = content.indexOf('el: {');
const greekEnd = content.indexOf('}, \n  // English');
const greekSection = content.slice(greekStart, greekEnd);

// Extract English section  
const englishStart = content.indexOf('en: {');
const englishEnd = content.indexOf('} as const');
const englishSection = content.slice(englishStart, englishEnd);

function findDuplicates(section, sectionName) {
  console.log(`\n=== ${sectionName} DUPLICATES ===`);
  const lines = section.split('\n');
  const seen = new Set();
  const duplicates = [];
  
  lines.forEach((line, i) => {
    const match = line.match(/^\s*(\w+):/);
    if (match) {
      const key = match[1];
      if (seen.has(key)) {
        duplicates.push(`${key} (duplicate)`);
      }
      seen.add(key);
    }
  });
  
  duplicates.forEach(d => console.log(d));
  return duplicates;
}

const greekDupes = findDuplicates(greekSection, 'GREEK');
const englishDupes = findDuplicates(englishSection, 'ENGLISH');

console.log(`\nTotal Greek duplicates: ${greekDupes.length}`);
console.log(`Total English duplicates: ${englishDupes.length}`);