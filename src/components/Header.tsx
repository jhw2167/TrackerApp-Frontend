/* Header component for app, rendered at top of every webpage */

//Imgs
import logo from '../resources/img/logo.png';
import banner from '../resources/img/blank_banner.png';

function Header()  {

    return (
        <div className="row header-row">
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