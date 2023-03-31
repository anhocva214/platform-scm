import { setupContracts, setupWeb3 } from "@redux/contract.redux";
import { useAppDispatch } from "@redux/index";
import { useMetaMask } from "metamask-react";
import React, { ReactNode, useEffect } from "react";
import Web3 from "web3";

type props = {
  children: ReactNode;
};

const MainLayout = (props: props) => {
  const dispatch = useAppDispatch();
  const { connect, status, ethereum } = useMetaMask();

  useEffect(() => {
    (async () => {
      console.log("Status: ", status);
      if (status == "connected") {
        // let Window = window;
        let web3 = new Web3(window.web3.currentProvider);
        await dispatch(setupWeb3(web3));
        await dispatch(setupContracts(web3));
      }
    })();
  }, [status]);

  return <>{props.children}</>;
};

export default MainLayout;
