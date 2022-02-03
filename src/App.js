// import "./App.css";
// import * as THREE from "three";
// import { Suspense, useMemo } from "react";
// import { Canvas, useLoader } from "react-three-fiber";
// import reactImg from "./images/584830f5cef1014c0b5e4aa1.png";

// function Points() {
//   const imageTexture = useLoader(THREE.TextureLoader, reactImg);

//   const count = 100;
//   const separation = 3;
//   let positions = useMemo(() => {
//     let positions = [];

//     for (let xi = 0; xi < count; xi++) {
//       for (let zi = 0; zi < count; zi++) {
//         let x = separation * (xi - count / 2);
//         let z = separation * (zi - count / 2);
//         let y = 0;
//         positions.push(x, y, z);
//       }
//     }

//     return new Float32Array(positions);
//   }, []);

//   return (
//     <Points>
//       <bufferGeometry attach="geometry">
//         <bufferAttribute
//           attachObject={["attributes", "position"]}
//           array={positions}
//           count={positions.length / 3}
//           itemSize={3}
//         />
//       </bufferGeometry>

//       <pointsMaterial
//         attach="material"
//         map={imageTexture}
//         color={0x00aaff}
//         size={0.5}
//         transparent={false}
//         alphaTest={0.5}
//         opacity={1.0}
//       ></pointsMaterial>
//     </Points>
//   );
// }

// function AnimationCanvas() {
//   return (
//     <Canvas
//       colorManagement={false}
//       camera={{ position: [100, 10, 0], fov: 75 }}
//     >
//       <Suspense fallback={null}>
//         <Points />
//       </Suspense>
//     </Canvas>
//   );
// }

// function App() {
//   return (
//     <div className="app">
//       <Suspense fallback={<div>loading...</div>}>
//         <AnimationCanvas />
//       </Suspense>
//     </div>
//   );
// }

// export default App;

import "./App.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "react-three-fiber";
import reactImage from "./images/584830f5cef1014c0b5e4aa1.png";
import { Suspense, useCallback, useMemo, useRef } from "react";
extend({ OrbitControls });

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update());

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
      autoRotate
      autoRotateSpeed={-0.2}
    />
  );
}

function Points() {
  const imgTex = useLoader(THREE.TextureLoader, reactImage);
  const bufferRef = useRef();

  let t = 0;
  let f = 0.002;
  let a = 3;
  const graph = useCallback(
    (x, z) => {
      return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
    },
    [t, f, a]
  );

  const count = 100;
  const separation = 3;
  let positions = useMemo(() => {
    let positions = [];

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = separation * (xi - count / 2);
        let z = separation * (zi - count / 2);
        let y = graph(x, z);
        positions.push(x, y, z);
      }
    }

    return new Float32Array(positions);
  }, [count, separation, graph]);

  useFrame(() => {
    t += 15;

    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = separation * (xi - count / 2);
        let z = separation * (zi - count / 2);

        positions[i + 1] = graph(x, z);
        i += 3;
      }
    }

    bufferRef.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={bufferRef}
          attachObject={["attributes", "position"]}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        attach="material"
        map={imgTex}
        color={0x00aaff}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

function AnimationCanvas() {
  return (
    <Canvas
      colorManagement={false}
      camera={{ position: [100, 10, 0], fov: 75 }}
    >
      <Suspense fallback={null}>
        <Points />
      </Suspense>
      <CameraControls />
    </Canvas>
  );
}

function App() {
  return (
    <div className="app">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimationCanvas />
      </Suspense>
    </div>
  );
}

export default App;
