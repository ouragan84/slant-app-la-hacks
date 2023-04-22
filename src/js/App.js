import React, {useState, useEffect, useRef} from "react";
import FileManager from "./components/FileManager";
import MainEditor from "./components/MainEditor";

export default () => {
    const [filePath, setFilePath] = useState(null);
    const [fileContent, setFileContent] = useState('');

    const windowSize = useRef([window.innerWidth, window.innerHeight]);

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
                    <FileManager
                        filePath={filePath}
                        fileContent={fileContent}
                        setFileContent={setFileContent}
                        setFilePath={setFilePath}
                    />
                </div>

                <MainEditor 
                    fileContent={fileContent}
                    setFileContent={setFileContent}
                />
                
            </div>
        </>
    )
};