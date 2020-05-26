import React from 'react';
import styled, {css} from 'styled-components';
import {Vertical, Horizontal, Spring} from './Layout';

export default styled.button`
  appearance: none;
  font-family: inherit;
  font-size: inherit;
  color: inherit;

  padding: 4px;
  text-align: center;
  vertical-align: middle;
  border: none;
  border-radius: 5px;
  background: transparent;

  &[disabled] {
    pointer-events: none;
    opacity: 0.15;
  }

  &:hover {
    background: #f0f0f0;
  }

  &:active {
    background: #e0e0e0;
  }
`;
