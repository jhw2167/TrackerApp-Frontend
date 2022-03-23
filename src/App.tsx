import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from "react-dom";

//project
import Layout from './main/Layout';

//css
import './css/General.css';
import './css/misc/Background.css'

  //high level
  import './css/main/PostTransactions.css'
  import './css/main/Overview.css'

  //lib components
  import '../node_modules/react-vis/dist/style.css';

  //Main components
  import './css/components/SubTable.css'
  import './css/components/DataTable.css'
  import './css/components/DataGraph.css';
  import './css/components/AddNewTrans.css'

  //Sub components



import './css/components/subcomponents/DropDown.css'

function App() {
  return (
    <BrowserRouter basename='/finances'>
        <Layout />
    </BrowserRouter>
  );
}

export default App;
