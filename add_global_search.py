import re

with open('src/components/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states and logic
search_logic = """
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Mock Global Search Data
  const searchData = [
    { type: 'Pacient', text: 'Agim Ramadani', desc: 'Nr: +355 69 123 4567', link: '/patients/1' },
    { type: 'Pacient', text: 'Teuta Kelmendi', desc: 'Nr: +355 69 222 3333', link: '/patients/2' },
    { type: 'Pacient', text: 'Dritan Hoxha', desc: 'Nr: +355 69 444 5555', link: '/patients/3' },
    { type: 'Pacient', text: 'Blerina Koci', desc: 'Nr: +355 69 666 7777', link: '/patients/4' },
    { type: 'Pacient', text: 'Erion Daci', desc: 'Nr: +355 69 888 9999', link: '/patients/5' },
    { type: 'Vizitë', text: 'Kontroll Rutinë', desc: 'Sot, Ora 10:00 - Dr. Agim Hoxha', link: '/appointments' },
    { type: 'Vizitë', text: 'Pastrim Gurëzash', desc: 'Nesër, Ora 11:30 - Dr. Blerina Koci', link: '/appointments' },
    { type: 'Porosi Lab', text: 'Kurorë Zirkoni (Teuta K.)', desc: 'Gati më 15 Qershor 2026', link: '/lab' },
    { type: 'Porosi Lab', text: 'Protezë e Plotë (Agim R.)', desc: 'Në proces (Dita 3/5)', link: '/lab' },
    { type: 'Doktor', text: 'Dr. Agim Hoxha', desc: 'Mjek Dentar - Orari 09:00 - 17:00', link: '/settings/staff' },
    { type: 'Doktor', text: 'Dr. Blerina Koci', desc: 'Mjeke Ortodonte - Orari 12:00 - 19:00', link: '/settings/staff' },
  ];

  const searchResults = searchQuery.trim() === '' ? [] : searchData.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
"""

content = content.replace("  const [showProfile, setShowProfile] = useState(false);", "  const [showProfile, setShowProfile] = useState(false);\n" + search_logic)

# Replace Input and add Dropdown
search_ui = """
      <div className={styles.searchWrapper}>
        {onToggleSidebar && (
          <button className={styles.menuBtn} onClick={onToggleSidebar} aria-label="Toggle Sidebar">
            <Menu size={20} />
          </button>
        )}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Kërko pacientë..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className={styles.searchDropdown}>
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <a key={i} href={res.link} className={styles.searchResultItem}>
                    <div className={styles.searchResultType}>{res.type}</div>
                    <div className={styles.searchResultInfo}>
                      <span className={styles.searchResultText}>{res.text}</span>
                      <span className={styles.searchResultDesc}>{res.desc}</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className={styles.searchResultEmpty}>Nuk u gjet asnjë rezultat.</div>
              )}
            </div>
          )}
        </div>
      </div>
"""

# We need to replace the exact searchWrapper div
content = re.sub(r'<div className={styles\.searchWrapper}>.*?</div>\s+<div className={styles\.actions}>', search_ui.strip() + '\n      <div className={styles.actions}>', content, flags=re.DOTALL)

with open('src/components/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Update Header.module.css
css_append = """

.searchDropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 8px 0;
  z-index: 100;
  animation: slideDown 200ms ease;
  max-height: 400px;
  overflow-y: auto;
}

.searchResultItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  text-decoration: none;
  transition: background-color var(--transition-fast);
  border-bottom: 1px solid var(--border-color);
}

.searchResultItem:last-child {
  border-bottom: none;
}

.searchResultItem:hover {
  background-color: var(--background-color);
}

.searchResultType {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary-color);
  background-color: var(--primary-light);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  width: 70px;
  text-align: center;
}

.searchResultInfo {
  display: flex;
  flex-direction: column;
}

.searchResultText {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.searchResultDesc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.searchResultEmpty {
  padding: 16px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}
"""

with open('src/components/Header.module.css', 'a', encoding='utf-8') as f:
    f.write(css_append)

print("Updated Header.tsx and Header.module.css")
