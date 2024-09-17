import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer();
const threeBackground = document.getElementById('threeBackground');
document.getElementById('threeBackground').appendChild(renderer.domElement);

function resizeRenderer() {
  const width = threeBackground.clientWidth;
  const height = threeBackground.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
}
resizeRenderer();
const noiseShader = `
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec2 mod289(vec2 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec3 permute(vec3 x) {
      return mod289(((x*34.0)+1.0)*x);
    }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  
                          0.366025403784439,  
                          -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
`;
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } 
    },
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec2 resolution;

        ${noiseShader}

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            uv.x *= resolution.x / resolution.y;
            float noiseValue = snoise(uv  + time * 0.05);
            vec3 color = vec3(
                ceil(sin(noiseValue * 200.0 - time*5.0) - sin(noiseValue * 10.0 - time*10.0) + sin(noiseValue * 4.0 - time*5.0) - sin(noiseValue * 2.0 - time*5.0)  + abs(cos(4.0*time)*0.2))*0.1, 
                0, 
                (sin(noiseValue * 200.0 - time*5.0) - sin(noiseValue * 10.0 - time*10.0) + sin(noiseValue * 2.0 - time*5.0) - sin(noiseValue * 2.0 - time*5.0) + abs(cos(6.0*time)*0.5))*0.1
            );
            gl_FragColor = vec4(color, 1.0);
        }
    `
});
const geometry = new THREE.PlaneGeometry(2, 2);
const trippyBackground = new THREE.Mesh(geometry, shaderMaterial);
scene.add(trippyBackground);
function animate() {
    requestAnimationFrame(animate);
    shaderMaterial.uniforms.time.value += 0.001;
    renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', resizeRenderer);