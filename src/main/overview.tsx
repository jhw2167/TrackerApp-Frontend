//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';


//project imports
import * as consts from '../resources/constants';
import {DataTuple, Transaction, Summary} from '../resources/constants';
import * as api from '../resources/api';
import DataTable from '../components/DataTable';
import SubTable from '../components/SubTable';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main/Overview.css'
import { Config } from '@testing-library/react';
import DataGraph from '../components/DataGraph';
import { URLSearchParamsInit } from 'react-router-dom';
import { URLSearchParams } from 'url';
import useWindowDimensions from '../resources/WindowDims';

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
    const SUMMARY_TABLE_LIMIT = 4;

    /* State and Effect Functions */
    let {winHeight, winWidth } = useWindowDimensions();
    //console.log(JSON.stringify(JSON.stringify({winHeight, winWidth})));
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
    const [offsetTransactions, setOffsetTransactions] = useState<number>(0);

    const [incomeSummary, setIncomeSummary] = useState<Summary[]>([]);
    const [expenseSummary, setExpenseSummary] = useState<Summary[]>([]);

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

        api.getRequest(api.SERVER_INCOME_SUMMARY(start, end), setIncomeSummary);
        api.getRequest(api.SERVER_EXPENSE_SUMMARY(start, end), setExpenseSummary);
        
        api.getRequest(api.SERVER_ALL_CATEGORIES, setCategories);
    }, []);


    /* On window resize */
    

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
    }, [hovCategory]);




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
            <div className="row">

               
                <div className="col-6 half-portion-wrapper-col">
                    <div className='left-div row-centered-contents'>

                    <div className='row inner-portion-top-row justify-content-center'>
                        <div className='col-12 inner-portion-full-col'>
                        
                        
                        <div className="left-data-graph">
                        <DataGraph
                           data=          {categoriesData} 
                           exclusions=    {DATA_GRAPH_EXC_FUNC}
                           limit=         {DATA_GRAPH_LIMIT}
                           title=         {currentMonth}
                           setHovSegment= {setHovCategory}
                           height={Math.min(winWidth * .40 * .90, 290)}
                           width={Math.min(winWidth * .40 * .90, 300)}
                           />
                        </div>


                        </div>    
                    </div>
                    {/* END TOP ROW UPPER LEFT */}


                    <div className='row second-row justify-content-center'>
                        <div className='col-10 inner-portion-full-col'>

                            {/*div for summary table 1, expenses */}

                            <div className='inline-summary-table'> 
                                <SubTable 
                                    title={'Expense Summary'}
                                    headers={['Expense Summary']}
                                    colNames={Object.values(consts.SUMMARY_DATA)}
                                    data={expenseSummary}
                                    limit={SUMMARY_TABLE_LIMIT}
                                />
                            </div>

                        </div>    
                    </div>
                            
                    <div className='row third-row justify-content-center'>
                        <div className='col-10 inner-portion-full-col'>

                                {/*div for summary table 2, income*/ }

                                <div className='inline-summary-table'> 
                                <SubTable 
                                    title={'Income Summary'}
                                    headers={['Income Summary']}
                                    colNames={Object.values(consts.SUMMARY_DATA)}
                                    data={incomeSummary}
                                    limit={SUMMARY_TABLE_LIMIT}
                                />
                                </div>


                        </div>
                        </div>    
                    {/*#######################*/}
                    {/* END SECOND ROW  LEFT */}
                    {/*#######################*/}

                   
                    </div>
                </div>
               {/*#######################*/}
                {/* END Left side col segment */}
                {/*#######################*/}



                {/* Spacing cols */}
                
                {/*div for transactions table, right side entire length */}
                <div className="col-6">

                    <div className='right-data-table'>
                        <h4>Recent Transactions</h4>
                        <DataTable headers={DATA_TABLE_HEADERS} 
                        colNames=   {DATA_TABLE_COLS}
                        data=       {recentTransactions} 
                        limit=      {MAX_TRANS_PAGE}
                        hovCellFunc=   {setHovCellFunc}
                        />

                    </div>
                </div>
                
               
            </div> {/* Container row class */}
            </main>

    {/* Container wrapper class */}
            <footer>
                <div> {//JSON.stringify(recentTransactions[0], null, 2)
                } </div>
            </footer>

        </div>  {/* Container wrapper class */}
    </>
    )
    //END REACT OVERVIEW ELEMENT
}

export default Overview;