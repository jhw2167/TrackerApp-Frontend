//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';

//svg
import { ReactComponent as DoublePlusSVG } from '../svg/double_plus.svg';
//import { ReactComponent as DoublePlusSVG } from './src/resources/svg/double_plus.svg'

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/General.css'

interface DoublePlusProps {
    height?: string;
    width?: string;
    direction?: string

    styleClass?:string;
    onClick?: Function;
}


function DoublePlus(props: DoublePlusProps) {

    const height = props.height ? props.height : '40px';
    const width = props.width ? props.width : '40px';

    const styleClass: string = props.styleClass ? props.styleClass : '';

    return(
        <div className={'hyperlink-double-plus-div ' + styleClass + '-div'}
        onClick={() => {if(props.onClick) props.onClick()}} >   
        <DoublePlusSVG className={'svg-double-plus ' + styleClass} 
        fill='black'
        stroke='black'
        strokeWidth={1}
        height={height} width={width}
        />
        </div>
    );
}

export default DoublePlus;