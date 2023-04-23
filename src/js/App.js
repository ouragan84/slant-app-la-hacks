import React, {useState, useEffect, useRef} from "react";
import FileManager from "./components/FileManager";
import MainEditor from "./components/newEditor";
import { platform } from "os";

export default () => {
    const [filePath, setFilePath] = useState(null);
    const [fileContent, setFileContent] = useState('<h2>Start writing, or load a file</h2> <p>Press ctrl + s to save</p> <p>Press ctrl + o to open a file</p>');

    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    const openWorkingDir = () => {
        ipcRenderer.send('open-working-dir');
    }

    return (
        <>  
            <div style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',

            }}>
                <div style={{
                    backgroundColor:'#ffffff',

                    width:'20%',
                    height:'90vh',
                    border:0,
                    boxShadow: "0px 0px 10px #ddd"
                }}
                zindex={1}
                >
                    <FileManager
                        filePath={filePath}
                        fileContent={fileContent}
                        setFileContent={setFileContent}
                        setFilePath={setFilePath}
                    />
                </div>
                
                <div style={{
                    backgroundColor:'#ffffff',        
                    width:'80%',
                    height:'90vh',
                    // border:'2px solid #000000',
                   
                }}>
                <div style={{position:'absolute', top: 0, left: '20.25vw', width:'80vw'}} zindex={2}>
                    <MainEditor 
                        html={fileContent}
                        setHtml={setFileContent}
                        filePath={filePath}
                        style={{                            
                        }}
                    />
                </div>
                </div>
            </div>
        </>
    )
};