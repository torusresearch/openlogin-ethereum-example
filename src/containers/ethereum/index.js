/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { ethers } from "ethers";
import { PageHeader, Button } from "antd";
import { useHistory } from "react-router";
import { verifiers } from "../../utils/config";
import "./style.scss";


function Ethereum() {
  const [loading, setLoading] = useState(false);
  const [sdk, setSdk] = useState(undefined);
  const [accountInfo, setUserAccountInfo] = useState(null);
  
  const history = useHistory();
  useEffect(() => {
    async function initializeOpenlogin() {
      setLoading(true)
      const sdkInstance = new OpenLogin({ clientId: verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
      await sdkInstance.init();
      if (!sdkInstance.privKey) {
        await sdkInstance.login({
          loginProvider: "google",
          redirectUrl: `${window.origin}/ethereum`,
        });
      }
      let provider = ethers.getDefaultProvider();
      let wallet = new ethers.Wallet(sdkInstance.privKey, provider);
      let balance = await wallet.getBalance();
      let address = await wallet.getAddress();
      setUserAccountInfo({balance, address});
      setSdk(sdkInstance);
      setLoading(false)
    }
    initializeOpenlogin();
  }, []);


  const handleLogout = async () => {
    await sdk.logout();
    history.push("/");
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Openlogin x Ethereum"
        extra={[
          <Button key="1" type="primary" onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      />

      {
          loading ?
          <div className="container">
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
               <h1>....loading</h1>
               </div>
               </div>
               : 
               <div className="container">
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
            <div style={{margin:20}}>
              Wallet address: <i>{accountInfo?.address}</i>
            </div>
            <div style={{margin:20}}>
              Balance: <i>{accountInfo?.balance?.toNumber()}</i>
            </div>
            <div style={{margin:20}}>
              Private key: <i>{(sdk && sdk.privKey)}</i>
            </div>
          </div>
        </div>
      }
   
        
    </div>
  );
}

export default Ethereum;
