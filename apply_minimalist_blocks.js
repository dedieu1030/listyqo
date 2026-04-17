const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Unify surface names
            content = content.replace(/Colors\.surfaceActive/g, 'Colors.surface');
            content = content.replace(/Colors\.surfaceInactive/g, 'Colors.surface');
            
            // Remove borders
            content = content.replace(/^\s*borderWidth:.*?\n/gm, '');
            content = content.replace(/^\s*borderColor:.*?\n/gm, '');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Minimalist flat styled applied to ${fullPath}`);
            }
        }
    }
}

// Also rewrite Colors.ts completely to eradicate surfaceActive/surfaceInactive and border
const colorsContent = `export const Colors = {
  background: '#FFFFFF', 
  primary: '#E85D36',    
  surface: '#F5F4EE',    
  textHeading: '#111111',
  text: '#111111',       
  textLight: '#8A8A8A',  
  black: '#111111',
  white: '#FFFFFF',
  
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#FF5A22',
  tabBarInactive: '#8A8A8A',
  
  highlightPill: '#E8E6DF', 
  highlightIcon: '#E85D36', 
};`;

fs.writeFileSync(path.join(__dirname, 'src/theme/colors.ts'), colorsContent);
console.log('Colors.ts completely flattened.');

processDir(path.join(__dirname, 'src/screens'));
