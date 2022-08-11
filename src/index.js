import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { theme } from './custom-theme'
import reportWebVitals from './reportWebVitals'
import {
  ChakraProvider
} from '@chakra-ui/react'
import store from './actions/store'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <App />
        </Web3ReactProvider>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
