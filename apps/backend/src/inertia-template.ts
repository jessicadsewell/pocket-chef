import * as fs from 'fs';
import * as path from 'path';

// When running from dist, views are at dist/views/app.html
// When in development (ts-node), views are at backend/views (one level up from src)
const templatePath = path.join(__dirname, 'views', 'app.html');

let template: string;
try {
  // Try loading from dist/views first (when running compiled code)
  template = fs.readFileSync(templatePath, 'utf-8');
} catch {
  // Fallback to parent directory for development
  template = fs.readFileSync(
    path.join(__dirname, '../views/app.html'),
    'utf-8',
  );
}

export const inertiaTemplate = (pageString: string) => {
  return template.replace('PAGE_DATA', pageString);
};
