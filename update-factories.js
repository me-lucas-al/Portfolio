const fs = require('fs');
const path = require('path');

const factoriesDir = path.join(__dirname, 'core/src/factories');
const files = fs.readdirSync(factoriesDir).filter(f => f.endsWith('.ts') && f !== '_index.ts');

for (const file of files) {
  const filePath = path.join(factoriesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace prisma imports with drizzle imports
  content = content.replace(
    /import \{ (Prisma\w+Repository) \} from "\.\.\/repositories\/prisma\/(prisma-[\w-]+)";/g,
    (match, className, fileName) => {
      const newClassName = className.replace('Prisma', 'Drizzle');
      const newFileName = fileName.replace('prisma-', 'drizzle-');
      return `import { ${newClassName} } from "../repositories/drizzle/${newFileName}";`;
    }
  );

  // Replace prisma client import with drizzle db import
  content = content.replace(
    /import \{ prisma \} from "@portfolio\/database\/prisma";/g,
    'import { db } from "@portfolio/database/src/client";'
  );
  
  // Also check if they import from @portfolio/database/prisma/generated/client or anything like that
  content = content.replace(
    /import \{ (.*)prisma(.*) \} from "@portfolio\/database.*";/g,
    'import { db } from "@portfolio/database/src/client";'
  );

  // Replace instantiation new PrismaSomething(prisma) with new DrizzleSomething(db)
  content = content.replace(/new Prisma(\w+Repository)\(prisma\)/g, 'new Drizzle$1(db)');
  content = content.replace(/new Prisma(\w+Repository)\(prismaClient\)/g, 'new Drizzle$1(db)');

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log('Factories updated successfully!');
