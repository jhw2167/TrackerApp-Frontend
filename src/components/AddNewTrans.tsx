/*
    Component renders the currentTransaction state of the containing
    component in its form fields.
*/

//project imports
import * as c from '../resources/constants';
import * as api from '../resources/api';
import React, { KeyboardEvent, MutableRefObject,
     ReactElement, RefObject, useEffect, useRef, useState } from 'react';
     import DropDown from './subcomponents/DropDown';
import { isParameterPropertyDeclaration, JsxChild } from 'typescript';


interface FormProps {
    headers: string[];
    data?: Array<any>;
    setFormValues?: ((fields: Array<any>) => void);
    onFormSubmit: ((fields: Array<any>) => void);
    formRef: RefObject<HTMLFormElement>;
    fieldValidation: Array<((field: string) => boolean)>;
    inputTypes: string[];
    options?: Map<string, Array<any>>;  //maps headers[i] to its options
    id: string;
}

interface BaseInput {
    id: string;
    index: number;
    default?: string;
    options?: string[];
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
let globalFormValues: React.MutableRefObject<Array<any>>;
let globalActiveFields: React.MutableRefObject<Set<any>>;

let selectedFormField: React.MutableRefObject<number>;
let onFormUpdate: Function;

let _setDDPosExternally: Function;
let _setFuncSetDDPosExternally: Function;

let chat = (v: any) => {
    console.log(v);
}

function AddNewTrans(props: FormProps) {

    /* States */
    const formValues = useRef<Array<any>>(Array.from (props.headers.map(() => {return ''})));
    const formValueStates = useRef<Array<string>>(Array.from (props.headers.map(() => {return ''})));
        //Fields can be VISITED, UNVISTED, COMPLETE, ERROR
    const activeFields = useRef<Set<any>>(new Set());
    const selectedField = useRef<number>(-1);
    //const formRef = useRef<HTMLFormElement>(null);
    
    [_setDDPosExternally, _setFuncSetDDPosExternally] = useState<Function>((i: number) => (i: number) => {return;});

    /* Functions */
    onFormUpdate = (v: any, i: number) => {
        formValues.current = formValues.current.map( (val, ind) => {
            return (i==ind) ? v : val;
        })

        if(props.setFormValues) {
            props.setFormValues(formValues.current);    //setFormValues for containing component as well
        }
    }

    let onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('insideOnFormSubmit');

        let validFields = formValues.current.map( (v, i) => {
            return props.fieldValidation[i](v);
        })

        if(validFields.every((v) => {return v;})) {
            props.onFormSubmit(formValues.current);
        }
        else {  //some fields have errors, lets demarcate them
            formValueStates.current = validFields.map( (v, i) => {
                return (v) ? formValueStates.current[i] : 'ERROR';
            })
        }
        //End if-else

        console.log('End form submit-addNewTrans method');
    }

    /* Effects */
    useEffect(() => {
        if(!props.data) {
            //nothing
        } else if (props.data.length >= props.headers.length) {
            formValues.current = props.data;
            if(props.setFormValues)
                props.setFormValues(formValues.current)
        }

        
        globalFormValues=formValues;
        //chat(formValues.current + ".");
        globalActiveFields = activeFields;
        selectedFormField = selectedField;

    }, [])



   return (
       <div className="add-new-trans-wrapper-div" id={props.id + '-div'}>
        <form ref={props.formRef} id={props.id} onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit(e);}}>
            <table id="add-new-trans-wrapper-table">
                <tbody>
                <tr>{
            formValues.current.map(  (v,i) => {
                let typeArr = props.inputTypes[i].split('-');
                const  data: FormElemProps = { 
                    id: props.headers[i].replace(' ', '-').toLowerCase(),
                    index: i,
                    type: typeArr[0],
                    default: v,
                    options: props.options ? props.options.get(props.headers[i])
                     : ['none'],
                    subtype: typeArr[1]
                }
                  //console.log("Val: %s", data.default);
                    //console.log("options: %s", JSON.stringify(props.options));
                    return(
                        <td  key={i} id={data.id + '-col'} className={'pt-data-col ' + 
                        'pt-' + data.id + '-tuple'}>
                        {FormElemWrapper(data)}
                        </td>
                    )
            })}</tr>
            
            <tr>
                {props.headers.map( (v, i) => {
                let id = v.replace(' ', '-').toLowerCase();
                 return (<th key={i} className={'pt-data-header ' + 'pt-' + id + '-tuple'}
                 id={id +'-header'}>
                     <label id={'lb-' + id} htmlFor={id}>{v}
                     </label>
                     </th>)})}
            </tr>

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


        //updates when drop down menu displays
        let handleActiveFieldsOnChange = (globalActiveFields) ? (fieldVal: string) => {
            globalActiveFields.current.add(props.index)
            if(fieldVal.length==0)
                globalActiveFields?.current.delete(props.index);
        } : () => {};

        //updates which dropDown cell is hovered by arrow keys
        let handleArrowsOnDropDown = (e: KeyboardEvent) => {
            if(e.key=='ArrowDown') {
                _setDDPosExternally(1);
            } else if (e.key=='ArrowUp'){
                _setDDPosExternally(-1);
            }
        };

        let currentFieldVal: string = (globalFormValues) ? globalFormValues.current.at(props.index) : 
                                ((props.default) ? props.default : '');

        let setSelectedData = (val: any) => {
            if(currentFieldVal.length > 0 && val.length==0)
                return; //dont reset the val
            onFormUpdate(val, props.index)
        }

        //Custom searchable DropDown menu conditionally rendered depending on if options are provided
        let dropDown: ReactElement = (!!props.options && (selectedFormField.current) && 
        (selectedFormField.current==props.index)) ?
         <DropDown data={props.options as string[]}
        styleClass={'dd-' + props.id + ' pt'}
        filterFunction={() => {}}
        setSelectedData = {(val: any) => setSelectedData(val)}
        setFuncSetDDPosExternally = {_setFuncSetDDPosExternally}
        /> : <></>;

        //console.log("val: " + globalFormValues.current.at(props.index))

        return( <> <input className='pt-form-field pt-form-input' id={props.id} 
        type={props.subtype}
        value={currentFieldVal}
        onChange={(e) => { handleActiveFieldsOnChange(e.target.value)
            onFormUpdate(e.target.value, props.index)}
        }
        onFocus={() => {selectedFormField.current = props.index; onFormUpdate('', -1);}}
        onBlur={ () => {if(globalActiveFields) globalActiveFields.current.delete(props.index)
            onFormUpdate('', -1);}} //just to trigger state update
        onKeyDown={(e) => handleArrowsOnDropDown(e)}
       
        >
        </input>
        {dropDown}
        </>
        )
    }