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



function PostTransactions() {

        return (

        <div className='row outer-row'>
        <div className='col rev-side-anim side-anim'></div>

        <div className='col-11 no-padding' id='transactions-center-col'>
          {/* HEADER */}
                <Header/>
        {/*---------------*/}

        <main className="center-div align-items-center">
                <div className="row  main-content-row">
                <div className='col-12'>


                {/*ADD NEW TRANS*/}
                <div className='row' id='add-new-transaction'>
                        <div className='col-12'>

                        </div>
                        <div className='section-title'>
                        <h1>Add New</h1>
                        <div> + </div>
                        <div> <p> --- </p> </div>
                        </div>

                        <div id="transaction-form-div">
                                {/* Component goes here */}                
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