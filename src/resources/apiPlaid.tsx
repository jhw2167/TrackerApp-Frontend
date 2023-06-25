//apiPlaid.ts used for providing simple interface betweeen react and plaid

import React, { useEffect, useContext, useState } from "react";
import { usePlaidLink } from "react-plaid-link"


//imports
import * as api from "./api";

//Server calls
export const SERVER_USERS_PLAID = (userId: string) => {
    api.DOMAIN + api.PORT + "finances/users/plaid" + userId ;
}

export const SERVER_POST_TOKEN = (userId: string) => {
    return SERVER_USERS_PLAID(userId) + "/token"
}

export interface initPlaidLinkProps {
  userId: string;
}

/*Utility functions */


/* MODULES */
export function initiatePlaidLinkButton(props: initPlaidLinkProps ) {

    const userId = props.userId;
    //const [linkToken, updateLinkToken] = useState("");
    const [serverPostTokenResponse, updateServerPostTokenResponse] = useState<any>({});

    const onSuccess = (publicToken: string) => {
        api.postRequest(SERVER_POST_TOKEN(userId),
         {"plaidToken": publicToken},
         updateServerPostTokenResponse);
      }
  
    const config: Parameters<typeof usePlaidLink>[0] = {
      token: "",
      onSuccess,
    };
  
    const { open, ready } = usePlaidLink(config);

    return (
      <div id="plaid-button-wrapper-div">
       <button id="plaid-button" type="button" onClick={() => open()} disabled={!ready}>
        Add Account
       </button>
      </div>
    );

}



/* REQUESTS */

