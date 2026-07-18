import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { ZoomIn, ZoomOut, Maximize, X, Activity, Shield, Users, MapPin } from 'lucide-react';

const HOTSPOTS = [
  { id: 'gate-north', title: 'North Gate', description: 'High traffic. Queue: 12m', x: 0, y: 15, z: -35, color: '#f87171' },
  { id: 'vip-lounge', title: 'VIP Lounge', description: 'Capacity: 85%', x: -40, y: 10, z: 0, color: '#fbbf24' },
  { id: 'medical-1', title: 'Medical Unit A', description: 'Standby - All Clear', x: 30, y: 5, z: 25, color: '#34d399' },
  { id: 'food-court', title: 'Food Court', description: 'Busy. Wait: 5m', x: -20, y: 12, z: 35, color: '#fbbf24' }
];

export default function InteractiveMap() {
  const mountRef = useRef(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Three.js refs to cleanup
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene Setup
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
    camera.position.set(0, 80, 120);
    camera.lookAt(0, 0, 0);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xfff0dd, 0.8);
    dirLight.position.set(50, 100, 50);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x4488ff, 1.5, 200);
    blueLight.position.set(-50, 20, -50);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xffaa00, 1, 200);
    goldLight.position.set(50, 20, 50);
    scene.add(goldLight);

    // Build Abstract 3D Stadium
    const stadiumGroup = new THREE.Group();
    
    // Field (Pitch)
    const fieldGeo = new THREE.PlaneGeometry(60, 100);
    const fieldMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a472a, 
      roughness: 0.8,
      metalness: 0.1
    });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.rotation.x = -Math.PI / 2;
    stadiumGroup.add(field);

    // Outer Stadium Rings (Tiers)
    const createTier = (radiusX, radiusZ, yOffset, colorHex, opacityVal = 1) => {
      const shape = new THREE.Shape();
      shape.ellipse(0, 0, radiusX, radiusZ, 0, Math.PI * 2, false, 0);
      
      const hole = new THREE.Path();
      hole.ellipse(0, 0, radiusX - 10, radiusZ - 10, 0, Math.PI * 2, false, 0);
      shape.holes.push(hole);

      const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      
      const mat = new THREE.MeshStandardMaterial({ 
        color: colorHex,
        roughness: 0.3,
        metalness: 0.8,
        transparent: opacityVal < 1,
        opacity: opacityVal
      });
      
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = yOffset;
      return mesh;
    };

    // Add 3 tiers to the stadium
    stadiumGroup.add(createTier(50, 80, 5, 0x111111));
    stadiumGroup.add(createTier(65, 95, 12, 0x1a1a1a));
    stadiumGroup.add(createTier(80, 110, 20, 0x222222, 0.9));
    
    // Inner Glow Ring
    const ringGeo = new THREE.RingGeometry(40, 42, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xE5C158, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const glowRing = new THREE.Mesh(ringGeo, ringMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 1;
    stadiumGroup.add(glowRing);

    // Hotspots (Pins)
    const pins = [];
    HOTSPOTS.forEach((spot) => {
      // Pin stem
      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: spot.color })
      );
      cylinder.position.set(spot.x, spot.y, spot.z);
      
      // Pin head
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 16, 16),
        new THREE.MeshBasicMaterial({ color: spot.color })
      );
      sphere.position.set(spot.x, spot.y + 5, spot.z);
      
      const pinGroup = new THREE.Group();
      pinGroup.add(cylinder);
      pinGroup.add(sphere);
      pinGroup.userData = spot;
      
      stadiumGroup.add(pinGroup);
      pins.push(pinGroup);
    });

    scene.add(stadiumGroup);

    // Raycaster for interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Check intersections with pins (the sphere part)
      const pinMeshes = pins.map(p => p.children[1]); 
      const intersects = raycaster.intersectObjects(pinMeshes);
      
      if (intersects.length > 0) {
        const selectedPinGroup = intersects[0].object.parent;
        setActiveHotspot(selectedPinGroup.userData);
      } else {
        setActiveHotspot(null);
      }
    };

    mountRef.current.addEventListener('click', onMouseClick);

    setLoading(false);

    // Animation Loop
    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      time += 0.005;
      
      // Rotate stadium slowly
      stadiumGroup.rotation.y = time * 0.5;
      
      // Pulse glow ring
      glowRing.material.opacity = 0.3 + Math.sin(time * 5) * 0.2;
      
      // Bob pins up and down
      pins.forEach((pin, i) => {
        pin.position.y = Math.sin(time * 3 + i) * 1.5;
      });

      renderer.render(scene, camera);
    };
    
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('click', onMouseClick);
        mountRef.current.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0B0C10]' : 'h-full w-full min-h-[400px]'} flex flex-col glass overflow-hidden rounded-2xl`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-[#0B0C10]/80 to-transparent pointer-events-none">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#E5C158] to-[#C5A03A] bg-clip-text text-transparent">
            3D Stadium Digital Twin
          </h2>
          <p className="text-sm text-gray-400">Real-time WebGL Telemetry Map</p>
        </div>
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 glass rounded-lg hover:bg-white/10 transition-colors pointer-events-auto"
        >
          {isFullscreen ? <X className="text-[#E5C158]" size={20} /> : <Maximize className="text-[#E5C158]" size={20} />}
        </button>
      </div>

      {/* 3D Canvas Container */}
      <div ref={mountRef} className="flex-1 w-full h-full cursor-pointer touch-none" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B0C10]/50 backdrop-blur-sm z-20">
          <div className="w-8 h-8 border-2 border-[#E5C158] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Hotspot Info Panel Overlay */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 min-w-[280px] glass p-4 rounded-xl border border-white/10 shadow-2xl z-20"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} color={activeHotspot.color} />
                <h3 className="font-semibold text-white">{activeHotspot.title}</h3>
              </div>
              <button 
                onClick={() => setActiveHotspot(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-300">{activeHotspot.description}</p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs px-2 py-1 bg-white/5 rounded-md border border-white/5 text-gray-300">
                Lat: {activeHotspot.x.toFixed(1)}
              </span>
              <span className="text-xs px-2 py-1 bg-white/5 rounded-md border border-white/5 text-gray-300">
                Lng: {activeHotspot.z.toFixed(1)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Interaction Hint */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="px-3 py-1.5 glass rounded-lg border border-white/10 text-xs text-gray-400 flex items-center gap-2">
          <Activity size={12} className="text-[#E5C158]" />
          Click colored pins to view data
        </div>
      </div>
    </div>
  );
}
