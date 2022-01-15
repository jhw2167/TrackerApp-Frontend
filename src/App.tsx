import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from "react-dom";

//project
import Layout from './main/Layout';

//Resources
import logo from './logo.svg';

//css
import './css/App.css';

function App() {
  return (
    <BrowserRouter>
        <Layout />
    </BrowserRouter>
  );
}

export default App;
