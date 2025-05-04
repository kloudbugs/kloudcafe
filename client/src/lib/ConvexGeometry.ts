import * as THREE from 'three';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull.js';

/**
 * A geometry class for creating convex hulls from a set of 3D points
 */
class ConvexGeometry extends THREE.BufferGeometry {
  constructor(points: THREE.Vector3[]) {
    super();
    
    // Create convex hull
    const hull = new ConvexHull();
    hull.setFromPoints(points);
    
    // Generate vertices and faces
    const vertices: number[] = [];
    const indices: number[] = [];
    
    // Process faces
    const faces = hull.faces;
    
    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
      let edge = face.edge;
      
      // We need to find three consecutive edges to form a triangle
      do {
        const point = edge.head().point;
        vertices.push(point.x, point.y, point.z);
        edge = edge.next;
      } while (edge !== face.edge);
      
      // Add indices for the current face (triangle)
      const offset = (i * 3);
      indices.push(offset, offset + 1, offset + 2);
    }
    
    // Build geometry
    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.setIndex(indices);
    this.computeVertexNormals();
    this.computeBoundingSphere();
  }
}

// Add to THREE namespace for compatibility
THREE.ConvexGeometry = ConvexGeometry;

// Add missing type definition for TypeScript
declare module 'three' {
  class ConvexGeometry extends THREE.BufferGeometry {
    constructor(points: THREE.Vector3[]);
  }
}

export { ConvexGeometry };
export default ConvexGeometry;