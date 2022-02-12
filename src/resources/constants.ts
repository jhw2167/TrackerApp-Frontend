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
    '#3D426B',
    '#89CFF0',
    '#abc4ff',

    //Reds
    '#ffe5ec',
    '#ffb3c6',
    '#fb6f92',

    //Greens
    '#a0e8ce',
    '#DAF7A6',
    '#14563e',

    //Yellow
    '#ffde89',
    '#ffca42',
    '#f9b400',

    //Pinks/Purp
    '#D77FA1',
    '#FF0048',
    '#B983FF',

    //Greens Again 
    '#C6D57E',
    '#CDF2CA',
    '#E7FBBE',

    //Red/Orange
    '#FF7878',
    '#F6AE99',
    '#ff8000',

    //Blues again
    '#99FEFF',
    '#316B83',
    '#11324D'


    //Mix 1:  #a7bed3 // #c6e2e9 // #f1ffc4 // #ffcaaf // #dab894
    //Mix 2:  #70d6ff // #ff70a6 // #ff9770 // #ffd670 // #e9ff70
  ];

  export const colorPicker = function(start: number, total: number): string[]  {
        let picked = new Set<string>();
        let index = start;
        const ERR_COLOR = '1D1C1A';
        for (let i = 0; i < total; i++) {
            if(index >= PASTEL_PALETE.length) {
                index = ++start;
            }
            //console.log("L: %d, Index: %d, val: " + PASTEL_PALETE[index], PASTEL_PALETE.length, index);
            if(!picked.has(PASTEL_PALETE[index])) {
                picked.add(PASTEL_PALETE.at(index) || ERR_COLOR);
            } else if(total > PASTEL_PALETE.length) {
                picked.add(PASTEL_PALETE.at(index) || ERR_COLOR);
            } else {
                i--;
            }
            
            index+= ((Math.random() * 3) + 3);
        }

        let res: string[] = [];
        picked.forEach( (value) => {
        res.push(value);
    })

    return res;
  }


/* Interfaces */
export interface Transaction {
    tId: string;
    purchasedate: Date;
    amount: number;
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

export interface DataTuple {
    label: string;
    data: Object;
}

/* FUNCTION CONSTANTS */

//Returns object parsed by categories
export const aggregateTransactions = function(data: Transaction[], categories: string[], limit: number): DataTuple[]  {
    let map: Map<string, number> = new Map<string, number>();

    //Append array for each category
    Object.entries(categories).map(([key, val]) => {
        map.set(val, 0);
    })

    //parse through limited transactions to garner results
    Object.entries(data).slice(0, limit).map(([key, value]) => {
       map.set(value.category, (map.get(value.category) || 0) + value.amount);
    })

    //Return array of DataTuples
    let res: DataTuple[] = [];
    map.forEach( (value, key) => {
        res.push({label: key, data: value});
    })

    return res;
}