import { useState } from 'react';
import { useControls } from '../../lib/stores/useControls';
import { useAudio } from '../../lib/stores/useAudio';
import { Volume2, VolumeX, BarChart2, Settings } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
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
    <div className="absolute right-3 bottom-3 z-10">
      {/* Menu buttons - always shown in a horizontal row */}
      <div className="flex gap-2 mb-3 justify-end">
        <button
          onClick={() => {
            setIsDashboardOpen(!isDashboardOpen);
            // Close control panel if dashboard is opening
            if (!isDashboardOpen && isOpen) setIsOpen(false);
          }}
          className={`cosmic-main-btn ${isDashboardOpen ? 'active-btn' : ''}`}
          style={{ 
            minWidth: '110px',
            backgroundColor: isDashboardOpen ? 'rgba(153, 0, 255, 0.3)' : undefined,
            boxShadow: isDashboardOpen ? '0 0 15px rgba(153, 0, 255, 0.5)' : undefined 
          }}
        >
          <span className="flex items-center gap-2 justify-center">
            <BarChart2 className="w-4 h-4" />
            Dashboard
          </span>
        </button>
        
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            // Close dashboard if control panel is opening
            if (!isOpen && isDashboardOpen) setIsDashboardOpen(false);
          }}
          className={`cosmic-main-btn ${isOpen ? 'active-btn' : ''}`}
          style={{ 
            minWidth: '110px',
            backgroundColor: isOpen ? 'rgba(255, 204, 0, 0.3)' : undefined,
            boxShadow: isOpen ? '0 0 15px rgba(255, 204, 0, 0.5)' : undefined 
          }}
        >
          <span className="flex items-center gap-2 justify-center">
            <Settings className="w-4 h-4" />
            Control Panel
          </span>
        </button>
      </div>
      
      {/* Dashboard Panel */}
      {isDashboardOpen && (
        <div className="text-white p-3 mb-2 rounded-lg w-72 backdrop-blur-md bg-black/90 overflow-hidden float-right" 
             style={{
               border: "1px solid #9900ff",
               boxShadow: "0 0 15px rgba(255, 204, 0, 0.4)",
               background: "linear-gradient(145deg, rgba(10,10,20,0.9), rgba(26,26,46,0.9))"
             }}>
          <div className="flex justify-between items-center mb-2 border-b border-yellow-500 pb-2">
            <h2 className="text-base font-bold" 
                style={{ 
                  color: "#9900ff", 
                  textShadow: "0 0 5px rgba(153, 0, 255, 0.5)",
                  letterSpacing: "1px"
                }}>MINING DASHBOARD</h2>
            <button
              onClick={() => setIsDashboardOpen(false)}
              className="text-purple-400 hover:text-purple-300 hover:scale-110 transition-all"
              style={{ 
                textShadow: "0 0 8px rgba(153, 0, 255, 0.6)" 
              }}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Mining Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-700">
                <div className="text-sm text-purple-200 mb-1">Hash Rate</div>
                <div className="text-xl font-bold text-yellow-300">248.3 TH/s</div>
              </div>
              <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-700">
                <div className="text-sm text-purple-200 mb-1">Daily Earnings</div>
                <div className="text-xl font-bold text-yellow-300">0.0023 ₿</div>
              </div>
              <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-700">
                <div className="text-sm text-purple-200 mb-1">Efficiency</div>
                <div className="text-xl font-bold text-yellow-300">92.8%</div>
              </div>
              <div className="bg-purple-900/40 p-3 rounded-lg border border-purple-700">
                <div className="text-sm text-purple-200 mb-1">Uptime</div>
                <div className="text-xl font-bold text-yellow-300">99.1%</div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-4">
              <h3 className="text-md font-semibold text-yellow-300 mb-2">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-purple-800/50 pb-1">
                  <span className="text-purple-200">Block #729043 mined</span>
                  <span className="text-yellow-400">+0.00012 ₿</span>
                </div>
                <div className="flex justify-between border-b border-purple-800/50 pb-1">
                  <span className="text-purple-200">Block #729042 mined</span>
                  <span className="text-yellow-400">+0.00015 ₿</span>
                </div>
                <div className="flex justify-between border-b border-purple-800/50 pb-1">
                  <span className="text-purple-200">Block #729040 mined</span>
                  <span className="text-yellow-400">+0.00011 ₿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="text-white p-3 rounded-lg w-64 backdrop-blur-md bg-black/90" 
             style={{
               border: "1px solid #ffcc00",
               boxShadow: "0 0 15px rgba(153, 0, 255, 0.4)",
               background: "linear-gradient(145deg, rgba(10,10,20,0.9), rgba(26,26,46,0.9))"
             }}>
          <div className="flex justify-between items-center mb-2 border-b border-purple-500 pb-2">
            <h2 className="text-base font-bold" 
                style={{ 
                  color: "#ffcc00", 
                  textShadow: "0 0 5px rgba(255, 204, 0, 0.5)",
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
                  Sound Effects
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!audio.isMuted}
                    onChange={() => audio.toggleMute()}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#9900ff] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gradient-to-br after:from-yellow-200 after:to-yellow-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:shadow-[0_0_12px_rgba(153,0,255,0.7)]"></div>
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