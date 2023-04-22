import React from 'react';
import { FaBeer } from "react-icons/fa";
import { BiUpArrowAlt } from 'react-icons/bi';



export default (props) => {
  return (
    <div style={props.style}>
        <h1>
            <BiUpArrowAlt />
        </h1>
        <h3>
            <FaBeer />
        </h3>
    </div>
  );
}
