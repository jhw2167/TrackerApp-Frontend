import { CpuInfo } from "os";

//Project imports
import { XYPlot, ArcSeries, RadialChart, ArcSeriesPoint } from "react-vis";
import * as consts from '../resources/constants';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';
import '../css/components/DataGraph.css'
import { useEffect, useState } from "react";

//Define interface for props type
interface DataGraphProps {
    headers: string[];
    data: Object;
}

function DataGraph(props: DataGraphProps) {


    /* CONSTANTS */ 
    const PI = Math.PI;
    //angle
    //radius
    //label
    //subLabel
    //classname
    //color?
    const myData: any = [ {angle: 10, radius: 10}, {angle: 2, label: 'Super Custom label', subLabel: 'With annotation', radius: 20}, {angle: 4, radius: 5, label: 'Alt Label'}, {angle: 3, radius: 14}, {angle: 5, radius: 12, subLabel: 'Sub Label only', className: 'custom-class'} ];
    
    const gHEIGHT = 280;
    const gWIDTH = 280;
    const PAD_ANGLE = .1;

    //Normalize data
    let sum: number = 0;
    Object.entries(props.data).forEach( ([key, value]) => sum+=value);

    let colIndex = 0;
    const colors = consts.colorPicker(7, Object.keys(props.data).length);
    let graphData: any = [];
    let lastAngle = 0;
    const buffer = 0.01;
    const STROKE_COL = '#ffffff';
    Object.entries(props.data).map(([key, val]) => {
            let start = lastAngle;
            let end = (start + (val * 2 * PI / sum));  //normalize val to 1
            graphData.push({angle0: start, angle: end, label: key,
                 color: colors[colIndex++], stroke: STROKE_COL});
            lastAngle = end;
    } );

    /* STATES AND EFFECTS */
    const [stateData, setStateData] = useState<ArcSeriesPoint[]>(graphData);

    //init
    useEffect( () => {
        setStateData(graphData);
    }, [])

    //Updates
    useEffect( () => {
        setStateData(graphData);
    }, graphData)

    return (
        
        <XYPlot 
            xDomain={[-10, 10]}
            yDomain={[-10, 10]}
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

    )

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