import React from 'react';
import styled from 'styled-components';
import visitModeFromEvent from 'utils/visitModeFromEvent';
import useShortcuts from 'utils/useShortcuts';
import {Horizontal} from './Layout';
import Button from './Button';

import {
  IoMdArrowBack,
  IoMdArrowForward,
  IoMdSettings,
  IoMdRefresh,
} from 'react-icons/io'

export default function NavBar(p: {
  url?: string,
  onNewTab(url?: string, select?: boolean): void,
  onNavigate(url: string, mode: string): void,
  onReload(): void,
  canReload: boolean,
  canNavigateBack: boolean,
  canNavigateForward: boolean,
  onNavigateBack(): void,
  onNavigateForward(): void,

  onOpenSettings(): void,
}) {
  const $address = React.useRef<HTMLInputElement>(null);
  const [temporaryUrl, setTemporaryUrl] = React.useState(p.url);

  React.useEffect(() => {
    setTemporaryUrl(p.url);
    if (!p.url) $address.current?.focus();
  }, [p.url]);

  const changeAddress = React.useCallback((e: React.ChangeEvent) => {
    setTemporaryUrl((e.target as HTMLInputElement).value);
  }, [setTemporaryUrl]);

  const submitAddress = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const url = (e.target as HTMLInputElement).value.trim();
      if (!url) return;
      $address.current?.blur();
      p.onNavigate(url, visitModeFromEvent(e));
    } else if (e.key === 'Escape') {
      setTemporaryUrl(p.url);
      $address.current?.blur();
    }
  }, [p.url, p.onNavigate, p.onNewTab]);

  useShortcuts(React.useCallback((e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'l') {
      $address.current?.focus();
      $address.current?.select();
    } else return false;
  }, []));

  return <Container>
    <ToolbarButton title="Show the previous page" disabled={!p.canNavigateBack} onClick={p.onNavigateBack}>
      <IoMdArrowBack size={22}/>
    </ToolbarButton>

    <ToolbarButton title="Show the next page" disabled={!p.canNavigateForward} onClick={p.onNavigateForward}>
      <IoMdArrowForward size={22}/>
    </ToolbarButton>

    <ToolbarButton title="Reload this page" disabled={!p.canReload} onClick={p.onReload}>
      <IoMdRefresh size={22}/>
    </ToolbarButton>

    <AddressField
      ref={$address}
      value={temporaryUrl ?? ''}
      onChange={changeAddress}
      placeholder="Search or enter address"
      // @ts-ignore
      onKeyDown={submitAddress}
    />

    <ToolbarButton title="Open settings (Not implemented)">
      <IoMdSettings size={22} onClick={p.onOpenSettings}/>
    </ToolbarButton>
  </Container>;
}

const Container = styled(Horizontal)`
  z-index: 10;
  height: 38px;
  padding: 4px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
`;

const ToolbarButton = styled(Button)`
  align-self: center;
  height: 30px;
`;

const AddressField = styled.input`
  flex: 1;
  font-size: inherit;
  padding: 1px 12px 3px;
  border: none;
  border-radius: 5px;
  background: transparent;
  -webkit-app-region: no-drag;

  &:hover, &:focus {
    background: #f0f0f0;
  }
`;
