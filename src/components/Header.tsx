/* Header component for app, rendered at top of every webpage */

//Imgs
import logo from '../resources/img/logo.png';
import banner from '../resources/img/blank_banner.png';

function Header()  {

    return (
        <header>
            <div className="logoImg d-inline header-div">
                <div className='nested-banner-img'>
                    <img id="banner-img" src={banner}/>
                </div>
                <div className='banner-text'>Tracker</div>
            </div>

            <div className="logo-container">
                <div className='logo-subcontainer' id='feet1'><img src={logo}/></div>
            </div>
        </header>
    )

}

export default Header;