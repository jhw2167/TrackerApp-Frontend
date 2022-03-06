//PostTransactions.tsx - website interactive page for entering and posting data to the backend server
        // will integrate a connection with Plaid at some point as well

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';


//project imports
import * as c from '../resources/constants';
import {DataTuple, Transaction, Summary} from '../resources/constants';
import * as api from '../resources/api';
import DataGraph from '../components/DataGraph';
import DataTable from '../components/DataTable';
import SubTable from '../components/SubTable';
import Header from '../components/Header';

//CSS
import '../css/main/PostTransactions.css'
import Arrow from '../resources/subcomponents/arrow';
import DoublePlus from '../resources/subcomponents/double_plus';


function PostTransactions() {

        const ARROW_DIMS = { h: '30px', w: '40px'}

        return (

        <div className='row outer-row'>
        <div className='col rev-side-anim side-anim'></div>

        <div className='col-10 no-padding' id='transactions-center-col'>
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
                     <div className='col post-trans-subsec-title-item section-title'>
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
                        
                   <div className='row bordered-section' id="transaction-form-div">
                        <div className='col-12'>
                        {/* Component goes here */} <div className='sample'></div>               
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

                <div className='row main-scrollable-content-row scrollable-row'>
                <div className='col-12'>

                {/*Pending Transactions*/}
                <div className='row content-row rollover-row' id='pt-pending-transactions'>
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Pending
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row bordered-section' id="transaction-form-div">
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



                {/*Prepared Transactions*/}

                <div className='row content-row rollover-row' id='pt-prepared-transactions'>
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Prepared
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row bordered-section' id="transaction-form-div">
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


                        {/*Posted Transactions*/}
                <div className='row content-row rollover-row' id='pt-posted-transactions'>
                <div className='col-12 content-col'> 

                        <div className='row section-title-row no-internal-flex'>
                                <div className='col post-trans-subsec-title-item section-title'>
                                Posted
                                </div>
                        </div>
                {/* End row section title content */} 

                        <div className='row bordered-section' id="transaction-form-div">
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

                </div>
                </div>
                {/* END MAIN SCROLLABLE ROW*/}


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