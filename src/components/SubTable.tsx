import { CpuInfo } from "os";

//Project imports
import * as c from '../resources/constants';

//other imports
import _, { values } from 'underscore';

//CSS
import '../css/components/SubTable.css'
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

//Define interface for props type
interface SubTableProps {
    title: string;
    headers: String[];
    data: Array<any>;
    colNames: string[];
    limit: number;
    minRows?: number;
    aggOtherRow?: boolean;
    summaryRow?: boolean;
    aggFunction?: Function;
    hovCellFunc?: Function;
}

/* Styles */ 
const HOV_ROW_STYLE: CSS.Properties = {
    ["fontWeight" as any]: 700,
    ["fontSize" as any]: 15,
    ["border" as any]: 'solid 3px black',
    ["lineHeight" as any]: '1.6em'
};

/* CONSTS */
const MAX_VENDOR_DISP_LEN = 12;


function SubTable(props: SubTableProps) {

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
        //console.log("data passed: " + JSON.stringify(props.data));
        setData(buildData(Array.from(props.data), props.aggFunction,
             props.minRows, props.limit, props.aggOtherRow))
    }, [props])

    useEffect( () => {
        if(extHovCells) {
            setHovCells(extHovCells);
        }
    }
    , [extHovCells])

    if(!data[0]) {
        //console.log("ret nothing!!! %s: " + props.data.length, props.headers);
        return (<div className="loading-data-try"> Loading Data... </div>);
    } else {

    return ( 
        <div className={'subtable-' + props.title.replace(' ', '-').toLowerCase()}>
    
                <table className="summary-subtable">
                    <tbody>
                    {/*             Table Header            */}
                    <tr className={'data-table-header' + ' data-subtable-header'}>{
                        Object.entries(props.headers).map(([key, value]) => {       //[0]
                        return <th colSpan={ (data && data.length > 0) ? Object.entries(data[0]).length : 1}
                         key={key}>{value}</th>})
                    }</tr>
    
    
                    {/*         Now return data row      */}
                    {data.slice(0, props.limit+2).map( (value: any, index: number) => {
                        let isHov: number = hovCells.has(value) ? 1 : 0;
                        isHov += _.isEqual(deepHovCell, value) ? 1 : 0; //0-no hov, 1-hov, 2-deep hov
                        //console.log("Vals: " + !!props.aggFunction + " : " + index + " : " + (props.limit+1));
    
                        let rowStyle = (isHov > 0 || (!!props.aggFunction && index==data.length-1))
                         ? HOV_ROW_STYLE : undefined;
                        let aggRowClassName = (!!props.aggFunction && index==data.length-1) ?
                        ' data-subtable-aggregate-row' : undefined;
                        let uniqueAggRowClassName = (!!props.aggFunction && index==data.length-1) ?
                        ' data-subtable-aggregate-row-' + props.title.replace(' ', '-').toLowerCase() : undefined;

                        return <tr className= {props.title.replace(' ', '-').toLowerCase() + '-subtable-row' 
                                + ' data-subtable-row' + ' data-table-row' + aggRowClassName + uniqueAggRowClassName}
                        key={index}
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
                                let val:string = !_.isEqual(value, {}) ? value[col.toString()] : '-';
                                if(!_.isEqual(value, {})) {
                                switch(col.toString()) {
    
                                    case c.SUMMARY_DATA.aggregate:
                                        innerStyle = { ['fontWeight' as any]: 600,
                                        ['paddingLeft' as any]: '3%',
                                        ["borderLeft" as any]: 'solid 3px ' + c.TRANS_GREY };
                                        val += ':';
                                        break;
    
                                    case c.SUMMARY_DATA.value:
                                        innerStyle= {['textAlign' as any]: 'left',
                                        ['paddingLeft' as any]: isHov > 1 ? '0%' : '3%'};
                                        val = '$' + Number(val).toFixed(2);
                                        break;
    
                                    case c.SUMMARY_DATA.categories:
                                        val = c.properCase(val);
                                        if(val.length > MAX_VENDOR_DISP_LEN ) {
                                            val = val.slice(0, 12);
                                            val += '...'
                                        }
                                        innerStyle= {['width' as any]: '50%'};
                                        break;
                                    }
                                } else {    //This is for filler '-' formatting that fill in null rows
                                    innerStyle = {['fontSize' as any]: '1.2em',
                                 ['fontWeight' as any]: 600, ['textAlign' as any]: 'center',
                                 ['textAlign' as any]: 'center'};
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
    //end else
}
//END COMPONENT 

/* Functions */
function buildData(data: any[], aggFunc: Function | undefined, min: number = data.length, limit: number = Infinity,
      usingOther: boolean = false): any[] {

        //create array from data
        let retData: any[] = data.slice(0, Math.min(limit-1, data.length));
        let otherTuple: Object = {};
        let totalTuple: Object = {};

        //console.log("data given: " + JSON.stringify(data));

        //aggregate all after max
        if(aggFunc) {
            if(limit < data.length && usingOther) {
                //calc other
                otherTuple = aggFunc(data.slice(limit-1), new String('Other') )
            }
            
            //calc total
            totalTuple = aggFunc(data, new String('Total') )
        }

        //pad until min

        let i: number = retData.length;    
        while(i < min) {retData.push({}); i++;}
        
            

        if(!_.isEqual(otherTuple,{}))
            retData.push(otherTuple);
        
        if(!_.isEqual(totalTuple,{}))
            retData.push(totalTuple);

        //console.log("to return: " + JSON.stringify(retData));

    return retData;
}


export default SubTable;