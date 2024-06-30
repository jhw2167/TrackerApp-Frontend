
/*
    Page: Context.ts
    Description: React Context for Frontend Tracker App. Configurations are provided
    by the backend and are stored in a map.

    Author: JHW
    Date: 06/19/2024
*/

//Imports
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* Project imports */
import * as api from './resources/api';


/* Application */

interface ConfigProviderProps {
    children: ReactNode;
  }

 export const CONFIG_KEYS = {
    PLAID_LINK_TOKEN: 'frontend.plaid.dev.token',
    DATA_USE_SENSITIVE_DATA: 'frontend.data.use_sensitive_data',
    DATA_BASE_REIMBURSES_ID : 'frontend.data.base_reimburses_id',
    TRANSACTION_MOST_RECENT_DATE: 'transaction.mostRecentDate'
}


// Create a context with a default value
const ConfigContext = createContext<Map<string, string>>(new Map<string, string>());

// Custom hook to use the ConfigContext
export const useConfig = () => {
  return useContext(ConfigContext);
};

// Provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
 
  const BASE_CONFIG = new Map<string, string>([[api.URI_PARAMS.USER_ID, api.DEFAULT_USER_ID as string]]);
  const [config, setConfig] = useState<Map<string, string>>(new Map<string, string>(BASE_CONFIG));

  useEffect(() => {

    /*
      Local function to extract the JSON config property from server side
      reads data into a map that can be accessed anywhere in the app
    */
    
    const extractConfigs = function( jsonData : any) {
     
      const data = jsonData.data;
      const keys = Object.keys(data);
      const configs = config;
      keys.forEach( (key) => {
        configs.set(key, data[key] as string);
      });

      setConfig(configs);
    }

    //use api.ts getRequest to get the config data
    api.getRequest(api.SERVER_CONFIG, extractConfigs);

  }, []);

  if (config.size === 0) {
    return <div>Loading Account Details from "Demo"...</div>;
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
