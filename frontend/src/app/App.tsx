import React, {useEffect} from 'react';
import {BrowserRouter} from "react-router-dom";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import {useTelegram} from "@/shared/lib/hooks/useTelegram";

import { RouterView } from './router'
import { SocketProvider } from './socketProvider'
import './App.css';

function App() {
    const { expand } = useTelegram()

    useEffect(() => {
        expand()
        // setTimeout(() => {
        //     alert(`${window.innerWidth}-${window.innerHeight}`)
        // }, 500)
    });

  return (
       <TonConnectUIProvider 
        manifestUrl= 'https://ponke-alpha.vercel.app/tonconnet.json'
        actionsConfiguration={{
            twaReturnUrl: 'https://t.me/Keyng_test_bot'
        }}
    >
        <SocketProvider>
            <BrowserRouter>
                <RouterView />
            </BrowserRouter>
        </SocketProvider>
    </TonConnectUIProvider>
  );
}

export default App;
