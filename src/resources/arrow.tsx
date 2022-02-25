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
    height?: any,
    width: any,
    color: string,
    size?: number,
    weight?: number,
    direction?: string
    onClick?: Function;
}


function Arrow(props: ArrowProps) {

    const innerStyle: CSS.Properties = {
        ['height' as any]: props.height ? props.height : '100%',
        ['width' as any]: props.width,
        ['fontSize' as any]: props.size,
        ['fontWeight' as any]: props.weight,
        ['color' as any]: props.color
    };

    let symbol = (props.direction && props.direction=='left') ? '<' : '>';
    return(
        <div style={innerStyle} className={'hyperlink-arrow'}
        onClick={() => {if(props.onClick) props.onClick()}} >{symbol}</div>
    );
}

export default Arrow;