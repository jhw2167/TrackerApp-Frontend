/*
    Component renders the currentTransaction state of the containing
    component in its form fields.
*/

//project imports
import * as c from '../resources/constants';
import {DataTuple, Transaction, Summary} from '../resources/constants';
import * as api from '../resources/api';
import { useEffect, useState } from 'react';
import { DiscreteColorLegendProps } from 'react-vis';

//CSS Imports
import '../css/components/AddNewTrans.css'

interface FormProps {
    headers: string[];
    data?: Array<any>;
    inputTypes: string[];
    options?: Array<Array<any>>;
    id: string;
}

interface BaseInput {
    key: any;
    id: string;
    default?: string;
}

interface DDProps extends BaseInput {
    options: string[];
    
}

interface InputProps extends BaseInput {
    subtype: string;
}

interface FormElemProps extends BaseInput {
    type: string;
    options?: string[];
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
                <tr>
                {
            formValues.map(  (v,i) => {
                const  data: FormElemProps = { 
                id: props.headers[i].replace(' ', '-').toLowerCase(),
                key: i,
                type: props.inputTypes[i].split('-')[0],
                default: v,
                options: props.options ? props.options[i] : ['none'],
                subtype: props.inputTypes[i].split('-')[1]
            };
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
            subtype={props.subtype as string} default={props.default}/>);

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
    return( <input className='pt-form-field pt-form-Input' id={props.id} 
    type={props.subtype} onChange={(e) => {onFormUpdate(e.target.value, props.key)}}
    defaultValue={props.default}>
    </input>)
}