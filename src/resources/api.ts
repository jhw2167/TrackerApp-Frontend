//api.ts used for storing URL, port num and other constants

//imports
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

export const CONST_VAR = "CONSTANT VARS GO HERE";
export const DOMAIN = "http://localhost";
export const PORT = ":8080/";

//Server calls
export const SERVER_ALL_TRANSACTIONS = DOMAIN + PORT + "transactions";
export const SERVER_ALL_CATEGORIES = SERVER_ALL_TRANSACTIONS + "/categories";
export const SERVER_ALL_PAYMETHODS = SERVER_ALL_TRANSACTIONS + "/payMethods";
export const SERVER_ALL_BOUGHTFOR = SERVER_ALL_TRANSACTIONS + "/boughtFor";
export const SERVER_ALL_PAYSTATUS = SERVER_ALL_TRANSACTIONS + "/payStatus";

export const SERVER_ALL_VENDORS = SERVER_ALL_TRANSACTIONS + "/vendors";


/*Utility functions */

    //Build request with dates
    export function SERVER_ALL_TRANSACTIONS_DATES(start: Date, end: Date): string {
        //Date.proto.toISOString() gives 2022-02-15 date format
        const from = start.toISOString().split("T")[0];
        const to = end.toISOString().split("T")[0];

        return SERVER_ALL_TRANSACTIONS + "/dates" 
        + "?start=" + from +
        "&to=" + to;
    }

    //Income Summary
    export function SERVER_INCOME_SUMMARY(start: Date, end: Date): string {
        //Date.proto.toISOString() gives 2022-02-15 date format
        const from = start.toISOString().split("T")[0];
        const to = end.toISOString().split("T")[0];

        return SERVER_ALL_TRANSACTIONS + "/income" 
        + "?start=" + from +
        "&to=" + to;
    }


    //Expense Summary
    export function SERVER_EXPENSE_SUMMARY(start: Date, end: Date): string {
        //Date.proto.toISOString() gives 2022-02-15 date format
        const from = start.toISOString().split("T")[0];
        const to = end.toISOString().split("T")[0];

        return SERVER_ALL_TRANSACTIONS + "/expenses" 
        + "?start=" + from +
        "&to=" + to;
    }

    //Build request with dates
    export function SERVER_ALL_TRANSACTIONS_RECENT(limit: Number, offset: number = 0): string {
        return SERVER_ALL_TRANSACTIONS + "/recent" 
        + "?limit=" + limit +
        "&offset=" + Math.max(offset, 0);
    }

    export function SERVER_QUERY_VENDOR_NAME(vendor_name: string) {
        return SERVER_ALL_VENDORS + "/query?name=" + vendor_name;
    }

    export function SERVER_QUERY_VENDOR_ID(id: string, cc: string) {
        return SERVER_ALL_VENDORS + "/query?cc_id=" + id 
        + "&cc=" + cc;
    }

/* REQUESTS */

export const getRequest = async function getRequest(url: string, setData: Function) {

    const config: AxiosRequestConfig<any> = {
        method: 'GET',
        url: url
    }

    console.log("Making call to: " + url)
    await axios(config).then( (resp) =>
    {
        console.log("Transactions returned: " + url );//+ JSON.stringify(resp.data));
        setData(resp.data);
        return resp;
    }).catch( (reason) => {
        console.log("Error from GET request from: " + url + " with error: " + reason);
    });
    //end axios call   
}
//END GENERAL GET METHOD



export const psotRequest = async function postRequest(url: string, data: any) {

    
    const config: AxiosRequestConfig<any> = {
        method: 'POST',
        url: url,
        data: data
    }

    console.log("Making POST call to: " + url + " with data: " + data)
    await axios(config).then( (resp) =>
    {
        console.log("POST returned: " + resp.status + 
        " with data: " + resp.data);//+ JSON.stringify(resp.data));
    }).catch( (reason) => {
        console.log("Error from POST request from: " + url + " with error: " + reason);
    });
    //end axios call   

}