//CSS
import '../css/General.css'


function Header()  {

    return (
        <header>
            <div className="logoImg d-inline header-div">
                <div className='nested-banner-img'>
                    <img id="banner-img" src="img/blank_banner.png"/>
                </div>
                <div className='banner-text'>Tracker</div>
            </div>

            <div className="logo-container">
                <div className='logo-subcontainer' id='feet1'><img src="img/logo.png"/></div>
            </div>
        </header>
    )

}

export default Header;