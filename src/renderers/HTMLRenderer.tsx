import React from 'react';
import styled from 'styled-components';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {RendererProps} from './Renderer';


export default function HTMLRenderer(p: RendererProps) {
  const url = React.useMemo(() => {
    const blob = new Blob([p.data], {type:'text/html'});
    return URL.createObjectURL(blob);
  }, [p.data]);

  const $scroller = useScrollRestoration<HTMLIFrameElement>(p.scroll, p.onScroll);

  return (
    <Frame src={url} sandbox="" ref={$scroller}/>
  );
}

const Frame = styled.iframe`
  margin: 0 auto;
  overflow: hidden scroll;
  height: 100%;
  width: 664px;
  border: none;
`;
