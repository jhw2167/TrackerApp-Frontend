import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from "react-dom";

//project
import Layout from './main/Layout';
//css
import './css/App.css';

function App() {
  return (
    <BrowserRouter basename='/finances'>
        <Layout />
    </BrowserRouter>
  );
}

export default App;
