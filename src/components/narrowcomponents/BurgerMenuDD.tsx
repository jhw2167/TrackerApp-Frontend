
//React imports
import { useState } from "react";
import * as CSS from 'csstype';

//libraries
import * as _ from 'underscore';

//Resources
import * as c from "../../resources/constants";
import {DropDown, DropDownProps, DDHtmlStructure} from "../subcomponents/DropDown";


export interface BurgerMenuDDProps {
    styeclass?: string;
    transition?: string; //below, replace
    options: c.LinkedTextJSX[];
}

//Styles

const REPLACE_STYLE: CSS.Properties = {
    ['opacity' as any]: 0,
    ['transition' as any]: 'opacity 1s',
}


function BurgerMenuDD(props: BurgerMenuDDProps) {
    const sc = (props.styeclass) ? props.styeclass : '';
    const replace = (props.transition) ? (props.transition.toUpperCase()=='REPLACE') : false ;

    /* States */
    const [isOpen, setOpen] = useState(false);

    /* JSX */
    const dropDownJsx = (data: c.LinkedText[] | undefined) => {
        if(!data)
          return null;
  
        let ddProps: DropDownProps = {data: _.clone(data), styleClass: sc, addStyleClasses: {}};
          ddProps.addStyleClasses = {
          tr: sc + 'dd-row-anim'+' burger option', 
          div: sc + 'burger' + ((isOpen)?" open":"")
        };
          
            return <DropDown {...ddProps}/>;
      }

    return (
        <div className={sc+"burger-menu-wrapper"}>
          <div className={sc+"burger-menu" + ((isOpen)?" open":"")} onClick={(e)=>setOpen(!isOpen)}>
            <div className={sc+"burger-icon"} style={(replace) ? REPLACE_STYLE : {}}>
                <span className={sc+"burger-bar "+ ((isOpen) ? 'open':'')}></span>
                <span className={sc+"burger-bar "+ ((isOpen) ? 'open':'')}></span>
                <span className={sc+"burger-bar "+ ((isOpen) ? 'open':'')}></span>
            </div>
         <div className={sc+"burger-list-wrapper"}>
           {dropDownJsx(props.options)}
         </div>
       </div>
      </div>
    )
}

export default BurgerMenuDD;