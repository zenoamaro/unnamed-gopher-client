import styled from 'styled-components';

export interface LayoutOptions {
  flex?: boolean,
  align?: string,
  justify?: string,
}

export const Vertical = styled.div<LayoutOptions>`
  position: relative;
  flex: ${p => p.flex ? 1 : '0 0 auto'};
  display: flex;
  flex-direction: column;
  align-items: ${p => p.align ?? 'stretch'};
  justify-content: ${p => p.justify ?? 'start'};
`;

export const Horizontal = styled.div<LayoutOptions>`
  position: relative;
  flex: ${p => p.flex ? 1 : '0 0 auto'};
  display: flex;
  flex-direction: row;
  align-items: ${p => p.align ?? 'stretch'};
  justify-content: ${p => p.justify ?? 'start'};
`;

export const Spring = styled.div`
  flex: 1;
`;
