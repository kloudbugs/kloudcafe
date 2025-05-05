varying vec3 vPosition;
varying vec2 vUv;
varying float vLength;

void main() {
    vPosition = position;
    vUv = uv;
    vLength = length(position);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}