import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import FileManager from "./components/FileManager";
import fs from 'fs';
import { ipcRenderer } from 'electron';

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

    const [filePath, setFilePath] = useState(null);
    const [fileContent, setFileContent] = useState('');

    const loadNotesFile = () => {
        // console.log('loadNotesFile')
        // console.log( dialog.showOpenDialog({ properties: ['openFile'] }))
        ipcRenderer.send('load-file');
    };

    const latestFileContent = useRef(fileContent);
    const latestFilePath = useRef(filePath);

    useEffect(() => {
        latestFileContent.current = fileContent;
        latestFilePath.current = filePath;
    }, [fileContent, filePath]);

    // When the crtl + s is pressed, save the file to the disk
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.metaKey && event.key === 's') {
                saveNotesFile();
            }
            if (event.metaKey && event.key === 'o') {
                loadNotesFile();
            }
        };
      
        document.addEventListener('keydown', handleKeyDown);
      }, []);

    ipcRenderer.on('file-loaded', (event, file) => {
        console.log('obtained file from main process: ' + file);
        setFilePath(file);
        readFile(file);
    });

    ipcRenderer.on('file-saved', (event, file) => {
        console.log('file saves ' + file);
        setFilePath(file);
    });

    const saveNotesFile = () => {
        // var actualFilePath = document.getElementById("actual-file").value;

        console.log('saving file: ' + latestFilePath.current);
                
        if(latestFilePath.current){
            saveChanges(latestFilePath.current, latestFileContent.current);
        }else{
            ipcRenderer.send('save-new-file', latestFileContent.current);
            // alert("Please select a file first");
        }
    };

    const handleNewCharacter = (event) => {
        // console.log('Change event: ', event)
        setFileContent(event.target.value);
        // setFileContent(event.target.value);
    };
            
    function readFile(filepath) {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if(err){
                alert("An error ocurred reading the file :" + err.message);
                return;
            }
            
            setFileContent(data);
        });
    }
    
    function saveChanges(filepath, content){
        fs.writeFile(filepath, content, (err) => {
            if(err){
                alert("An error ocurred updating the file"+ err.message);
                console.log(err);
                return;
            }
            
            alert("The file has been succesfully saved");
        }); 
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
                <button id="load-file-button" onClick={loadNotesFile}>Load File</button>
                <button id="save-file-button" onClick={saveNotesFile}>Save File</button>
            </div>
        </>
    )
};