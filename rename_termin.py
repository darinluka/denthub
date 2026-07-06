import os

replacements = {
    'c:/Users/x1car/Desktop/Dentisti/src/app/settings/staff/page.tsx': [
        ("termineve", "vizitave")
    ],
    'c:/Users/x1car/Desktop/Dentisti/src/app/page.tsx': [
        ("Terminet e Ardhshme", "Vizitat e Ardhshme"),
        ("Terminet e Rradhës", "Vizitat e Rradhës")
    ],
    'c:/Users/x1car/Desktop/Dentisti/src/app/appointments/page.tsx': [
        ("Terminet", "Vizitat"),
        ("termin</span>", "vizitë</span>"),
        ("Ruaj Terminin", "Ruaj Vizitën")
    ]
}

for file_path, reps in replacements.items():
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old_txt, new_txt in reps:
            content = content.replace(old_txt, new_txt)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

print("Replacements done!")
