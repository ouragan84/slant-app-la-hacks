import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import FileManager from "./components/FileManager";

export default () => {
    const windowSize = useRef([window.innerWidth, window.innerHeight]);


    let textEditorStyle = {
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

    return (
        <>  
            <div>
                <div style={{
                    backgroundColor:'#eeefff',
                    float:'left',
                    width:'20%',
                    height:windowSize.current[1],
                    border:0,
                }}>
                <FileManager/>
                </div>
                <div style={textEditorStyle.outer}>
                    <textarea id="file-input" style={textEditorStyle.inner}/>
                </div>
            </div>
                

            {/* <br/>
            <button id="load-file-button">Load File</button>
            <button id="save-file-button">Save File</button> */}
        </>
    )
};

const titleStyle = {
    color: 'blue',
    fontSize: '50px'
};