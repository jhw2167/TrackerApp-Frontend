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

/* COLORS */
export const PASTEL_PALETE = [
    //Blues
    '#edf2fb',
    '#d7e3fc',
    '#ccdbfd',
    '#c1d3fe',
    '#abc4ff',

    //Reds
    '#ffe5ec',
    '#ffb3c6',
    '#fb6f92',

    //Greens
    '#a0e8ce',
    '#2fca91',
    '#14563e',

    //Yellow
    '#ffde89',
    '#ffca42',
    '#f9b400'

    //Mix 1:  #a7bed3 // #c6e2e9 // #f1ffc4 // #ffcaaf // #dab894
    //Mix 2:  #70d6ff // #ff70a6 // #ff9770 // #ffd670 // #e9ff70
  ];

  export const colorPicker = function(start: number, total: number): string[]  {
        let picked = [];
        let index = start;
        for (let i = 0; i < total; i++) {
            if(index >= PASTEL_PALETE.length) {
                index = ++start;
            }
            picked.push(PASTEL_PALETE[index])
            index+=6;
        }

        return picked;
  }


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