//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect, useRef, useCallback } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';


//project imports
import * as c from '../resources/constants';
import {DataTuple, Transaction, Summary} from '../resources/constants';
import * as api from '../resources/api';
import useWindowDimensions from '../resources/WindowDims';

import Header from '../components/Header';
import DataGraph from '../components/DataGraph';
import DataTable from '../components/DataTable';
import SubTable from '../components/SubTable';
import { includes } from 'underscore';

interface OverviewProps {
    mn?: string | null;
    yr?: string | null;
    setSearchParams: Function;
}

///finances/overview?mn=August&yr=21
//Guess we'll have to take some params here
function Overview(props: OverviewProps) {

    //Constants
    const MAX_TRANS_PAGE: number = 30;
    const DATA_TABLE_HEADERS: Array<string> = [
        "Date", "Vendor", "Amount", "Category"
    ]

    const DATA_TABLE_COLS: Array<string> = [
        c.TRANS_DATA.PURCHDATE,
        c.TRANS_DATA.VEND,
        c.TRANS_DATA.AMT,
        c.TRANS_DATA.CAT
    ]

    const DATA_TABLE_TT_COLS: Array<string> = Object.entries(c.TRANS_DATA).filter( ([key, v]) => {
        return !includes(DATA_TABLE_COLS, v);}).map(([key, val]) => {return val});


    const DATA_GRAPH_EXCLUSIONS = new Set<string>(['Income', 'Returns']);
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
    const [currentDateByMonth, setCurrentDateByMonth] = useState<Date>( () => {
        let date = new Date(Date.now());
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });

    const [hovCategory, setHovCategory] = useState<string>("");
    const [hovCellFunc, setHovCellFunc] = useState<Function>();

    const isMounted = useRef(false);

    //Grouped functions
    const updateOnDateChange = async (start: Date, end: Date) => {

        //transactions
        //console.log("st: %s and end: %s", start, end);
        let [] = await Promise.all([ // eslint-disable-line no-empty-pattern
        api.getRequest(api.SERVER_ALL_TRANSACTIONS_DATES(start, end), 
        (data: Array<Transaction>) => {setMonthlyTransactions(c.formatData(data, 'Transaction'))}),
        api.getRequest(api.SERVER_ALL_TRANSACTIONS_RECENT(offsetTransactions + MAX_TRANS_PAGE,
             offsetTransactions), (data: Array<Transaction>) => {setRecentTransactions(c.formatData(data, 'Transaction'))}),

        api.getRequest(api.SERVER_INCOME_SUMMARY(start, end),
        (data: Array<Summary>) => {setIncomeSummary(c.formatData(data, 'Summary'))}),
        api.getRequest(api.SERVER_EXPENSE_SUMMARY(start, end), 
        (data: Array<Summary>) => {setExpenseSummary(c.formatData(data, 'Summary'))})
        ]);
    }

    const onLanding = useCallback( async () => {
        //Date stuff
        const [start, end] = c.convMnYrToTimeFrame(props.mn, props.yr);
        //setCurrentDateByMonth(start);

        //api Calls
        //console.log(1);
        await api.getRequest(api.SERVER_ALL_CATEGORIES, 
            (data: Array<Summary>) => {setCategories(c.formatData(data, 'string'))});

        updateOnDateChange(start, end);
        const srchParamStr = "?mn=" + c.MONTHS.at(start.getMonth()) + "&yr=" + start.getFullYear();
        props.setSearchParams(srchParamStr);

        isMounted.current = true;
    }, [])

    //OnLanding
    useEffect( () => {onLanding()}, [onLanding]);


    //On update to dependencies
    useEffect( () => {
        //console.log(2);
        if(isMounted.current){
            //console.log("hello")
            setCategoriesData(c.aggregateTransactions(monthlyTransactions, categories));
        }
    }, [categories, monthlyTransactions]);

    useEffect( () => {
        //console.log(3);
        if(isMounted.current) {
            //console.log("hello3")
            api.getRequest(api.SERVER_ALL_TRANSACTIONS_RECENT(offsetTransactions + MAX_TRANS_PAGE,
                offsetTransactions), setRecentTransactions);
        }
    }, [offsetTransactions]);

    useEffect( () =>  {
        //console.log(4);
        if(isMounted.current) {
            //console.log("hello4")
            updateOnDateChange(currentDateByMonth, 
                new Date(currentDateByMonth.getFullYear(), currentDateByMonth.getMonth()+1, 1));
        }
    }
    , [currentDateByMonth])
    
    useEffect( () => {
        if(hovCategory && hovCellFunc) {
            let hovCells = new Set<any>();
            recentTransactions.forEach((v) => { if(v.category==hovCategory) { hovCells.add(v);} })
            hovCellFunc(hovCells);
        } else if(hovCellFunc) {
            hovCellFunc(new Set<any>())
        }
    }, [hovCategory]);

    useEffect( () => {
        recentTransactions.forEach( (t) => properlyCaseTransaction(t));
    }, [recentTransactions])

    /*  Other functions  */
    const updateCurrentMonth = (dir: number) => {
        let yy = new Date(Date.now()).getFullYear();
        let mm = new Date(Date.now()).getMonth();

        if(dir > 0 && !((yy==currentDateByMonth.getFullYear())
         && (mm<=currentDateByMonth.getMonth()))) {
            setCurrentDateByMonth(new Date(currentDateByMonth.getFullYear(), currentDateByMonth.getMonth()+1, 1))
        } else if (dir < 0) {
            setCurrentDateByMonth(new Date(currentDateByMonth.getFullYear(), currentDateByMonth.getMonth()-1, 1))
        }
    }

    const properlyCaseTransaction = (t: Transaction) => {
        t.boughtFor = c.properCase(t.boughtFor);
        t.category = c.properCase(t.category);
        t.payStatus = c.properCase(t.payStatus);
        t.vendor = c.properCase(t.vendor);
    }

    //positive offset is further back in the logs
    const updateRecentTransactions = (dir: number) => {
        const offSet = MAX_TRANS_PAGE * dir;
        setOffsetTransactions(Math.max(0, offsetTransactions + offSet));
    }

    //Only Render if we have all our data:

    return (

        <div className='row outer-row g-0'>
        <div className='col rev-side-anim side-anim'></div>
        <div className='col-8 no-padding' id='overview-center-col'>


        {/*page title and logo*/}
            <Header />

            {/*Large div contains entire vertical length page*/}
            <div className='center-div-spacer'>
            <main className="center-div align-items-center">
            <div className="row  main-content-row">

               
                <div className="col-6 half-portion-wrapper-col">
                    <div className='left-div row-centered-contents'>

                    <div className='row inner-portion-top-row justify-content-center'>
                        <div className='col-12 inner-portion-full-col'>
                        
                        
                        <div className="left-data-graph">
                        <DataGraph
                           data=          {categoriesData} 
                           exclusions=    {DATA_GRAPH_EXC_FUNC}
                           limit=         {DATA_GRAPH_LIMIT}
                           title=         {c.properCase(c.MONTHS[currentDateByMonth.getMonth()])}
                           setHovSegment= {setHovCategory}
                           height={Math.min(winWidth * .60 * .90, 340)}
                           width={Math.min(winWidth * .60 * .90, 380)}
                           updateDataHyperlink={updateCurrentMonth}
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
                                    colNames={Object.values(c.SUMMARY_DATA)}
                                    aggFunction={sumTableAgg}
                                    aggOtherRow={true}
                                    minRows={3}
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
                                    colNames={Object.values(c.SUMMARY_DATA)}
                                    aggFunction={sumTableAgg}
                                    minRows={3}
                                    aggOtherRow={true}
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
                        <DataTable headers={DATA_TABLE_HEADERS}
                        title=      {'Recent Transactions'} 
                        colNames=   {DATA_TABLE_COLS}
                        toolTipColNames= {DATA_TABLE_TT_COLS}
                        toolTipHeaders={DATA_TABLE_TT_COLS.map((v)=> {return c.titleCase(v)})}
                        data=       {recentTransactions}
                        limit=      {MAX_TRANS_PAGE}
                        hovCellFunc=   {setHovCellFunc}
                        updateDataHyperlink={updateRecentTransactions}
                        />

                    </div>
                </div>
                
               
            </div> {/* Container row class */}
            </main>

        <footer>
          <div id="footer">
                <p> &copy; TrackerApp 2022  </p>
          </div>
        </footer>

        </div>
        </div>
            <div className='col for-side-anim side-anim'></div>

    </div>)
          {/* OUTTER ROW WRAPPER class */}
    //END REACT OVERVIEW ELEMENT
}

//Aggregate summary function for subTables
function sumTableAgg(data: Summary[], aggRowName: string = 'NONE' ) {

    let sum = 0;
    data.forEach(curr => { sum += curr.value as number }); 
    return  {
        [c.SUMMARY_DATA.aggregate]: aggRowName,
        [c.SUMMARY_DATA.value]: sum,
        [c.SUMMARY_DATA.categories]: 'None'
    }
}

export default Overview;

function sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
