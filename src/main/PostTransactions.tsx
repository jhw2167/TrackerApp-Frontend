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
import Arrow from '../resources/arrow';


function PostTransactions() {

        const ARROW_DIMS = { h: '30px', w: '40px'}

        return (

        <div className='row outer-row'>
        <div className='col rev-side-anim side-anim'></div>

        <div className='col-11 no-padding' id='transactions-center-col'>
          {/* HEADER */}
                <Header/>
        {/*---------------*/}

        <main className="center-div align-items-center" id='post-trans-main-content'>
                <div className="row  content-row">
                <div className='col-12'>


                {/*ADD NEW TRANS*/}
                <div className='row content-row' id='add-new-transaction'>
                <div className='col-12'>
                  <div className='row content-row section-title-row no-internal-flex'>
                     <div className='col post-trans-subsec-title-item section-title'>
                        Add New
                     </div>
                        <div id='add-new-trans-button' className='col post-trans-plus post-trans-subsec-title-item
                        post-trans-hoverable'>
                                 <div>+</div> 
                        </div>
                        <div className='col post-trans-subsec-title-item post-trans-arrow-outer-div'> 
                        <div><Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                        styleClass='post-trans-hoverable post-trans-arrow'/> </div>
                        </div>
                  </div>
                        
                        <div id="transaction-form-div" className='bordered-section'>
                                {/* Component goes here */}                
                        </div>

                   <div className='row content-row section-footer-row no-internal-flex'>
                        <div id='add-new-trans-button' className='col post-trans-double-plus post-trans-subsec-title-item
                        post-trans-hoverable'>
                                 <div>+</div> 
                        </div>
                        <div className='col post-trans-subsec-title-item post-trans-arrow-outer-div'> 
                        <div><Arrow height={ARROW_DIMS.h} width={ARROW_DIMS.w} 
                          styleClass='post-trans-hoverable post-trans-arrow'/> </div>
                        </div>
                  </div>

                
                </div>                        
                </div>
                {/*---------------*/}


                {/*Pending Transactions*/}


                {/*---------------*/}



                {/*Pending Transactions*/}


                {/*---------------*/}


                {/*Pending Transactions*/}


                {/*---------------*/}

                </div>
                </div>
                {/* END MAIN CONCNTENT ROW*/}
        </main>
        </div> 
        {/*END MAIN CONTENT DIV*/}

        <div className='col for-side-anim side-anim'></div>
        </div>  
        /* END OUTER ROW*/
)

}

export default PostTransactions;