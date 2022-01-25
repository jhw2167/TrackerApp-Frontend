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
        //page title and logo

        //Large div contains entire vertical length page
        <div className="center-div">

            {//div for pie graph, upper left
            }

            <div>
            {/*div for transactions table, right side entire length */}
                <DataTable headers={DATA_TABLE_HEADERS} 
                colNames={DATA_TABLE_COLS}
                data={transactions} />
            </div>

            {//div for summary table 1, expenses
            }

            {//div for summary table 2, income
            }

            <h1>Hello World!</h1>
            <p>
            {JSON.stringify(transactions[0], null, 2)};
            </p>
        </div>
    )
}

export default Overview;