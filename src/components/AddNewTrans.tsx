/*
    Component renders the currentTransaction state of the containing
    component in its form fields.
*/

//project imports
import * as c from '../resources/constants';
import * as api from '../resources/api';
import React, { KeyboardEvent, MutableRefObject,
     ReactElement, useEffect, useRef, useState } from 'react';

//CSS Imports
import '../css/components/AddNewTrans.css'
import DropDown from './subcomponents/DropDown';
import { JsxChild } from 'typescript';

interface FormProps {
    headers: string[];
    data?: Array<any>;
    setFormValues?: Function;
    inputTypes: string[];
    options?: Map<string, Array<any>>;  //maps headers[i] to its options
    id: string;
}

interface BaseInput {
    id: string;
    index: number;
    default?: string;
    options?: string[];
    activeFields?: MutableRefObject<Set<any>>;
}

interface DDProps extends BaseInput {
}

interface InputProps extends BaseInput {
    subtype: string;
}

interface FormElemProps extends BaseInput {
    type: string;
    subtype?: string;
}

//id, "for" = headers, replace ' ' with '-'

/* Form input types to handle:

<input>
    - text
<label>
<select>
    <option, label>
<textarea>
<button>
<fieldset>
<legend>
<datalist>
<output>
<option>
<optgroup>

*/

/* Global consts */
let onFormUpdate: Function;
let setDropDownPlaceOnArrow: Function;

function AddNewTrans(props: FormProps) {

    /* States */
    const [formValues, setFormValues] = useState<Array<any>>([]);
    const activeFields = useRef<Set<any>>(new Set());
    const [dropDownPlace, setDropDownPlace] = useState<number>(-1);

    /* Functions */
    onFormUpdate = (v: any, i: number) => {
        setFormValues(formValues.map( (val, ind) => {
            return (i==ind) ? v : val;
        }))

        if(props.setFormValues) {
            props.setFormValues(formValues);    //setFormValues for containing component as well
        }
    }

    setDropDownPlaceOnArrow = (inc: number, max: number) => {
        if(inc==0) {
            setDropDownPlace(-1); //default, no value selected spot
        } else {
            setDropDownPlace(Math.min(Math.max(dropDownPlace+inc, 0), max));
        }
    };


    /* Effects */
    useEffect(() => {
        if(props.data) {
            setFormValues(props.data)
        } else {
            setFormValues(props.headers.map(() => {return ''}))
        }

    }, [])

   return (
       <div className="add-new-trans-wrapper-div" id={props.id + '-div'}>
        <form id={props.id}>
            <table id="add-new-trans-wrapper-table">
                <tbody>
                <tr>
                {
            formValues.map(  (v,i) => {
                const  data: FormElemProps = { 
                id: props.headers[i].replace(' ', '-').toLowerCase(),
                index: i,
                type: props.inputTypes[i].split('-')[0],
                default: v,
                options: props.options ? props.options.get(props.headers[i])
                 : ['none'],
                subtype: props.inputTypes[i].split('-')[1],
                activeFields: activeFields
            };
                //console.log("Val: %s", data.default);
                //console.log("options: %s", JSON.stringify(props.options));
                return(
                    <td  key={i} id={data.id + '-col'} className={'pt-data-col ' + 
                    'pt-' + data.id + '-tuple'}    
                    >
                        {FormElemWrapper(data)}
                    </td>
                )
               
            })}
            </tr>
            <tr> {props.headers.map( (v, i) => {
                let id = v.replace(' ', '-').toLowerCase();
                 return <th key={i} className={'pt-data-header ' + 'pt-' + id + '-tuple'}
                   id={id +'-header'}><label id={'lb-' + id} htmlFor={id}>
                     {v}</label></th>})} </tr>
                </tbody>
            </table>
         </form>
       </div>
   )
}

//Functions

export default AddNewTrans;

    /* Subcomponents */
    function FormElemWrapper(props: FormElemProps) {

        switch(props.type) {
    
            case 'input':
              return (<InputElem index={props.index} id={props.id}
                subtype={props.subtype as string} default={props.default}
                activeFields={props.activeFields}
                options={props.options as string[]}
                />);
    
            case 'select':
                    return <DropDownElem index={props.index} id={props.id}
                options={props.options as string[]} default={props.default}/>
    
            default:
                return <div> Input type '{props.type}' not found, value '{props.default}' </div>
            
        }
    }
    
    function DropDownElem(props: DDProps) {
    
        return(
            <select className='pt-form-field pt-form-select' id={props.id}
        onChange={(e) => {onFormUpdate(e.target.value, props.index)}}
        defaultValue={props.default}>
        </select>)
    }
    
    function InputElem(props: InputProps) {
        
        //Custom searchable DropDown menu conditionally rendered depending on if options are provided
        let dropDown: ReactElement = (!!props.options && props.activeFields && 
            props.activeFields.current.has(props.index)) ?
         <DropDown data={props.options as string[]}
        styleClass={'dd-' + props.id + ' pt'}
        filterFunction={() => {}}
        /> : <></>;

        //updates when drop down menu displays
        let handleActiveFieldsOnChange = (props.activeFields) ? (fieldVal: string) => {
            props.activeFields?.current.add(props.index)
            if(fieldVal.length==0)
                props.activeFields?.current.delete(props.index);
        } : () => {};

        //updates which dropDown cell is hovered by arrow keys
        let handleArrowsOnDropDown = (props.options) ? (e: KeyboardEvent) => {
            if(e.key=='ArrowDown') {
                setDropDownPlaceOnArrow(1, props.options?.length);
            } else if (e.key=='Arrowup'){
                setDropDownPlaceOnArrow(-1, props.options?.length);
            }
        } : () => {};

        return( <> <input className='pt-form-field pt-form-input' id={props.id} 
        type={props.subtype} 
        onChange={(e) => { handleActiveFieldsOnChange(e.target.value)
            onFormUpdate(e.target.value, props.index)}
        }
        onBlur={ () => {if(props.activeFields) props.activeFields?.current.delete(props.index)
            onFormUpdate('', -1); //just to trigger state update
        }}
        onKeyDown={ (e: KeyboardEvent) => handleArrowsOnDropDown(e)}
        defaultValue={props.default}>
        </input>
        {dropDown}
        </>
        )
    }