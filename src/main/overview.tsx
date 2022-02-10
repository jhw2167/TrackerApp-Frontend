//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';


//project imports
import * as consts from '../resources/constants';
import * as api from '../resources/api';
import DataTable from '../components/DataTable';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main/Overview.css'
import { Config } from '@testing-library/react';
import DataGraph from '../components/DataGraph';

//import '../css/Landing.css';

///finances/overview?mn=August&yr=21
//Guess we'll have to take some params here
function Overview() {

    //Constants
    const TOTAL_TRANSACTIONS = 25;
    const DATA_TABLE_HEADERS: Array<string> = [
        "Date", "Vendor", "Amount", "Category"
    ]

    const DATA_TABLE_COLS: Array<string> = [
        consts.TRANS_DATA_PURCHDATE,
        consts.TRANS_DATA_VEND,
        consts.TRANS_DATA_AMT,
        consts.TRANS_DATA_CAT
    ]

    /* State and Effect Functions */
    const [transactions, setTransactions] = useState<consts.Transaction[]>([]);
    const [categories, setCategories] = useState(["Loading Categories"]);
    const [categoriesData, setCategoriesData] = useState<Object>(Object());

    //OnLanding
    useEffect( () => {
        api.getRequest(api.SERVER_ALL_TRANSACTIONS, setTransactions);
        api.getRequest(api.SERVER_ALL_CATEGORIES, setCategories);
    }, []);

    //On update to dependencies
    useEffect( () => {
        setCategoriesData(consts.filterTransactions(transactions, categories, 50));
    }, [categories, transactions]);
    
  
    return (
        <>

        <div className="container container-table">

        
            {/*page title and logo*/}
            <header>
                <div className="logoImg d-inline header-div">
                    <img src="images/logo.png" alt="Tracker"/>
                </div>
                <h1>Tracker</h1>
            </header>

            {/*Large div contains entire vertical length page*/}
            <main className="center-div align-items-center">
            <div className="row row-centered-contents">
                {//div for pie graph, upper left
                <div className="col-6 left-div">
                    <div className="left-data-graph">
                        <h4 id="data-graph-title">September</h4>
                        <DataGraph
                            headers={categories}
                            data={categoriesData} />
                    </div>
                </div>
                //END COL-4 DIV
                }

                {/* Spacing cols */}
                

                {/*div for transactions table, right side entire length */}
                <div className="col-5 right-data-table align-items-right">
                    <h4>Recent Transactions</h4>
                    <DataTable headers={DATA_TABLE_HEADERS} 
                    colNames=   {DATA_TABLE_COLS}
                    data=       {transactions} 
                    limit=      {TOTAL_TRANSACTIONS}/>
                </div>

                {/*div for summary table 1, expenses */}
                <div> 

                </div>


                {/*div for summary table 2, income*/ }
                <div> </div>
                <div> </div>
                

            </div> {/* Container row class */}
            </main>

    {/* Container wrapper class */}
            <footer>
                <div> {JSON.stringify(transactions[0], null, 2)} </div>
            </footer>

        </div>  {/* Container wrapper class */}
    </>
    )
    //END REACT OVERVIEW ELEMENT
}

export default Overview;