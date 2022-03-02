import React from "react";
import { Route, Routes, Navigate, useSearchParams, BrowserRouter} from "react-router-dom";
import Overview from "./Overview";
import PostTransactions from "./PostTransactions";

function Layout() {

  //Give me some search params to pass
  let [searchParams, setSearchParams] = useSearchParams();

  //console.log("SP: %s %s ", searchParams.get("mn"), searchParams.get("yr") );
    return (
      /* BrowserRouter sits in App.tsx */
          <Routes>
          <Route path="/overview" element={<Overview 
            mn={searchParams.get("mn")} 
            yr={searchParams.get("yr")}
            setSearchParams={setSearchParams} />} />

          <Route path="/post" element={<PostTransactions/>} />
          <Route path="*" element={<Navigate to="/overview" />} />

           {/*  <Route path="summary" element={Overview} /> */}
           </Routes>          
    );
}

export default Layout;
