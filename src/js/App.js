import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";

export default () => {

    return (
        <>  
            <h1 style={titleStyle}>
                Hello from ReactJS! pop
            </h1>
            <textarea id="file-input" style={{height: '50pt'}}/>
            <br/>
            <button id="load-file-button">Load File</button>
            <button id="save-file-button">Save File</button>
        </>
    )
};

const titleStyle = {
    color: 'blue',
    fontSize: '50px'
};