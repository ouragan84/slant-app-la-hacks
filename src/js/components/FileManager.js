import React, {useState, useEffect, useRef} from "react";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";


export default () => {

    const files = {
        type: 'directory',
        name: 'my working directory',
        children: [
            {
                type: 'directory',
                name: 'my sub-directory 1',
                children: [
                    {
                        type: 'file',
                        name: 'Notes 1',
                    },
                    {
                        type: 'file',
                        name: 'Notes 2',
                    }
                ]
            },
            {
                type: 'file',
                name: 'Notes 3',
            },
            {
                type: 'directory',
                name: 'my sub-directory 2',
                children: [
                    {
                        type: 'file',
                        name: 'Notes 4',
                    },
                    {
                        type: 'directory',
                        name: 'my sub-sub-directory',
                        children: [
                            {
                                type: 'file',
                                name: 'Notes 5',
                            },
                            {
                                type: 'file',
                                name: 'Notes 6',
                            }
                        ]
                    },
                ]
            },
        ]

    }

    let fileList = []
    //console.log(files.children)
    // for (let i = 0; i < files.children.length; i++){

    //     // fileList.push(
    //     //     <p>{files[i]}</p>
    //     // )
    //     fileList.push
    //     console.log(files.children[i].name)
    //     if(files.children[i].type == 'directory')
    //     {
    //         for (let j = 0; j < files.children[i].length; j++){

    //             // fileList.push(
    //             //     <p>{files[i]}</p>
    //             // )
    //             console.log(files.children[i].name, " : ", files.children[i].children)
                      
    //         }
    //     }       

    // }

    // function dfs(fileSystem) {
    //     console.log('new: ', fileSystem)
    //     return fileSystem.children.map((child) => (
    //       <div key={child.name} style={{ marginLeft: '0.5rem' }}>
    //         {child.name}
    //         {child.type == 'directory' && child.children.length > 0 && <>{dfs(child)}</>}
    //       </div>
    //     ));
    //   }
      
    //   function FileSystem({ fileSystem }) {
    //     return (
    //       <div>
    //         {fileSystem.name}
    //         {dfs(fileSystem)}
    //       </div>
    //     );
    //   }

    // const FileStructure = ({ data }) => {
    //     const [expanded, setExpanded] = useState(false);
      
    //     const handleExpand = () => {
    //       setExpanded(!expanded);
    //     };
      
    //     const dfs = (node, level = 0) => {
    //       if (!node) return null;
    //       const { name, children } = node;
      
    //       const directory = children ? (
    //         <>
    //           <div
    //             className="directory"
    //             style={{ marginLeft: `${level * 0.5}rem` }}
    //             onClick={handleExpand}
    //           >
    //             {name}
    //             <BsChevronDown
    //               className="expand-icon"
    //               style={{ float: "right" }}
    //             />
    //           </div>
    //           {expanded &&
    //             children.map((child) => dfs(child, level + 1))}
    //         </>
    //       ) : (
    //         <div
    //           className="file"
    //           style={{ marginLeft: `${level * 0.5}rem` }}
    //         >
    //           {name}
    //         </div>
    //       );
      
    //       return <div key={name}>{directory}</div>;
    //     };
      
    //     return <>{dfs(data)}</>;
    //   };
      
      //export default FileStructure;

    //   import React, { useState } from "react";
    //   import { BsChevronDown } from "react-icons/bs";
      
      const File = ({ name }) => {
        return <div style={{ marginLeft: "0.5rem" }}>{name}</div>;
      };
      
      const Directory = ({ name, children }) => {
        const [isOpen, setIsOpen] = useState(false);
      
        const toggleOpen = () => {
          setIsOpen(!isOpen);
        };
      
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{name}</div>
              {children && (
                <BsChevronDown
                  onClick={toggleOpen}
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                />
              )}
            </div>
            {isOpen && (
              <div style={{ marginLeft: "0.5rem" }}>
                {children.map((child) => (
                  <div key={child.name}>
                    {child.type === "file" ? (
                      <File name={child.name} />
                    ) : (
                        <Directory name={child.name} children={child.children} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      };
      
      const dfs = (tree) => {
        return (
          <div>
            {tree.children.map((node) => (
              <div key={node.name}>
                {node.type === "file" ? (
                  <File name={node.name} />
                ) : (
                  <Directory name={node.name} children={node.children} />
                )}
              </div>
            ))}
          </div>
        );
      };
      
    function FileTree({data}) {
        
      
        return <div>{dfs(data)}</div>;
      }
       


    return (
        <>  
            <p style={{fontSize:20, fontFamily: 'Open Sans', paddingLeft:'10pt'}}>Page Explorer</p>
            {/* {fileList} */}
            {/* <FileSystem fileSystem={files}/> */}
            <FileTree data={files} />
        </>
    )
}
