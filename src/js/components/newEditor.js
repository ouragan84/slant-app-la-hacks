import React, { useState } from 'react';
import Editor from 'react-simple-wysiwyg';

export default function myEditor(props) {
    const [html, setHtml] = [props.html, props.setHtml]
     const [highlightedText, setHighlightedText] = useState('');
  
    function onChange(e) {
        setHtml(e.target.value);
    }

    //funtion to get the raw html that is highlighted in the editor
    function getHighlightedText() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const div = document.createElement('div');
        div.appendChild(range.cloneContents());
        const html = div.innerHTML;
        setHighlightedText(html);
        return html;
    }

    //function to paste some html into the editor
    function pasteHtmlAtCaret(html) {
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const el = document.createElement('div');
            el.innerHTML = html;
            const frag = document.createDocumentFragment();
            let node;
            let lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                // range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }

  return (
    <>
        <Editor value={html} onChange={onChange} style={{
            fontFamily:'Open Sans',
            height:'80vh',
        }} />
        <button onClick={() => console.log(getHighlightedText())}>Get Highlighted Text</button>
        <button onClick={() => console.log(pasteHtmlAtCaret('<code>poop</code>'))}>Set Highlighted Text</button>

    </>
  );
}