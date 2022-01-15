import React from "react";
import { Route, Routes} from "react-router-dom";
import Overview from './overview';

function Layout() {
    return (
        <Routes>
          
          <Route path="/" element={<Overview />} />
          <Route path="overview" element={<Overview />} >
           {/*  <Route path="summary" element={Overview} /> */}
          </Route>
        </Routes>
          
    );
}

export default Layout;
