import { CpuInfo } from "os";

//Project imports
import * as c from '../resources/constants';

//other imports
import _, { values } from 'underscore';

//CSS
import '../css/components/SubTable.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

//Define interface for props type
interface DataTableProps {
    title: string;
    headers: String[];
    data: Array<any>;
    colNames: string[];
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

    const [data, setData] = useState<any[]>(Array.from( props.data ));
    
    /* EFFECTS */
    useEffect( () => {
        if(props.hovCellFunc) {
            props.hovCellFunc((s: Set<any>) => (s: Set<any>) => setExtHovCells(s));
        }
    }
    , [])

    useEffect(() => {
        setData(Array.from( props.data ))
    }, [props])

    useEffect( () => {
        if(extHovCells) {
            setHovCells(extHovCells);
        }
    }
    , [extHovCells])
    

    return ( 
    <div className={'subtable-' + props.title.replace(' ', '-').toLowerCase()}>

            <table className="summary-subtable">
                <tbody>

                {/*             Table Header            */}
                <tr className="data-table-header">{
                    Object.entries(props.headers).map(([key, value]) => {
                    return <th colSpan={ (data && data.length > 0) ? Object.entries(data[0]).length : 1}
                     key={key}>{value}</th>})
                }</tr>


                {/*         Now return data row      */}
                {data.slice(0, props.limit).map( (value: any, key: number) => {
                    let isHov: number = hovCells.has(value) ? 1 : 0;
                    isHov += _.isEqual(deepHovCell, value) ? 1 : 0; //0-no hov, 1-hov, 2-deep hov

                    let rowStyle = isHov > 0 ? HOV_ROW_STYLE : undefined;
                    return <tr className= {props.title.replace(' ', '-').toLowerCase() + '-subtable-row' 
                            + ' data-subtable-row'}
                     style={rowStyle} key={key}
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
                        {Object.entries(props.colNames).map(([dkey, col]) => {
                            let innerStyle: CSS.Properties = {};
                            let val:string = value[col.toString()];
                            switch(col.toString()) {

                                case c.SUMMARY_DATA.aggregate:
                                    innerStyle = {['fontSize' as any]: 14,
                                    ['fontWeight' as any]: 600,
                                    ['paddingLeft' as any]: '3%'};
                                    val += ':';
                                    break;

                                case c.SUMMARY_DATA.value:
                                    innerStyle= {['textAlign' as any]: 'left',
                                    ['paddingLeft' as any]: isHov > 1 ? '0%' : '3%'};
                                    val = '$' + Number(val).toFixed(2);
                                    break;

                                    case c.SUMMARY_DATA.categories:
                                    if(val.length > MAX_VENDOR_DISP_LEN ) {
                                        val = val.slice(0, 12);
                                        val += '...'
                                    }
                                    innerStyle= {['width' as any]: '50%'};
                                    break;
                            }

                            return <td className="data-subtable-entry"
                            style={innerStyle}
                            key={dkey}>{val}</td>
                            })}
                    </tr>
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