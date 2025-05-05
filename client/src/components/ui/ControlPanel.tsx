import { useState } from 'react';
import { useControls } from '../../lib/stores/useControls';
import { useAudio } from '../../lib/stores/useAudio';
import { Volume2, VolumeX } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useControls();
  const audio = useAudio();
  
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
    <div className="absolute right-4 bottom-4 z-10">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="cosmic-main-btn"
        >
          <span>Control Panel</span>
        </button>
      )}
      
      {isOpen && (
        <div className="text-white p-5 rounded-lg w-80 backdrop-blur-md bg-black/90" 
             style={{
               border: "2px solid #ffcc00",
               boxShadow: "0 0 25px rgba(153, 0, 255, 0.5)",
               background: "linear-gradient(145deg, rgba(10,10,20,0.9), rgba(26,26,46,0.9))"
             }}>
          <div className="flex justify-between items-center mb-4 border-b border-purple-500 pb-3">
            <h2 className="text-xl font-bold" 
                style={{ 
                  color: "#ffcc00", 
                  textShadow: "0 0 10px rgba(255, 204, 0, 0.5)",
                  letterSpacing: "1px"
                }}>ZIG-MINER CONTROLS</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-yellow-400 hover:text-yellow-300 hover:scale-110 transition-all"
              style={{ 
                textShadow: "0 0 8px rgba(255, 204, 0, 0.6)" 
              }}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Color Scheme */}
            <div>
              <label className="block mb-3 text-sm font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>Color Scheme</label>
              <div className="flex flex-wrap gap-3 justify-center">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => controls.setColorScheme(option.value as any)}
                    className={`w-10 h-10 rounded-full transition-all duration-300 ${
                      controls.colorScheme === option.value 
                        ? 'scale-110 ring-2 ring-white shadow-lg' 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: option.color,
                      boxShadow: controls.colorScheme === option.value 
                        ? `0 0 15px ${option.color}` 
                        : 'none'
                    }}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            
            {/* Auto Rotation */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>Auto Rotation</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={controls.autoRotate}
                    onChange={() => controls.setAutoRotate(!controls.autoRotate)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#9900ff] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gradient-to-br after:from-yellow-200 after:to-yellow-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:shadow-[0_0_12px_rgba(153,0,255,0.7)]"></div>
                </label>
              </div>
            </div>
            
            {/* Rotation Speed */}
            <div>
              <label className="block mb-3 text-sm font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>Rotation Speed</label>
              <div className="px-1">
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
            </div>
            
            {/* Tendrils removed as requested */}
            
            {/* Core Intensity */}
            <div>
              <label className="block mb-3 text-sm font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>Core Intensity</label>
              <div className="px-1">
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
            </div>
            
            {/* Pulse Intensity */}
            <div>
              <label className="block mb-3 text-sm font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>Pulse Intensity</label>
              <div className="px-1">
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
            </div>
            
            {/* Mouse Interaction */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>Mouse Interaction</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={controls.interactionEnabled}
                    onChange={() => controls.toggleInteraction()}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#9900ff] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gradient-to-br after:from-yellow-200 after:to-yellow-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:shadow-[0_0_12px_rgba(153,0,255,0.7)]"></div>
                </label>
              </div>
            </div>
            
            {/* Sound Toggle */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>
                  Sound
                  <span className="ml-2 opacity-75 text-xs">
                    {audio.isMuted ? "(Muted)" : "(On)"}
                  </span>
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!audio.isMuted}
                    onChange={() => audio.toggleMute()}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#ffcc00] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gradient-to-br after:from-purple-200 after:to-purple-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:shadow-[0_0_12px_rgba(255,204,0,0.7)]">
                    <span className="absolute inset-0 flex items-center justify-center">
                      {audio.isMuted ? 
                        <VolumeX className="w-3 h-3 text-gray-400 absolute left-7" /> : 
                        <Volume2 className="w-3 h-3 text-purple-900 absolute left-2" />
                      }
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Keyboard shortcuts */}
            <div className="mt-6 py-3 px-4 text-xs text-yellow-300 border border-purple-700 rounded-lg bg-purple-900/50" 
                 style={{ boxShadow: "inset 0 0 15px rgba(153, 0, 255, 0.2)" }}>
              <div className="font-semibold mb-2 uppercase tracking-wide">Cosmic Commands</div>
              <p className="mb-1">• Press 'P' to toggle performance stats</p>
              <p>• Press 'M' to toggle sound</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;