/*
    Component renders the currentTransaction state of the containing
    component in its form fields.
*/

//project imports
import * as c from '../resources/constants';
import * as api from '../resources/api';
import { ReactElement, useEffect, useState } from 'react';

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
    key: any;
    id: string;
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
let onFormUpdate: Function;

function AddNewTrans(props: FormProps) {

    /* States */
    const [formValues, setFormValues] = useState<Array<any>>([]);


    /* Functions */
    onFormUpdate = (v: any, i: number) => {
        setFormValues(formValues.map( (val, ind) => {
            return (i==ind) ? v : val;
        }))

        if(props.setFormValues) {
            props.setFormValues(formValues);    //setFormValues for containing component as well
        }
    }


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
                key: i,
                type: props.inputTypes[i].split('-')[0],
                default: v,
                options: props.options ? props.options.get(props.headers[i])
                 : ['none'],
                subtype: props.inputTypes[i].split('-')[1]
            };
                //console.log("Val: %s", data.default);
                //console.log("options: %s", JSON.stringify(props.options));
                return(
                    <td  key={i} id={data.id + '-col'} className={'pt-data-col ' + 
                    'pt-' + data.id + '-tuple'}>
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

function FormElemWrapper(props: FormElemProps) {

    switch(props.type) {

        case 'input':
          return (<InputElem key={props.key} id={props.id}
            subtype={props.subtype as string} default={props.default}
            options={props.options as string[]}
            />);

        case 'select':
                return <DropDownElem key={props.key} id={props.id}
            options={props.options as string[]} default={props.default}/>

        default:
            return <div> Input type '{props.type}' not found, value '{props.default}' </div>
        
    }
}

function DropDownElem(props: DDProps) {

    return(
        <select className='pt-form-field pt-form-select' id={props.id}
    onChange={(e) => {onFormUpdate(e.target.value, props.key)}}
    defaultValue={props.default}>
    </select>)
}

function InputElem(props: InputProps) {
    
    let dropDown: ReactElement = (!!props.options) ? <DropDown data={props.options as string[]}
    styleClass={props.id + 'pt'}
    filterFunction={() => {}}
    /> : <></>;
    return( <> <input className='pt-form-field pt-form-input' id={props.id} 
    type={props.subtype} onChange={(e) => {onFormUpdate(e.target.value, props.key)}}
    defaultValue={props.default}>
    </input>
    {dropDown}
    </>
    )
}