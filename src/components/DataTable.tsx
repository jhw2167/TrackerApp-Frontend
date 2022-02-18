import { CpuInfo } from "os";

//Project imports
import * as c from '../resources/constants';

//other imports
import _ from 'underscore';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/components/DataTable.css'
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

//Define interface for props type
interface DataTableProps {
    headers: String[];
    colNames: String[];
    data: Array<any>;
    limit: number;
    hovCellFunc?: Function;
}

/* Styles */ 
const HOV_ROW_STYLE: CSS.Properties = {
    ["fontWeight" as any]: 600,
    ["fontSize" as any]: 15,
    ["border" as any]: 'solid 3px black',
    ["lineHeight" as any]: '1.6em'
};

/* CONSTS */
const MAX_VEND_LEN = 12;


function DataTable(props: DataTableProps) {

    /* STATES */
    const [extHovCells, setExtHovCells] = useState<Set<any>>(new Set());
    const [hovCells, setHovCells] = useState<Set<any>>(new Set());
    const [deepHovCell, setDeepHovCell] = useState<any>();

    /* EFFECTS */
    useEffect( () => {
        if(props.hovCellFunc) {
            props.hovCellFunc((s: Set<any>) => (s: Set<any>) => setExtHovCells(s));
        }
    }
    , [])

    useEffect( () => {
        if(extHovCells) {
            setHovCells(extHovCells);
        }
    }
    , [extHovCells])

    return (
            <table className="transactions-table">
                <tbody>

                {/* Table Header */}
                <tr className="data-table-header">{
                    Object.entries(props.headers).map(([key, value]) => {
                    return <th key={key}>{value}</th>})
                }</tr>

                {/* Now return data columns */}
                {Object.entries(props.data).slice(0, props.limit).map(([key, value]) => {
                    let isHov: number = hovCells.has(value) ? 1 : 0;
                    isHov += _.isEqual(deepHovCell, value) ? 1 : 0; //0-no hov, 1-hov, 2-deep hov

                    let rowStyle = isHov > 0 ? HOV_ROW_STYLE : undefined;
                    return <tr className="data-table-row" style={rowStyle} key={key}
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
                            let val:string = value[col.toString()];
                            switch(col.toString()) {

                                case c.TRANS_DATA.PURCHDATE:
                                    innerStyle = {['fontSize' as any]: 14};

                                    let split = val.split('-'); //[2022, MM, YY]
                                    val = Number(split[1]) + '/' + Number(split[2]) +
                                    '/' + ( Number(split[0]) - 2000);
                                    break;

                                case c.TRANS_DATA.VEND:
                                    if(val.length > MAX_VEND_LEN ) {
                                        val = val.slice(0, 12);
                                        val += '...'
                                    }
                                    innerStyle= {['width' as any]: '50%'};
                                    break;

                                case c.TRANS_DATA.AMT:
                                    innerStyle= {['textAlign' as any]: 'left',
                                    ['paddingLeft' as any]: isHov > 1 ? '6%' : '9%'};
                                    val = '$' + Number(val).toFixed(2);
                                    break;

                                case c.TRANS_DATA.CAT:
                                    break;
    
                            }

                            return <td className="data-table-entry"
                            style={innerStyle}
                            key={dkey}>{val}</td>
                        })}
                    </tr>
                    })
                }
                {/* END PRINT DATA */}

                </tbody>
            </table>
    )
    //END RETURN
}
//END COMPONENT DATATABLE
export default DataTable;