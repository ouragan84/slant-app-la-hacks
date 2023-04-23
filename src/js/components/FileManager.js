import React, {useState, useEffect, useRef} from "react";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { ipcRenderer } from "electron";
import path from "path";
import fs from "fs";
import { opendir } from "fs-extra";

export default (props) => {

    const [directoryTree, setDirectoryTree] = useState(null);

    const files = props.directoryTree;

    const disableTextSelection = {
        '-moz-user-select':'none', /* firefox */
        '-webkit-user-select': 'none', /* Safari */
        '-ms-user-select': 'none', /* IE*/
        'user-select': 'none'/* Standard syntax */
    };


    const sample = {
        type: 'directory',
        name: 'Open Directory Here',
        pth: 'aosjdoasdojj',
        children: [
            {
                type: 'directory',
                name: 'my sub-directory 1',
                pth: 'aosjdoasdojj',
                children: [
                    {
                        type: 'file',
                        name: 'Notes 1',
                        pth: 'aosjdoasdojj',
                    },
                    {
                        type: 'file',
                        name: 'Notes 2',
                        pth: 'aosjdoasdojj',
                    }
                ]
            },
            {
                type: 'file',
                name: 'Notes 3',
                pth: 'aosjdoasdojj',
            },
            {
                type: 'directory',
                name: 'my sub-directory 2',
                pth: 'aosjdoasdojj',
                children: [
                    {
                        type: 'file',
                        name: 'Notes 4',
                        pth: 'aosjdoasdojj',
                    },
                    {
                        type: 'directory',
                        name: 'my sub-sub-directory',
                        pth: 'aosjdoasdojj',
                        children: [
                            {
                                type: 'file',
                                name: 'Notes 5',
                                pth: 'aosjdoasdojj',
                            },
                            {
                                type: 'file',
                                name: 'Notes 6',
                                pth: 'aosjdoasdojj',
                            }
                        ]
                    },
                ]
            },
        ]

    }
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

        ipcRenderer.on('dir-opened', (event, dirPath) => {

            console.log(readDirectory(dirPath, {
                type:'directory',
                name:dirPath,
                pth:dirPath,
                children:[]
            }))

            setDirectoryTree( readDirectory(dirPath, {
                type:'directory',
                name:dirPath,
                pth:dirPath,
                children:[]
            }))
        })

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

    const readDirectory = (dirPath, dirObj) => {

        // console.log(dirPath)
         
        fs.readdir(dirPath, (err, files) => {
            if (err)
                return console.error("error: ", err)
            
            files.forEach(f => {
                const newPath = path.join(dirPath, f);
                if(fs.lstatSync(newPath).isDirectory()){
                    dirObj.children.push({
                        name: f,
                        pth: newPath,
                        type: 'directory',
                        children: []
                    });
                    const newDirObj = dirObj.children[dirObj.children.length - 1]
                    readDirectory(newPath, newDirObj);
                }else{
                    if(f.slice(-4) === '.sla'){
                        dirObj.children.push({
                            name: f,
                            pth: newPath,
                            type: 'file',
                            selected: true,
                        });
                    }
                }
            });
        })

        return dirObj;
    }
            
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

    

      const File = ({obj, files}) => {        
        
        return <div 
            onClick={()=>{
                console.log(obj)
                readFile(obj.pth)
                setFilePath(obj.pth)
            }} 
            // onMouseEnter = {()=>{name == selectedFile ? setDynBgCol('#dcdcdc') : setDynBgCol('white')}}
            // onMouseLeave = {()=>{name == selectedFile ? setDynBgCol('white') : setDynBgCol('#bcbcee')}}
            style={{fontFamily: 'Open Sans', backgroundColor:filePath === obj.pth ? 'bcbcee' : 'white', paddingLeft:15}}
        >{obj.name}</div>;
      };
      
      const Directory = ({ name, children , files}) => {
        // const [isOpen, setIsOpen] = useState(false);
      
        // const toggleOpen = () => {
        //   setIsOpen(!isOpen);
        // };
        const [dynBgCol, setDynBgCol] = useState('white')
      
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" ,backgroundColor:dynBgCol}}
                // onMouseEnter = {()=>{setDynBgCol('#dcdcdc')}}
                // onMouseLeave = {()=>{setDynBgCol('white')}}
            >
              <div style={{fontFamily: 'Open Sans', paddingLeft:15}}
              >{name}</div>
              
            </div>
            <div style={{ marginLeft: "0.5rem" }}>
                {children.map((child) => (
                  <div key={child.name}>
                    {child.type === "file"  ? (
                        <File obj={child}/> 
                    ) : (
                        <Directory name={child.name} children={child.children} />
                    )}
                  </div>
                ))}
              </div>
          </div>
        );
      };
      
      const dfs = (tree) => {
        console.log('tree', tree)
        return (
          <div>
            {tree.children.map((node) => (
              <div key={node.name}>
                {(node.type === "file") ? (
                  <File obj={node} />
                ) : (
                  <Directory name={node.name} children={node.children}/>
                )}
              </div>
            ))}
          </div>
        );
      };
      
      const openWorkingDir = () => {
        ipcRenderer.send('open-working-dir');
    }


    return (
        <>  
            <p style={{fontSize:20, fontFamily: 'Open Sans', paddingLeft:'10pt', paddingTop:'10pt'}}>Page Explorer</p>
            {/* {fileList} */}
            {/* <FileSystem fileSystem={files}/> */}
            <div>{ directoryTree ? dfs(directoryTree) : dfs(sample)}</div>
            <button id="open-dir-button" onClick={openWorkingDir}>Open Dir</button>
    
        </>
    )
}
