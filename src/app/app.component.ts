import { Component, Inject, OnInit } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { DOCUMENT } from '@angular/common';
import MetaMaskOnboarding from '@metamask/onboarding';

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

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;
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




  async testModal() {



    // const providerOptions = {
    //   walletconnect: {
    //     package: WalletConnectProvider, // required
    //     options: {
    //       infuraId: "5b62013b0c764aa0a0f58a590e6ce464" // required
    //     }
    //   }
    // };


    // // const web3Modal = new Web3Modal({
    // //   network: "mainnet", // optional
    // //   cacheProvider: true, // optional
    // //   providerOptions // required
    // // });

    // const provider = await web3Modal.connect();

    // const web3 = new Web3(provider);
  }

}
