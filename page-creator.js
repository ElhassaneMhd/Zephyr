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

  // Now update the sidebar
  updateSidebar(pageName);
};

// Function to update the sidebar routes
const updateSidebar = (pageName) => {
  const sidebarPath = path.join(__dirname, 'resources/js/components/Sidebar.jsx');

  // Read the current sidebar file
  let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

  const pageNameLower = pageName.toLowerCase();

  // Check if route already exists as a sub-route structure
  if (sidebarContent.includes(`/${pageNameLower}/general`)) {
    console.log(`Route for ${pageName} already exists with sub-routes in Sidebar.`);
    return;
  }

  // Check if the route exists as a single route
  const singleRouteRegex = new RegExp(
    `{[^}]*label: ['"]${pageName}['"][^}]*href: ['"]\\/${pageNameLower}['"][^}]*}`,
    'i'
  );
  const singleRouteMatch = sidebarContent.match(singleRouteRegex);

  if (singleRouteMatch) {
    // Found a single route, convert it to a route with sub-routes
    const singleRoute = singleRouteMatch[0];

    // Extract just the icon component, not the whole "icon: <Component />" text
    const iconMatch = singleRoute.match(/icon: (<[^>]*>)/);
    const iconComponent = iconMatch ? iconMatch[1] : "<IoAnalyticsOutline />";

    // Create the replacement with sub-routes
    const replacementRoute = `{
    icon: ${iconComponent},
    label: '${pageName}',
    sub: [
      { label: 'Compteur General', href: '/${pageNameLower}/general' },
      { label: 'Compteur Divisionnel', href: '/${pageNameLower}/divisional' },
    ],
  }`;

    // Replace the single route with the new sub-route structure
    const updatedContent = sidebarContent.replace(singleRoute, replacementRoute);

    // Write back to file
    fs.writeFileSync(sidebarPath, updatedContent, 'utf8');
    console.log(`Updated Sidebar.jsx: Converted ${pageName} to use sub-routes.`);
    return;
  }

  console.log(
    `No existing route found for ${pageName} in Sidebar.jsx. Please add it manually or use a different script to add new routes.`
  );
};

// Process command line arguments
const pageName = process.argv[2];
if (!pageName) {
  console.error('Please provide a page name.');
  process.exit(1);
}

createPage(pageName);
