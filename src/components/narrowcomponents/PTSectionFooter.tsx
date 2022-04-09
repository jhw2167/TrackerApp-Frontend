
/* Convenvience wrapper for PostTransactions page, wraps footer with buttons
that we use three times in the scrollable lower divs */

import React, { useState, useEffect, useRef, ReactElement, JSXElementConstructor, ReactNode } from 'react';
import {contains, now } from 'underscore';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Offset, Placement, UsePopperOptions, UsePopperState } from '../../../node_modules/@restart/ui/esm/usePopper';

//project imports
import * as c from '../../resources/constants';
import {Transaction} from '../../resources/constants';
import Arrow from '../../resources/subcomponents/arrow';
import DoublePlus from '../../resources/subcomponents/double_plus';
import { OverlayTriggerRenderProps } from 'react-bootstrap/esm/OverlayTrigger';


/* Interfaces */
interface PTFooterProps {
    ids: string[];
    messages: string[];
    offsets?: Offset[];
    positions?: string[];
    onClicks?: Function[];
    classNames?: string[];
    children: (ReactElement<any, string | JSXElementConstructor<any>> | ((props: OverlayTriggerRenderProps) => ReactNode))[];
}

const ARROW_DIMS = { h: '30px', w: '40px'}

function PTSectionFooter(props: PTFooterProps) {

     //For tooltips
     const rndrBtnTooltip = (expression: string, placement: string, id: string) => (props: any) => (
        <Tooltip {...props} id={id + '-tooltip'}
         className={c.addStyleClass('pt', 'tooltip')}
         placement={placement}>
                {expression}
        </Tooltip>
    )

    const ids = props.ids;
    const msgs = props.messages;
    const offsets = (props.offsets) ? props.offsets : ids.map( ()=>{return undefined;});
    const poses = (props.positions) ? props.positions : ids.map( ()=>{return 'auto';});
    const onClicks = (props.onClicks) ? props.onClicks : ids.map( ()=>{return ()=>{};});
    const classes = (props.classNames) ? props.classNames : ids.map( ()=>{return '';});

    const triggers = ids.map( (id, i) => {
    return    <div className={classes[i]} key={i}>
        <OverlayTrigger offset={offsets[i]} overlay={rndrBtnTooltip(msgs[i], poses[i], ids[i])}>
            <div onClick={(e) => onClicks[i](e)}>{props.children[i]}</div>
        </OverlayTrigger>
    </div>
    });

    return (<>{triggers}</>);
}


export default PTSectionFooter;