import { useState } from 'react';
import { useControls } from '../../lib/stores/useControls';

const ControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useControls();
  
  const colorOptions = [
    { value: 'orange', label: 'Orange', color: '#ff6600' },
    { value: 'blue', label: 'Blue', color: '#0099ff' },
    { value: 'green', label: 'Green', color: '#00dd44' },
    { value: 'purple', label: 'Purple', color: '#aa33ff' },
    { value: 'bioluminescent', label: 'Bio', color: '#c9ff00' },
    { value: 'miner', label: 'Miner', color: '#ffcc00' },
    { value: 'kloud', label: 'Cosmic', color: '#9d4edd' },
  ];
  
  return (
    <div className="absolute left-4 top-4 z-10">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="cosmic-main-btn"
        >
          <span>Show Controls</span>
        </button>
      )}
      
      {isOpen && (
        <div className="bg-black/80 text-white p-4 rounded-lg w-72 backdrop-blur-sm border-2 border-[#ffd700] shadow-lg shadow-[#9d4edd]/30" 
             style={{
               background: "linear-gradient(135deg, rgba(20, 17, 40, 0.9), rgba(10, 10, 10, 0.98))",
               boxShadow: "0 0 15px rgba(157, 78, 221, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)"
             }}>
          <div className="flex justify-between items-center mb-4"
               style={{
                 background: "linear-gradient(45deg, #9d4edd, #5a189a)",
                 margin: "-16px -16px 16px -16px",
                 padding: "12px 16px",
                 borderTopLeftRadius: "8px",
                 borderTopRightRadius: "8px",
                 borderBottom: "2px solid #ffd700"
               }}>
            <h2 className="text-lg font-semibold" style={{ 
              color: "#ffd700", 
              textShadow: "0 0 5px rgba(255, 215, 0, 0.7)" 
            }}>Cosmic Mining Network</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Color Scheme */}
            <div>
              <label className="block mb-2 text-sm font-medium">Color Scheme</label>
              <div className="flex space-x-2">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => controls.setColorScheme(option.value as any)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      controls.colorScheme === option.value ? 'scale-110 ring-2 ring-white' : 'opacity-70'
                    }`}
                    style={{ backgroundColor: option.color }}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            
            {/* Auto Rotation */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Rotation</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={controls.autoRotate}
                    onChange={() => controls.setAutoRotate(!controls.autoRotate)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-500 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>
            </div>
            
            {/* Rotation Speed */}
            <div>
              <label className="block mb-1 text-sm font-medium">Rotation Speed</label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={controls.rotationSpeed}
                onChange={(e) => controls.setRotationSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Tendril Count */}
            <div>
              <label className="block mb-1 text-sm font-medium">Tendrils: {controls.tendrilCount}</label>
              <input
                type="range"
                min="20"
                max="120"
                step="10"
                value={controls.tendrilCount}
                onChange={(e) => controls.setTendrilCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Core Intensity */}
            <div>
              <label className="block mb-1 text-sm font-medium">Core Intensity</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={controls.coreIntensity}
                onChange={(e) => controls.setCoreIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Pulse Intensity */}
            <div>
              <label className="block mb-1 text-sm font-medium">Pulse Intensity</label>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.1"
                value={controls.pulseIntensity}
                onChange={(e) => controls.setPulseIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Mouse Interaction */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mouse Interaction</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={controls.interactionEnabled}
                    onChange={() => controls.toggleInteraction()}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-500 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>
            </div>
            
            {/* Keyboard shortcuts */}
            <div className="mt-6 text-xs text-gray-400">
              <p>Press 'P' to toggle performance stats</p>
              <p>Press 'M' to toggle sound</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;