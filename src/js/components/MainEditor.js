import React, { useMemo, useRef, useEffect } from 'react'
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react'
import {
  Editor,
  Transforms,
  Text,
  createEditor,
  Descendant,
  Range,
} from 'slate'
import { css } from '@emotion/css'
import { withHistory } from 'slate-history'

import {UnderlineOutlined, BoldOutlined, ItalicOutlined, CodeOutlined, OrderedListOutlined, UnorderedListOutlined, CodepenOutlined} from '@ant-design/icons'

import { Button, Icon, Menu, Portal } from './CustomComponents'

const HoveringMenuExample = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate editor={editor} value={initialValue}>
      <HoveringToolbar />
      <Editable
        renderLeaf={props => <Leaf {...props} />}
        placeholder="Enter some text..."
        onDOMBeforeInput={(event) => {
            switch (event.inputType) {
                case 'formatBold':
                    event.preventDefault()
                    return toggleFormat(editor, 'bold')
                case 'formatItalic':
                    event.preventDefault()
                    return toggleFormat(editor, 'italic')
                case 'formatUnderline':
                    event.preventDefault()
                    return toggleFormat(editor, 'underlined')
                case 'inlineCode':
                    event.preventDefault()
                    return toggleFormat(editor, 'inlineCode')
                case 'codeBlock':
                    event.preventDefault()
                    return toggleFormat(editor, 'codeBlock')
                case 'insertUnorderedList':
                    event.preventDefault()
                    return toggleFormat(editor, 'unorderedList')
                case 'insertOrderedList':
                    event.preventDefault()
                    return toggleFormat(editor, 'orderedList')
          }
        }}
      />
    </Slate>
  )
}

// const toggleBlockFormat = (editor, format) => {
//     const isActive = isFormatActive(editor, format)
//     Transforms.setNodes(
//         editor,
//         { [format]: isActive ? null : true },
//         { match: n => Editor.isBlock(editor, n) }
//     )
// };

const toogleInlineFormat = (editor, format) => {
    const isActive = isFormatActive(editor, format);

    Transforms.setNodes(
        editor,
        { ['inlineCode']: null },
        { match: n => Text.isText, split: true }
    );

    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true }
    );
}
  
const resetInlineFormatting = (editor) => {
    Transforms.setNodes(
        editor,
        { ['bold']: null },
        { match: Text.isText, split: true }
    );
    Transforms.setNodes(
        editor,
        { ['bold']: null },
        { match: Text.isText, split: true }
    );
    Transforms.setNodes(
        editor,
        { ['bold']: null },
        { match: Text.isText, split: true }
    );
};

const toogleInlineFormatReset = (editor, format) => {
    const isActive = isFormatActive(editor, format)
    resetInlineFormatting(editor)

    // removes all other inline formats, and sets the current one
    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true }
    );
};

const toggleBlockFormatReset = (editor, format) => {
    const isActive = isFormatActive(editor, format)
    resetBlockFormatting(editor)

    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: n => Editor.isBlock(editor, n) }
    );
}

const toggleBlockFormat = (editor, format) => {
    const isActive = isFormatActive(editor, format)

    Transforms.setNodes(
        editor,
        { ['codeBlock']: null },
        { match: n => Editor.isBlock(editor, n) }
    );

    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: n => Editor.isBlock(editor, n) }
    );
}

const resetBlockFormatting = (editor) => {
    Transforms.setNodes(
        editor,
        { ['inlineCode']: null },
        { match: n => Editor.isBlock(editor, n) }
    );
    Transforms.setNodes(
        editor,
        { ['underlined']: null },
        { match: n => Editor.isBlock(editor, n) }
    );
    Transforms.setNodes(
        editor,
        { ['bold']: null },
        { match: n => Editor.isBlock(editor, n) }
    );
    Transforms.setNodes(
        editor,
        { ['italics']: null },
        { match: n => Editor.isBlock(editor, n) }
    );
    Transforms.setNodes(
        editor,
        { ['unorderedList']: null },
        { match: n => Editor.isBlock(editor, n) }
    );
    Transforms.setNodes(
        editor,
        { ['orderedList']: null },
        { match: n => Editor.isBlock(editor, n) }
    );
};


const toggleFormat = (editor, format) => {
    switch (format) {
        case 'bold': return toogleInlineFormat(editor, 'bold');
        case 'italic': return toogleInlineFormat(editor, 'italic');
        case 'underlined': return toogleInlineFormat(editor, 'underlined');
        case 'inlineCode': return toogleInlineFormatReset(editor, 'inlineCode');
        case 'codeBlock': return toggleBlockFormatReset(editor, 'codeBlock');
        case 'unorderedList': return toggleBlockFormat(editor, 'unorderedList');
        case 'orderedList': return toggleBlockFormat(editor, 'orderedList');
    }
}

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  })
  return !!match
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
  
    if (leaf.italic) {
      children = <em>{children}</em>
    }
  
    if (leaf.underlined) {
      children = <span style={{ textDecoration: 'underline' }}>{children}</span>
    }
  
    if (leaf.inlineCode) {
      children = <code>{children}</code>
    }

    if (leaf.codeBlock) {
        children = <pre> <code>{children}</code> </pre>
    }

    if (leaf.orderedList) {
        children = <ol>{children}</ol>
    }

    if (leaf.unorderedList) {
        children = <ul>{children}</ul>
    }
  
    return <span {...attributes}>{children}</span>
  }

const HoveringToolbar = () => {
  const ref = useRef()
  const editor = useSlate()
  const inFocus = useFocused()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
        !selection ||
        !inFocus ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === ''
    ) {
        el.removeAttribute('style')
        return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`
  })

  return (
    <Portal>
      <Menu
        ref={ref}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #222;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        onMouseDown={e => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault()
        }}
      >
        <FormatButton format="bold" icon={<BoldOutlined style={{color:'white'}} />} />
        <FormatButton format="italic" icon={<ItalicOutlined style={{color:'white'}} />} />
        <FormatButton format="underlined" icon={<UnderlineOutlined style={{color:'white'}} />} />
        <FormatButton format="inlineCode" icon={<CodeOutlined style={{color:'white'}} />} />
        <FormatButton format="orderedList" icon={<OrderedListOutlined style={{color:'white'}} />} />
        <FormatButton format="unorderedList" icon={<UnorderedListOutlined style={{color:'white'}} />} />
        <FormatButton format="codeBlock" icon={<CodepenOutlined style={{color:'white'}} />} />


      </Menu>
    </Portal>
  )
}

const FormatButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      reversed
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
        {icon}
    </Button>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      },
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', or anything else you might want to do!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out yourself! Just ' },
      { text: 'select any piece of text and the menu will appear', bold: true },
      { text: '.' },
    ],
  },
]

export default HoveringMenuExample