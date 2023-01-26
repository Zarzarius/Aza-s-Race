import React, { useEffect } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { addEffect } from '@react-three/fiber';
import useGame from './stores/useGame';

export default function Interface() {
  const restart = useGame((state) => state.restart);
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);
  const isEnded = useGame((state) => state.phase === 'ended');
  const timeRef = React.useRef();

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;
      if (state.phase === 'playing') {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === 'ended') {
        elapsedTime = state.endTime - state.startTime;
      }
      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);
      if (timeRef.current) { timeRef.current.textContent = elapsedTime; }
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="interfaceContainer">
      <div ref={timeRef} className="time">0.00</div>
      { isEnded && (
        <div
          onClick={() => restart()}
          className="restart"
          role="button"
          tabIndex={0}
        >
          Restart
          {' '}

        </div>
      ) }
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? 'active' : ''}`} />
        </div>
        <div className="raw">
          <div className={`key ${leftward ? 'active' : ''}`} />
          <div className={`key ${backward ? 'active' : ''}`} />
          <div className={`key ${rightward ? 'active' : ''}`} />
        </div>
        <div className="raw">
          <div className={`key large ${jump ? 'active' : ''}`} />
        </div>
      </div>

    </div>
  );
}
