import React from 'react';
import {useLoadEffect} from 'utils/useLoadEffect';

export function useFetchText(
  url: RequestInfo,
  options?: RequestInit,
  deps: readonly any[] = [],
): [string, boolean, Error|void] {
  let currentContent = '';
  const [content, setContent] = React.useState(currentContent);

  const [loading, error] = useLoadEffect(async () => {
    const response = await fetch(url, options);
    const reader = response.body!.getReader();
    const decoder = new TextDecoder('utf-8');

    currentContent = '';
    setContent(currentContent);

    while (true) {
      const {done, value} = await reader.read();
      const chunk = (!done) ? decoder.decode(value, {stream: true}) : '';
      currentContent += chunk;
      setContent(currentContent);
      if (done) break;
    }
  }, [url, ...deps]);

  return [content, loading, error];
}
