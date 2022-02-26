//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/General.css'
import * as CSS from 'csstype';

interface ArrowProps {
    styleClass?:string
    direction?: string
    onClick?: Function;
}


function Arrow(props: ArrowProps) {

    let symbol = (props.direction && props.direction=='left') ? '<' : '>';
    return(
        <div className={'hyperlink-arrow ' + props.styleClass}
        onClick={() => {if(props.onClick) props.onClick()}} ><p>{symbol}</p></div>
    );
}

export default Arrow;