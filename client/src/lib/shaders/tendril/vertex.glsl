uniform float time;
uniform float length;
uniform float noiseScale;
uniform float noiseSpeed;

varying vec2 vUv;
varying float vDistance;

// Simplex noise function (simplified version)
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  // More code would normally go here for a complete noise implementation
  // This is a simplified version to save shader space
  
  // Create some output based on position
  return sin(v.x * 10.0) * cos(v.y * 10.0) * sin(v.z * 10.0);
}

void main() {
  vUv = uv;
  
  // Calculate distance along the tendril (0 at base, 1 at tip)
  vDistance = uv.y;
  
  // Get the original position
  vec3 pos = position;
  
  // Add some noise movement based on position and time
  float noiseFreq = noiseScale;
  float noiseAmp = 0.1 * (1.0 - vDistance); // Less movement at the tip
  
  // Sample noise at different frequencies for more organic movement
  float noise1 = snoise(vec3(pos.x * noiseFreq, pos.y * noiseFreq, time * noiseSpeed)) * noiseAmp;
  float noise2 = snoise(vec3(pos.z * noiseFreq, pos.x * noiseFreq, time * noiseSpeed * 0.7)) * noiseAmp;
  float noise3 = snoise(vec3(pos.y * noiseFreq, pos.z * noiseFreq, time * noiseSpeed * 1.3)) * noiseAmp;
  
  // Apply noise displacement
  pos.x += noise1;
  pos.y += noise2;
  pos.z += noise3;
  
  // Calculate wave motion along the tendril
  float wave = sin(vDistance * 10.0 + time * 2.0) * 0.05 * vDistance;
  pos.x += wave;
  pos.z += wave;
  
  // Make the tendril thinner toward the tip
  float taperFactor = mix(1.0, 0.2, vDistance);
  pos.x = pos.x * taperFactor;
  pos.z = pos.z * taperFactor;
  
  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
