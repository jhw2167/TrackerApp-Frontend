import { CpuInfo } from "os";

//Project imports
import { ArcSeries, RadialChart, XYPlot } from "react-vis";

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';
import '../css/components/DataGraph.css'

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
    const myData = [ {angle: 1000, radius: 10}, {angle: 2, label: 'Super Custom label', subLabel: 'With annotation', radius: 20}, {angle: 4, radius: 5, label: 'Alt Label'}, {angle: 3, radius: 14}, {angle: 5, radius: 12, subLabel: 'Sub Label only', className: 'custom-class'} ];
    
    const gHEIGHT = 250;
    const gWIDTH = 250;
    let graphData: any = [];
    Object.entries(props.data).map(([key, val]) => {
            graphData.push({angle: val, label: key});
    } );

    /* STATES AND EFFECTS */

    return (
        
            <RadialChart
            animation
            data={graphData}
            width={gWIDTH}
            height={gHEIGHT}
            showLabels={true}
            />

    )

}

export default DataGraph;