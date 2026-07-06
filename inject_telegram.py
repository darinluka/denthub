import os
import re

# 1. Update src/app/appointments/page.tsx
appts_file = 'c:/Users/x1car/Desktop/Dentisti/src/app/appointments/page.tsx'
with open(appts_file, 'r', encoding='utf-8') as f:
    appts = f.read()

if "sendTelegramNotification" not in appts:
    appts = appts.replace("import { Calendar as CalendarIcon", "import { sendTelegramNotification } from '@/lib/telegram';\nimport { Calendar as CalendarIcon")
    
    save_logic_target = """    setAppts([...appts, newAppt]);
    setShowModal(false);"""
    
    save_logic_replacement = """    setAppts([...appts, newAppt]);
    setShowModal(false);
    
    // Telegram Notification
    sendTelegramNotification(`📅 <b>Vizitë e Re</b>\\nPacienti: ${form.patient}\\nTrajtimi: ${form.treatment}\\nData: ${form.date} ora ${form.time}`);"""
    
    appts = appts.replace(save_logic_target, save_logic_replacement)
    
    with open(appts_file, 'w', encoding='utf-8') as f:
        f.write(appts)


# 2. Update src/app/lab/page.tsx
lab_file = 'c:/Users/x1car/Desktop/Dentisti/src/app/lab/page.tsx'
with open(lab_file, 'r', encoding='utf-8') as f:
    lab = f.read()

if "sendTelegramNotification" not in lab:
    lab = lab.replace("import { FlaskConical,", "import { sendTelegramNotification } from '@/lib/telegram';\nimport { FlaskConical,")
    
    save_logic_target = """    setOrders([newOrder, ...orders]);
    setShowModal(false);"""
    
    save_logic_replacement = """    setOrders([newOrder, ...orders]);
    setShowModal(false);
    
    // Telegram Notification
    sendTelegramNotification(`🧪 <b>Porosi Laboratori e Re</b>\\nPacienti: ${form.patient}\\nLloji: ${form.type}\\nKlinika: ${form.lab}`);"""
    
    lab = lab.replace(save_logic_target, save_logic_replacement)
    
    with open(lab_file, 'w', encoding='utf-8') as f:
        f.write(lab)

# 3. Update src/app/patients/[id]/page.tsx
patient_file = 'c:/Users/x1car/Desktop/Dentisti/src/app/patients/[id]/page.tsx'
with open(patient_file, 'r', encoding='utf-8') as f:
    pat = f.read()

if "sendTelegramNotification" not in pat:
    pat = pat.replace("import { ArrowLeft,", "import { sendTelegramNotification } from '@/lib/telegram';\nimport { ArrowLeft,")
    
    save_inv_target = """    setInvoicesList([newInvoice, ...invoicesList]);
    setShowInvoiceModal(false);"""
    
    save_inv_replacement = """    setInvoicesList([newInvoice, ...invoicesList]);
    setShowInvoiceModal(false);
    
    // Telegram Notification
    sendTelegramNotification(`💰 <b>Faturë e Re</b>\\nPacienti: ${patient.firstName} ${patient.lastName}\\nShërbimi: ${invoice.service}\\nShuma: ${invoice.amount} Lekë`);"""
    
    pat = pat.replace(save_inv_target, save_inv_replacement)
    
    save_viz_target = """    setVisits([newVisit, ...visits]);
    setShowVisitModal(false);"""
    
    save_viz_replacement = """    setVisits([newVisit, ...visits]);
    setShowVisitModal(false);
    
    // Telegram Notification
    sendTelegramNotification(`🦷 <b>Trajtim i Përfunduar</b>\\nPacienti: ${patient.firstName} ${patient.lastName}\\nTrajtimi: ${visit.treatment}\\nDhëmbi: ${visit.tooth}`);"""
    
    pat = pat.replace(save_viz_target, save_viz_replacement)
    
    with open(patient_file, 'w', encoding='utf-8') as f:
        f.write(pat)

print("All components updated to trigger Telegram notifications.")
