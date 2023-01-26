/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unknown-property */
import { RigidBody, useRapier } from '@react-three/rapier';
import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useGame from './stores/useGame';

export default function Player() {
  const textureProps = useTexture({
    map: './textures/PavingStones092_1K_Color.jpg',
    displacementMap: './textures/PavingStones092_1K_Displacement.jpg',
    normalMap: './textures/PavingStones092_1K_NormalGL.jpg',
    roughnessMap: './textures/PavingStones092_1K_Roughness.jpg',
    // aoMap: './textures/PavingStones092_1K_AmbientOcclusion.jpg',
  });
  // CONTROLS
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  useFrame((state, delta) => {
    const {
      forward, backward, leftward, rightward,
    } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.4 * delta;
    const torqueStrength = 0.0125 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    // CAMERA
    const bodyPosition = body.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, delta * 5);
    smoothedCameraTarget.lerp(cameraTarget, delta * 5);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // PHASES
    if (bodyPosition.z < -(blocksCount * 4 + 2)) end();

    if (bodyPosition.y < -4) restart();
  });

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.toi < 0.15) body.current.applyImpulse({ x: 0, y: 0.35, z: 0 });
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        // eslint-disable-next-line no-console
        console.log('Phase changed to', phase);
        if (phase === 'ready') {
          reset();
        }
      },
    );
    const unsubscribeJump = subscribeKeys((state) => state.jump, (value) => {
      if (value) jump();
    });
    const unsubscribeAnyKey = subscribeKeys(() => start());

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAnyKey();
    };
  }, []);

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
      scale={0.05}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial {...textureProps} />
      </mesh>
    </RigidBody>
  );
}
