uniform float time;
uniform vec3 color;
uniform vec3 tipColor;
uniform float pulseSpeed;
uniform float baseOpacity;

varying vec2 vUv;
varying float vDistance;

void main() {
  // Create a gradient from base to tip
  vec3 finalColor = mix(color, tipColor, pow(vDistance, 1.5));
  
  // Pulse effect
  float pulse = 0.7 + 0.3 * sin(time * pulseSpeed + vDistance * 5.0);
  
  // Fade out at the tip
  float opacity = mix(baseOpacity, 0.0, pow(vDistance, 2.0));
  
  // Add some subtle color variation
  float colorVar = sin(vDistance * 20.0 + time) * 0.1;
  finalColor = finalColor * (1.0 + colorVar);
  
  // Apply pulse to brightness
  finalColor = finalColor * pulse;
  
  // Final color with opacity
  gl_FragColor = vec4(finalColor, opacity * pulse);
}
