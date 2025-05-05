import { useState, useEffect } from 'react';
import { useControls } from '../../lib/stores/useControls';
import { useAudio } from '../../lib/stores/useAudio';
import { Volume2, VolumeX, BarChart2, Sliders, Hash, Activity, Clock, Zap } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const controls = useControls();
  const audio = useAudio();
  
  // Determine if we're on a mobile device to adjust positioning
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
  
  // Render different button layouts based on where they should be positioned
  const DashboardButton = () => (
    <button
      onClick={() => {
        setIsDashboardOpen(!isDashboardOpen);
        if (!isDashboardOpen && isOpen) setIsOpen(false);
      }}
      className={`cosmic-main-btn ${isDashboardOpen ? 'active-btn' : ''}`}
      style={{ 
        width: '64px',
        height: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDashboardOpen ? 'rgba(153, 0, 255, 0.3)' : undefined,
        boxShadow: isDashboardOpen ? '0 0 15px rgba(153, 0, 255, 0.5)' : undefined 
      }}
    >
      <BarChart2 className="w-5 h-5 mb-1" />
      <span className="text-[10px]">Dashboard</span>
    </button>
  );

  const ControlsButton = () => (
    <button
      onClick={() => {
        setIsOpen(!isOpen);
        if (!isOpen && isDashboardOpen) setIsDashboardOpen(false);
      }}
      className={`cosmic-main-btn ${isOpen ? 'active-btn' : ''}`}
      style={{ 
        width: '64px',
        height: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isOpen ? 'rgba(255, 204, 0, 0.3)' : undefined,
        boxShadow: isOpen ? '0 0 15px rgba(255, 204, 0, 0.5)' : undefined 
      }}
    >
      <Sliders className="w-5 h-5 mb-1" />
      <span className="text-[10px]">Controls</span>
    </button>
  );
  
  return (
    <>
      {/* Top-left button - Dashboard */}
      <div className="absolute top-4 left-4 z-10">
        <DashboardButton />
      </div>
      
      {/* Top-right button - Controls */}
      <div className="absolute top-4 right-4 z-10">
        <ControlsButton />
      </div>
      
      {/* Sound toggle button - keep at top right */}
      <div className="absolute top-20 right-4 z-10">
        <button
          onClick={() => audio.toggleMute()}
          className="cosmic-mini-btn"
          style={{ width: '34px', height: '34px' }}
          title={audio.isMuted ? "Unmute" : "Mute"}
        >
          <span className="flex items-center justify-center">
            {audio.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </span>
        </button>
      </div>
      
      {/* Dashboard Panel - More compact mini-menu */}
      {isDashboardOpen && (
        <div className="cosmic-panel float-right mb-2 p-2 w-64" style={{ maxWidth: "200px" }}>
          <div className="flex justify-between items-center mb-1.5 border-b border-purple-500 pb-1">
            <h2 className="text-xs font-bold" 
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
          
          <div className="space-y-1.5">
            {/* Mining Stats - More compact */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center bg-purple-900/30 p-1.5 rounded-md border border-purple-700">
                <Hash className="w-3 h-3 mr-1 text-purple-400" />
                <div>
                  <div className="text-[8px] text-purple-200">Hash Rate</div>
                  <div className="text-[10px] font-bold text-yellow-300">248.3 TH/s</div>
                </div>
              </div>
              <div className="flex items-center bg-purple-900/30 p-1.5 rounded-md border border-purple-700">
                <Activity className="w-3 h-3 mr-1 text-purple-400" />
                <div>
                  <div className="text-[8px] text-purple-200">Earnings</div>
                  <div className="text-[10px] font-bold text-yellow-300">0.0023 ₿</div>
                </div>
              </div>
              <div className="flex items-center bg-purple-900/30 p-1.5 rounded-md border border-purple-700">
                <Zap className="w-3 h-3 mr-1 text-purple-400" />
                <div>
                  <div className="text-[8px] text-purple-200">Efficiency</div>
                  <div className="text-[10px] font-bold text-yellow-300">92.8%</div>
                </div>
              </div>
              <div className="flex items-center bg-purple-900/30 p-1.5 rounded-md border border-purple-700">
                <Clock className="w-3 h-3 mr-1 text-purple-400" />
                <div>
                  <div className="text-[8px] text-purple-200">Uptime</div>
                  <div className="text-[10px] font-bold text-yellow-300">99.1%</div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity - Ultra compact */}
            <div>
              <div className="flex justify-between items-center text-[8px]">
                <span className="text-yellow-300 font-medium">RECENT ACTIVITY</span>
                <span className="text-purple-400">PROFITS</span>
              </div>
              <div className="space-y-0.5 mt-0.5">
                <div className="flex justify-between text-[8px] border-b border-purple-800/30 pb-0.5">
                  <span className="text-purple-200">Block #729043</span>
                  <span className="text-yellow-400">+0.00012 ₿</span>
                </div>
                <div className="flex justify-between text-[8px] border-b border-purple-800/30 pb-0.5">
                  <span className="text-purple-200">Block #729042</span>
                  <span className="text-yellow-400">+0.00015 ₿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Control Panel - Compact mini-menu */}
      {isOpen && (
        <div className="cosmic-panel-gold p-2 w-64" style={{ maxWidth: "200px" }}>
          <div className="flex justify-between items-center mb-1.5 border-b border-yellow-500/50 pb-1">
            <h2 className="text-xs font-bold" 
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
          
          <div className="space-y-2">
            {/* Color Scheme - Ultra compact */}
            <div>
              <label className="block mb-1 text-[9px] font-medium text-purple-200" style={{ textShadow: "0 0 5px rgba(153, 0, 255, 0.5)" }}>COLOR SCHEME</label>
              <div className="flex flex-wrap gap-1 justify-center">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => controls.setColorScheme(option.value as any)}
                    className={`w-5 h-5 rounded-full transition-all duration-300 ${
                      controls.colorScheme === option.value 
                        ? 'scale-110 ring-1 ring-white shadow-md' 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: option.color,
                      boxShadow: controls.colorScheme === option.value 
                        ? `0 0 10px ${option.color}` 
                        : 'none'
                    }}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            
            {/* Toggles in a row */}
            <div className="grid grid-cols-2 gap-1.5">
              {/* Auto Rotation Toggle */}
              <div className="bg-purple-900/20 p-1.5 rounded-md border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-[8px] font-medium text-yellow-300">Auto Rotation</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={controls.autoRotate}
                      onChange={() => controls.setAutoRotate(!controls.autoRotate)}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-3 bg-gray-700 rounded-full peer peer-checked:bg-[#9900ff] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-gradient-to-br after:from-yellow-200 after:to-yellow-400 after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:shadow-[0_0_6px_rgba(153,0,255,0.7)]"></div>
                  </label>
                </div>
              </div>
              
              {/* Mouse Interaction Toggle */}
              <div className="bg-purple-900/20 p-1.5 rounded-md border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-[8px] font-medium text-yellow-300">Mouse Effects</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={controls.interactionEnabled}
                      onChange={() => controls.toggleInteraction()}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-3 bg-gray-700 rounded-full peer peer-checked:bg-[#9900ff] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-gradient-to-br after:from-yellow-200 after:to-yellow-400 after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:shadow-[0_0_6px_rgba(153,0,255,0.7)]"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Sliders - Ultra compact */}
            <div className="space-y-1.5">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[8px] font-medium text-yellow-300">Rotation Speed</label>
                  <span className="text-[8px] text-purple-300">{Math.round(controls.rotationSpeed * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={controls.rotationSpeed}
                  onChange={(e) => controls.setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full cursor-pointer h-2"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[8px] font-medium text-yellow-300">Core Intensity</label>
                  <span className="text-[8px] text-purple-300">{Math.round(controls.coreIntensity * 50)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={controls.coreIntensity}
                  onChange={(e) => controls.setCoreIntensity(parseFloat(e.target.value))}
                  className="w-full cursor-pointer h-2"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[8px] font-medium text-yellow-300">Pulse Intensity</label>
                  <span className="text-[8px] text-purple-300">{Math.round(controls.pulseIntensity * 67)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.1"
                  value={controls.pulseIntensity}
                  onChange={(e) => controls.setPulseIntensity(parseFloat(e.target.value))}
                  className="w-full cursor-pointer h-2"
                />
              </div>
            </div>
            
            {/* Keyboard shortcuts - Ultra compact */}
            <div className="mt-1 py-1 px-1.5 text-xs text-yellow-300 border border-purple-700/50 rounded-md bg-purple-900/30" 
                 style={{ boxShadow: "inset 0 0 5px rgba(153, 0, 255, 0.2)" }}>
              <div className="font-medium text-center text-[8px] text-yellow-200">COSMIC COMMANDS</div>
              <div className="flex justify-between text-[7px] text-purple-200">
                <span>• 'P': toggle stats</span>
                <span>• 'M': toggle sound</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ControlPanel;