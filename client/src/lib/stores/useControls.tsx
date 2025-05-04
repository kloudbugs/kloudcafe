import { create } from "zustand";

interface ControlsState {
  // Camera controls
  autoRotate: boolean;
  rotationSpeed: number;
  
  // Visual settings
  tendrilCount: number;
  coreIntensity: number;
  
  // Action functions
  setAutoRotate: (value: boolean) => void;
  setRotationSpeed: (value: number) => void;
  setTendrilCount: (value: number) => void;
  setCoreIntensity: (value: number) => void;
}

export const useControls = create<ControlsState>((set) => ({
  // Default values
  autoRotate: true,
  rotationSpeed: 0.5,
  tendrilCount: 60,
  coreIntensity: 1.0,
  
  // Setter functions
  setAutoRotate: (value) => set({ autoRotate: value }),
  setRotationSpeed: (value) => set({ rotationSpeed: value }),
  setTendrilCount: (value) => set({ tendrilCount: value }),
  setCoreIntensity: (value) => set({ coreIntensity: value }),
}));
