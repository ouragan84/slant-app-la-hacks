import React, { useState } from 'react';
import { 
    ContentEditable, 
    ContentEditableEvent, 
    ContentEditableProps, 
    DefaultEditor, 
    Editor, 
    EditorProps, EditorContext, EditorProvider, useEditorState, EditorState, HtmlEditor, 


    BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnStrikeThrough, BtnLink, BtnNumberedList, BtnRedo, BtnUnderline, BtnUndo, createButton, BtnStyles, createDropdown, Dropdown, DropDownItem, DropdownProps, HtmlButton, Separator, Toolbar
  } from 'react-simple-wysiwyg';

import { beautify, askQuestion, fillBlanks } from './GPTCaller';

import ReactModal from 'react-modal';
import { getPriority } from 'os';
// import prompt from 'electron-prompt';
const loading = 'https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif';

export default function myEditor(props) {
    const [html, setHtml] = [props.html, props.setHtml]
    const filePath = props.filePath;
    const [highlightedText, setHighlightedText] = useState('');
    const [isCallingGPT, setIsCallingGPT] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWaitingForUser, setIsWaitingForUser] = useState(false);
    const [modalInput, setModalInput] = useState('');
    const [selection, setSelection] = useState(null);
    const [rangeGPT, setRangeGPT] = useState(null);
  
    function onChange(e) {
        setHtml(e.target.value);
    }

    const BtnBeautify = createButton('Beautify', 'B', async () => {

        if(isCallingGPT)
            return;

        const sel = window.getSelection();
        if (!sel.getRangeAt || !sel.rangeCount)
            return;

        const range = sel.getRangeAt(0);

        // extend range from the begining of the first line to the end of the last line in the selection
        range.setStart(range.startContainer, 0);
        range.setEnd(range.endContainer, range.endContainer.length);

        // get unformatted text (without html tags)
        const unformattedText = range.cloneContents().textContent;

        if(unformattedText.length < 1)
            return;

        setRangeGPT(range);
        setIsCallingGPT(true);

        await beautify(unformattedText).then((resHtml) => {
            pasteHtmlAtCaret(resHtml, range, sel);
            setIsCallingGPT(false);
        });
    });
    
    const BtnPrompt = createButton('Prompt', 'P', async () => {
        if(isCallingGPT)
            return;

        const sel = window.getSelection();
        if (!sel.getRangeAt || !sel.rangeCount)
            return;
        
        const range = sel.getRangeAt(0);

        // make the end of the range be at the start of the range so that the prompt is inserted at the cursor
        range.setEnd(range.startContainer, range.startOffset);
        setSelection(sel);
        setModalInput('');
        setIsModalOpen(true);

        setIsWaitingForUser(true);

        setRangeGPT(range);
        setIsCallingGPT(true);
    });

    const BtnFillBlanks = createButton('Fill Blanks', 'FB', async () => {
        if(isCallingGPT)
            return;

        const sel = window.getSelection();
        if (!sel.getRangeAt || !sel.rangeCount)
            return;

        const range = sel.getRangeAt(0);

        // extend range from the begining of the first line to the end of the last line in the selection
        range.setStart(range.startContainer, 0);
        range.setEnd(range.endContainer, range.endContainer.length);

        // get unformatted text (without html tags)
        const div = document.createElement('div');
        div.appendChild(range.cloneContents());
        const html = div.innerHTML;

        console.log('html:', html)

        if(html.length < 1  || !html.includes('[___]'))
            return;

        setRangeGPT(range);
        setIsCallingGPT(true);

        await fillBlanks(html).then((resHtml) => {
            pasteHtmlAtCaret(resHtml, range, sel);
            setIsCallingGPT(false);
        });
    });

    const BtnDesmos = createButton('Add Desmos Graph', 'DG', () => {
        const sel = window.getSelection();
        if (!sel.getRangeAt || !sel.rangeCount)
            return;

        const range = sel.getRangeAt(0);

        // make the end of the range be at the start of the range so that the prompt is inserted at the cursor
        range.setEnd(range.startContainer, range.startOffset);

        const desmosHtml = `<iframe src="https://www.desmos.com/calculator/" width="600px" style="min-height:400px"></iframe>`;

        pasteHtmlAtCaret(desmosHtml, range, sel);
    });



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
    function pasteHtmlAtCaret(html, range, sel) {
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

  return (
    <>
        
        {/* <Editor value={html} onChange={onChange} style={{
            fontFamily:'Open Sans',
        }} /> */}

        <h2 style={{
            fontFamily:'Open Sans'
        }}>{filePath? filePath: 'Editor'}</h2>

        <EditorProvider>
            <Editor value={html} onChange={onChange} style={{
                fontFamily:'Open Sans',
                height:'80vh',
                overflowY:'scroll',
            }}>
                <Toolbar>
                    <BtnBold />
                    <BtnItalic />
                    <BtnUnderline />
                    <BtnStrikeThrough />
                    <BtnClearFormatting />
                    <Separator />
                    <BtnBulletList />
                    <BtnNumberedList />
                    <Separator />
                    <BtnUndo />
                    <BtnRedo />
                    <Separator />
                    <BtnStyles />
                    <Separator />
                    <BtnBeautify />
                    <BtnPrompt />
                    <BtnFillBlanks />
                    <Separator />
                    <BtnDesmos />
                    <img src={loading} style={{
                        display: isCallingGPT ? 'block' : 'none',
                        width:'20px',
                        height:'20px',
                        marginLeft:'auto',
                        marginRight:'auto'
                    }}/>
                </Toolbar>
            </Editor>
        </EditorProvider>

        <ReactModal isOpen={isModalOpen} onRequestClose={() => {setIsModalOpen(false); setIsCallingGPT(false)}} style={{
            overlay: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            },

            content: {
                width: '300px',
                height: '120px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginTop: '50px',
                transform: 'translate(-50%, -50%)',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                paddingTop: '10px',
                fontFamily: 'Open Sans'
            }
        }}>
            <input type="text" value={modalInput} onChange={(e) => setModalInput(e.target.value)} style={{
                width:'90%',
                height:'30px',
                padding:'5px',
                fontFamily:'Open Sans',
                borderRadius:'5px',
                border:'1px solid #ccc'
            }}/>
            <br/>
            <button onClick={async () => {

                const question = modalInput;

                setIsWaitingForUser(false)


                if(!question || question.length < 1)
                    return;
        
                await askQuestion(question).then((resHtml) => {
                    pasteHtmlAtCaret(resHtml, rangeGPT, selection);
                    setIsCallingGPT(false);
                    setIsModalOpen(false);
                });
            }} style={{
                width:'90%',
                height:'30px',
                fontSize:'20px',
                padding:'5px',
                fontFamily:'Open Sans',
                borderRadius:'5px',
                border:'1px solid #ccc'

            }}>Submit</button>
            <br/>
            <img src={loading} style={{
                display: isCallingGPT  && !isWaitingForUser ? 'block' : 'none',
                width:'30px',
                height:'30px',
            }}/>
        </ReactModal>

        {/* <button onClick={() => console.log(getHighlightedText())}>Get Highlighted Text</button>
        <button onClick={() => console.log(pasteHtmlAtCaret('<code>poop</code>'))}>Set Highlighted Text</button> */}

    </>
  );
}