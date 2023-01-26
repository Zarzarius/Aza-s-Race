import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { Physics, Debug } from '@react-three/rapier';
import Lights from './Lights';
import { Level } from './Level';
import Player from './Player';
import useGame from './stores/useGame';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>

      <OrbitControls makeDefault />

      <Physics>
        {/* <Debug /> */}
        <color attach="background" args={['lightblue']} />
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>

    </>
  );
}
