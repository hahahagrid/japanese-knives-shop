import os
import glob
import re

src_dir = os.path.join(os.path.dirname(__file__), '../src')

components_map = {
    # Layout
    'Header': 'layout/Header',
    'BrandFooter': 'layout/BrandFooter',
    'MobileMenu': 'layout/MobileMenu',
    'LoadingScreen': 'layout/LoadingScreen',
    # UI
    'AnimatedSection': 'ui/AnimatedSection',
    'ExpandableSection': 'ui/ExpandableSection',
    'Logo': 'ui/Logo',
    'RichText': 'ui/RichText',
    'ScrollToTop': 'ui/ScrollToTop',
    'ScrollToTopFab': 'ui/ScrollToTopFab',
    'PageVersion': 'ui/PageVersion',
    'FreshnessHandler': 'ui/FreshnessHandler',
    'ViewportHandler': 'ui/ViewportHandler',
    # Product
    'KnifeCard': 'product/KnifeCard',
    'KnifeGallery': 'product/KnifeGallery',
    'ProductTabs': 'product/ProductTabs',
    'RelatedProducts': 'product/RelatedProducts',
    'StickyProductBar': 'product/StickyProductBar',
    'ManufacturerCard': 'product/ManufacturerCard',
    # Common
    'LatestPosts': 'common/LatestPosts',
    'ReviewsMarquee': 'common/ReviewsMarquee',
    'ContactForm': 'common/ContactForm'
}

def fix_imports_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False
    for comp, new_path in components_map.items():
        pattern = r"@/components/" + comp + r"(['\"/])"
        new_content = re.sub(pattern, r"@/components/" + new_path + r"\1", content)
        if new_content != content:
            content = new_content
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(src_dir):
    for fn in files:
        if fn.endswith(('.ts', '.tsx')):
            fix_imports_in_file(os.path.join(root, fn))
