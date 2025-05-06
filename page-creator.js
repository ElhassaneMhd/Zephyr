import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createPage = (pageName) => {
  const pageDir = path.join(__dirname, 'resources/js/Pages', pageName);
  // Create the directory if it doesn't exist
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  // Create the counters files
  const generalFilePath = path.join(pageDir, `General.jsx`);
  const divisionalFilePath = path.join(pageDir, `Divisional.jsx`);

  const generalFileContent = `
import Counter from '@/components/Counter';

export default function General({ tables, history }) {
  return (
    <Counter title='${pageName} | Compteur General' routeName='/${pageName.toLowerCase()}' type='general' tables={tables} history={history} />
  );
}
  `;

  const divisionalFileContent = `
import Counter from '@/components/Counter';

export default function Divisional({ tables, history }) {
  return (
    <Counter title='${pageName} | Compteur Divisionnel' routeName='/${pageName.toLowerCase()}' type='divisional' tables={tables} history={history} />
  );
}
  `;

  // Write the files
  fs.writeFileSync(generalFilePath, generalFileContent.trim(), { flag: 'w' });
  fs.writeFileSync(divisionalFilePath, divisionalFileContent.trim(), { flag: 'w' });

  console.log(`Created ${pageName} page with General and Divisional components.`);
};

// Process command line arguments
const pageName = process.argv[2];
if (!pageName) {
  console.error('Please provide a page name.');
  process.exit(1);
}

createPage(pageName);