/* Layout Module simply lays out our web pages and links them to components */

import { Route, Routes, Navigate, useSearchParams} from "react-router-dom";
import Overview from "./overview";
import PostTransactions from "./PostTransactions";

//import constants
import * as c from '../resources/constants.js';

function Layout() {

  //Give me some search params to pass
  let [searchParams, setSearchParams] = useSearchParams();
  //With baseName creates double path
  //let buildPath = (relativePath: string) => { return c.ROOT + relativePath }
  let buildPath = (relativePath: string) => { return relativePath };

  //console.log("SP: %s %s ", searchParams.get("mn"), searchParams.get("yr") );
    return (
      /* BrowserRouter sits in App.tsx */
          <Routes>
          <Route path="/" element={<Navigate to={buildPath('/overview')} />} />
          <Route path={buildPath('/overview')} element={<Overview 
            mn={searchParams.get("mn")} 
            yr={searchParams.get("yr")}
            setSearchParams={setSearchParams} />} />

          <Route path={buildPath('/post')} element={<PostTransactions/>} />
          <Route path={buildPath('/*')} element={<Navigate to={buildPath('/overview')} />} />

           </Routes>          
    );
}

export default Layout;
