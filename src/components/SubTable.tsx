import { CpuInfo } from "os";

//Project imports
import * as c from '../resources/constants';

//other imports
import _, { values } from 'underscore';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/components/DataTable.css'
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

//Define interface for props type
interface DataTableProps {
    title: string;
    headers: String[];
    data: Array<any>;
    limit: number;
    minRows?: number;
    aggOtherRow?: boolean;
    summaryRow?: boolean;
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
const MAX_VENDOR_DISP_LEN = 12;


function DataTable(props: DataTableProps) {

    /* STATES */
    const [extHovCells, setExtHovCells] = useState<Set<any>>(new Set());
    const [hovCells, setHovCells] = useState<Set<any>>(new Set());
    const [deepHovCell, setDeepHovCell] = useState<any>();

    const [data, setData] = useState<any[]>(props.data);
    
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
    <div className={'subtable-' + props.title.replace(' ', '-')}>

            <table className="transactions-table">
                <tbody>

                {/*             Table Header            */}
                <tr className="data-table-header">{
                    Object.entries(props.headers).map(([key, value]) => {
                    return <th key={key}>{value}</th>})
                }</tr>


                {/*         Now return data row      */}
                {data.slice(0, props.limit).map( (value: any, key: number) => {
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

                        {/*         Now return data COLS      */}
                        {Object.entries(value).map(([key, val]) => {
                            return <td className="data-subtable-entry"
                            key={key}>{JSON.stringify(val)}</td>
                        })}
                    </tr>
                    })
                }
                {/* END PRINT DATA */}

                </tbody>
            </table>

        </div>
    )
    //END RETURN
}
//END COMPONENT DATATABLE
export default DataTable;