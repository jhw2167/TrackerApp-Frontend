import { CpuInfo } from "os";

//React imports
import React, { useDebugValue, useEffect, useState } from "react";

//Project imports
import { XYPlot, ArcSeries, ArcSeriesPoint, 
    DiscreteColorLegend, DiscreteColorLegendProps,
     Hint, 
     RVMouseEventHandler} from "react-vis";
//import DiscreteColorLegend from 'legends/discrete-color-legend';
import * as consts from '../resources/constants';
import {DataTuple, Transaction} from '../resources/constants';

//React CSS
import * as CSS from 'csstype';
import Arrow from "../resources/subcomponents/arrow";
import { Overlay, OverlayTriggerProps } from "react-bootstrap";
import OverlaySub from "./subcomponents/OverlaySub";

//Define interface for props type
interface DataGraphProps {
    title: string;
    data: DataTuple[];
    height: number;
    width: number;
    exclusions?: Function;
    limit?: number;
    setHovSegment?: Function;
    updateDataHyperlink?: Function;
}

interface FullArcSeriesPoint extends ArcSeriesPoint {
    value: any,
    label: string,
    pct: number;
}

/* CONSTANTS */ 
const PI = Math.PI;

//DataGraph constants

const RAD_START = 0;
const RAD = 1;
const MAX_DATA_DISPLAY = 8

const STROKE_WIDTH = 3;
const ANIM_STROKE_WIDTH = 4;

const DEF_CHART_STYLE = {stroke: consts.SEC_COLOR, strokeWidth: STROKE_WIDTH};
const ANIM_CHART_STYLE = {stroke: consts.PRIM_COLOR, strokeWidth: ANIM_STROKE_WIDTH};
    

//Data Legend constants
const l_STROKE_WIDTH = 10;
const l_STROKE_STYLE = 'solid';
const PER_LEGEND = 4;

const DEF_LEG_STYLE: CSS.Properties = {
    ['fontSize' as any]: 15,
    ['fontWeight' as any]: 500,
};

const ANIM_LEG_STYLE: CSS.Properties = {
    ['fontSize' as any]: 20,
    ['fontWeight' as any]: 650,
};

const POP_STYLE: CSS.Properties = {
    ['position' as any]: 'absolute',
    ['left' as any]: 50,
    ['top' as any]: 50,
    ['background-color' as any]: 'yellow'
};


function DataGraph(props: DataGraphProps) {
    
    
    /* STATES AND EFFECTS */
        const[graphDims, setGraphDims] = useState<number[]>([props.height, props.width]);
        const [stateData, setStateData] = useState<FullArcSeriesPoint[]>([]);
        const [legendItems, setLegendItems] = useState<any[]>([]);

        const [hovColor, sethovColor] = useState<any>('none');
        const [hovValue, sethovValue] = useState<FullArcSeriesPoint>();
        const [legItemClick, setLegItemClick] = useState<any>(false);
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

        useEffect(() => { 
            setGraphDims([props.height, props.width]);
        }, [window.innerWidth])



    /* FUNCTIONS */ 

        //places hovered value at back of array so its drawn last
        let setHovValueByColor = (color: string): void => {
            let newData: any[] = [];
            let hov = null;
            if(props.setHovSegment) props.setHovSegment("");    //reset this, then reset later
            stateData.forEach( (val) => {
                if(val.color !== color) {
                    newData.push({...val, stlye: DEF_CHART_STYLE} );
                } else hov = val;
            });
            if(hov) {
                newData.push({...hov as ArcSeriesPoint, style: ANIM_CHART_STYLE} );
                setStateData(newData);
                sethovValue(hov);
                if(props.setHovSegment) props.setHovSegment((hov as FullArcSeriesPoint).label);
            } else {
                sethovValue(undefined);
            }
            sethovColor(color);
        }
        //END

        //for legend styling
        let buildStyledLegend = (value: any) => {
            return {...value, innerStyle: (value.color === hovColor) ? ANIM_LEG_STYLE : DEF_LEG_STYLE};
        }

        //for hyperlink on arrows
        const arrowFunc = (a: number) => {
            if(props.updateDataHyperlink)
                props.updateDataHyperlink(a)
        }
        
    return (
        

        <div className="data-graph-wrapper">

            <div className="row content-header justify-content-center" id="data-graph-full-title">
            <div className="col-8">
            <div className="row no-internal-padding no-internal-flex justify-content-center">
                    <div className="col">
                <Arrow direction={'left'} styleClass={'overview-arrow'} onClick={() => arrowFunc(1)}/>
                    </div>
                    <div className="col fit-content">
                 <h2 className="content-header-title" id="data-graph-title">{props.title}</h2>        
                    </div>
                    <div className="col">
                        <OverlaySub
                        index={1}
                        placement="right"
                        tipcontent="This is a toolTip"
                        element={ <Arrow direction={'right'} styleClass={'overview-arrow'} onClick={() => arrowFunc(-1)}/>}
                        styleclass='o'
                        />

               
                    </div>
            </div>
            </div>
            </div>
            


        <div className="graph-components-wrapper">
        
        {/*<div className="loading-data-try"> No Data this month :/ </div> */}

            <div className="data-graph-plot">
                <XYPlot 
                xDomain={[-.78, 1]}
                yDomain={[-.78, 1]}
                height={graphDims[0] as number}
                width={graphDims[1] as number}
                strokeType={'literal'}
                >

                <ArcSeries
                center={{x: 0, y: 0}}
                data={stateData.map( (value) => {
                    return {...value, style: (value.color === hovColor) ? ANIM_CHART_STYLE : DEF_CHART_STYLE} as ArcSeriesPoint
                })}
                colorType={'literal'}
                onValueMouseOver={(value) => { if(!legItemClick) setHovValueByColor(value.color as string)}}
                onValueMouseOut={ () => { if(!legItemClick) setHovValueByColor('none') }}
                />

            {/* ######## TOOLTIP ########  */ }
            {/* ######## TOOLTIP ########  */ }
            {/* ######## TOOLTIP ########  */ }

                {hovValue ? (
                <Hint value={buildValue(hovValue)}>
                    <div className="data-graph-tooltip">
                        <p className="sublabel-title">{hovValue.label}</p>
                        <p>{"$" + (hovValue.value as number).toFixed(2) +
                         ",  " + (hovValue.pct*100).toFixed(1) + "%"}</p>
                    </div>
                </Hint> ) 
                    : null}

                </XYPlot>
            </div>

            {/* ######## LEGEND ########  */ }
            {/* ######## LEGEND ########  */ }
            {/* ######## LEGEND ########  */ }


            <div className="data-graph-legend">

            <DiscreteColorLegend orientation="horizontal" 
            width={graphDims[1] as number}
            items={legendItems.slice(0, PER_LEGEND).map((value) => {
                return buildStyledLegend(value);
            })}
            onItemMouseEnter={(item) => {if(!legItemClick) setHovValueByColor(item.color)}}
            onItemMouseLeave={() => {if(!legItemClick) setHovValueByColor("") }}
           //onItemClick={(item: any) => {setLegItemClick(item); setHovValueByColor(item.color);}} 
           /* LATER DEVELOPMENT */
            >
                </DiscreteColorLegend>

            {/* lower row */}
                <DiscreteColorLegend orientation="horizontal" 
                width={graphDims[1] as number}
                items={legendItems.slice(PER_LEGEND, MAX_DATA_DISPLAY).map( (value) => {
                    return buildStyledLegend(value);
                    })}
                    onItemMouseEnter={(item) => {if(!legItemClick) setHovValueByColor(item.color)}}
                    onItemMouseLeave={() => {if(!legItemClick) setHovValueByColor("") }}
                 />
    
            </div>
        
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

    const colors = consts.colorPicker( Math.random() * consts.PASTEL_PALETE.length, data.length+1);
    let graphData: FullArcSeriesPoint[] = [];
    let lastAngle = 0;
    let colIndex = 0;
    const NORM: number = (2 * PI / sum );
    const SIG_FIGS: number = 1000;

    data.map((tuple) => 
        {
            let start: number = lastAngle;
            let end: number = Math.round( (start - (tuple.data as number * NORM) ) * SIG_FIGS) / SIG_FIGS;  //normalize val to 1
            graphData.push({
                angle0: start as number,
                angle: end as number, 
                radius0: RAD_START, 
                radius: RAD, 
                color: colors[colIndex++],
                //Extended values
                value: tuple.data as number,
                label: tuple.label, 
                pct: Math.round(( tuple.data as number / sum) * 1000) / 1000
                });
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


function buildValue(hoveredCell: ArcSeriesPoint | undefined) {
    const {radius, angle, angle0} = hoveredCell ? hoveredCell : 
    {radius: 0, angle: 0, angle0: 0};
    const truedAngle = (angle - angle0) / 2;

     return {
       x: 1.20,
       y: 1.05
     };

    // return {
    //   x: radius * Math.cos(truedAngle),
    //   y: radius * Math.sin(truedAngle)
    // };
  }


//Style chart on value hovered

//Style legend on value hovered


//style table?

export default DataGraph;
