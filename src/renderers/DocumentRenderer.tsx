import ExtensionRenderer from './ExtensionRenderer';
import TextRenderer from './TextRenderer';
import MarkdownRenderer from './MarkdownRenderer';
import HTMLRenderer from './HTMLRenderer';

export default ExtensionRenderer({
  '*': TextRenderer,
  '.md': MarkdownRenderer,
  '.html': HTMLRenderer,
});
