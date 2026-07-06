'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

type ToothData = {
  id: string;
  status: 'healthy' | 'caries' | 'filling' | 'implant' | 'missing';
};

const INITIAL_TEETH: ToothData[] = [
  // Top Right (18 to 11)
  { id: '18', status: 'healthy' }, { id: '17', status: 'healthy' }, { id: '16', status: 'healthy' }, { id: '15', status: 'healthy' },
  { id: '14', status: 'healthy' }, { id: '13', status: 'healthy' }, { id: '12', status: 'healthy' }, { id: '11', status: 'healthy' },
  // Top Left (21 to 28)
  { id: '21', status: 'healthy' }, { id: '22', status: 'healthy' }, { id: '23', status: 'healthy' }, { id: '24', status: 'healthy' },
  { id: '25', status: 'healthy' }, { id: '26', status: 'healthy' }, { id: '27', status: 'healthy' }, { id: '28', status: 'healthy' },
  // Bottom Right (48 to 41)
  { id: '48', status: 'healthy' }, { id: '47', status: 'healthy' }, { id: '46', status: 'healthy' }, { id: '45', status: 'healthy' },
  { id: '44', status: 'healthy' }, { id: '43', status: 'healthy' }, { id: '42', status: 'healthy' }, { id: '41', status: 'healthy' },
  // Bottom Left (31 to 38)
  { id: '31', status: 'healthy' }, { id: '32', status: 'healthy' }, { id: '33', status: 'healthy' }, { id: '34', status: 'healthy' },
  { id: '35', status: 'healthy' }, { id: '36', status: 'healthy' }, { id: '37', status: 'healthy' }, { id: '38', status: 'healthy' },
];

function createToothGeometry(index: number, isTop: boolean) {
  const isMolar = index <= 2 || index >= 13;
  const isPremolar = index === 3 || index === 4 || index === 11 || index === 12;
  const isCanine = index === 5 || index === 10;
  const isIncisor = index >= 6 && index <= 9;

  let width = 0.55;
  let height = 0.85;
  let depth = 0.5;

  if (isMolar) {
    width = 0.74;
    height = 0.65;
    depth = 0.74;
  } else if (isPremolar) {
    width = 0.58;
    height = 0.75;
    depth = 0.58;
  } else if (isCanine) {
    width = 0.48;
    height = 0.95;
    depth = 0.48;
  } else if (isIncisor) {
    width = 0.52;
    height = 0.85;
    depth = 0.32;
  }

  // Create a subdivided box geometry for realistic organic tooth shaping
  const geometry = new THREE.BoxGeometry(width, height, depth, 6, 6, 6);
  const position = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const normY = vertex.y / (height / 2); // -1.0 to 1.0
    const angle = Math.atan2(vertex.x, vertex.z);

    // 1. Spherical rounding of the box corners
    const length = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
    if (length > 0) {
      const cornerFactor = 0.86 + 0.04 * Math.cos(4 * angle);
      vertex.x *= cornerFactor;
      vertex.z *= cornerFactor;
    }

    // 2. Shape root and crown anatomically
    if (normY < 0) {
      // Root: taper down and curve slightly backwards
      const taper = 1.0 + normY * 0.58;
      vertex.x *= taper;
      vertex.z *= taper;
      vertex.z += 0.08 * normY * normY;
    } else {
      // Crown: bulge at waist
      const waistFactor = 1.0 + (1.0 - normY) * 0.12 - 0.05 * normY;
      vertex.x *= waistFactor;
      vertex.z *= waistFactor;

      if (isMolar) {
        if (normY > 0.35) {
          const cuspFactor = (normY - 0.35) / 0.65;
          const cusp = 0.08 * Math.cos(4 * angle) - 0.04;
          vertex.y += cusp * cuspFactor;
          
          const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
          vertex.y -= 0.08 * (1.0 - distFromCenter / (width / 2)) * cuspFactor;
        }
      } else if (isPremolar) {
        if (normY > 0.35) {
          const cuspFactor = (normY - 0.35) / 0.65;
          const cusp = 0.07 * Math.cos(2 * angle) - 0.035;
          vertex.y += cusp * cuspFactor;
        }
      } else if (isCanine) {
        if (normY > 0.1) {
          const cuspFactor = (normY - 0.1) / 0.9;
          const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
          vertex.y += (0.15 - distFromCenter * 0.35) * cuspFactor;
          vertex.x *= (1.0 - 0.35 * cuspFactor);
          vertex.z *= (1.0 - 0.35 * cuspFactor);
        }
      } else if (isIncisor) {
        if (normY > -0.1) {
          const flattenFactor = (normY + 0.1) / 1.1;
          vertex.z *= (1.0 - 0.72 * flattenFactor);
          vertex.x *= (1.0 + 0.22 * flattenFactor);
        }
      }
    }

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function Gums({ isTop }: { isTop: boolean }) {
  const points = React.useMemo(() => {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      const angle = Math.PI * 0.84 * (t - 0.5);
      const radiusX = 3.25; // aligned with root center
      const radiusZ = 2.75;
      const x = Math.sin(angle) * radiusX;
      const z = Math.cos(angle) * radiusZ;
      const y = isTop ? 1.05 : -1.05; // positioned cleanly around the roots
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [isTop]);

  const curve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const tubeGeometry = React.useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.30, 20, false); // thinner, cleaner gum tube
  }, [curve]);

  return (
    <mesh geometry={tubeGeometry} castShadow receiveShadow>
      <meshPhysicalMaterial 
        color="#d47385" // organic warm soft pink
        roughness={0.35}
        metalness={0.0}
        clearcoat={0.4}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

function getToothPosition(index: number, isTop: boolean): [number, number, number] {
  const t = index / 15; // 0 to 1
  const angle = Math.PI * 0.84 * (t - 0.5); // span roughly 150 degrees
  const radiusX = 3.3;
  const radiusZ = 2.8;
  
  const x = Math.sin(angle) * radiusX;
  const z = Math.cos(angle) * radiusZ;
  const y = isTop ? 0.78 : -0.78;
  
  return [x, y, z];
}

function Tooth({ data, isTop, index, onSelect, selected }: { data: ToothData, isTop: boolean, index: number, onSelect: () => void, selected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  const pos = getToothPosition(index, isTop);
  const t = index / 15;
  const angle = Math.PI * 0.84 * (t - 0.5);
  
  const toothGeometry = React.useMemo(() => {
    return createToothGeometry(index, isTop);
  }, [index, isTop]);
  
  // Real clinical tooth colors (Warm Ivory/Enamel with custom light scattering properties)
  let color = '#fefdfb'; // Warm realistic enamel white
  let metalness = 0.0;
  let roughness = 0.18;
  let transmission = 0.25; // Translucency
  
  if (data.status === 'caries') {
    color = '#382f27'; // decayed spot
    roughness = 0.65;
    transmission = 0.0;
  } else if (data.status === 'filling') {
    color = '#a5d8f3'; // composite blue filling
    roughness = 0.28;
    transmission = 0.15;
  } else if (data.status === 'implant') {
    color = '#94a3b8'; // titanium screw post
    metalness = 0.85;
    roughness = 0.25;
    transmission = 0.0;
  }
  
  if (data.status === 'missing') return null;

  return (
    <group 
      position={pos} 
      rotation={[0, angle, 0]} // Rotate tooth group to follow the arch curve tangent!
      onClick={(e) => { e.stopPropagation(); onSelect(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} 
      onPointerOut={() => setHover(false)}
    >
      {/* Rotate ONLY the mesh for top teeth (not the text label, keeping it upright!) */}
      <mesh ref={meshRef} castShadow receiveShadow geometry={toothGeometry} rotation={isTop ? [Math.PI, 0, 0] : [0, 0, 0]}>
        <meshPhysicalMaterial 
          color={color} 
          metalness={metalness} 
          roughness={roughness} 
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          transmission={transmission}
          thickness={0.5}
          ior={1.62} // Index of Refraction of natural tooth enamel
          attenuationColor="#fffaf0"
          attenuationDistance={0.5}
          emissive={selected ? '#10b981' : (hovered ? '#34d399' : '#000000')}
          emissiveIntensity={selected ? 0.45 : (hovered ? 0.25 : 0)}
        />
      </mesh>
      {/* Position label at the root base, slightly forward in local Z so it doesn't clip */}
      <Text position={[0, isTop ? 1.05 : -1.05, 0.15]} fontSize={0.18} color="#475569" anchorX="center" anchorY="middle">
        {data.id}
      </Text>
      {hovered && (
        <Html position={[0, isTop ? 1.45 : -1.45, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', whiteSpace: 'nowrap', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            Dhëmbi {data.id}: <span style={{ fontWeight: 600 }}>{data.status === 'healthy' ? 'I Shëndetshëm' : data.status === 'caries' ? 'Karies' : data.status === 'filling' ? 'Mbushje' : data.status === 'implant' ? 'Implant' : 'Bosh'}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Odontogram3D() {
  const [teeth, setTeeth] = useState<ToothData[]>(INITIAL_TEETH);
  const [history, setHistory] = useState<ToothData[][]>([]);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const topTeeth = teeth.slice(0, 16);
  const bottomTeeth = teeth.slice(16, 32);

  const handleUpdateStatus = (status: ToothData['status']) => {
    if (!selectedTooth) return;
    setHistory(prev => [...prev, teeth]);
    setTeeth(prev => prev.map(t => t.id === selectedTooth ? { ...t, status } : t));
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setTeeth(prev);
      setHistory(h => h.slice(0, -1));
    }
  };

  const handleSave = () => {
    setToastMsg('✅ Odontogrami u ruajt me sukses!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%', height: isMobile ? 'auto' : '500px', backgroundColor: '#f8fafc', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
      {toastMsg && (
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'slideDown 0.3s ease' }}>
          {toastMsg}
        </div>
      )}
      {isMobile && (
        <div style={{ padding: '16px 16px 8px 16px', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}>Odontogrami 3D</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Prekni dhe rrëshqitni me gisht për të rrotulluar nofullën</p>
        </div>
      )}
      <div style={{ flex: 1, height: isMobile ? '300px' : '100%', width: '100%', position: 'relative', backgroundColor: '#f1f5f9' }}>
        <Canvas shadows camera={{ position: [0, 3.2, 11.8], fov: 38 }}>
          <ambientLight intensity={0.55} />
          {/* Main Key Light */}
          <directionalLight position={[10, 15, 10]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
          {/* Soft Fill Light */}
          <directionalLight position={[-10, 5, -10]} intensity={0.4} />
          {/* Subtle rim light for outline shape */}
          <directionalLight position={[0, -10, 5]} intensity={0.6} color="#d1fae5" />
          <Environment preset="city" />
          
          <group position={[0, 0, -2.8]}>
            {/* Gums supporting the arches */}
            <Gums isTop={true} />
            <Gums isTop={false} />
            
            {topTeeth.map((tooth, i) => (
              <Tooth key={tooth.id} data={tooth} isTop={true} index={i} selected={selectedTooth === tooth.id} onSelect={() => setSelectedTooth(tooth.id)} />
            ))}
            {bottomTeeth.map((tooth, i) => (
              <Tooth key={tooth.id} data={tooth} isTop={false} index={i} selected={selectedTooth === tooth.id} onSelect={() => setSelectedTooth(tooth.id)} />
            ))}
          </group>
          
          <ContactShadows position={[0, -2.4, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.4} enableZoom={true} />
        </Canvas>
        
        {!isMobile && (
          <div style={{ position: 'absolute', top: 16, left: 16, pointerEvents: 'none' }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Odontogrami 3D</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Rrotullo me mouse për të parë nofullën</p>
          </div>
        )}
      </div>
      
      {/* Sidebar for Controls */}
      <div style={{ width: isMobile ? '100%' : '280px', backgroundColor: '#ffffff', borderLeft: isMobile ? 'none' : '1px solid #e2e8f0', borderTop: isMobile ? '1px solid #e2e8f0' : 'none', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Paneli i Trajtimit</h4>
        
        {selectedTooth ? (
          <>
            <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', color: '#0284c7' }}>
              Dhëmbi {selectedTooth}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => handleUpdateStatus('healthy')}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4ade80', border: '1px solid #cbd5e1' }} /> I Shëndetshëm
              </button>
              
              <button 
                type="button"
                onClick={() => handleUpdateStatus('caries')}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4a3f35' }} /> Karies
              </button>

              <button 
                type="button"
                onClick={() => handleUpdateStatus('filling')}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fdfbf7', border: '1px solid #cbd5e1' }} /> Mbushje
              </button>

              <button 
                type="button"
                onClick={() => handleUpdateStatus('implant')}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#a0a0a0' }} /> Implant Titani
              </button>
              
              <button 
                type="button"
                onClick={() => handleUpdateStatus('missing')}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px dashed #cbd5e1' }} /> Bosh (Mungon)
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>🦷</div>
            Kliko një dhëmb në modelin 3D për ta selektuar. Më pas mund t'i caktosh diagnozën.
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: history.length > 0 ? 'pointer' : 'not-allowed', opacity: history.length > 0 ? 1 : 0.5, fontWeight: 600, color: '#475569', transition: 'all 0.2s' }}
          >
            ↩ Undo
          </button>
          <button 
            type="button"
            onClick={handleSave}
            style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0ea5e9', color: 'white', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(14, 165, 233, 0.3)' }}
          >
            💾 Ruaj
          </button>
        </div>
      </div>
    </div>
  );
}
