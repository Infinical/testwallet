import { Component, Inject, OnInit } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { DOCUMENT } from '@angular/common';
import MetaMaskOnboarding from '@metamask/onboarding';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wallet-connect';
  accounts: any
  stateMetamsk = false


  private window: any
  private connector: any

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;

    // Create a connector
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
  }

  ngOnInit() {
    this.testMetamsk()
  }


  testMetamsk() {
    if (typeof this.window.ethereum !== 'undefined') {
      this.stateMetamsk = true
      console.log('MetaMask is installed!');
    } else {
      this.stateMetamsk = false
    }
  }


  onboardMetamsk() {
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
  }



  async initializeMetamask() {
    if (this.window.ethereum) {
      this.window.web3 = new Web3(this.window.ethereum);
      const accounts = await this.window.ethereum.request({ method: 'eth_requestAccounts' });
      this.accounts = accounts
    }
  }


  sendEth() {
    this.window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: this.accounts[0],
            to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
            value: '0x29a2241af62c0000',
            gasPrice: '0x09184e72a000',
            gas: '0x2710',
          },
        ],
      })
      .then((txHash: any) => console.log(txHash))
      .catch((error: any) => console.error);

  }







  initializeWalletConnect() {

    if (!this.connector.connected) {

      this.connector.createSession();
    }

    this.connector.on("connect", (error: any, payload: any) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
    });

    this.connector.on("session_update", (error: any, payload: any) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });

    this.connector.on("disconnect", (error: any, payload: any) => {
      if (error) {
        throw error;
      }

      // Delete connector
    });
  }


  sendWalletCOnnect() {

    const tx = {
      from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3", // Required
      to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359", // Required (for non contract deployments)
      data: "0x", // Required
      gasPrice: "0x02540be400", // Optional
      gas: "0x9c40", // Optional
      value: "0x00", // Optional
      nonce: "0x0114", // Optional
    };

    // Send transaction
    this.connector
      .sendTransaction(tx)
      .then((result: any) => {

        console.log(result);
      })
      .catch((error: any) => {

        console.error(error);
      });
  }

}
