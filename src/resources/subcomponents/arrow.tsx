//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';

//svg
import { ReactComponent as ArrowSvg } from '../svg/arrow.svg';
//import { ReactComponent as ArrowSvg } from './src/resources/svg/arrow.svg'

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/General.css'

interface ArrowProps {
    height?: string;
    width?: string;
    direction?: string

    styleClass?:string;
    onClick?: Function;
}


function Arrow(props: ArrowProps) {

    const height = props.height ? props.height : '30px';
    const width = props.width ? props.width : '40px';

    let rotate = (props.direction && props.direction=='left') ?
     'rotate(180)' : '';

    const styleClass: string = props.styleClass ? props.styleClass : '';

    return(
        <div className={'hyperlink-arrow-div ' + styleClass + '-div'}
        onClick={() => {if(props.onClick) props.onClick()}} >   
        <ArrowSvg className={'svg-arrow ' + styleClass} 
        fill='black'
        height={height} width={width}
        transform={rotate}
        />
        </div>
    );
}

export default Arrow;