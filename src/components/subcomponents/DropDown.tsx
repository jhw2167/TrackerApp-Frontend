//Project imports
import * as c from '../../resources/constants';

//other imports
import _, { PairValue, values } from 'underscore';
import * as CSS from 'csstype';
import React, { KeyboardEvent, MutableRefObject,
    ReactElement, useEffect, useRef, useState } from 'react';



/* Interfaces */
interface DropDownProps {
    data: Array<any>;
    charLimit?: number;
    styleClass: string
    hovCellFunc?: Function;
    setSelectedData?: Function; //sets data selected by DD menu to container
    setFuncSetDDPosExternally?: Function;   //takes a "setStateFunction" that sets the state of a 
    /* container with a setState function internally in dropDown, so the dropDownPlace state can
    be adjusted from outside this component */
    afterClick?: (val: string) => void;  //sets drop down items to do something after they are clicked
}

/* Global constants */


function DropDown(props: DropDownProps ) {

     /* STATES */
    const [extHovCells, setExtHovCells] = useState<Set<any>>(new Set());
    const [hovCells, setHovCells] = useState<Set<any>>(new Set());
    const [deepHovCell, setDeepHovCell] = useState<any>();

    const [data, setData] = useState<any[]>(props.data);
    const [selected, setSelected] = useState<any>('');
    const [dropDownPlace, setDropDownPlace] = useState<number>(-1);
    const [dropDownInc, setDropDownInc] = useState<number>(0);

    const parentAfterClick = (props.afterClick) ? props.afterClick : (v: any) => {};

    /* EFFECTS */
     /* For setting hovered cell from outside this component */
    useEffect( () => {
        if(props.hovCellFunc) {
            props.hovCellFunc((s: Set<any>) => (s: Set<any>) => setExtHovCells(s));
        }

        if(props.setFuncSetDDPosExternally) {
            props.setFuncSetDDPosExternally((i: number) => (i: number) => setDropDownInc(i));
        }
    }
    , [])
    

    useEffect( () => {
        if(extHovCells) {
            setHovCells(extHovCells);
        }
    }
    , [extHovCells])


    //Sets selected data from dropDownPlace
    useEffect( () => {
        if(dropDownPlace<0 || dropDownPlace>=data.length) {
            setSelected(''); //default, no value selected spot
        } else {
            setSelected(data.at(dropDownPlace));
        }
    }
    , [dropDownPlace])


    //updates dropDownPlace from externally set increment
    useEffect( () => {

        if(dropDownInc==0) {
            hovCells.clear();
            setDropDownPlace(-1);
        } else if (dropDownInc==Infinity) {
            return;
        }

        let newDDPlace = dropDownInc + dropDownPlace;
       // console.log("inc dd place, %d : start: ", newDDPlace, dropDownPlace )
        if(newDDPlace==dropDownPlace || newDDPlace<0 || newDDPlace==data.length) {
            return; //no relevant value for this position, keep it
        } else {
            hovCells.delete(dropDownPlace)
            hovCells.add(newDDPlace)
            setDropDownPlace(newDDPlace);
        }
        setDropDownInc(Infinity);
    }, [dropDownInc])



    useEffect( () => {
        if(props.setSelectedData)
            props.setSelectedData(selected);
    }, [selected])

    /* Functions */

    //Function that sets dropDownPlace
    const incDropDownPlace = function (i: number): void {
       
    }

    if(!data) {
        //console.log("ret nothing!!! %s: " + props.data.length, props.headers);
        return (<div className="empty-drop-down"> No Options </div>);
    } else {

    return (
        <div className={c.addStyleClass(props.styleClass, 'drop-down-wrapper-div')}>
        <div className={c.addStyleClass(props.styleClass, 'drop-down-nested-wrapper-div')}>
            <table className={c.addStyleClass(props.styleClass, 'drop-down-table')}>
                    <tbody>
                      
                    {/*         Now return data row      */}
                    {data.map( (value: string, index: number) => {
                        let isHov: number = (hovCells.has(value) || hovCells.has(index)) ? 1 : 0;
                        isHov += _.isEqual(deepHovCell, value) ? 1 : 0; //0-no hov, 1-hov, 2-deep hov
                        //console.log("Vals: " + !!props.aggFunction + " : " + index + " : " + (props.limit+1));
                        //hovCells.forEach((v) => console.log("val: " + v) )
                        let hovRowStyleClass = (isHov > 0) ? 
                        c.addStyleClass(props.styleClass, 'dd-hov-row') : '';
                        let displayVal = (props.charLimit && value.length > props.charLimit) ?
                        value.slice(0, props.charLimit) + '...' : value;
                        
                        return <tr className= {c.addStyleClass(props.styleClass, 'dd-row')
                        + ' ' + hovRowStyleClass}
                        onClick={() => {console.log('here');
                            parentAfterClick(value);
                            setDropDownPlace(index)}}
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
                            <td className={c.addStyleClass(props.styleClass, 'dd-col')} >
                                {displayVal}
                            </td>
                        </tr>
                        })}
                    {/* END PRINT DATA */}
    
                    </tbody>
                </table>
        </div>
        </div>
    );
    } // end ELSE
}//End COMPONENT DROP DOWN


export default DropDown;