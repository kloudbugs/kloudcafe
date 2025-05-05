import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ControlsTutorial.css';

interface ControlsTutorialProps {
  onComplete: () => void;
}

const ControlsTutorial: React.FC<ControlsTutorialProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [rotated, setRotated] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [panned, setPanned] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  
  // Mouse position tracking for highlighting areas
  const [previousMouseX, setPreviousMouseX] = useState<number | null>(null);
  const [previousMouseY, setPreviousMouseY] = useState<number | null>(null);
  const [previousScroll, setPreviousScroll] = useState<number | null>(null);
  
  // Track when tasks are completed
  useEffect(() => {
    if (rotated && zoomed && panned) {
      setAllCompleted(true);
    }
  }, [rotated, zoomed, panned]);
  
  // Listen for mouse movement to detect rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (previousMouseX !== null && previousMouseY !== null) {
        const deltaX = Math.abs(e.clientX - previousMouseX);
        const deltaY = Math.abs(e.clientY - previousMouseY);
        
        // If mouse has moved significantly, mark rotation as complete
        if (deltaX > 50 || deltaY > 50) {
          setRotated(true);
        }
      }
      
      setPreviousMouseX(e.clientX);
      setPreviousMouseY(e.clientY);
    };
    
    // Listen for wheel events to detect zoom
    const handleWheel = (e: WheelEvent) => {
      if (previousScroll !== null) {
        const deltaScroll = Math.abs(e.deltaY);
        
        // If scroll wheel has been used significantly, mark zoom as complete
        if (deltaScroll > 50) {
          setZoomed(true);
        }
      }
      
      setPreviousScroll(e.deltaY);
    };
    
    // For pan, we'll combine mouse movement + mouse button press
    const handleMouseDown = (e: MouseEvent) => {
      // Middle button or right button could indicate panning
      if (e.button === 1 || e.button === 2) {
        setPanned(true);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [previousMouseX, previousMouseY, previousScroll]);
  
  // Handle completion
  const handleContinue = () => {
    onComplete();
  };
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h2 className="tutorial-header">Interactive Tutorial</h2>
        <div className="tutorial-tasks">
          <div className={`tutorial-task ${rotated ? 'completed' : ''}`}>
            <div className={`task-checkbox ${rotated ? 'checked' : ''}`}></div>
            <span>Rotate the scene by clicking and dragging</span>
          </div>
          
          <div className={`tutorial-task ${zoomed ? 'completed' : ''}`}>
            <div className={`task-checkbox ${zoomed ? 'checked' : ''}`}></div>
            <span>Zoom in or out using your scroll wheel</span>
          </div>
          
          <div className={`tutorial-task ${panned ? 'completed' : ''}`}>
            <div className={`task-checkbox ${panned ? 'checked' : ''}`}></div>
            <span>Pan the scene with right mouse button</span>
          </div>
        </div>
        
        <p className="tutorial-instruction">
          Complete all tasks above to continue exploring the KLOUDBUGS CAFE ZIG-MINER platform
        </p>
        
        <button 
          className={`continue-button ${allCompleted ? 'active' : ''}`}
          onClick={handleContinue}
          disabled={!allCompleted}
        >
          Continue to Platform
        </button>
      </div>
    </div>
  );
};

export default ControlsTutorial;