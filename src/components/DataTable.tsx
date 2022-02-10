import { CpuInfo } from "os";

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/components/DataTable.css'

//Define interface for props type
interface DataTableProps {
    headers: String[];
    colNames: String[];
    data: Array<any>;
    limit: number;
}

function DataTable(props: DataTableProps) {

    //headers:Array<String>, data:Array<any>, cols:Array<String>

    return (
            <table className="transactions-table">
                <tbody>

                {/* Table Header */}
                <tr className="data-table-header">{
                    Object.entries(props.headers).map(([key, value]) => {
                    return <th key={key}>{value}</th>})
                }</tr>

                {/* Now return data columns */}
                {Object.entries(props.data).slice(0, props.limit).map(([key, value]) => {
                    return <tr className="data-table-row" key={key}>
                        {Object.entries(props.colNames).map(([dkey, col]) => {
                            return <td className="data-table-entry" key={dkey}>{value[col.toString()]}</td>
                        })}
                    </tr>
                    })
                }
                {/* END PRINT DATA */}

                </tbody>
            </table>
    )
    //END RETURN
}
//END COMPONENT DATATABLE
export default DataTable;