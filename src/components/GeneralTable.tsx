import { CpuInfo } from "os";

//Project imports
import * as c from '../resources/constants';

//other imports
import _, { values } from 'underscore';
import * as CSS from 'csstype';
import React, { useEffect, useState } from "react";

//Define interface for props type
interface GeneralTableProps<T> {
    title?: string;
    id: string;
    colNames: string[];
    headers: Map<string, string>;           //maps colName to header
    data: Array<T>;                         //indexes object T by colName
    colStyling?: Map<string, ColStyle>;      //maps colName to ColStyle
    rowStyling?: RowStyle;
    bufferStyling?: BufferRowStyling;

    limit: number;
    minRows?: number;
    aggOtherRow?: boolean;
    summaryRow?: boolean;
    aggFunction?: Function;
    hovCellFunc?: Function;
    styleClass: string;
}

interface ColStyle {
    css?: React.CSSProperties;
    hoverCSS?: React.CSSProperties;
    content?: (val: string) => string;
    hoverContent?: (val: string) => string;
}

interface RowStyle {
    normCSS?: React.CSSProperties;
    hoverCSS?: React.CSSProperties;
    aggRowCSS?: React.CSSProperties;
}

interface BufferRowStyling {
    bufferSymbol?: string;          //same buffered symbol for each col in a row
    bufferContent?: Map<string, string>;   //if you want different symbols per column, e.g. buffered numbers are '0', buffered strings are '-'
    bufferColStyle?: Map<string, React.CSSProperties>;
    bufferRowStyle?: React.CSSProperties;
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


function GeneralTable<T>(props: GeneralTableProps<T>) {

    /* STATES */
    const [extHovCells, setExtHovCells] = useState<Set<any>>(new Set());
    const [hovCells, setHovCells] = useState<Set<any>>(new Set());
    const [deepHovCell, setDeepHovCell] = useState<any>();

    const [data, setData] = useState<T[]>(Array.from( props.data ));

    //Conveniently named props
    const sc: string = props.styleClass;
    const cols: string[] = props.colNames;
    const rowStyles: RowStyle | undefined = props.rowStyling; //empty map will never return val
    const colStyles: Map<string, ColStyle> = (props.colStyling) ? props.colStyling : new Map<string, ColStyle>();
    const bufStyles: BufferRowStyling = (props.bufferStyling) ? props.bufferStyling : { bufferContent: new Map<string, string>() };
        cols.forEach( (v) => { if(!bufStyles.bufferContent?.get(v)) bufStyles.bufferContent?.set(v, '-');});
    
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
        <div className={c.addStyleClass(sc, 'general-table-wrapper-div') + ' ' + props.id}>
    
                <table className={c.addStyleClass(sc, 'general-table')}>
                    <tbody>
                    {/*             Table Header            */} 
                    { (props.headers) ?
                    <tr className={c.addStyleClass(sc, 'general-table-header')}>{
                        Object.entries(props.headers).map(([key, value]) => {       //[0]
                        return <th colSpan={ (data && data.length > 0) ? Object.entries(data[0]).length : 1}
                         key={key}>{value}</th>})
                    }</tr> : null} {/* END HEADER ROW */}
    

                    {/*         Now return data rows      */}
                    {data.slice(0, props.limit+2).map( (value: any, index: number) => {
                        let isHov: number = hovCells.has(value) ? 1 : 0;
                        isHov += _.isEqual(deepHovCell, value) ? 1 : 0; //0-no hov, 1-hov, 2-deep hov
                        //console.log("Vals: " + !!props.aggFunction + " : " + index + " : " + (props.limit+1));
    
                        let rowStyle = (!!props.aggFunction && index==data.length-1) ? rowStyles?.aggRowCSS : rowStyles?.normCSS;
                        rowStyle = (isHov > 0) ? {...rowStyle, ...rowStyles?.hoverCSS} : rowStyle;
                        let aggRowClassName = (!!props.aggFunction && index==data.length-1) ?
                        c.addStyleClass(props.id, 'data-subtable-aggregate-row-') : undefined;
                        
                        return <tr className= {c.addStyleClass(sc, 'general-table-row') + ' data-table-row ' +
                         aggRowClassName} style={rowStyle}
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
                                col = col.toString();
                                let isBufRow = _.isEqual(value, {});
                                let colStyle: ColStyle | undefined = colStyles.get(col);

                                //set Value of "adjust Value function" depending on what functions were provided
                                let adjValFunc = (colStyle) ? 
                                    ( (isHov) ? colStyles.get(col)?.content : colStyles.get(col)?.hoverContent ) :
                                        undefined;
                                adjValFunc = (!adjValFunc || isBufRow) ? (v: string) => {return v;} : adjValFunc;

                                //set Value of "adjust Value function" depending on what functions were provided
                                let innerStyle = (isHov) ? colStyle?.hoverCSS : 
                                                        ( (isBufRow && bufStyles.bufferColStyle?.get(col)) ?
                                                         bufStyles.bufferColStyle.get(col) : colStyle?.css);

                                let val:string = _.isEqual(value, {}) ?  bufStyles.bufferContent?.get(col) as string : adjValFunc(value[col]); 
                                return <td className={c.addStyleClass(sc, 'general-table-entry')}
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


export default GeneralTable;