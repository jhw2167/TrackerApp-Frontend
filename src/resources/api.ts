//api.ts used for storing URL, port num and other constants

//imports
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

export const CONST_VAR = "CONSTANT VARS GO HERE";
export const DOMAIN = "http://localhost";
export const PORT = ":8080/";

//Server calls
export const SERVER_ALL_TRANSACTIONS = DOMAIN + PORT + "transactions";
export const SERVER_ALL_CATEGORIES = SERVER_ALL_TRANSACTIONS + "/categories";


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

/* REQUESTS */

export const getRequest = async function getRequest(url: string, setData: Function) {

    const config: AxiosRequestConfig<any> = {
        method: 'GET',
        url: url
    }

    await axios(config).then( (resp) =>
    {
        //console.log("Transactions returned: " + resp.data.toString() );
        setData(resp.data);
    }).catch( (reason) => {
        console.log("Error from GET request from: " + url + " with error: " + reason);
    });
    //end axios call   
}
//END GENERAL GET METHOD