//PostTransactions.tsx - website interactive page for entering and posting data to the backend server
        // will integrate a connection with Plaid at some point as well

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';
import { any, now } from 'underscore';

//project imports
import * as c from '../resources/constants';
import {DataTuple, Transaction, Summary} from '../resources/constants';
import * as api from '../resources/api';
import DataTable from '../components/DataTable';
import SubTable from '../components/SubTable';
import Header from '../components/Header';
import * as CSS from 'csstype';

import Arrow from '../resources/subcomponents/arrow';
import DoublePlus from '../resources/subcomponents/double_plus';
import AddNewTrans from '../components/AddNewTrans';

//CSS


//Constants
const ROLLOVER_DIV_STYLE: CSS.Properties = {
        ['position' as any]: 'fixed',
        ['width' as any]: '82.5%',
        ['minHeight' as any]: 'unset'
};

const ROLLOVER_BLANK_STYLE: CSS.Properties = {
};

const ROLLOVER_PLCHLD_DIV: CSS.Properties = {
        ['height' as any]: '100%',
        ['opacity' as any]: 0
};

/* Form Constants */
const FORM_HEADERS = {
        tid: 'Transaction ID',
	PURCHDATE: 'Purchase Date', 
	AMT: 'Amount', 
	VEND: 'Vendor', 
	CAT: 'Category',  
	PMETHOD: 'Pay Method',
        BOTFOR: 'Bought For', 
	PSTATUS: 'Pay Status', 
	INCOME: 'Income', 
	REIMB: 'Reimburses',
	POSTDATE: 'Posted Date', 
	NOTES: 'Notes'
}

const FORM_INP_TYPES = {
        tid: 'input-text',
	PURCHDATE: 'input-date', 
	AMT: 'input-text', 
	VEND: 'input-text', 
	CAT: 'input-search',
        PMETHOD: 'input-search', 
	BOTFOR: 'input-search',  
	PSTATUS: 'input-search', 
	INCOME: 'input-checkbox', 
	REIMB: 'input-number',
	POSTDATE: 'input-date', 
	NOTES: 'input-text'
}

function PostTransactions() {

        const ARROW_DIMS = { h: '30px', w: '40px'}

        /* States */
        const [rolloverStyles, setRollOverStyles] = useState<Array<any>>([
                ROLLOVER_BLANK_STYLE, ROLLOVER_BLANK_STYLE, ROLLOVER_BLANK_STYLE
        ]);

        const [mouseWheelScrollDist, setMouseWheelScrollDist] = useState<number>(0);

        //data states
                const DEF_FORM_VALS = [
                        "",     //trans id
                        (new Date(now())).toISOString().split("T")[0],     //Purchased Date
                        "",     //amount
                        "",     //vendor
                        "",     //category
                        "",     //PayMethod
                        "",     //BoughtFor
                        "",     //PayStatus
                        false,     //Income
                        "",     //Reimburses
                        (new Date(now())).toISOString().split("T")[0],     //Posted Date
                        ""     //Notes
                ]
                const [formValues, setFormValues] = useState<any[]>(DEF_FORM_VALS);
                const [formOptions, setFormOptions] = useState<Map<string, Array<any>>>(new Map());  //drop down options for form

        //Stylistic states
                const [grayedValues, setGrayedValues] = useState<Array<Boolean>>([]);

        /* Effects */
        const updateWheelPos = () => {
           let wheelPos: number = document.querySelector("#transactions-content-row")?.scrollTop as unknown as number;
            //console.log("------------------\nStarting pos: " + wheelPos);

            let topLeft: any = (document.querySelector('.main-scrollable-content-row') as HTMLDivElement).getBoundingClientRect();
            topLeft = {t: topLeft.top, l: topLeft.left};

            let h: any =  window.getComputedStyle(document.querySelector('.rollover-row-spacer') as Element).height;
            h = Number((h as string).split('p')[0]);
            //console.log(wheelPos + "  " + h );
            let newStyles = rolloverStyles.map( (v, i) => {
                //console.log("wheelPos+100: %d, i*Number(h): %d,  i: %d", wheelPos+mouseWheelScrollDist, i*Number(h), i);
                let toRet = ROLLOVER_BLANK_STYLE;
                if(h) {
                    toRet = (wheelPos+mouseWheelScrollDist >= i*Number(h)) ? {...ROLLOVER_DIV_STYLE,
                            ['top' as any]: topLeft.t, ['left' as any]: topLeft.l }
                                    : ROLLOVER_BLANK_STYLE;
                }
                //console.log("Returning: " + JSON.stringify(toRet));
                 return toRet;
        });
            setRollOverStyles(newStyles);
            //console.log("NewStyles: " + JSON.stringify(newStyles));
        };

        useEffect( () => {
                window.addEventListener("wheel", updateWheelPos);
        }, []);


        /* Api Calls */
        let map: Map<string, Array<any>> = new Map;
        const getOptions = async function name() {

                const getSetData = (header: string) => {
                        return (data: Array<string>) => {
                                map.set(header, data);
                        }
                }

                let [A, B, C, D, E] = await Promise.all([
                //GET Options for
                //Category
                api.getRequest(api.SERVER_ALL_CATEGORIES, getSetData(FORM_HEADERS.CAT)),        

                //Pay Method
                api.getRequest(api.SERVER_ALL_PAYMETHODS, getSetData(FORM_HEADERS.PMETHOD)),

                //Pay Status
                api.getRequest(api.SERVER_ALL_PAYSTATUS, getSetData(FORM_HEADERS.PSTATUS)),

                //Bought For
                api.getRequest(api.SERVER_ALL_BOUGHTFOR, getSetData(FORM_HEADERS.BOTFOR)),

                //Vendor (?) dyn search box?
                api.getRequest(api.SERVER_ALL_VENDORS, getSetData(FORM_HEADERS.VEND))

                ]);// END PROMISE.ALL
        }       

        useEffect( () => {
                
                let makeApiCall = (async () => {
                        await getOptions();

                        let vendorObjectArr: Array<c.Vendor> = map.get(FORM_HEADERS.VEND) as Array<c.Vendor>;
                        map.set(FORM_HEADERS.VEND, vendorObjectArr?.map( (value: c.Vendor, key) => {
                                return value.vendor;
                        }  ));
        
                        setFormOptions(map);
                        console.log("In form options: " );
                        formOptions.forEach( (val, key) => {
                                console.log(key + ": " + val.length)
                        })
                })
                makeApiCall();
               
        }, []);

        return (

        <div className='row outer-row' id='pt-outer-row'>
        <div className='col rev-side-anim side-anim'></div>

        <div className='col-10 no-padding' id='post-trans-center-col'>
          {/* HEADER */}
                <Header/>
        {/*---------------*/}

        <main className="center-div align-items-center" id='post-trans-main-content'>
                <div className="row  content-row">
                <div className='col-12'>


                {/*ADD NEW TRANS*/}
                <div className='row content-row' id='add-new-transaction'>
                <div className='col-12 content-col'>

                  <div className='row content-row section-title-row no-internal-flex'>
                     <div className='col post-trans-subsec-title-item section-title'
                        id="add-new-trans-title">
                        Add New
                     </div>
                        <div className='col post-trans-plus post-trans-subsec-title-item
                        post-trans-hoverable' id='add-new-trans-button'>
                                 <div>+</div> 
                        </div>
                        <div className='col post-trans-subsec-title-item post-trans-arrow-outer-div'> 
                        <div><Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                        styleClass='post-trans-hoverable post-trans-arrow'/> </div>
                        </div>
                  </div> 
                  {/* End row section header content */} 
                        
                   <div className='row pt-bordered-section' id="transaction-form-div">
                        <div className='col-12' id='transaction-form-container'>
                                <AddNewTrans headers={Object.entries(FORM_HEADERS).map(
                                        ([key, val]) => {return val;}
                                )}
                                 inputTypes={Object.entries(FORM_INP_TYPES).map(
                                        ([key, val]) => {return val;}
                                 )}
                                 id='pt-add-new-trans-form'
                                 data={formValues}
                                 setFormValues={setFormValues}
                                options={formOptions}
                                />  
                        </div>
                   </div>
                   {/* End row section component content */} 

                   <div className='row content-row section-footer-row no-internal-flex'>
                        <div className='col post-trans-double-plus post-trans-subsec-footer-item
                        post-trans-hoverable'>
                                 <div> <DoublePlus
                                 styleClass='post-trans-hoverable post-trans-double-plus' /> </div> 
                        </div>
                        <div className='col post-trans-subsec-footer-item post-trans-arrow-outer-div'> 
                        <div><Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                          styleClass='post-trans-hoverable post-trans-arrow'/> </div>
                        </div>
                  </div>
                {/* End row section footer content */} 
                
                </div>                        
                </div>
                {/*--------------------------*/}
                {/*-------END ADD NEW--------*/}
                {/*--------------------------*/}


                <div className='row main-scrollable-content-row scrollable-row'
                        id='transactions-content-row' onWheel={(e) => setMouseWheelScrollDist(e.deltaY+10)}>
                <div className='col-12 main-scrollable-content-col'>

                {/*Pending Transactions*/}
                <div className='row content-row rollover-row' id='pt-pending-transactions'
                style={rolloverStyles[0]}>
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Pending
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row pt-bordered-section pt-table-section' id="transaction-form-div">
                                <div className='col-12'>
                                {/* Component goes here */} <div className='scroll-sample'></div>               
                                </div>
                        </div>
                {/* End row section component content */} 

                        <div className='row content-row section-footer-row no-internal-flex'>
                                <div className='col post-trans-double-plus post-trans-subsec-footer-item
                                post-trans-hoverable'>
                                  <div> <DoublePlus 
                                        styleClass='post-trans-hoverable post-trans-double-plus' /> 
                                  </div> 
                                </div>

                                <div className='col post-trans-subsec-footer-item post-trans-arrow-outer-div'> 
                                  <div><Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                                        styleClass='post-trans-hoverable post-trans-arrow'/> 
                                  </div>
                                </div>
                        </div>
                {/* End row section footer content */} 

                </div>
                </div>
                {/*--------------------------*/}
                {/*-------END PENDING--------*/}
                {/*--------------------------*/}
                <div className='row rollover-row-spacer'> </div>


                {/*Prepared Transactions*/}

                <div className='row content-row rollover-row' id='pt-prepared-transactions'
                        style={rolloverStyles[1]}>
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Prepared
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row pt-bordered-section pt-table-section' id="transaction-form-div">
                                <div className='col-12'>
                                {/* Component goes here */} <div className='scroll-sample'></div>               
                                </div>
                        </div>
                {/* End row section component content */} 

                        <div className='row content-row section-footer-row no-internal-flex'>
                                <div className='col post-trans-double-plus post-trans-subsec-footer-item
                                post-trans-hoverable'>
                                  <div> <DoublePlus 
                                        styleClass='post-trans-hoverable post-trans-double-plus' /> 
                                  </div> 
                                </div>

                                <div className='col post-trans-subsec-footer-item post-trans-arrow-outer-div'> 
                                  <div><Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                                        styleClass='post-trans-hoverable post-trans-arrow'/> 
                                  </div>
                                </div>
                        </div>
                {/* End row section footer content */} 

                </div>
                </div>
                {/*--------------------------*/}
                {/*-------END PREPARED-------*/}
                {/*--------------------------*/}

                <div className='row rollover-row-spacer'> <div className='rollover-row-ptr-allow'></div> </div>
                

                        {/*Posted Transactions*/}
                <div className='row content-row rollover-row' id='pt-posted-transactions'
                        style={rolloverStyles[2]}>
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Posted
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row pt-bordered-section pt-table-section' id="transaction-form-div">
                                <div className='col-12'>
                                {/* Component goes here */} <div className='scroll-sample'></div>               
                                </div>
                        </div>
                {/* End row section component content */} 

                        <div className='row content-row section-footer-row no-internal-flex'>
                                <div className='col post-trans-double-plus post-trans-subsec-footer-item
                                post-trans-hoverable'>
                                  <div> <DoublePlus 
                                        styleClass='post-trans-hoverable post-trans-double-plus' /> 
                                  </div> 
                                </div>

                                <div className='col post-trans-subsec-footer-item post-trans-arrow-outer-div'> 
                                  <div><Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                                        styleClass='post-trans-hoverable post-trans-arrow'/> 
                                  </div>
                                </div>
                        </div>
                {/* End row section footer content */} 

                </div>
                </div>
                {/*--------------------------*/}
                {/*-------END POSTED--------*/}
                {/*--------------------------*/}

                <div className='row rollover-row-spacer'> </div>

                </div>
                </div>
                {/* END MAIN SCROLLABLE ROW*/}

                <div className='row post-trans-tab-down-arrow'>
                <div className='col-12 justify-contents-center'>
                        <div className='sample'> ^ </div>
                </div>
                </div>


                </div>
                </div>
                {/* END MAIN CONTENT ROW*/}

        </main>
        </div> 
        {/*END MAIN CONTENT DIV*/}

        <div className='col for-side-anim side-anim'></div>
        </div>  
        /* END OUTER ROW*/
)

}

export default PostTransactions;