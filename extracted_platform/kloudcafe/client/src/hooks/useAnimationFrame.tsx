import { useRef, useEffect, useCallback } from 'react';

type AnimationFrameCallback = (deltaTime: number) => void;

/**
 * Custom hook for animation frame loop with delta time calculation
 * @param callback Function to call on each animation frame
 * @param dependencies Array of dependencies for the callback
 */
export const useAnimationFrame = (
  callback: AnimationFrameCallback,
  dependencies: any[] = []
) => {
  // Store the callback in a ref
  const callbackRef = useRef<AnimationFrameCallback>(callback);
  
  // Time tracking for delta calculation
  const timeRef = useRef<number>(0);
  
  // Animation frame request ID for cleanup
  const requestRef = useRef<number>(0);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Animation loop function
  const animate = useCallback((time: number) => {
    // Calculate delta time in seconds
    if (timeRef.current === 0) {
      timeRef.current = time;
    }
    
    const deltaTime = (time - timeRef.current) / 1000;
    timeRef.current = time;
    
    // Call the current callback with delta time
    callbackRef.current(deltaTime);
    
    // Schedule the next frame
    requestRef.current = requestAnimationFrame(animate);
  }, []);
  
  // Set up and clean up the animation frame loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, ...dependencies]);
};

export default useAnimationFrame;
