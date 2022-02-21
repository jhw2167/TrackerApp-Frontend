import { validateLocaleAndSetLanguage } from "typescript";
import { filter } from "underscore";

export const axios = require('axios').default;

//Data Structure Constants
export const TRANS_DATA = {
	ID: 'tId', 
	PURCHDATE: 'purchaseDate', 
	AMT: 'amount', 
	VEND: 'vendor', 
	CAT: 'category', 
	BOTFOR: 'boughtFor', 
	PMETHOD: 'payMethod', 
	PSTATUS: 'payStatus', 
	INCOME: 'income', 
	REIMB: 'reimburses',
	POSTDATE: 'postedDate', 
	NOTES: 'notes'
}

export const SUMMARY_DATA = {
    aggregate: 'aggregateCol',
    value: 'value',
    categories: 'categories'
}

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

  //Color picker
    export const colorPicker = function(start: number, total: number): string[]  {
            let picked = new Set<string>();
            let index = start;
            const ERR_COLOR = '#1D1C1A';
            for (let i = 0; i < total; i++) {
                if(index >= PASTEL_PALETE.length) {
                    index %= PASTEL_PALETE.length;
                }
                //console.log("L: %d, Index: %d, val: %s", PASTEL_PALETE.length, index, PASTEL_PALETE.at(index));

                let nextCol = PASTEL_PALETE.at(index);
                if(nextCol) {
                    if(!picked.has(nextCol)) {
                        picked.add(nextCol);
                    } else if(total > PASTEL_PALETE.length) {
                        picked.add(nextCol);
                    } else {
                        i--;
                    }
                }
                
                
                index += ((Math.random() * 3) + 3);
            }

            let res: string[] = [];
            picked.forEach( (value) => {
            //console.log("------- Col: " + value);
            res.push(value);
        })

        return res;
    }

/* UTILITY */
export const MONTHS= ["january","february","march","april","may","june","july",
            "august","september","october","november","december"];
export const MNTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul","aug", "sep", "oct", "nov", "dec"];

    export const convMnYrToTimeFrame = function(mn: string | undefined | null,
         yr: string | undefined | null, asStrings: boolean = false): [Date, Date] {

        //Get Iso month and year
        let temp = -1;
        mn = mn ? mn?.toLocaleLowerCase() : "";
        if(!mn || ( (MNTHS.indexOf(mn)==-1) && (MNTHS.indexOf(mn)==-1) ) ) {
            temp = (new Date(Date.now())).getMonth()+1;
        } else if (mn?.length == 3) {
            temp = MNTHS.indexOf(mn)+1;
        } else {
            temp = MONTHS.indexOf(mn)+1;
        }

        const month: number = temp;
        const year: number = yr ? Number(yr) : (new Date(Date.now())).getFullYear();
        //console.log("M: %d : %s, y: %s : %s", month, mn, year, yr)
        //return dates
        let start: any = new Date(year + "-" + month + "-01");
        let end: any = new Date(( (month == 11) ? year+1 : year) + "-"
         + ((month == 11) ? "1" : month+1) + "-01");

        return [start, end];
    }

    export const properCase = function(a: string): string {
        return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
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

export interface Summary {
    aggregateCol: string,
    value: number,
    categories: string
}

/* FUNCTION CONSTANTS */

//Returns object parsed by categories
export const aggregateTransactions = function(data: Transaction[], categories: string[] | Set<string>, limit: number = Infinity): DataTuple[]  {
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

