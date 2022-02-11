import { CpuInfo } from "os";

//Project imports
import { XYPlot, ArcSeries, ArcSeriesPoint, 
    DiscreteColorLegend, DiscreteColorLegendProps } from "react-vis";
//import DiscreteColorLegend from 'legends/discrete-color-legend';
import * as consts from '../resources/constants';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';
import '../css/components/DataGraph.css'
import { useDebugValue, useEffect, useState } from "react";

//Define interface for props type
interface DataGraphProps {
    headers: string[];
    data: Object;
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
    
    const genGraphData: any = (data: any) => {

        //Normalize data
        let sum: number = 0;
        Object.entries(props.data).forEach( ([key, value]) => sum+=value);

        const colors = consts.colorPicker(7, Object.keys(props.data).length);
        let graphData: ArcSeriesPoint[] = [];
        let lastAngle = 0;
        let colIndex = 0;

        Object.entries(props.data).map(([key, val]) => {
                let start = lastAngle;
                let end = (start + (val * 2 * PI / sum));  //normalize val to 1
                graphData.push({angle0: start, angle: end, 
                    radius0: RAD_START, 
                    radius: RAD, 
                    label: key, color:
                    colors[colIndex++],
                    stroke: STROKE_COL, 
                    style: {strokeWidth: STROKE_WIDTH}});
                lastAngle = end;
        } );

            return graphData;
    }

    /* STATES AND EFFECTS */
    const [stateData, setStateData] = useState<ArcSeriesPoint[]>([]);
    const [legendItems, setLegendItems] = useState<any[]>([]);

    //init
    useEffect( () => {
       
    }, [])

    //Updates
    useEffect( () => {
        let graphData = genGraphData(props.data);
        setStateData(graphData);
        setLegendItems(calcLegendData(graphData));
        console.log("running");
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