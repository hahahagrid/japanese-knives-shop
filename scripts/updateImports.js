const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const map = {
  // Layout
  'Header': 'layout/Header',
  'BrandFooter': 'layout/BrandFooter',
  'MobileMenu': 'layout/MobileMenu',
  'LoadingScreen': 'layout/LoadingScreen',
  // UI
  'AnimatedSection': 'ui/AnimatedSection',
  'ExpandableSection': 'ui/ExpandableSection',
  'Logo': 'ui/Logo',
  'RichText': 'ui/RichText',
  'ScrollToTop': 'ui/ScrollToTop',
  'ScrollToTopFab': 'ui/ScrollToTopFab',
  'PageVersion': 'ui/PageVersion',
  'FreshnessHandler': 'ui/FreshnessHandler',
  'ViewportHandler': 'ui/ViewportHandler',
  // Product
  'KnifeCard': 'product/KnifeCard',
  'KnifeGallery': 'product/KnifeGallery',
  'ProductTabs': 'product/ProductTabs',
  'RelatedProducts': 'product/RelatedProducts',
  'StickyProductBar': 'product/StickyProductBar',
  'ManufacturerCard': 'product/ManufacturerCard',
  // Common
  'LatestPosts': 'common/LatestPosts',
  'ReviewsMarquee': 'common/ReviewsMarquee',
  'ContactForm': 'common/ContactForm'
};

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Update @/components/ imports
      for (const [component, newPath] of Object.entries(map)) {
        const regex = new RegExp(`@/components/${component}`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `@/components/${newPath}`);
          modified = true;
        }
      }

      // Component files themselves might have relative imports like '../Logo' or './Logo'
      // This is a bit too complex for string replace if we rely strictly on filename. 
      // But let's handle the `@/components/` first.
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk(srcDir);
