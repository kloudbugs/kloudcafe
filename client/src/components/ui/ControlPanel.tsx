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
    { value: 'kloud', label: 'KloudBugs', color: '#00ffcc' },
    { value: 'cosmic', label: 'Cosmic', color: '#9900ff' },
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
        <div className="text-white p-4 rounded-lg w-72 backdrop-blur-sm bg-black/80" 
             style={{
               border: "1px solid #9900ff",
               boxShadow: "0 0 15px rgba(153, 0, 255, 0.3)"
             }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold" style={{ color: "#ffcc00" }}>ZIG MINER CONTROLS</h2>
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
                  <div className="w-9 h-5 bg-gray-500 rounded-full peer peer-checked:bg-[#00ffcc] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:shadow-[0_0_8px_rgba(0,255,204,0.6)]"></div>
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
                className="w-full cursor-pointer"
              />
            </div>
            
            {/* Tendrils removed as requested */}
            
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
                className="w-full cursor-pointer"
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
                className="w-full cursor-pointer"
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
                  <div className="w-9 h-5 bg-gray-500 rounded-full peer peer-checked:bg-[#00ffcc] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:shadow-[0_0_8px_rgba(0,255,204,0.6)]"></div>
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