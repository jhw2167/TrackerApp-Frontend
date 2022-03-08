/* Layout Module simply lays out our web pages and links them to components */

import { Route, Routes, Navigate, useSearchParams, BrowserRouter} from "react-router-dom";
import Overview from "./overview";
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
          <Route path="*" element={<Navigate to="/post" />} />

           </Routes>          
    );
}

export default Layout;
