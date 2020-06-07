import {ipcRenderer, IpcRendererEvent} from 'electron';
import React, {useEffect, useState} from 'react';
import {Patch, applyPatches} from 'immer';
import * as Core from 'core';

export function useRemoteState(): Core.State | undefined {
  const [state, setState] = useState<Core.State>();
  let pendingState: Core.State;

  function handler(event: IpcRendererEvent, newState: Core.State, patches?: Patch[]) {
    setState(pendingState = (pendingState && patches) ?
      applyPatches(pendingState, patches) :
      newState
    );
  }

  useEffect(() => {
    ipcRenderer.on('state', handler);
    ipcRenderer.send('state'); // Request fresh state
    return () => {ipcRenderer.off('state', handler)};
  }, []);

  return state;
}

export function withRemoteState(Component: React.FC<{state: Core.State}>): React.FC {
  return () => {
    const state = useRemoteState();
    return state ? <Component state={state}/> : null;
  };
}

// FIXME try to do reflection here, or create an actual API
export function remoteAction(action: keyof typeof Core, ...args: any[]): any {
  return ipcRenderer.send('action', action, ...args);
}
