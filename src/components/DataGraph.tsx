import { CpuInfo } from "os";

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
import { useDebugValue, useEffect, useState } from "react";
import { stringify } from "querystring";

//Define interface for props type
interface DataGraphProps {
    data: DataTuple[];
    exclusions?: Function;
    limit?: number;
}

const PI = Math.PI;

//DataGraph constants
const gHEIGHT = 280;
const gWIDTH = 280;

const STROKE_COL = '#ffffff';
const STROKE_WIDTH = 2;
const RAD_START = 0;
const RAD = 1;
const MAX_DATA_DISPLAY = 8

//Data Legend constants
const l_STROKE_WIDTH = 12;
const l_STROKE_STYLE = 'solid';
const PER_LEGEND = 4;

function DataGraph(props: DataGraphProps) {


    /* CONSTANTS */ 
    //angle
    //radius
    //label
    //subLabel
    //classname
    //color?
    const myData: any = [ {angle: 10, radius: 10}, {angle: 2, label: 'Super Custom label', subLabel: 'With annotation', radius: 20}, {angle: 4, radius: 5, label: 'Alt Label'}, {angle: 3, radius: 14}, {angle: 5, radius: 12, subLabel: 'Sub Label only', className: 'custom-class'} ];;
    
    /* STATES AND EFFECTS */
    const [stateData, setStateData] = useState<ArcSeriesPoint[]>([]);
    const [legendItems, setLegendItems] = useState<any[]>([]);

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

    return (
        

        <div className="data-graph-wrapper">

            <div className="data-graph-plot">
                <XYPlot 
                xDomain={[-.78, 1]}
                yDomain={[-.78, 1]}
                width={gWIDTH}
                height={gHEIGHT}
                strokeType={'literal'}>

                <ArcSeries
                center={{x: 0, y: 0}}
                //data={myData}
                data={stateData}
                //data={graphData}
                colorType={'literal'}/>
                </XYPlot>
            </div>

            <div className="data-graph-legend">

            <DiscreteColorLegend orientation="horizontal" 
            width={gWIDTH}
            items={legendItems.slice(0, PER_LEGEND)} >
                </DiscreteColorLegend>

            {/* lower row */}
                <DiscreteColorLegend orientation="horizontal" 
            width={gWIDTH}
            items={legendItems.slice(PER_LEGEND, MAX_DATA_DISPLAY)} >
                </DiscreteColorLegend>
    
            </div>
           
        </div>
        //end data graph wrapper

    )

}
//END DATAGRAPH MODULE

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

    /*
    data.forEach( (value) => {
        console.log("New LAB: " + value.label + " : " + value.data);
    })
    */

    //Normalize data
    let sum: number = 0;
    data.forEach( (tuple : DataTuple) => sum += tuple.data as number);

    const colors = consts.colorPicker( Math.random() * consts.PASTEL_PALETE.length, data.length);
    console.log("Colors: " + JSON.stringify(colors));
    let graphData: ArcSeriesPoint[] = [];
    let lastAngle = 0;
    let colIndex = 0;

    data.map((tuple) => {
            let start = lastAngle;
            let end = (start - (tuple.data as number * 2 * PI / sum));  //normalize val to 1
            graphData.push({angle0: start, angle: end, 
                radius0: RAD_START, 
                radius: RAD, 
                label: tuple.label, 
                color: colors[colIndex++],
                stroke: STROKE_COL, 
                style: {strokeWidth: STROKE_WIDTH}});
            lastAngle = end;
    } );

        return graphData;
}


function calcLegendData(data: ArcSeriesPoint[]) {
    let arr: any[] = [];
    Object.entries(data).map( ([key, value]) => {
        arr.push({title: value.label, color: value.color,
        strokeWidth: l_STROKE_WIDTH, strokeStyle: l_STROKE_STYLE})
    })
    return arr;
}

/*
<RadialChart
            animation
            data={graphData}
            width={gWIDTH}
            height={gHEIGHT}
            showLabels={false}
            colorType='literal'
            />
*/

export default DataGraph;