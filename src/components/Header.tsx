/* Header component for app, rendered at top of every webpage */
import { useEffect, useState } from 'react';


//Project imports
import * as context from '../Context';
import * as c from '../resources/constants';
import * as api from '../resources/api';
import '../components/narrowcomponents/BurgerMenuDD'


//Imgs
import logo from '../resources/img/logo.png';
import banner from '../resources/img/blank_banner.png';
import BurgerMenuDD, { BurgerMenuDDProps } from '../components/narrowcomponents/BurgerMenuDD';
import * as plaid from '../resources/apiPlaid';



function Header()  {

    const PLAID_PROPS: plaid.initPlaidLinkProps = {
        linkToken: context.useConfig().get(context.CONFIG_KEYS.PLAID_LINK_TOKEN) as string,
        userId:  context.useConfig().get(api.URI_PARAMS.USER_ID) as string
    }

    const [burgerMenuOpts, updateBurgerMenuOptions] = useState<BurgerMenuDDProps>(
        {
            styeclass: "header ",
            transition: "below",
            options: [
                {text: "Overview", openIn:0, url:"/finances/overview"},
                {text: "Post", openIn:0, url:"/finances/post"},
                {text: "", jsx: plaid.InitiatePlaidLinkButton(PLAID_PROPS) }            
         ]
        }
    );

    return (
        <div className="row header-row">
            <BurgerMenuDD {...burgerMenuOpts}/>    
                <div className='nested-banner-img'>
                    <img id="banner-img" src={banner}/>
                </div>
            
            <div className="logo-title-container row">
            <div className='col banner-text'>Tracker</div>
            <div className="col logo-container">
                <div className='logo-subcontainer' id='feet1'><img src={logo}/></div>
            </div>
            </div>
        
        </div>
    )

}

export default Header;