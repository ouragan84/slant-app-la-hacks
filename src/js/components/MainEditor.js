import React, {useState, useEffect, useRef} from "react";

import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'


export default (props) => {

    const fileContent = props.fileContent;
    const setFileContent = props.setFileContent;

    const [editor] = useState(() => withReact(createEditor()))

    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    const textEditorStyle = {
        inner:{
            width: '612pt',
            height:'100%',
            border: '0px',
            boxShadow: "0px 0px 10px #ddd"
        },
        outer:{
            display:'flex',
            alignItems: "center",
            justifyContent: "center",
            height:windowSize.current[1],
        }
    }    


    const handleNewCharacter = (event) => {
        // console.log('Change event: ', event)
        setFileContent(event.target.value);
        // setFileContent(event.target.value);
    };

    return (
        <>
            <div style={textEditorStyle.outer}>
                <textarea id="file-input" style={textEditorStyle.inner} value={fileContent} onChange={handleNewCharacter}/>
            </div>
        </>
    )
};