import React, {useState, useEffect, useRef} from "react";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { ipcRenderer } from "electron";
import path from "path";
import fs from "fs";
import { opendir } from "fs-extra";

export default (props) => {

    const [directoryTree, setDirectoryTree] = useState(null);
    // const [treeObj, setTreeObj] = useState(<h3 style={{fontFamily:'Open Sans'}}>No Directory Opened Yet</h3>);

    const filePath = props.filePath;
    const setFilePath = props.setFilePath;
    const fileContent = props.fileContent;
    const setFileContent = props.setFileContent;


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
                openWorkingDir();
            }
        };
      
        document.addEventListener('keydown', handleKeyDown);
    
        ipcRenderer.on('file-saved', (event, file) => {
            console.log('file saves ' + file);
            setFilePath(file);
        });
    
        ipcRenderer.on('open-dir', (event) => {
            // console.log('loading file')
            // loadNotesFile();
            openWorkingDir();
        });
    
        ipcRenderer.on('save-file', (event) => {
            console.log('saving file')
            saveNotesFile();
        });

        ipcRenderer.on('dir-opened', (event, dirPath) => {
            console.log("got message ")
            buildDirectory(dirPath);
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

    const buildDirectory = (dirPath) => {

        console.log('building DIR ' + dirPath)
        let tree = readDirectory(dirPath, {
            type:'directory',
            name:dirPath,
            pth:dirPath,
            children:[]
        })

        setDirectoryTree( tree )

        console.log('TREE:', tree)

        
        // wait 50 ms
        setTimeout(() => {
            console.log('triggering re-render')
            setDirectoryTree( {...tree} )
        }, 50);
    }

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
        // const [dynBgCol, setDynBgCol] = useState('white')
      
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" ,backgroundColor:'white'}}
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
      
      const buildTreeObj = (tree) => {
        // console.log('tree', tree)
        if(!tree)
            return (<p style={{paddingLeft:15,fontFamily:'Open Sans'}}>No Directory Opened Yet</p>);

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
            <div>{ buildTreeObj(directoryTree) }</div>

            <div style={{width:'20vw', height:100}}>
                <button id="open-dir-button" onClick={openWorkingDir} style={{width:100, height:30, borderRadius:100, border:0, backgroundColor:'#0080FE', color:'white', marginLeft:10, marginTop:10}}
                >Open Folder</button>
            </div>
    
        </>
    )
}
