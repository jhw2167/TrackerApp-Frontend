//api.ts used for storing URL, port num and other constants

//imports
import axios, { AxiosRequestConfig } from 'axios';

export const CONST_VAR = "CONSTANT VARS GO HERE";
export const DOMAIN = "https://jackhenrywelsh.com";
export const PORT = ":443/";

//URI Constants
export const URI_PARAMS = {
    USER_ID: "userId",
    TRANSACTION_ID: "transactionId"

}

//Property Constants
//export const DEFAULT_USER_ID = '20230303JACKHENRYWELSH@GMAIL.COM';
export const DEFAULT_USER_ID = 'DEMO';


//Server calls
export const SERVER_API_BASE = "api/finances"
export const SERVER_USER_BASE = DOMAIN + PORT + SERVER_API_BASE + "/users/{" + URI_PARAMS.USER_ID + "}";

export const SERVER_CONFIG = SERVER_API_BASE + "/server/config";
export const SERVER_ALL_TRANSACTIONS = SERVER_USER_BASE + "/transactions";

export const SERVER_ALL_CATEGORIES = SERVER_ALL_TRANSACTIONS + "/categories";
export const SERVER_ALL_PAYMETHODS = SERVER_ALL_TRANSACTIONS + "/payMethods";
export const SERVER_ALL_BOUGHTFOR = SERVER_ALL_TRANSACTIONS + "/boughtFor";
export const SERVER_ALL_PAYSTATUS = SERVER_ALL_TRANSACTIONS + "/payStatus";

export const SERVER_ALL_VENDORS_BASE = SERVER_USER_BASE + "/vendors";
export const SERVER_ALL_VENDORS = SERVER_ALL_VENDORS_BASE;

/* API Server Data Structures */

export interface SingleStatusResponse{
    status: string;
    data?: any;
    id?: string;
    message?: string;
    error?: string;
}

export interface MultiStatusResponse {
    message: string;
    responses: Array<SingleStatusResponse>;
}

export const SERVER_RESPONSE_STATUS_MAP: Map<string, string[]> = new Map([
    [ SERVER_ALL_TRANSACTIONS, ['CREATED']]
]);

/* AXIOS Setup */

/*
    Description: Axios interceptors for request and response
        200 Response: No errors, forward to caller
        Other Response: Return rejected promise to set the error, no data will be set in calling function
        the error.response.data.message will be set as the banner error to the user in getRequest or postRequest

*/
axios.interceptors.response.use((response) => {
    //console.log("Clean Response: " + JSON.stringify(response));
    return response;
}, (error) => {
    //console.log("Error Response: " + JSON.stringify(error.response.data));
    return Promise.reject(error);
});


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
    export function SERVER_ALL_TRANSACTIONS_RECENT(size: Number, page: number = 0): string {
        return SERVER_ALL_TRANSACTIONS + "/recent" 
        + "?size=" + size +
        "&page=" + Math.max(page, 0);
    }

    export function SERVER_QUERY_VENDOR_NAME(vendor_name: string) {
        return SERVER_ALL_VENDORS + "/query?name=" + vendor_name;
    }

    export function SERVER_QUERY_VENDOR_ID(id: string, cc: string) {
        return SERVER_ALL_VENDORS + "/query?cc_id=" + id 
        + "&cc=" + cc;
    }

/* REQUESTS */

/*
    Description: Hydrate API request URL with user or id parameters
    Parameters: url: string, Array<string> args

    Sample url: "http://localhost:8080/finances/users/{userId}/transactions/{transactionId}"
    Sample args: ["1234@google.com", "5678"]
    Returns: http://localhost:8080/finances/users/1234@google.com/transactions/5678"

*/

export const hydrateURIParams = function(url: string, uriParams: Map<string,string>): string {
    let ret: string = url;
    uriParams.forEach( (v, k) => {
        ret = ret.replace("{" + k + "}", v);
    });
    return ret;
}


export const getRequest = async function getRequest(url: string, setData: Function, setError?: Function) {

    const config: AxiosRequestConfig<any> = {
        method: 'GET',
        url: url
    }

   //console.log("Making call to: " + url)
    await axios(config).then( (resp) =>
    {
        //console.log("Transactions returned: " + url + " " +  JSON.stringify(resp));
        setData(resp.data);
        return resp;
    }).catch( (reason) => {
        let urlStr = url.replace(DOMAIN + PORT, "");
        console.log("Error from GET request from: " + urlStr + " with error: " + reason);
        return {};
    });
    //end axios call   
}
//END GENERAL GET METHOD

export const postRequest = async function postRequest(url: string, data: any, 
    setPostData: ((data: any) => void) = () => {}, setError?: ((data: SingleStatusResponse) => void) ) {

    
    const config: AxiosRequestConfig<any> = {
        method: 'POST',
        url: url,
        data: data
    }

    //console.log("Making POST call to: " + url + " with data: " + JSON.stringify(data))
    await axios(config).then( (resp) =>
    {
        //console.log("POST returned: " + resp.status +  " with data: " + resp.data);//+ JSON.stringify(resp.data));
        if(setPostData) 
          setPostData(resp.data);
    }).catch( (reason: any) => {
        //remove domain and port from URL
        let urlStr = url.replace(DOMAIN + PORT, "");
        console.log("Error from POST request from: " + urlStr + " with error: " + reason);
        if(setError) {
            setError(reason.response.data);
        }
    });
    //end axios call   

}