import glob
import re

css_files = glob.glob('c:/Users/x1car/Desktop/Dentisti/src/**/*.module.css', recursive=True)

for file in css_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # Replace .modalOverlay block
    if '.modalOverlay {' in content:
        content = re.sub(
            r'\.modalOverlay\s*{[^}]*}',
            r'.modalOverlay {\n  position: fixed;\n  inset: 0;\n  background-color: rgba(0, 0, 0, 0.4);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  z-index: 9999;\n  overflow-y: auto;\n  padding: 40px 20px;\n}',
            content
        )
        modified = True

    # Replace .modal block to be fully responsive/unrestricted in height and centered
    if '.modal {' in content:
        modal_match = re.search(r'\.modal\s*{([^}]*)}', content)
        if modal_match:
            original_styles = modal_match.group(1)
            # Remove height, max-height, margin, overflow, position to avoid conflicts
            new_styles = original_styles
            new_styles = re.sub(r'\bmax-height\s*:[^;]+;', '', new_styles)
            new_styles = re.sub(r'\bheight\s*:[^;]+;', '', new_styles)
            new_styles = re.sub(r'\bmargin\s*:[^;]+;', '', new_styles)
            new_styles = re.sub(r'\boverflow\s*:[^;]+;', '', new_styles)
            new_styles = re.sub(r'\bposition\s*:[^;]+;', '', new_styles)
            
            # Remove empty lines
            new_lines = [line for line in new_styles.split('\n') if line.strip()]
            new_styles = '\n'.join(new_lines)
            
            # Add updated safe layout properties
            new_styles = new_styles + '\n  position: relative;\n  margin: 40px auto;\n  height: auto !important;\n  max-height: none !important;\n  overflow: visible !important;\n'
            
            content = content.replace(original_styles, new_styles)
            modified = True

    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")

print("Modals patching finished!")
