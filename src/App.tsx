import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from "react-dom";

//project
import Layout from './main/Layout';

//css
import './css/General.css';
import './css/misc/Background.css'

//lib components
  import '../node_modules/react-vis/dist/style.css';


  //high level
  import './css/main/PostTransactions.css'
  import './css/main/Overview.css'
  import './css/components/subcomponents/DropDown.css'

  //Main components
  import './css/components/AddNewTrans.css'
  import './css/components/DataTable.css'
  import './css/components/SubTable.css'
  import './css/components/DataGraph.css';
  

  //Sub components


function App() {
  return (
    <BrowserRouter basename='/finances'>
        <Layout />
    </BrowserRouter>
  );
}

export default App;
