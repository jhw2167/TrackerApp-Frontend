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

function DataGraph(props: DataGraphProps) {


    /* CONSTANTS */ 
    const PI = Math.PI;
    const BUL = "○";
    //angle
    //radius
    //label
    //subLabel
    //classname
    //color?
    const myData: any = [ {angle: 10, radius: 10}, {angle: 2, label: 'Super Custom label', subLabel: 'With annotation', radius: 20}, {angle: 4, radius: 5, label: 'Alt Label'}, {angle: 3, radius: 14}, {angle: 5, radius: 12, subLabel: 'Sub Label only', className: 'custom-class'} ];
    const DATA_LENGTH = 8;
    
    const gHEIGHT = 280;
    const gWIDTH = 280;

    const STROKE_COL = '#ffffff';
    const STROKE_WIDTH = 2;
    const RAD_START = 0;
    const RAD = 1;

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

            <table id="data-graph-legend-list">
                    {Object.entries(legendItems).map(([key, value]) => {
                        return <tr>
                            <td className="bul" style={{color: value[0].color}}>{BUL}</td>
                                <td className="data-graph-val">{value[0].label}</td>
                            <td className="bul" style={{color: value[1].color}}>{BUL}</td>
                                <td className="data-graph-val">{value[1].label}</td>
                        </tr>
                    })} {/*END JS*/}
                </table>
    
            </div>
           
        </div>
        //end data graph wrapper

    )

}
//END DATAGRAPH MODULE

function calcLegendData(data: ArcSeriesPoint[]) {
    let arr: any[] = [];
    let lastData: any = undefined;
    Object.entries(data).map( ([key, value], index) => {
        (index % 2 == 0 ? lastData = {label: value.label, color: value.color} : 
            arr.push([lastData, {label: value.label, color: value.color}]  )
        );
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