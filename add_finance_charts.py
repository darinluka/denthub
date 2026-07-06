import re

with open('src/app/finance/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
imports_to_add = "import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';\nconst COLORS = ['#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#14b8a6', '#6366f1'];\n"
content = content.replace("import styles from './finance.module.css';", "import styles from './finance.module.css';\n" + imports_to_add)

# Add chart data calculation inside FinancePage component
# Search for: const monthLabel = ...
chart_data_calc = """
  // Generate chart data dynamically
  const revenueByDate = useMemo(() => {
    const map = new Map<string, number>();
    [...filtered].reverse().forEach(t => {
      map.set(t.dateLabel, (map.get(t.dateLabel) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, te_ardhura]) => ({ name, te_ardhura }));
  }, [filtered]);

  const revenueByService = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(t => {
      map.set(t.service, (map.get(t.service) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filtered]);
"""

content = content.replace("const monthLabel = showAll ? 'Të Gjitha' : `${MONTHS[selectedMonth]} ${selectedYear}`;", "const monthLabel = showAll ? 'Të Gjitha' : `${MONTHS[selectedMonth]} ${selectedYear}`;\n" + chart_data_calc)


# Add charts UI
charts_ui = """
      {/* Charts section */}
      {filtered.length > 0 && (
        <div style={{ marginTop: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '20px', fontWeight: 600 }}>Të Ardhurat ndër Kohë</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByDate} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={{ outline: 'none' }}>
                    <defs>
                      <linearGradient id="colorFinRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `${value / 1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`${Number(value).toLocaleString()} L`, 'Të Ardhurat']}
                    />
                    <Area type="monotone" dataKey="te_ardhura" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorFinRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '20px', fontWeight: 600 }}>Të Ardhurat sipas Trajtimeve</h3>
              <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ outline: 'none' }}>
                    <Pie
                      data={revenueByService}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {revenueByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(value, name) => [`${Number(value).toLocaleString()} L`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}
"""

content = content.replace("{/* Table */}", charts_ui + "\n      {/* Table */}")

with open('src/app/finance/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated finance page.")
