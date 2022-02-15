import { CpuInfo } from "os";

//React imports
import React, { useDebugValue, useEffect, useState } from "react";

//Project imports
import { XYPlot, ArcSeries, ArcSeriesPoint, 
    DiscreteColorLegend, DiscreteColorLegendProps } from "react-vis";
//import DiscreteColorLegend from 'legends/discrete-color-legend';
import * as consts from '../resources/constants';
import {DataTuple, Transaction} from '../resources/constants';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';
import '../css/components/DataGraph.css'

//React CSS
import * as CSS from 'csstype';

//Define interface for props type
interface DataGraphProps {
    data: DataTuple[];
    exclusions?: Function;
    limit?: number;
    title: string;
}

/* CONSTANTS */ 
const PI = Math.PI;

//DataGraph constants
const gHEIGHT = 280;
const gWIDTH = 280;

const RAD_START = 0;
const RAD = 1;
const MAX_DATA_DISPLAY = 8

const STROKE_WIDTH = 3;
const ANIM_STROKE_WIDTH = 5;

const DEF_CHART_STYLE = {stroke: 'white', strokeWidth: STROKE_WIDTH};
const ANIM_CHART_STYLE = {stroke: 'black', strokeWidth: ANIM_STROKE_WIDTH};
    

//Data Legend constants
const l_STROKE_WIDTH = 12;
const l_STROKE_STYLE = 'solid';
const PER_LEGEND = 4;

const DEF_LEG_STYLE: CSS.Properties = {
    ['fontSize' as any]: 12,
    ['fontWeight' as any]: 200,
};

const ANIM_LEG_STYLE: CSS.Properties = {
    ['fontSize' as any]: 15,
    ['fontWeight' as any]: 900,
};


function DataGraph(props: DataGraphProps) {
    
    
    /* STATES AND EFFECTS */
    const [stateData, setStateData] = useState<ArcSeriesPoint[]>([]);
    const [legendItems, setLegendItems] = useState<any[]>([]);

    const [hovColor, sethovColor] = useState<any>('none');
    //init
    useEffect( () => {
       
    }, [])

    //Updates
    useEffect( () => {
        if(props.data.length > 0) {
            let graphData = genGraphData(props.data, props.exclusions, props.limit);
            setStateData(graphData);
            setLegendItems(calcLegendData(graphData));
        }
        //console.log("running");
    }, [props.data])


     let sethovValue = (color: string): void => {
        let newData: any[] = [];
        let hov = null;
        stateData.forEach( (val) => {
            if(val.color !== color) {
                newData.push({...val, stlye: DEF_CHART_STYLE} );
            } else hov = val;
        });
        if(hov) {
            newData.push({...hov as ArcSeriesPoint, style: ANIM_CHART_STYLE} );
            setStateData(newData);
        }
        sethovColor(color);
    }

    return (
        

        <div className="data-graph-wrapper">

            <h4 id="data-graph-title">{props.title}</h4>

            <div className="data-graph-plot">
                <XYPlot 
                xDomain={[-.78, 1]}
                yDomain={[-.78, 1]}
                width={gWIDTH}
                height={gHEIGHT}
                strokeType={'literal'}
                >

                <ArcSeries
                center={{x: 0, y: 0}}
                data={stateData.map( (value) => {
                    return {...value, style: (value.color === hovColor) ? ANIM_CHART_STYLE : DEF_CHART_STYLE}
                })}
                colorType={'literal'}
                onValueMouseOver={(value) => {sethovValue(value.color as string)}}
                onValueMouseOut={ () => sethovColor('none') }
                />
                </XYPlot>
            </div>

            <div className="data-graph-legend">

            <DiscreteColorLegend orientation="horizontal" 
            width={gWIDTH}
            items={legendItems.slice(0, PER_LEGEND).map((value) => {
                return {...value, innerStyle: (value.color === hovColor) ? ANIM_LEG_STYLE : DEF_LEG_STYLE}
            })} >
                </DiscreteColorLegend>

            {/* lower row */}
                <DiscreteColorLegend orientation="horizontal" 
                width={gWIDTH}
                items={legendItems.slice(PER_LEGEND, MAX_DATA_DISPLAY).map( (value) => {
                    return {...value, innerStyle: (value.color === hovColor) ? ANIM_LEG_STYLE : DEF_LEG_STYLE}
                    })}
                 />
    
            </div>
           
        </div>
        //end data graph wrapper
                    
    )

}
//END DATAGRAPH MODULE

/* Calc Data functions */
function genGraphData(data: DataTuple[], 
    exclusions: Function = (value: any) => {return true;}, limit: number = data.length ) {

    //Refine and sort
    limit-=1;
    data = Array.from(data);
    data = data.filter( (value) => exclusions(value) );
    data.sort((a, b) => a.data > b.data ? 1 : -1);
    data.reverse();
    
    /*
    console.log("----- EXCLUDED AND SORTED -----");
    data.forEach( (value) => {
        console.log("New LAB: " + value.label + " : " + value.data);
    })
    console.log("-----  -----");
    */

    //Limit Categories, add "other"
        //for all values after "limit" is reached
    if(data.length > limit) {
        let excessData: DataTuple[] = data.splice(limit, data.length);
        data = data.splice(0, limit);
        let sumOther: number = 0;
        excessData.forEach( (val) => sumOther += (val.data as number));
        data.push( {data: sumOther, label: "Other"})
    }

    //Normalize data
    let sum: number = 0;
    data.forEach( (tuple : DataTuple) => sum += tuple.data as number);
    const PAD_ANGLE = 0.04 //0-1, a percent each arc is padded between next

    const colors = consts.colorPicker( Math.random() * consts.PASTEL_PALETE.length, data.length+1);
    let graphData: ArcSeriesPoint[] = [];
    let lastAngle = 0;
    let colIndex = 0;
    const NORM = (2 * PI / sum );
    const SIG_FIGS = 10000

    data.map((tuple) => 
        {
            let start = lastAngle;
            let end = Math.round( (start - (tuple.data as number * NORM) ) * SIG_FIGS) / SIG_FIGS;  //normalize val to 1
            graphData.push({
                angle0: start,
                angle: end, 
                radius0: RAD_START, 
                radius: RAD, 
                label: tuple.label, 
                color: colors[colIndex++]});

            lastAngle = end;
        }
    );
        return graphData;
}


function calcLegendData(data: ArcSeriesPoint[]) {
    let arr: any[] = [];
    Object.entries(data).map( ([key, value]) => {
        arr.push({title: value.label, color: value.color,
        strokeWidth: l_STROKE_WIDTH, strokeStyle: l_STROKE_STYLE})
    })

    //Partition into balanced groups... future problem

    return arr;
}

/* Styling Functions */

//Style chart on value hovered

//Style legend on value hovered

//style table?

export default DataGraph;