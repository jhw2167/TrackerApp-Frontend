import { BrowserRouter } from 'react-router-dom';
import { render } from "react-dom";

//project
import Layout from './main/Layout';
import { ConfigProvider } from './Context';

//css
import './css/General.css';
import './css/Header.css';
import './css/misc/Background.css';
import './components/narrowcomponents/CSS/BurgerMenuDD.css';

  //Animations
  import './css/animations.scss';

//lib components
  import '../node_modules/react-vis/dist/style.css';

  //Project libs
  import './css/components/subcomponents/DropDown.css'
  import './css/components/subcomponents/Overlay.css'

  //Main components
  import './css/components/AddNewTrans.css'
  import './css/components/DataTable.css'
  import './css/components/SubTable.css'
  import './css/components/DataGraph.css';
  
  //webpages
  import './css/main/PostTransactions.css'
  import './css/main/Overview.css'


function App() {

  return (
    <BrowserRouter basename='/finances'>
      <ConfigProvider>
        <Layout />
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
