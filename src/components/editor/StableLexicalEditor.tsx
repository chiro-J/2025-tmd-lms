import React, { useEffect, useMemo, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import {
  type EditorState,
  $getSelection,
  $isRangeSelection,
  $getRoot,
} from 'lexical';

import { $setBlocksType } from '@lexical/selection';
import {
  $createHeadingNode,
  HeadingNode,
  QuoteNode,
  type HeadingTagType,
} from '@lexical/rich-text';
import {
  ListNode,
  ListItemNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode, AutoLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';

import {
  $generateHtmlFromNodes,
  $generateNodesFromDOM,
} from '@lexical/html';

import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';

import {
  Bold, Italic, Underline, Code, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Undo, Redo, Heading1, Heading2,
} from 'lucide-react';

// ---------------- Theme (Tailwind/DaisyUI)
const theme = {
  paragraph: 'mb-2',
  heading: {
    h1: 'text-2xl font-bold mb-3',
    h2: 'text-xl font-bold mb-2',
    h3: 'text-lg font-semibold mb-2',
  },
  quote: 'border-l-4 border-base-300 pl-3 text-base-content/80 italic my-2',
  list: { ul: 'list-disc ml-6 my-2', ol: 'list-decimal ml-6 my-2', listitem: 'my-1' },
  code: 'font-mono text-sm bg-base-200 rounded px-2 py-1',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'font-mono bg-base-200 rounded px-1',
  },
};

// ---------------- Toolbar (아이콘 + "선택 블록만" 포맷)
function Toolbar({ readOnly }: { readOnly?: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBold, setBold] = React.useState(false);
  const [isItalic, setItalic] = React.useState(false);
  const [isUnderline, setUnderline] = React.useState(false);
  const [isCode, setCode] = React.useState(false);
  const [align, setAlign] = React.useState<'left'|'center'|'right'|null>(null);

  // selection 상태 구독
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          setBold(sel.hasFormat('bold'));
          setItalic(sel.hasFormat('italic'));
          setUnderline(sel.hasFormat('underline'));
          setCode(sel.hasFormat('code'));

          // 정렬 상태 감지
          const anchor = sel.anchor.getNode().getTopLevelElementOrThrow();
          const format = anchor.getFormat();

          // Lexical의 정렬 포맷 비트 확인
          if (format & 0b10) { // center
            setAlign('center');
          } else if (format & 0b100) { // right
            setAlign('right');
          } else {
            setAlign('left');
          }
        }
      });
    });
  }, [editor]);

  useEffect(() => {
    const unRegUndo = editor.registerCommand<boolean>(CAN_UNDO_COMMAND, v => { setCanUndo(v); return false; }, 1);
    const unRegRedo = editor.registerCommand<boolean>(CAN_REDO_COMMAND, v => { setCanRedo(v); return false; }, 1);
    return () => { unRegUndo(); unRegRedo(); };
  }, [editor]);

  if (readOnly) return null;

  const group = 'flex items-center gap-1 bg-base-200/80 px-2 py-1 rounded-lg shadow-sm';
  const divider = 'mx-1 w-px h-5 bg-base-300/80';
  const btnBase = 'inline-flex items-center justify-center h-8 w-8 rounded-md transition outline-none focus-visible:ring-2 focus-visible:ring-primary';
  const btn = `${btnBase} border border-base-300 hover:bg-base-300/60`;
  const btnActive = 'bg-primary/10 text-primary border-primary/40';
  const barWrap = 'flex flex-wrap items-center justify-between gap-2 border-b border-base-300/80 bg-base-100/90 px-3 py-2 sticky top-0 z-10';

  // 인라인 포맷을 적용하기 전에 code 포맷이면 잠깐 끄기
  const withCodeOff = (fn: () => void) => {
    editor.update(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel) && sel.hasFormat('code')) sel.toggleFormat('code');
    });
    fn();
  };

  // 선택된 블록만 헤딩 적용
  const setHeading = (level: HeadingTagType) =>
    editor.update(() => {
      const sel = $getSelection();
      if (!$isRangeSelection(sel)) return;
      $setBlocksType(sel, () => $createHeadingNode(level));
    });

  // 선택된 블록만 정렬 적용 (루트 전체 X)
  const setAlignForSelection = (value: 'left'|'center'|'right') => {
    editor.update(() => {
      const sel = $getSelection();
      if (!$isRangeSelection(sel)) return;

      // FORMAT_ELEMENT_COMMAND 사용
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value);
    });
    setAlign(value);
  };

  const toggleLink = () => {
    const url = window.prompt('링크 URL (빈칸=해제)');
    if (url === null) return;
    const normalized =
      url.trim() === ''
        ? null
        : url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
    withCodeOff(() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, normalized));
  };

  const Btn = ({ active=false, title, onClick, children }:{
    active?: boolean; title: string; onClick: () => void; children: React.ReactNode;
  }) => (
    <button type="button" className={`${btn} ${active ? btnActive : ''}`} title={title} aria-label={title} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className={barWrap} role="toolbar" aria-label="Rich text editor toolbar">
      <div className={group}>
        <Btn title="Heading 1" onClick={() => setHeading('h1')}><Heading1 size={16} /></Btn>
        <Btn title="Heading 2" onClick={() => setHeading('h2')}><Heading2 size={16} /></Btn>
        <div className={divider} />
        <Btn title="Bold" active={isBold} onClick={() => withCodeOff(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'))}><Bold size={16}/></Btn>
        <Btn title="Italic" active={isItalic} onClick={() => withCodeOff(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'))}><Italic size={16}/></Btn>
        <Btn title="Underline" active={isUnderline} onClick={() => withCodeOff(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'))}><Underline size={16}/></Btn>
        <Btn title="Inline code" active={isCode} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}><Code size={16}/></Btn>
      </div>

      <div className={group}>
        <Btn title="Bulleted list" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}><List size={16}/></Btn>
        <Btn title="Numbered list" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}><ListOrdered size={16}/></Btn>
        <Btn title="Remove list" onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>✕</Btn>
        <div className={divider} />
        <Btn title="Align left" active={align==='left'} onClick={() => setAlignForSelection('left')}><AlignLeft size={16}/></Btn>
        <Btn title="Align center" active={align==='center'} onClick={() => setAlignForSelection('center')}><AlignCenter size={16}/></Btn>
        <Btn title="Align right" active={align==='right'} onClick={() => setAlignForSelection('right')}><AlignRight size={16}/></Btn>
      </div>

      <div className={group}>
        <Btn title="Link / Unlink" onClick={toggleLink}><LinkIcon size={16}/></Btn>
        <div className={divider} />
        <button type="button" className={`${btn} ${!canUndo ? 'opacity-40 pointer-events-none' : ''}`} title="Undo" aria-label="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}><Undo size={16}/></button>
        <button type="button" className={`${btn} ${!canRedo ? 'opacity-40 pointer-events-none' : ''}`} title="Redo" aria-label="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><Redo size={16}/></button>
      </div>
    </div>
  );
}

// ---------------- HTML 브리지 (디바운스 onChange)
function HTMLBridge({ onChange }: { onChange?: (html: string, json: string) => void }) {
  const [editor] = useLexicalComposerContext();
  const rafRef = useRef<number | null>(null);

  const handle = (editorState: EditorState) => {
    if (!onChange) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        const json = JSON.stringify(editorState.toJSON());
        onChange(html, json);
      });
    });
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);
  return <OnChangePlugin onChange={handle} />;
}

// ---------------- 초기 HTML 주입(단 1회)
function InitialHTML({ html }: { html?: string }) {
  const [editor] = useLexicalComposerContext();
  const doneRef = useRef(false);

  useEffect(() => {
    if (!html || doneRef.current) return;
    doneRef.current = true;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      // 루트 교체
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [editor, html]);

  return null;
}

// ---------------- 안정화 에디터
export default function StableLexicalEditor({
  value,               // initial HTML
  onChange,            // (html, json)
  placeholder = '내용을 입력하세요…',
  className = '',
  readOnly = false,
}: {
  value?: string;
  onChange?: (html: string, json: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}) {
  const initialConfig = useMemo(
    () => ({
      namespace: 'lms-lexical',
      theme,
      editable: !readOnly,
      onError(e: Error) { console.error(e); },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode, AutoLinkNode],
    }),
    [readOnly]
  );

  return (
    <div className={`rounded-xl border border-base-300 ${className}`} suppressHydrationWarning>
      <LexicalComposer key="lms-lexical-root" initialConfig={initialConfig}>
        {!readOnly && <Toolbar readOnly={readOnly} />}

        <div className="p-3">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`prose max-w-none min-h-[200px] px-3 py-2 rounded-lg focus:outline-none ${readOnly ? 'bg-base-100/60' : 'bg-base-100'}`}
                aria-label="Rich text editor"
              />
            }
            placeholder={
              !readOnly ? <div className="text-base-content/50 px-3 py-2 select-none">{placeholder}</div> : null
            }
            ErrorBoundary={({ children }) => <div>{children}</div>}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <InitialHTML html={value} />
          <HTMLBridge onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}
