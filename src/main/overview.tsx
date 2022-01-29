//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

//project imports
import * as consts from '../resources/constants';
import * as api from '../resources/api';
import DataTable from '../components/DataTable';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main/Overview.css'
import { Config } from '@testing-library/react';

//import '../css/Landing.css';

/*Helper functions */
async function getRequest(url: string, setData: Function) {

    const config: AxiosRequestConfig<any> = {
        method: 'GET',
        url: url
    }

    await axios(config).then( (resp) =>
    {
        console.log("Transactions returned: " + resp.data.toString() );
        setData(resp.data);
    }).catch( (reason) => {
        console.log("Error from GET request from: " + url + " with error: " + reason);
    }
    );
    //end axios call
    
}


///finances/overview?mn=August&yr=21
//Guess we'll have to take some params here
function Overview() {

    //Constants
    const TOTAL_TRANSACTIONS = 25;
    const DATA_TABLE_HEADERS: Array<String> = [
        "Date", "Vendor", "Amount", "Category"
    ]

    const DATA_TABLE_COLS: Array<String> = [
        consts.TRANS_DATA_PURCHDATE,
        consts.TRANS_DATA_VEND,
        consts.TRANS_DATA_AMT,
        consts.TRANS_DATA_CAT
    ]

    /* State and Effect Functions */
    const [transactions, setTransactions] = useState(["Loading Data"]);

    //OnLanding
    useEffect( () => {
        getRequest(api.SERVER_ALL_TRANSACTIONS, setTransactions);

    }, []);
  
    return (
        <body>

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
            <div className="row">
                {//div for pie graph, upper left
                }

                {/*div for transactions table, right side entire length */}
                <div className="col-4 right-data-table align-items-right">
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
    </body>
    )
    //END REACT OVERVIEW ELEMENT
}

export default Overview;