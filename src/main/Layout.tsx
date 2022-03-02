import React from "react";
import { Route, Routes, Navigate, useSearchParams} from "react-router-dom";
import Overview from "./overview";
import PostTransactions from "./PostTransactions";

function Layout() {

  //Give me some search params to pass
  let [searchParams, setSearchParams] = useSearchParams();

  //console.log("SP: %s %s ", searchParams.get("mn"), searchParams.get("yr") );
    return (
        <Routes>
          <Route path="/overview" element={<Overview 
            mn={searchParams.get("mn")} 
            yr={searchParams.get("yr")}
            setSearchParams={setSearchParams} />} />
          <Route path="*" element={<Navigate to="/overview" />} />

           {/*  <Route path="summary" element={Overview} /> */}
        </Routes>
          
    );
}

export default Layout;
