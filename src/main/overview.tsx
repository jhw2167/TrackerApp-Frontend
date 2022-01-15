//overview.tsx - website homepage with grahp, summary, and data charts

//react imports
import React, { useState, useEffect } from 'react';
//import { useCookies } from "react-cookie";
//import { Modal, Button } from 'react-bootstrap';

//project imports
import * as myConstClass from '../resources/api';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../css/Landing.css';


///finances/overview?mn=August&yr=21
//Guess we'll have to take some params here
function Overview() {

    return (
        //page title and logo

        //Large div contains entire vertical length page

            //div for pie graph, upper left

            //div for transactions table, right side entire length

            //div for summary table 1, expenses

            //div for summary table 2, income

        //place modules inside divs at will
        <div>
            <h1>Hello World!</h1>
        </div>
    )
}

export default Overview;