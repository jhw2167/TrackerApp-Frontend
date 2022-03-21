//Project imports
import * as c from '../../resources/constants';

//other imports
import _, { values } from 'underscore';

//CSS
import '../../css/components/subcomponents/DropDown.css'
import * as CSS from 'csstype';
import { useEffect, useState } from "react";


/* Interfaces */
interface DropDownProps {
    data: Array<any>;
    filterFunction: Function;
    styleClass: string
    
}

/* Global constants */

function DropDown(props: DropDownProps ) {

     /* STATES */
    const [extHovCells, setExtHovCells] = useState<Set<any>>(new Set());
    const [hovCells, setHovCells] = useState<Set<any>>(new Set());
    const [deepHovCell, setDeepHovCell] = useState<any>();

    const [data, setData] = useState<any[]>(props.data);
    
    /* EFFECTS */
    /*  For setting hovered cell from outside this component
    we can likely use a state for "hovered option" in our form and pass the number
    of the hovered value into this as a prop
    useEffect( () => {
        if(props.hovCellFunc) {
            props.hovCellFunc((s: Set<any>) => (s: Set<any>) => setExtHovCells(s));
        }
    }
    , [])
    */

    useEffect( () => {
        if(extHovCells) {
            setHovCells(extHovCells);
        }
    }
    , [extHovCells])

    if(!data) {
        //console.log("ret nothing!!! %s: " + props.data.length, props.headers);
        return (<div className="empty-drop-down"> No Options </div>);
    } else {

    return (
        <div className={c.addStyleClass(props.styleClass, 'drop-down-wrapper-div')}>
            <table className={c.addStyleClass(props.styleClass, 'drop-down-table-div')}>
                    <tbody>
                      
                    {/*         Now return data row      */}
                    {data.map( (value: any, index: number) => {
                        let isHov: number = hovCells.has(value) ? 1 : 0;
                        isHov += _.isEqual(deepHovCell, value) ? 1 : 0; //0-no hov, 1-hov, 2-deep hov
                        //console.log("Vals: " + !!props.aggFunction + " : " + index + " : " + (props.limit+1));
    
                        let hovRowStyleClass = (isHov > 0) ? 
                        c.addStyleClass(props.styleClass, 'dd-hov-row') : undefined;
                        
                        return <tr className= {c.addStyleClass(props.styleClass, 'dd-row')
                        + ' ' + hovRowStyleClass}
                                
                        key={index}
                        onMouseEnter={() => {
                            hovCells.add(value);
                            setHovCells(hovCells); 
                            setDeepHovCell(value); }}
    
                        onMouseLeave={() => {
                            hovCells.delete(value);
                            setHovCells(hovCells); 
                            setDeepHovCell(null);}}
                         >
                            {/*         Now return data COLS      */}
                            <td className={c.addStyleClass(props.styleClass, 'dd-col')}>
                                {value}
                            </td>
                        </tr>
                        })}
                    {/* END PRINT DATA */}
    
                    </tbody>
                </table>
    
        </div>
    );
    } // end ELSE
}//End COMPONENT DROP DOWN


export default DropDown;