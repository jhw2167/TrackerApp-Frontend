//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';


//project imports
import * as consts from '../resources/constants';
import {DataTuple, Transaction} from '../resources/constants';
import * as api from '../resources/api';
import DataTable from '../components/DataTable';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main/Overview.css'
import { Config } from '@testing-library/react';
import DataGraph from '../components/DataGraph';
import { URLSearchParamsInit } from 'react-router-dom';
import { URLSearchParams } from 'url';

//import '../css/Landing.css';
interface OverviewProps {
    mn?: string | null;
    yr?: string | null;
    setSearchParams: Function;
}

///finances/overview?mn=August&yr=21
//Guess we'll have to take some params here
function Overview(props: OverviewProps) {

    //Constants
    const MAX_TRANS_PAGE: number = 25;
    const DATA_TABLE_HEADERS: Array<string> = [
        "Date", "Vendor", "Amount", "Category"
    ]

    const DATA_TABLE_COLS: Array<string> = [
        consts.TRANS_DATA.PURCHDATE,
        consts.TRANS_DATA.VEND,
        consts.TRANS_DATA.AMT,
        consts.TRANS_DATA.CAT
    ]

    const DATA_GRAPH_EXCLUSIONS = new Set<string>(["Income"]);
    const DATA_GRAPH_EXC_FUNC: Function = (tuple: DataTuple) => {
        return !DATA_GRAPH_EXCLUSIONS.has(tuple.label as string);
    }
    const DATA_GRAPH_LIMIT = 8; 

    /* State and Effect Functions */
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
    const [offsetTransactions, setOffsetTransactions] = useState<number>(0);

    const [categories, setCategories] = useState(["Loading Categories"]);
    const [categoriesData, setCategoriesData] = useState<DataTuple[]>([]);
    const [currentMonth, setCurrentMonth] = useState<string>( 
        consts.MONTHS[(new Date( Date.now()).getMonth())] );

    const [hovCategory, setHovCategory] = useState<string>("");
    const [hovCellFunc, setHovCellFunc] = useState<Function>();

    //OnLanding
    useEffect( () => {

        //Date stuff
        const [start, end] = consts.convMnYrToTimeFrame(props.mn, props.yr);
        const srchParamStr = "?mn=" + consts.MONTHS.at(start.getMonth()) + "&yr=" + start.getFullYear();
        props.setSearchParams(srchParamStr);
        setCurrentMonth(consts.MONTHS[(new Date( Date.now()).getMonth())])
        setCurrentMonth(currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1) );

        //api calls
        api.getRequest(api.SERVER_ALL_TRANSACTIONS_DATES(start, end), setMonthlyTransactions);
        api.getRequest(api.SERVER_ALL_TRANSACTIONS_RECENT(offsetTransactions + MAX_TRANS_PAGE,
             offsetTransactions), setRecentTransactions);
        api.getRequest(api.SERVER_ALL_CATEGORIES, setCategories);
    }, []);

    //On update to dependencies
    useEffect( () => {
        setCategoriesData(consts.aggregateTransactions(monthlyTransactions, categories, 50));
    }, [categories, monthlyTransactions]);
    
    useEffect( () => {
        if(hovCategory && hovCellFunc) {
            let hovCells = new Set<any>();
            recentTransactions.forEach((v) => { if(v.category==hovCategory) { hovCells.add(v);} })
            hovCellFunc(hovCells);
        } else if(hovCellFunc) {
            hovCellFunc(new Set<any>())
        }
    }, [hovCategory])


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
                        <DataGraph
                           data=          {categoriesData} 
                           exclusions=    {DATA_GRAPH_EXC_FUNC}
                           limit=         {DATA_GRAPH_LIMIT}
                           title=         {currentMonth}
                           setHovSegment= {setHovCategory}
                           />
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
                    data=       {recentTransactions} 
                    limit=      {MAX_TRANS_PAGE}
                    hovCellFunc=   {setHovCellFunc}
                    />
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
                <div> {JSON.stringify(recentTransactions[0], null, 2)} </div>
            </footer>

        </div>  {/* Container wrapper class */}
    </>
    )
    //END REACT OVERVIEW ELEMENT
}

export default Overview;