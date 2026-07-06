import re

# 1. Update settings/clinic/page.tsx
with open('src/app/settings/clinic/page.tsx', 'r', encoding='utf-8') as f:
    clinic_content = f.read()

clinic_content = clinic_content.replace(
    "if (logoPreviewUrl) localStorage.setItem('clinicLogo', logoPreviewUrl);",
    "if (logoPreviewUrl) localStorage.setItem('clinicLogo', logoPreviewUrl);\n    window.dispatchEvent(new Event('clinicInfoUpdated'));"
)

with open('src/app/settings/clinic/page.tsx', 'w', encoding='utf-8') as f:
    f.write(clinic_content)

# 2. Update Sidebar.tsx
with open('src/components/Sidebar.tsx', 'r', encoding='utf-8') as f:
    sidebar_content = f.read()

sidebar_state = """  const pathname = usePathname();
  const [clinicName, setClinicName] = import('react').then(m => m.useState('DentaCRM')); // Hacky way to use React without importing at top level, wait let's just add it to imports

"""
# Better approach for Sidebar.tsx:
sidebar_content = sidebar_content.replace(
    "import { usePathname } from 'next/navigation';",
    "import { usePathname } from 'next/navigation';\nimport { useState, useEffect } from 'react';"
)

sidebar_logic = """  const pathname = usePathname();
  const [clinicName, setClinicName] = useState('DentaCRM');
  const [clinicLogo, setClinicLogo] = useState<string | null>(null);

  useEffect(() => {
    const loadInfo = () => {
      const savedInfo = localStorage.getItem('clinicInfo');
      if (savedInfo) setClinicName(JSON.parse(savedInfo).name || 'DentaCRM');
      const savedLogo = localStorage.getItem('clinicLogo');
      if (savedLogo) setClinicLogo(savedLogo);
    };
    loadInfo();
    window.addEventListener('clinicInfoUpdated', loadInfo);
    return () => window.removeEventListener('clinicInfoUpdated', loadInfo);
  }, []);
"""
sidebar_content = sidebar_content.replace("  const pathname = usePathname();", sidebar_logic)

logo_ui = """      <div className={styles.logo}>
        <div className={styles.logoIcon} style={{ overflow: 'hidden' }}>
          {clinicLogo ? <img src={clinicLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Stethoscope size={20} />}
        </div>
        {!isCollapsed && <h2>{clinicName}</h2>}
      </div>"""
sidebar_content = re.sub(r'<div className={styles\.logo}>.*?</div>', logo_ui, sidebar_content, flags=re.DOTALL)

with open('src/components/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(sidebar_content)


# 3. Update patients/[id]/page.tsx
with open('src/app/patients/[id]/page.tsx', 'r', encoding='utf-8') as f:
    patient_content = f.read()

# Make email mailto:
patient_content = patient_content.replace(
    "<Mail size={14} className={styles.icon} /> {patient.email}",
    "<a href={`mailto:${patient.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}><Mail size={14} className={styles.icon} /> {patient.email}</a>"
)

# Add Edit Patient button and state
state_injection = """
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [editPatientForm, setEditPatientForm] = useState({ ...patient });

  const handleEditPatientSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPatient({ ...patient, ...editPatientForm });
    setShowEditPatientModal(false);
  };
"""
patient_content = patient_content.replace("  const startEdit = (field: string, value: string) => {", state_injection + "\n  const startEdit = (field: string, value: string) => {")

# Add button to header
header_buttons = """          <div className={styles.headerActions}>
            <button className={styles.editBtn} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }} onClick={() => setShowEditPatientModal(true)}>
              <Pencil size={16} /> Ndrysho të dhënat
            </button>
            <button className="btn-primary" onClick={() => setShowInvoiceModal(true)}>
"""
patient_content = patient_content.replace(
    """          <div className={styles.headerActions}>\n            <button className="btn-primary" onClick={() => setShowInvoiceModal(true)}>""",
    header_buttons
)

# Add Modal
modal_ui = """
      {/* Edit Patient Modal */}
      {showEditPatientModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditPatientModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Ndrysho të Dhënat e Pacientit</h2>
              <button className={styles.closeBtn} onClick={() => setShowEditPatientModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditPatientSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Emri</label>
                <input type="text" value={editPatientForm.firstName} onChange={e => setEditPatientForm({...editPatientForm, firstName: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Mbiemri</label>
                <input type="text" value={editPatientForm.lastName} onChange={e => setEditPatientForm({...editPatientForm, lastName: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Telefoni</label>
                <input type="text" value={editPatientForm.phone} onChange={e => setEditPatientForm({...editPatientForm, phone: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" value={editPatientForm.email} onChange={e => setEditPatientForm({...editPatientForm, email: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Datëlindja</label>
                <input type="text" value={editPatientForm.dob} onChange={e => setEditPatientForm({...editPatientForm, dob: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Adresa</label>
                <input type="text" value={editPatientForm.address} onChange={e => setEditPatientForm({...editPatientForm, address: e.target.value})} />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowEditPatientModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary">Ruaj Ndryshimet</button>
              </div>
            </form>
          </div>
        </div>
      )}
"""
patient_content = patient_content.replace("{/* Prescription Modal */}", modal_ui + "\n      {/* Prescription Modal */}")

with open('src/app/patients/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(patient_content)

print("Updated Settings, Sidebar, and Patient Details.")
