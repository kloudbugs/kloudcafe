precision mediump float;

uniform float time;
uniform vec3 color;
uniform vec3 tipColor;
uniform float length;
uniform float thickness;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float pulseSpeed;
uniform float baseOpacity;

varying vec3 vPosition;
varying vec2 vUv;
varying float vLength;

// Simple noise function
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    // Calculate position along tendril (0 = base, 1 = tip)
    float pos = vUv.y;
    
    // Determine thickness falloff - thinner toward the tip
    float thicknessFactor = mix(1.0, 0.3, pos);
    
    // Apply noise pattern for texture
    vec2 noiseCoord = vUv * noiseScale + time * noiseSpeed;
    float noiseValue = noise(noiseCoord) * 0.2 + 0.8;
    
    // Pulse effect
    float pulse = sin(time * pulseSpeed + pos * 3.0) * 0.5 + 0.5;
    
    // Calculate transparency - more transparent at edges and tip
    float edgeFade = smoothstep(0.0, 0.5, 1.0 - abs(vUv.x - 0.5) * 2.0);
    float tipFade = smoothstep(0.0, 0.8, 1.0 - pos);
    
    // Combine factors
    float alpha = edgeFade * noiseValue * baseOpacity * thicknessFactor;
    
    // Color gradient from base to tip
    vec3 finalColor = mix(color, tipColor, pos);
    
    // Add pulse effect to color
    finalColor = mix(finalColor, finalColor * 1.5, pulse * 0.3);
    
    gl_FragColor = vec4(finalColor, alpha);
}