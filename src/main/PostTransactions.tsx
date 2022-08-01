//PostTransactions.tsx - website interactive page for entering and posting data to the backend server
        // will integrate a connection with Plaid at some point as well

//react imports
import React, { useState, useEffect, useRef } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';
import {contains, now } from 'underscore';

//project imports
import * as c from '../resources/constants';
import {Transaction, Vendor, PlaidTransaction} from '../resources/constants';
import * as api from '../resources/api';
//import DataTable from '../components/DataTable';
//import SubTable from '../components/SubTable';
import Header from '../components/Header';
import * as CSS from 'csstype';

import Arrow from '../resources/subcomponents/arrow';
import DoublePlus from '../resources/subcomponents/double_plus';
import AddNewTrans from '../components/AddNewTrans';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import PTSectionFooter from '../components/narrowcomponents/PTSectionFooter';
import GeneralTable, { ColStyle } from '../components/GeneralTable';
import { ContinuousColorLegend } from 'react-vis';

//CSS
//fgdfgdfgf

//Constants
const ROLLOVER_DIV_FIXED_STYLE: CSS.Properties = {
        ['position' as any]: 'fixed',
        ['width' as any]: '82.5%',
        ['minWidth' as any]: '1390px',
        ['minHeight' as any]: 'unset',
        ['pointerEvents' as any]: 'all',
};

const ROLLOVER_BLANK_STYLE: CSS.Properties = {
};

        //For Tables
        const HOV_ROW_STYLE: CSS.Properties = {
        ["border" as any]: 'solid 2px var(--primary-col)',
        ["lineHeight" as any]: '2em'
        };
    
        const HOV_COL_STYLE: CSS.Properties = {
                ["fontWeight" as any]: 500,
                ["fontSize" as any]: 18,
                ["border" as any]: 'solid 3px var(--tert-col)',
                ["lineHeight" as any]: '2.2em'
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

/* Table Constants */
const MIN_ROWS = 1;
const MAX_STR_LEN = 14;

const PLTRS = Object.entries(c.PLAID_TRANS);
const PENDING_COLS = PLTRS.map(([k, v]) => {return v;});
const PENDING_HEADERS = new Map<string, string>(PLTRS.map(([k, v]) => {
 return [v, c.titleCase(v)];}));
const PENDING_COL_STYLE = new Map<string, ColStyle>(PLTRS.map(([k, col]) => { 
        let cs: ColStyle = {
                content: (v: string) => {return v;},
                hoverCSS: HOV_COL_STYLE
         }

         switch(col) {
                case c.PLAID_TRANS.AMT:
                cs.css = {['textAlign' as any]: 'right',
                ['paddingRight' as any]: '1%'};
                cs.hoverCSS = {['paddingRight' as any]: '3%', ...cs.hoverCSS};
                cs.content = (v: string) => {return '$' + Number(v).toFixed(2);};
                break;

                case c.PLAID_TRANS.POSTDATE:
                case c.PLAID_TRANS.PURCHDATE:
                cs.content = (v: string) => {return c.formatISODate(Date.parse(v))};
                break;

         } //END SWITCH
         cs.content = (v:string) => {
                 v = (cs.content) ? cs.content(v) : v;
                 return c.truncString(v, MAX_STR_LEN);
        };

        cs.hoverContent = (v:string) => {
                v = (cs.content) ? cs.content(v) : v;
                return c.truncString(v, MAX_STR_LEN-3);
       };

         return [col, cs];
}));

const TRS = Object.entries(c.TRANS_DATA);
const PREPARED_COLS = TRS.map(([k, v]) => {return v;});
const PREPARED_HEADERS = new Map<string, string>(TRS.map(([k, v]) => {
 return [v, c.titleCase(v)];}));
const PREPARED_COL_STYLE = new Map<string, ColStyle>(TRS.map(([k, col]) => { 
        let cs: ColStyle = {
                hoverCSS: HOV_COL_STYLE
         }

         switch(col) {
                case c.TRANS_DATA.AMT:
                cs.css = {['textAlign' as any]: 'right',
                ['paddingRight' as any]: '1%'};
                cs.hoverCSS = {['paddingRight' as any]: '3%', ...cs.hoverCSS};
                cs.content = (v: string) => {return '$' + Number(v).toFixed(2);};
                break;

                case c.TRANS_DATA.POSTDATE:
                case c.TRANS_DATA.PURCHDATE:
                cs.content = (v: string) => {return c.formatDBDate(c.formatISODate(Date.parse(v)))};
                break;

         } //END SWITCH
         let temp = (cs.content) ? cs.content : (v: string) => {return v;};
         cs.content = (v:string) => {
                 v = (cs.content) ? temp(v) : v;
                 return c.truncString(v, MAX_STR_LEN);
        };

        cs.hoverContent = (v:string) => {
                v = (cs.content) ? temp(v) : v;
                return c.truncString(v, MAX_STR_LEN-3);
       };

         return [col, cs];
}));



//console.log(PENDING_COL_STYLE);

/* MISC Constants */
const ARROW_DIMS = { h: '30px', w: '40px'};

/* Function Constants */
//For tooltips
const rndrBtnTooltip = (expression: string, placement: string, id: string) => (props: any) => (
        <Tooltip {...props} id={id + '-tooltip'}
         className={c.addStyleClass('pt', 'tooltip')}
         placement={placement}>
                {expression}
        </Tooltip>
    )



const ADD_NEW_TRANS_FORM_ID = 'pt-add-new-trans-form'

function PostTransactions() {

        /* Const */

        /* States */
        const [rolloverStyles, setRollOverStyles] = useState<Array<any>>([
                ROLLOVER_BLANK_STYLE, ROLLOVER_BLANK_STYLE, ROLLOVER_BLANK_STYLE
        ]);

        const [countFormRefresh, setCountFormRefresh] = useState<number>(0);

        //data states
        const BAD_CHARS = ['-', "'", '"', '.', '/', "\\", ','];      //we don't want our form to include these chars
        //let BOT_FOR_VALS: string[]; // = ['PERSONAL', 'GROUP', 'FAMILY', 'DATE', ''];
        //let PAY_STAT_VALS: string[]; //= ['COMPLETE', 'COVERED', 'OWED', 'PENDING', 'OWED_PARTIAL', ''];
        const FORM_VALD_FUNCS: ((val: string) => boolean)[]  = [
                (val: string) => {return (!isNaN(Number(val)) && Number(val) >= 0);},     //trans id - not recommended
                (val: string) => {return true;},     //Purchased Date
                (val: string) => {return (!isNaN(Number(val)) && Number(val) >= 0);},     //amount, Must be an actual number and be >= 0                                                
                (val: string) => {return BAD_CHARS.every( (c: string) => {return val && !val.includes(c)});},     //vendor
                (val: string) => {return BAD_CHARS.every( (c: string) => {return val && !val.includes(c)});},     //category
                (val: string) => {return BAD_CHARS.every( (c: string) => {return val && !val.includes(c)});},     //PayMethod
                (val: string) => {return (val) ? contains(formOptions.get(FORM_HEADERS.BOTFOR) as string[], val) : true; },     //BoughtFor - must be one of provided vals, or empty
                (val: string) => {return (val) ? contains(formOptions.get(FORM_HEADERS.PSTATUS) as string[], val) : true;},     //PayStatus
                (val: string) => {return true;},     //Income, boolean, default false
                (val: string) => {return (!isNaN(Number(val)) && Number(val) >= 0);},     //Reimburses
                (val: string) => {return true;},     //Posted Date
                (val: string) => {return true;}     //Notes
        ];

        const todayISO: string = c.formatISODate(now());
                const DEF_FORM_VALS = [
                        "",     //trans id
                        todayISO,     //Purchased Date
                        "85",     //amount
                        "Var",     //vendor
                        "Domestic",     //category
                        "Georgetown",     //PayMethod
                        "",     //BoughtFor
                        "",     //PayStatus
                        "",     //Income
                        "",     //Reimburses
                        todayISO,     //Posted Date
                        ""     //Notes
                ]
                let [formValues, setFormValues] = useState<React.MutableRefObject<any[]>>();
                const [formOptions, setFormOptions] = useState<Map<string, Array<any>>>(new Map());  //drop down options for form
                const addNewFormRef = useRef<HTMLFormElement>(null);

                const [, updateState] = React.useState<Object>();
                const forceUpdate = React.useCallback(() => updateState({}), []);

                //Stylistic states
                const scrollableRowRef = useRef<HTMLDivElement>(null);
                const rolloverRows = useRef<Array<HTMLDivElement | null>>([]);
                const [scrollPos, setScrollPos] = useState<number>(0);
                const MAX_SCROLL = 70;
                const MIN_SCROLL = 20;


        //table states
        const [pendingTrans, setPendingTrans] = useState<PlaidTransaction[]>([]);
        const [prepdTrans, setPrepdTrans] = useState<Transaction[]>([]);
        const [postedTrans, setPostedTrans] = useState<Transaction[]>([]);

        /* Effects */
        const scrollInnerDiv = (deltaY: number) => {
                console.log('----- -----');
                let dir = deltaY/Math.abs(deltaY)
                //console.log('dir: ' + dir);
                let ref: HTMLDivElement;
                if(scrollableRowRef.current)
                  ref = scrollableRowRef.current;
                else 
                  return;

                const BUFFER = 5;
                let distFromTop = rolloverRows.current.map( (v) => {
                        return (v) ? v.getBoundingClientRect().y - (ref.getBoundingClientRect().y + BUFFER) : 0;
                })

                let i = 0;
                while(i<rolloverRows.current.length && distFromTop[i] < 0 ) {
                        //for fixed rollovers, keep them fixed unless user tries to scroll down
                        rolloverStyles[i++] = {...ROLLOVER_DIV_FIXED_STYLE, top: ref.getBoundingClientRect().top };
                }

                let scrollDist = 0;
                let jump=0;
                if(i < rolloverRows.current.length) {
                        scrollDist = (dir>0) ? Math.min(MAX_SCROLL, Math.max(distFromTop[i]/4, MIN_SCROLL))*dir : MAX_SCROLL*dir;
                        //console.log("dist: " + scrollDist);

                } else if(dir < 0) { //user attempting to scroll down when all divs are locked; loosen last
                        scrollDist = -MIN_SCROLL*3;
                        jump = -MIN_SCROLL*2;
                        rolloverStyles[i-1] = ROLLOVER_BLANK_STYLE;
                }
                
                //console.log('Row height: '  + ref.getBoundingClientRect().height);
                //console.log('Dist From: ' + JSON.stringify(distFromTop));

                const LOOSEN_LEN = 2.2;
                if(i!=0 && i != rolloverRows.current.length && (dir<0) &&
                        distFromTop[i] - scrollDist > ref.getBoundingClientRect().height*LOOSEN_LEN) 
                {
                        //console.log('loosening');
                        rolloverStyles[i-1] = ROLLOVER_BLANK_STYLE; //loosen previous fixed div
                }
                while(i < rolloverRows.current.length) {
                        rolloverStyles[i++] = ROLLOVER_BLANK_STYLE;
                }
                setRollOverStyles(rolloverStyles);
                let newScrollPos = Math.min(Math.max(scrollPos+scrollDist, 0), ref.children[0].clientHeight)+jump;
                //console.log('SP: %d', scrollPos);
                //console.log("scrolls:  " + (newScrollPos))
                scrollableRowRef.current?.scroll(0, newScrollPos);
                //console.log('s')                        
                console.log('\n\n\n')
                setScrollPos(newScrollPos);
                //state doesnt update until after function terminates
        };

        /* Api Calls */
        let map: Map<string, Array<any>> = new Map();
        const getOptions = async function name() {

                const getSetData = (header: string) => {
                        return (data: Array<string>) => {
                                if(header == FORM_HEADERS.VEND)
                                        map.set(header, c.formatData(data, 'Vendor'));
                                else if(header==FORM_HEADERS.PMETHOD)
                                map.set(header, data);
                                else
                                        map.set(header, c.formatData(data, 'string'));
                        }
                }

                let [] = await Promise.all([ // eslint-disable-line no-empty-pattern
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
                        //console.log("In form options: " );
                        formOptions.forEach( (val, key) => {
                                //console.log(key + ": " + val.length)
                        })
                })
                makeApiCall();
               
        }, []); // eslint-disable-line react-hooks/exhaustive-deps


        /* Other Functions */
        let onAddNewTransSubmit = (action: string ) => {
                console.log('Submit Fired');
                //build transaction if form clears
                let i: number =0;
                let fv = (formValues) ? formValues.current : [];

                let t: Transaction = {
                        tid: (fv[i++]) ? fv[i] : '?',
                        purchaseDate: fv[i++],
                        amount: fv[i++],
                        vendor: fv[i++],
                        category: fv[i++],
                        payMethod: fv[i++],
                        boughtFor: fv[i++],
                        payStatus: fv[i++],
                        isIncome: fv[i++],
                        reimburses: fv[i++],
                        postedDate: fv[i++],
                        notes: fv[i++]
                }
                //Submitting the form tells form to validate entries and clear
                addNewFormRef.current?.requestSubmit();

                //if form validated, all entries will be empty string
                fv = (formValues) ? formValues.current : [];
                if(!fv.every( (v: string) => {return v==="";}))
                        return; //form didn't clear, form will mark existing errors
                        
                console.log('after firing form submit');
                //if condition - post or don't post
                switch(action)
                {
                        case 'POST':
                                //post results
                                console.log('Post Results')
                                api.postRequest(api.SERVER_ALL_TRANSACTIONS, [t]);
                                break;
                        
                        case 'PREPARE':
                                //push results to prepared table
                                prepdTrans.push(t);
                                setPrepdTrans(prepdTrans);
                                console.log('Prep results')
                                break;
                        default:
                                console.log('Form cleared with no action')
                                return;
                }
                //END SWITCH
                
                if(formValues)
                        formValues.current = DEF_FORM_VALS;              

                setCountFormRefresh(countFormRefresh+1);        //will force addNewTrans form refresh
        }

        return (

        <div className='row outer-row g-0 no-scroll' id='pt-outer-row'>
        <div className='col rev-side-anim side-anim'></div>

        <div className='col-10 no-padding' id='post-trans-center-col'>
    
           <Header/>

                <div className="row content-row center-div align-items-center flex-grow-1"
                id='post-trans-main-content'>
                <div className='col-12'>


                {/*ADD NEW TRANS*/}
                <div className='row content-row' id='add-new-transaction'>
                <div className='col-12 content-col'>

                  <div className='row content-row section-title-row no-internal-flex'>
                     <div className='col post-trans-subsec-title-item section-title'
                        id="add-new-trans-title">
                        Add New
                     </div>
                     <div 
                         className='col post-trans-plus post-trans-subsec-title-item
                        post-trans-hoverable' id='add-new-trans-button'>
                        <OverlayTrigger offset={[0, -45]} 
                        overlay={rndrBtnTooltip('Start New Transaction', 
                        'top', 'add-new-trans')}>
                                 <div>+</div>
                        </OverlayTrigger>
                        </div>
                     
                        <div className='col post-trans-subsec-title-item post-trans-arrow-outer-div'> 
                        
                        <OverlayTrigger offset={[0, 0]} 
                        overlay={rndrBtnTooltip('Load Next Pending Transaction', 
                        'top', 'load-next-trans')}>
                                <div> <Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                        styleClass='post-trans-hoverable post-trans-arrow'/> </div>
                        </OverlayTrigger>
                        </div>
                  </div> 
                  {/* End row section header content */} 
                        
                   <div className='row pt-bordered-section' id="transaction-form-div">
                        <div className='col-12' id='transaction-form-container'>
                                <AddNewTrans key={ADD_NEW_TRANS_FORM_ID + countFormRefresh}
                                headers={Object.entries(FORM_HEADERS).map(
                                        ([key, val]) => {return val;}
                                )}
                                 inputTypes={Object.entries(FORM_INP_TYPES).map(
                                        ([key, val]) => {return val;}
                                 )}
                                 data={DEF_FORM_VALS}
                                 setFormValuesRef={setFormValues}
                                 fieldValidation={FORM_VALD_FUNCS}
                                onFormSubmit={(fields: React.MutableRefObject<Array<any>>) => {
                                        fields.current = fields.current.map((v) => {return '';});
                                }}
                                 formRef={addNewFormRef}
                                options={formOptions}
                                id={ADD_NEW_TRANS_FORM_ID}
                                styleNamespace={'pt'}
                                />  
                        </div>
                   </div>
                   {/* End row section component content */} 

                   <div className='row content-row section-footer-row no-internal-flex'>
                        <div className='col post-trans-double-plus post-trans-subsec-footer-item
                        post-trans-hoverable'>
                        <OverlayTrigger offset={[0, -90]} overlay={rndrBtnTooltip('Post Now', 'bottom', 'post-form-trans-now')}>
                                 <div onClick={() => { console.log("calling " + JSON.stringify(formValues));
                                 onAddNewTransSubmit('POST');}}>
                                 <DoublePlus styleClass='post-trans-hoverable post-trans-double-plus' />
                                  </div>
                        </OverlayTrigger>
                        </div>
                        <div className='col post-trans-subsec-footer-item post-trans-arrow-outer-div'> 
                        <OverlayTrigger offset={[0, -100]} overlay={rndrBtnTooltip('Move to Prepared\n Table', 'bottom', 'prepare-trans-now')}>
                        <div onClick={() => onAddNewTransSubmit('PREPARE')}>      
                                <Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                          styleClass='post-trans-hoverable post-trans-arrow'/> 
                        </div>
                        </OverlayTrigger>
                        </div>
                  </div>
                {/* End row section footer content */} 
                
                </div>                        
                </div>
                {/*--------------------------*/}
                {/*-------END ADD NEW--------*/}
                {/*--------------------------*/}


                <div ref={scrollableRowRef} className='row main-scrollable-content-row scrollable-row'
                        id='transactions-content-row' onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
                                scrollInnerDiv(e.deltaY);
                        }}>
                <div className='col-12 main-scrollable-content-col'>

                {/*Pending Transactions*/}
                <div ref={ref => rolloverRows.current[0] = ref}  id='pt-pending-transactions'
                className='row content-row rollover-row'
                style={rolloverStyles[0]}>
                <div className='col-12 content-col'> 
                        <div className='row section-title-row no-internal-flex'>
                         <div className='col post-trans-subsec-title-item section-title'>
                            Pending
                          </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row pt-bordered-section pt-table-section' id="pending-table-row">
                                <div className='col-12'>
                                {/* Component goes here */} 
                                <GeneralTable<PlaidTransaction> 
                                id='pending-table'
                                styleClass='pt'
                                colNames={PENDING_COLS}
                                data={pendingTrans}
                                headers={PENDING_HEADERS}
                                limit={Infinity}
                                minRows={MIN_ROWS}

                                rowStyling={{hoverCSS: HOV_ROW_STYLE}}
                                colStyling={PENDING_COL_STYLE}
                                />
                                </div>
                        </div>
                {/* End row section component content */} 

                   <div className='row content-row section-footer-row no-internal-flex'>
                           <PTSectionFooter ids={['post-all-pending-trans', 'post-next-pending-trans']}
                           messages={['Post All', 'Post Next Record']}
                           positions={['bottom', 'bottom']}
                           offsets={[[0, -90], [0, -80]]}
                           classNames={['col post-trans-double-plus post-trans-subsec-footer-item post-trans-hoverable',
                           'col post-trans-subsec-footer-item post-trans-arrow-outer-div']}
                           children={[ <DoublePlus key={'dp'} styleClass='post-trans-hoverable post-trans-double-plus' />,
                           <Arrow key={'a'} height={ARROW_DIMS.h} width={ARROW_DIMS.w} styleClass='post-trans-hoverable post-trans-arrow'/>
                           ]}/>
                   </div>
                  {/* End row section footer content */} 
                 </div>
                </div>
                {/*--------------------------*/}
                {/*-------END PENDING--------*/}
                {/*--------------------------*/}
                <div className='row rollover-row-spacer'> </div>


                {/*Prepared Transactions*/}

                <div ref={ref => rolloverRows.current[1] = ref} id='pt-prepared-transactions'
                className='row content-row rollover-row'
                style={rolloverStyles[1]}>
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Prepared
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row pt-bordered-section pt-table-section' id="prepared-table-row">
                                <div className='col-12'>
                                <GeneralTable<Transaction> 
                                id='prepared-table'
                                styleClass='pt'
                                colNames={PREPARED_COLS}
                                data={prepdTrans}
                                headers={PREPARED_HEADERS}
                                limit={Infinity}
                                minRows={MIN_ROWS}

                                rowStyling={{hoverCSS: HOV_ROW_STYLE}}
                                colStyling={PREPARED_COL_STYLE}
                                />              
                                </div>
                        </div>
                {/* End row section component content */} 

                <div className='row content-row section-footer-row no-internal-flex'>
                <PTSectionFooter ids={['post-all-prepared-trans', 'post-next-prepared-trans']}
                           messages={['Post All', 'Post Next Record']}
                           positions={['bottom', 'bottom']}
                           offsets={[[0, -90], [0, -80]]}
                           classNames={['col post-trans-double-plus post-trans-subsec-footer-item post-trans-hoverable',
                           'col post-trans-subsec-footer-item post-trans-arrow-outer-div']}
                           children={[ <DoublePlus key={'dp'} styleClass='post-trans-hoverable post-trans-double-plus' />,
                           <Arrow key={'a'} height={ARROW_DIMS.h} width={ARROW_DIMS.w} styleClass='post-trans-hoverable post-trans-arrow'/>
                           ]}/>
                  </div>
                  {/* End row section footer content */} 

                </div>
                </div>
                {/*--------------------------*/}
                {/*-------END PREPARED-------*/}
                {/*--------------------------*/}

                <div className='row rollover-row-spacer'> <div className='rollover-row-ptr-allow'></div> </div>
                

                        {/*Posted Transactions*/}
                <div ref={ref => rolloverRows.current[2] = ref} id='pt-posted-transactions'
                className='row content-row rollover-row'
                style={rolloverStyles[2]}
                >
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Posted
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row pt-bordered-section pt-table-section' id="posted-table-row">
                         <div className='col-12'>
                                {/* Component goes here */} <div className='scroll-sample'></div>               
                         </div>
                        </div>
                {/* End row section component content */} 

                      
                {/* End row section footer content //Nothing to post here */} 

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

        </div> 
        {/*END MAIN CONTENT DIV*/}

        <div className='col for-side-anim side-anim'></div>
        </div>  
        /* END OUTER ROW*/
)

}

export default PostTransactions;