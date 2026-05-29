import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vDepth = (worldPosition.y - 0.0) / 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  varying float vDepth;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Distance from center (radial fade)
    float dist = length(vUv - vec2(0.5, 0.0));
    float radialFade = smoothstep(0.5, 0.0, dist);

    // Depth fade (fade out near floor)
    float depthFade = smoothstep(0.0, 0.3, vDepth) * smoothstep(1.0, 0.6, vDepth);

    // Animated noise for dust motes effect
    vec2 noiseUv = vUv * 3.0 + vec2(uTime * 0.05, uTime * 0.02);
    float dust = noise(noiseUv) * noise(noiseUv * 2.0 + 10.0);
    dust = smoothstep(0.3, 0.7, dust);

    // Combine
    float alpha = radialFade * depthFade * (0.3 + dust * 0.4);
    alpha *= uIntensity;

    gl_FragColor = vec4(uColor, alpha);
  }
`

export default function VolumetricLight() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#FFE4B5') },
      uIntensity: { value: 0.6 },
    }),
    []
  )

  return (
    <mesh position={[0, 3, -2]} rotation={[0.3, 0, 0]}>
      <coneGeometry args={[3, 8, 32, 1, true]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
