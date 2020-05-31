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
  canNavigateBack: boolean,
  canNavigateForward: boolean,
  onNavigateBack(): void,
  onNavigateForward(): void,

  onOpenSettings(): void,
}) {
  const [temporaryUrl, setTemporaryUrl] = React.useState(p.url);

  React.useEffect(() => {
    setTemporaryUrl(p.url);
  }, [p.url]);

  const changeAddress = React.useCallback((e: React.ChangeEvent) => {
    setTemporaryUrl((e.target as HTMLInputElement).value);
  }, [setTemporaryUrl]);

  const submitAddress = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const url = (e.target as HTMLInputElement).value.trim();
      if (e.metaKey) createTab('main', url);
      else p.onNavigate(url);
    }
  }, [p.onNavigate]);

  return <Container>
    <ToolbarButton disabled={!p.canNavigateBack} onClick={p.onNavigateBack}>
      <IoIosArrowBack size={22}/>
    </ToolbarButton>

    <ToolbarButton disabled={!p.canNavigateForward} onClick={p.onNavigateForward}>
      <IoIosArrowForward size={22}/>
    </ToolbarButton>

    <ToolbarButton disabled={!p.url} onClick={p.onRefresh}>
      <IoIosRefresh size={22}/>
    </ToolbarButton>

    <AddressField
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
  height: 38px;
  padding: 4px;
  background: white;
  border-bottom: solid thin #ddd;
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
