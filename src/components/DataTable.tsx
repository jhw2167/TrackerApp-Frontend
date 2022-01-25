import { CpuInfo } from "os";


//Define interface for props type
interface DataTableProps {
    headers: String[];
    colNames: String[];
    data: Array<any>;
}

function DataTable(props: DataTableProps) {

    //headers:Array<String>, data:Array<any>, cols:Array<String>

    return (
            <table className="data-table">
                <tbody>

                {/* Table Header */}
                <tr className="data-table-header">{
                    Object.entries(props.headers).map(([key, value]) => {
                    return  <th key={key}>{value}</th>})
                }</tr>

                {/* Now return data columns */}
                {Object.entries(props.data).map(([key, value]) => {
                    <tr>
                        {console.log(value)};
                        {Object.entries(props.colNames).map(([key, col]) => {
                            return <td>Hi{/*JSON.stringify(value)*/}</td>
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