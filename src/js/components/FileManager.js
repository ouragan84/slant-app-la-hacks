import React, {useState, useEffect, useRef} from "react";
import fs from 'fs';
import { ipcRenderer } from 'electron';

export default (props) => {

    // const [filePath, setFilePath] = useState(null);
    // const [fileContent, setFileContent] = useState('');

    const filePath = props.filePath;
    const setFilePath = props.setFilePath;
    const fileContent = props.fileContent;
    const setFileContent = props.setFileContent;


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
            const isCmd = process.platform === 'darwin' ? event.metaKey : event.crtlKey;

            if (isCmd&& event.key === 's') {
                saveNotesFile();
            }
            if (isCmd && event.key === 'o') {
                loadNotesFile();
            }
        };
      
        document.addEventListener('keydown', handleKeyDown);

        ipcRenderer.on('file-loaded', (event, file) => {
            console.log('obtained file from main process: ' + file);
            setFilePath(file);
            readFile(file);
        });
    
        ipcRenderer.on('file-saved', (event, file) => {
            console.log('file saves ' + file);
            setFilePath(file);
        });
    
        ipcRenderer.on('load-file', (event) => {
            console.log('loading file')
            loadNotesFile();
        });
    
        ipcRenderer.on('save-file', (event) => {
            console.log('saving file')
            saveNotesFile();
        });

        return () => {
            ipcRenderer.removeAllListeners(IPCConstants.UPDATE_SALE_CUSTOMER);
        };
        
      }, []);

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
            <p style={{fontSize:30, fontFamily: 'Open Sans'}}>File: {}</p>
            <button id="load-file-button" onClick={loadNotesFile}>Load File</button>
            <button id="save-file-button" onClick={saveNotesFile}>Save File</button>
        </>
    )
}