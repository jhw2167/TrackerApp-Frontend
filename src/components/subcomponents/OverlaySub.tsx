
/* Overlay component is a popover tooltip that surrounds
a JSX element passed as a prop */

//lib imports
import { JSXElementConstructor, ReactElement, useState } from "react";
import { Button, OverlayTrigger, OverlayTriggerProps, Tooltip, TooltipProps} from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/types";
import { JsxElement } from "typescript";


//Project Imports
import * as c from '../../resources/constants'


interface OverlayProps {
    index: number;
    placement?: Placement;
    element: ReactElement<any, string | JSXElementConstructor<any>>;
    tipcontent: ReactElement<any, string | JSXElementConstructor<any>> | string;
    styleclass: string;
    show?: boolean;
}

//cntrl k-u to undo
function OverlaySub(props: OverlayProps) {

    const sc = props.styleclass;
    
    //Declare Tooltip
    const renderTooltip = (innerProps: any) => (
        <Tooltip  {...innerProps}
        show={props.show}
        open={props.show}
        className={c.addStyleClass(sc, 'tooltip')}>{props.tipcontent}</Tooltip>
      );

    return(
        <OverlayTrigger
        placement={props.placement}
        overlay={renderTooltip}
        ><div
        className={c.addStyleClass(sc, 'btn-tooltip')}
         >{props.element}</div>
        </OverlayTrigger>
      );

}

export default OverlaySub;