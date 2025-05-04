precision mediump float;

uniform float time;
uniform vec3 color;
uniform float glowIntensity;
uniform float pulseSpeed;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    // Calculate rim lighting effect
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);
    float rimPower = 3.0;
    float rimIntensity = 1.5;
    float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), rimPower) * rimIntensity;
    
    // Add pulsing effect
    float pulse = sin(time * pulseSpeed) * 0.5 + 0.5;
    float glow = rim * glowIntensity * (0.8 + pulse * 0.4);
    
    // Final color
    vec3 finalColor = color * glow;
    
    // Add inner color gradient
    float innerGradient = smoothstep(0.0, 0.6, length(vUv - vec2(0.5)));
    finalColor = mix(color * 1.2, finalColor, innerGradient);
    
    gl_FragColor = vec4(finalColor, min(glow, 1.0));
}