import { CpuInfo } from "os";

//Project imports
import { ArcSeries, RadialChart, XYPlot } from "react-vis";

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';
import '../css/components/DataGraph.css'

//Define interface for props type
interface DataGraphProps {
    headers: String[];
    data: Array<any>;
}

function DataGraph(props: DataGraphProps) {


    /* CONSTANTS */ 
    const PI = Math.PI;
    const myData = [ {angle: 1, radius: 10}, {angle: 2, label: 'Super Custom label', subLabel: 'With annotation', radius: 20}, {angle: 4, radius: 5, label: 'Alt Label'}, {angle: 3, radius: 14}, {angle: 5, radius: 12, subLabel: 'Sub Label only', className: 'custom-class'} ];

    return (
        
            <RadialChart
            animation
            data={myData}
            width={300}
            height={300}
            showLabels={true}
            />

    )

}

export default DataGraph;