/* Data Table Component */

//React Imports
import React, { MutableRefObject, useEffect, useRef, useState } from "react";

//Project imports
import * as c from '../resources/constants';

//other imports
import _ from 'underscore';

//CSS

import * as CSS from 'csstype';
import Arrow from "../resources/subcomponents/arrow";
import OverlaySub from "./subcomponents/OverlaySub";
import { Overlay, Tooltip } from "react-bootstrap";

//Define interface for props type
interface DataTableProps {
    title: string;
    headers: string[];
    colNames: string[];
    isViewingRecentTransactions: boolean;
    toolTipColNames?: string[];
    toolTipHeaders?: string[];
    data: Array<any>;
    maxRows?: number;
    minRows?: number;
    hovCellFunc?: Function;
    updateDataHyperlink?: Function;
}

/* Styles */ 
const HOV_ROW_STYLE: CSS.Properties = {
    ["fontWeight" as any]: 600,
    ["fontSize" as any]: 15,
    ["border" as any]: 'solid 3px ' + c.PRIM_COLOR,
    ["lineHeight" as any]: '1.6em'
};

/* CONSTS */
const MAX_VENDOR_DISP_LEN = 12;


function DataTable(props: DataTableProps) {

    /* VARS */
    const maxRows = (props.maxRows) ? props.maxRows : Infinity;
    const minRows = (props.minRows) ? props.minRows : 0;
    const data = props.data;
        let i: number = data.length;    //pad until min
        while(i < minRows) {data.push({}); i++;}
        

    /* STATES */
    const [extHovCells, setExtHovCells] = useState<Set<any>>(new Set());
    const [hovCells, setHovCells] = useState<Set<any>>(new Set());
    const [deepHovCell, setDeepHovCell] = useState<any>();
    const [isViewingRecentTransactions, setIsViewingRecentTransactions] = useState<boolean>(props.isViewingRecentTransactions);
    let rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);

    /* EFFECTS */
    useEffect( () => {
        if(props.hovCellFunc) {
            props.hovCellFunc((s: Set<any>) => (s: Set<any>) => setExtHovCells(s));
        }
    }
    , [])

    useEffect( () => {
        setIsViewingRecentTransactions(props.isViewingRecentTransactions);
    }
    , [props.isViewingRecentTransactions])

    useEffect(() => {
        rowRefs.current = rowRefs.current.slice(0, props.data.length);
     }, [props.data]);

    useEffect( () => {
        if(extHovCells) {
            setHovCells(extHovCells);
        }
    }
    , [extHovCells])

    //Utility functions
    //for hyperlink on arrows
    const arrowFunc = (a: number) => {
        if(props.updateDataHyperlink)
            props.updateDataHyperlink(a)
    }

    return ( 
    
    <div className="data-table-wrapper">

            <div className="row content-header justify-content-center" id="data-table-full-title">
            <div className="col-12">
            <div className="row no-internal-padding no-internal-flex justify-content-center">
                    <div className="col">
                <Arrow direction={'left'} styleClass={'overview-arrow'} onClick={() => arrowFunc(-1)}/>
                    </div>
                    <div className="col fit-content">
                 <h2 className="content-header-title" id="data-table-title">{props.title}</h2>        
                    </div>
                    <div className="col">
                <Arrow direction={'right'} styleClass={'overview-arrow'} onClick={() => arrowFunc(1)}/>
                    </div>
            </div>
            </div>
            </div>

            <table className="transactions-table">
                <tbody>
                {/* Table Header */}
                <tr className="data-table-header">{
                    Object.entries(props.headers).map(([key, value]) => {
                    return <th key={key}>{value}</th>})
                }</tr>
                {/* Now return data columns */}
                {Object.entries(data).slice(0, maxRows).map(([key, value], index) => {
                
                    let isHov: number = hovCells.has(value) ? 1 : 0;
                    isHov += _.isEqual(deepHovCell, value) ? 1 : 0; //0-no hov, 1-hov, 2-deep hov
                        isHov = (_.isEqual(value, {})) ? 0 : isHov;
                    let rowStyle = isHov > 0 ? HOV_ROW_STYLE : undefined;
                    return <React.Fragment key={key}>
                    <tr ref={ ref => rowRefs.current[index] = ref} 
                    className="data-table-row" style={rowStyle}
                    key={key}
                    onMouseEnter={() => {
                        hovCells.add(value);
                        setHovCells(hovCells); 
                        setDeepHovCell(value); }}

                    onMouseLeave={() => {
                        hovCells.delete(value);
                        setHovCells(hovCells); 
                        setDeepHovCell(null);}}
                     >
                        {Object.entries(props.colNames).map(([dkey, col]) => {
                            let innerStyle: CSS.Properties = {};
                            let val:string = (!value[col]) ?  '-' :  value[col.toString()];

                            if(val != '-') 
                            {
                                switch(col.toString()) 
                                {
                                    case c.TRANS_DATA.PURCHDATE:
                                        innerStyle = {['fontSize' as any]: 14};
                                        val = c.formatDBDate(val);
                                        break;

                                    case c.TRANS_DATA.VEND:
                                        val = c.truncString(val, MAX_VENDOR_DISP_LEN);
                                        innerStyle= {['width' as any]: '50%'};
                                        break;

                                    case c.TRANS_DATA.AMT:
                                        innerStyle= {['textAlign' as any]: 'left',
                                        ['paddingLeft' as any]: isHov > 1 ? '5%' : '7%'};
                                        val = '$' + Number(val).toFixed(2);
                                        break;

                                    case c.TRANS_DATA.CAT:
                                        break;
                                }
                            }
                            return <td className="data-table-entry"
                            style={innerStyle}
                            key={dkey}>{val}</td>
                        })}
                    </tr>{(rowRefs.current[index] && props.toolTipColNames && props.toolTipHeaders) ?
                    <Overlay target={rowRefs.current[index]}
                     show={isHov>1}  placement="right">
                        <Tooltip className={c.addStyleClass('dt', 'tooltip')}
                        onMouseEnter={() => setDeepHovCell(value)}
                        onMouseLeave={() => setDeepHovCell(null)}
                        >
                            <ul>
                                {props.toolTipColNames.filter( (v) => { return value[v.toString()] != undefined} ).map((v, i) => {
                                    return (
                                        <li key={i}>
                                            <span className="text-bold no-wrap"> {(props.toolTipHeaders as string[])[i] + ': '}</span>
                                            <span>{value[v.toString()].toString()}</span>
                                        </li>
                                        )
                                })}
                            </ul>
                        </Tooltip>
                    </Overlay> : null}
                    </React.Fragment>
                    })}
                {/* END PRINT DATA */}
                </tbody>
            </table>

        </div>
    )
    //END RETURN
}
//END COMPONENT DATATABLE
export default DataTable;