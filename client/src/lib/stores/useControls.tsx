import { create } from "zustand";

interface ControlsState {
  // Camera controls
  autoRotate: boolean;
  rotationSpeed: number;
  
  // Visual settings
  tendrilCount: number;
  coreIntensity: number;
  particleCount: number;
  pulseIntensity: number;
  blockCount: number;
  colorScheme: 'orange' | 'blue' | 'green' | 'purple' | 'bioluminescent' | 'miner' | 'kloud';
  interactionEnabled: boolean;
  
  // Action functions
  setAutoRotate: (value: boolean) => void;
  setRotationSpeed: (value: number) => void;
  setTendrilCount: (value: number) => void;
  setCoreIntensity: (value: number) => void;
  setParticleCount: (value: number) => void;
  setPulseIntensity: (value: number) => void;
  setBlockCount: (value: number) => void;
  setColorScheme: (value: 'orange' | 'blue' | 'green' | 'purple' | 'bioluminescent' | 'miner' | 'kloud') => void;
  toggleInteraction: () => void;
  
  // Helper function to get color by scheme
  getColorByScheme: (type: 'core' | 'tendril' | 'pulse') => string;
}

export const useControls = create<ControlsState>((set, get) => ({
  // Default values
  autoRotate: true,
  rotationSpeed: 0.5,
  tendrilCount: 60,
  coreIntensity: 1.0,
  particleCount: 600,
  pulseIntensity: 0.7,
  blockCount: 20,
  colorScheme: 'kloud',
  interactionEnabled: false,
  
  // Setter functions
  setAutoRotate: (value) => set({ autoRotate: value }),
  setRotationSpeed: (value) => set({ rotationSpeed: value }),
  setTendrilCount: (value) => set({ tendrilCount: value }),
  setCoreIntensity: (value) => set({ coreIntensity: value }),
  setParticleCount: (value) => set({ particleCount: value }),
  setPulseIntensity: (value) => set({ pulseIntensity: value }),
  setBlockCount: (value) => set({ blockCount: value }),
  setColorScheme: (value) => set({ colorScheme: value }),
  toggleInteraction: () => set(state => ({ interactionEnabled: !state.interactionEnabled })),
  
  // Helper function to get colors based on scheme
  getColorByScheme: (type) => {
    const scheme = get().colorScheme;
    
    const colorMap = {
      orange: {
        core: '#ff3300',
        tendril: '#ff4400',
        pulse: '#ff6600',
      },
      blue: {
        core: '#0066ff',
        tendril: '#0099ff',
        pulse: '#00ccff',
      },
      green: {
        core: '#00cc66',
        tendril: '#00dd44',
        pulse: '#33ff66',
      },
      purple: {
        core: '#9900ff',
        tendril: '#aa33ff',
        pulse: '#cc66ff',
      },
      bioluminescent: {
        core: '#2a9d3a',
        tendril: '#c9ff00',
        pulse: '#aaff22',
      },
      miner: {
        core: '#00ffcc',  // Neon turquoise/teal like the leaf glow
        tendril: '#ff9900', // Orange like the coffee bean
        pulse: '#9900ff',  // Purple like the background
      },
      kloud: {
        core: '#9d4edd',  // Rich cosmic purple
        tendril: '#ffd700', // Vibrant cyber gold
        pulse: '#00b4d8',  // Electric blue glow
      }
    };
    
    return colorMap[scheme][type];
  }
}));
