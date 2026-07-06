import os

replacements = {
    'c:/Users/x1car/Desktop/Dentisti/src/app/settings/notifications/page.tsx': [
        (", '_blank')", ", 'whatsappWindow', 'width=800,height=600,left=200,top=100')")
    ],
    'c:/Users/x1car/Desktop/Dentisti/src/app/patients/[id]/page.tsx': [
        (", '_blank')", ", 'whatsappWindow', 'width=800,height=600,left=200,top=100')")
    ],
    'c:/Users/x1car/Desktop/Dentisti/src/app/lab/page.tsx': [
        (", '_blank')", ", 'whatsappWindow', 'width=800,height=600,left=200,top=100')")
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

print("WhatsApp window targets updated.")
