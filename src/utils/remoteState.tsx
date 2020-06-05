import {ipcRenderer, IpcRendererEvent} from 'electron';
import React, {useEffect, useState} from 'react';
import * as Core from 'core';

export function useRemoteState(): Core.State | undefined {
  const [state, setState] = useState<Core.State>();

  function handler(event: IpcRendererEvent, state: Core.State) {
    setState(state);
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

export function remoteAction(
  action: keyof typeof Core,
  ...args: Parameters<typeof Core[typeof action]>
): ReturnType<typeof Core[typeof action]> {
  return ipcRenderer.send('action', action, ...args);
}
