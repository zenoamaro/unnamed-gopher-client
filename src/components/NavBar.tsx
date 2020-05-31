import {shell} from 'electron';
import React from 'react';
import styled from 'styled-components';
import {createTab} from 'core';
import {Horizontal} from './Layout';
import Button from './Button';

import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosSettings,
  IoIosRefresh,
} from 'react-icons/io'

export default function NavBar(p: {
  url: string,
  onNavigate(url: string): void,
  onRefresh(): void,
  canRefresh: boolean,
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
      if (url.includes('://') && !url?.startsWith('gopher://')) shell.openExternal(url);
      else if (e.metaKey) createTab('main', url, e.shiftKey);
      else p.onNavigate(url);
      setTemporaryUrl(p.url);
      $address.current?.blur();
    } else if (e.key === 'Escape') {
      setTemporaryUrl(p.url);
      $address.current?.blur();
    }
  }, [p.onNavigate]);

  return <Container>
    <ToolbarButton disabled={!p.canNavigateBack} onClick={p.onNavigateBack}>
      <IoIosArrowBack size={22}/>
    </ToolbarButton>

    <ToolbarButton disabled={!p.canNavigateForward} onClick={p.onNavigateForward}>
      <IoIosArrowForward size={22}/>
    </ToolbarButton>

    <ToolbarButton disabled={!p.canRefresh} onClick={p.onRefresh}>
      <IoIosRefresh size={22}/>
    </ToolbarButton>

    <AddressField
      ref={$address}
      value={temporaryUrl ?? ''}
      onChange={changeAddress}
      placeholder="Search or enter address"
      // @ts-ignore
      onKeyDown={submitAddress}
    />

    <ToolbarButton>
      <IoIosSettings size={22} onClick={p.onOpenSettings}/>
    </ToolbarButton>
  </Container>;
}

const Container = styled(Horizontal)`
  z-index: 2;
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
