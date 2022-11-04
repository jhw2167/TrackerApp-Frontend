/* Header component for app, rendered at top of every webpage */

//Project imports
import '../components/narrowcomponents/BurgerMenuDD'

//Imgs
import logo from '../resources/img/logo.png';
import banner from '../resources/img/blank_banner.png';
import BurgerMenuDD, { BurgerMenuDDProps } from '../components/narrowcomponents/BurgerMenuDD';

const B_MENU_OPTS: BurgerMenuDDProps = {
    styeclass: "header ",
    transition: "below",
    options: [{text: "Overview", openIn:0, url:"/finances/overview"},
            {text: "Post", openIn:0, url:"/finances/post"}
 ]
}

function Header()  {

    return (
        <div className="row header-row">
            <BurgerMenuDD {...B_MENU_OPTS}/>    
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