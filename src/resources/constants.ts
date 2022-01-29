import { validateLocaleAndSetLanguage } from "typescript";

export const axios = require('axios').default;

//Data Structure Constants
export const TRANS_DATA_ID = "tId"; 
export const TRANS_DATA_PURCHDATE = "purchaseDate"; 
export const TRANS_DATA_AMT = "amount"; 
export const TRANS_DATA_VEND = "vendor"; 
export const TRANS_DATA_CAT = "category"; 
export const TRANS_DATA_BOTFOR = "boughtFor"; 
export const TRANS_DATA_PMETHOD = "payMethod"; 
export const TRANS_DATA_PSTATUS = "payStatus"; 
export const TRANS_DATA_INCOME = "isIncome"; 
export const TRANS_DATA_REIMB = "reimburses";
export const TRANS_DATA_POSTDATE = "postedDate"; 
export const TRANS_DATA_NOTES = "notes";

/* Interfaces */
export interface Transaction {
    tId: string;
    purchasedate: Date;
    amount: Number;
    vendor: string;
    category: string;
    boughtFor: string;
    payMethod: string;
    payStatus: string;
    isIncome: boolean;
    reimburses: string;
    postedDate: Date;
    notes: string;
}

/* FUNCTION CONSTANTS */

//Returns object parsed by categories
export const filterTransactions = function(data: Transaction[], categories: string[], limit: number): Object  {
    let res = Object();

    //Append array for each category
    Object.entries(categories).map(([key, val]) => {
        res[val] = 0;
    })

    //parse through limited transactions to garner results
    Object.entries(data).slice(0, limit).map(([key, value]) => {
        res[value.category]+= value.amount;
    })

    return res;
}