import React, {useState, useEffect, useRef} from "react";
import FileManager from "./components/FileManager";
import MainEditor from "./components/newEditor";
import { platform } from "os";

export default () => {
    const [filePath, setFilePath] = useState(null);
    const [fileContent, setFileContent] = useState('<h2>Start writing, or load a file</h2> <p>Press ctrl + s to save</p> <p>Press ctrl + o to open a file</p>');

    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    return (
        <>  
            <div style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',

            }}>
                <div style={{
                    backgroundColor:'#eeefff',

                    width:'20%',
                    height:windowSize.current[1],
                    border:0,
                }}>
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
                    height:windowSize.current[1],
                    // border:'2px solid #000000',
                    padding:'30px',
                   
                }}>
                    <MainEditor 
                        html={fileContent}
                        setHtml={setFileContent}
                        style={{
                            boxShadow:'0px 0px 10px 0px #000000',
                        }}
                    />
                </div>
            </div>
        </>
    )
};