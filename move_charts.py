import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

stats_regex = r"\s*{\/\* Statistikat me Charta \*\/}[\s\S]*?{\/\* Quick Actions \*\/"
match = re.search(stats_regex, content)

if match:
    stats_block = match.group(0).replace('{/* Quick Actions */}', '').strip()
    
    # Remove from original position
    content = re.sub(stats_regex, '\n\n      {/* Quick Actions */', content)
    
    # Clean borders and add outline none
    stats_block = stats_block.replace(
        "border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'",
        "border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)'"
    )
    stats_block = stats_block.replace("<PieChart>", "<PieChart style={{ outline: 'none' }}>")
    
    # Insert after Recent appointments
    content = content.replace(
        '      {/* ---- MODALS ---- */}',
        f'      {{/* Statistikat me Charta */}}\n      <div className={{styles.fade}}>\n{stats_block}\n      </div>\n\n      {{/* ---- MODALS ---- */}}'
    )
    
    with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
