import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create(subscribeWithSelector((set) => ({
  blocksCount: 10,
  blocksSeed: 0,

  // TIME
  startTime: 0,
  endTime: 0,

  // PHASES

  phase: 'ready',

  start: () => {
    set((state) => {
      if (state.phase === 'ready') return { phase: 'playing', startTime: Date.now() };

      return {};
    });
  },

  restart: () => {
    set((state) => {
      // eslint-disable-next-line no-return-assign
      if (state.phase === 'playing' || state.phase === 'ended') return { phase: 'ready', blocksSeed: state.blocksSeed = Math.random() };

      return {};
    });
  },

  end: () => {
    set((state) => {
      if (state.phase === 'playing') return { phase: 'ended', endTime: Date.now() };

      return {};
    });
  },
})));
