/*
    Component renders the currentTransaction state of the containing
    component in its form fields.
*/

import * as CSS from 'csstype';

//project imports
import * as c from '../resources/constants';
import * as api from '../resources/api';
import React, { KeyboardEvent, MutableRefObject,
     ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import { StringMappingType } from 'typescript';
     import { DropDown } from './subcomponents/DropDown';
import { table } from 'console';


     /* Definitions */
interface FormProps {
    headers: string[];
    data?: Array<any>;
    setFormValuesRef?: (ref: React.MutableRefObject<Array<any>>) => void;
    onFormSubmit?: ((fields: React.MutableRefObject<Array<any>>) => void);
    formRef: RefObject<HTMLFormElement>;
    fieldValidation: Array<((field: string) => boolean)>;
    inputTypes: string[];
    options?: Map<string, Array<any>>;  //maps headers[i] to its options
    id: string;
    styleNamespace?: string;     //short string that namespaces all classes
}


interface BaseInput {
    id: string;
    index: number;
    style?: CSS.Properties;
    default?: string;
    options?: string[];
}

interface DDProps extends BaseInput {
}

interface InputProps extends BaseInput {
    //holds reference to immediate parent element
    subtype: string;
    parentRef?: React.MutableRefObject<HTMLElement | null>;
}

interface FormElemProps extends BaseInput {
    type: string;
    subtype?: string;
    parentRef?: React.MutableRefObject<HTMLElement | null>;
}

/* Global consts */
let wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
let formValues: React.MutableRefObject<Array<any>>;
let formValueStates: React.MutableRefObject<Array<any>>;
let activeFields: React.MutableRefObject<Set<any>>;

let selectedFormField: React.MutableRefObject<number>;
let onFormUpdate: Function;

let filterableDDOptions: React.MutableRefObject<Map<string, Array<string>>>
let globalHeaders: Array<string>;
let usingDropDown: React.MutableRefObject<boolean>;

let _setDDPosExternally: Function;
let _setFuncSetDDPosExternally: Function;

let forceUpdate: Function;
let sc: string = '';

const FORM_STATES = {
    cmpt: 'COMPLETE',
    vis: 'VISITED',
    unvis: 'UNVISITED',
    err: 'ERROR'
}

let chat = (v: any) => {    //eslint-disable-line @typescript-eslint/no-unused-vars
    console.log(v);
}

function AddNewTrans(props: FormProps) {

    /* Refs */
    //Make a ref that holds an array of Mutable Ref objects
    wrapperRef = useRef<HTMLDivElement>(null);

    /* States */
    formValues = useRef<Array<any>>(Array.from (props.headers.map(() => {return ''})));
    formValueStates = useRef<Array<string>>(Array.from (props.headers.map(() => {return FORM_STATES.unvis})));
        //Fields can be VISITED, UNVISTED, COMPLETE, ERROR
    activeFields = useRef<Set<any>>(new Set());
    selectedFormField = useRef<number>(-1);
    usingDropDown = useRef<boolean>(false);
    filterableDDOptions = 
        useRef<Map<string, Array<string>>>((props.options) ? props.options : new Map());

    
    [sc] = useState<string>( (props.styleNamespace) ? props.styleNamespace+' ' : '');
    const [, updateState] = React.useState<Object>();
    forceUpdate = React.useCallback(() => updateState({}), []);
    
    [_setDDPosExternally, _setFuncSetDDPosExternally] = useState<Function>((i: number) => (i: number) => {return;});

    /* Functions */
    onFormUpdate = (v: any, i: number) => {
        formValues.current.forEach( (val, ind, arr) => {
            arr[ind] = (ind===i) ? v : val;
        });
        forceUpdate();  //forces component updated each time form is changed
    }

    let onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let validFields = formValues.current.map( (v, i) => {
            return props.fieldValidation[i](v);
        })

        if(validFields.every((v) => {return v;})) {
            if(props.onFormSubmit) props.onFormSubmit(formValues);
            formValues.current.forEach( (v: any) => console.log(v));
        }
        //some fields may have errors, lets demarcate them
        formValueStates.current = validFields.map( (v, i) => {
            return (v) ? FORM_STATES.cmpt : FORM_STATES.err;
        })
        forceUpdate();  //forces component updated each time form submit is attempted
    }


    /* Effects */
    useEffect(() => {
        if(!props.data) {
            //nothing
        } else if (props.data.length >= props.headers.length) {
            formValues.current = props.data.map( (v, i) => {
                formValueStates.current[i] = (v==='') ? FORM_STATES.unvis : FORM_STATES.vis;
                return v;
            });
        }

        if(props.setFormValuesRef) {
            props.setFormValuesRef(formValues);    //setFormValues for containing component as well
        }

        globalHeaders = props.headers;

    }, [])



   return (
       <div ref={wrapperRef} className={props.id + "-wrapper-div"} id={props.id + '-div'}>
        <form ref={props.formRef} id={props.id} onSubmit={onFormSubmit}>
            <table className={props.id + "-wrapper-table"} id={props.id + "-wrapper-table"}>
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
                  //console.log("Val: %s : ValState: %s \n -----------------",
                   //props.headers[i], formValueStates.current[i]);
                    //console.log("options: %s", JSON.stringify(props.options));
                    let stateClass = sc + 'data-col-' + formValueStates.current[i].toLowerCase()
                    return(
                        <td  key={i} id={data.id + '-col'} className={sc + 'data-col ' + 
                        sc + data.id + '-tuple ' + stateClass}>
                        {FormElemWrapper(data)}
                        </td>
                    )
            })}</tr>
            
            <tr>
                {props.headers.map( (v, i) => {
                let id = v.replace(' ', '-').toLowerCase();

                let errSt = formValueStates.current[i].toLowerCase();
                let baseClass = sc + 'data-header ' + sc + ' ' + id + '-tuple ';
                let stateClass = sc + 'data-header-' + errSt;
                 return (<th key={i} className={baseClass + stateClass}
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
            <select className={sc + 'form-field form-select'} 
            id={props.id}
            onChange={(e) => {onFormUpdate(e.target.value, props.index)}}
            defaultValue={props.default}>
            
        </select>)
    }
    
    function InputElem(props: InputProps) {

        let inputRef = useRef<HTMLInputElement>(null);

        let handleDropDownFilter = () => {
            if(props.options && !usingDropDown.current && filterableDDOptions.current) 
            {
            //console.log("ERROR LINES");
            //console.log(filterableDDOptions);
            //console.log(filterableDDOptions.current);
            //console.log(globalHeaders);
            //console.log(props.index);
            //console.log('-------------------');
            filterableDDOptions.current.set(globalHeaders[props.index],
                props.options.filter( (str: string) => {
                    return (currentFieldVal.length > 0) ? 
                    str.slice(0, currentFieldVal.length).toLowerCase().includes(currentFieldVal.toLowerCase())
                    : true;
                }));
            }
        }

        //updates when drop down menu displays
        let handleActiveFieldsOnChange = (activeFields) ? (fieldVal: string) => {
            activeFields.current.add(props.index)
            if(fieldVal.length===0)
                activeFields?.current.delete(props.index);
        } : () => {};

        //updates which dropDown cell is hovered by arrow keys
        let handleArrowsOnDropDown = (e: KeyboardEvent) => {
            selectedFormField.current=props.index;
            usingDropDown.current=true;
            if(e.key==='ArrowDown') {
                _setDDPosExternally(1);
                //scroll.scrollMore(-100);
            } else if (e.key==='ArrowUp'){
                _setDDPosExternally(-1);
                //scroll.scrollMore(100);
            } else {
                usingDropDown.current=false;
            }
        };

        let currentFieldVal: any = (formValues) ? formValues.current.at(props.index) : 
                                ((props.default) ? props.default : '');

        let setSelectedData = (val: c.LinkedText) => {
            console.log("Setting selected data: %s %s", val.text, props.index);

            if(!val.text || val.text.length===0)
                return; //dont reset the val
            
            onFormUpdate(val.text, props.index)
        }

        let handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            handleActiveFieldsOnChange(e.target.value);

            //handle filter update on change
           handleDropDownFilter();
           usingDropDown.current=false;
            if(formValueStates) 
                formValueStates.current[props.index] = FORM_STATES.vis;
            let newVal = (props.subtype=='checkbox') ? e.target.checked : e.target.value;
            onFormUpdate(newVal, props.index)
        }

        let handleOnFocus = () => {
            selectedFormField.current = props.index;
            if(formValueStates) formValueStates.current[props.index] = FORM_STATES.vis;
            onFormUpdate('', -1);
        }

        let buildInlineStyles = () => {
            let style = {};

            if( wrapperRef.current ) 
            {
                //React query the dom for the column width by id of column
                let rect = document.getElementById(props.id + '-col')?.getBoundingClientRect();
                if(rect)
                    style = { width: rect.width + 'px' }
            }
            return style;
        }


        //Custom searchable DropDown menu conditionally rendered depending on if options are provided
        let dropDown: ReactElement = <></>;
        if(props.options && !(typeof(selectedFormField)=='undefined')) {
            if (selectedFormField.current===props.index) {
            handleDropDownFilter();
            let options: Array<string> = (filterableDDOptions.current) ? 
            filterableDDOptions.current.get(globalHeaders[props.index]) as string[] : [];

            dropDown = <DropDown 
            key={props.id+ '-' + options.length}  /* we can force child to update each time key changes */
            data={options.map((v: string) => {return {text: v}})}
            charLimit={12}
            styleClass={'dd-' + props.id + ' pt'}
            inlineStyles={ buildInlineStyles() }
            setSelectedData = {setSelectedData}
            setFuncSetDDPosExternally = {_setFuncSetDDPosExternally}
            afterClick = { (v: c.LinkedText) => {selectedFormField.current=-1; setSelectedData(v); forceUpdate(); }}
            animCellHeight={35}
            />}
        }

        return( <> <input className={sc + 'form-field ' + 'form-input'} id={props.id} 
        type={props.subtype}
        value={currentFieldVal}
        ref={inputRef}
        checked={(props.subtype=='checkbox') ? (currentFieldVal as boolean) : undefined}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={ () => {if(activeFields) activeFields.current.delete(props.index)
            onFormUpdate('', -1);}} //just to trigger state update
        onKeyDown={(e) => { handleArrowsOnDropDown(e)}}
        >
        </input>
        {dropDown}
        </>
        )
    }