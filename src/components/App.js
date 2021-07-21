import React, { Component } from 'react'
import Web3 from 'web3'
import TuviellaToken from '../abis/TuviellaToken.json'
import Faucet from '../abis/Faucet.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

const tuViellaAddress = "0x5b44ddf0262ece7b2453b01202e567baed58690f"
const faucetAddress = "0x51099aC96b0F60f5942C320f2372c7Eb10F5ed33"
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    if(tuViellaAddress) {
      const tuviellaToken = new web3.eth.Contract(TuviellaToken.abi, tuViellaAddress)
      this.setState({ tuviellaToken })
      let tuviellaTokenBalance = await tuviellaToken.methods.balanceOf(this.state.account).call()
      this.setState({ tuviellaTokenBalance: tuviellaTokenBalance.toString() })
    } else {
      window.alert('tuviellaToken contract not deployed to detected network.')
    }

    if(faucetAddress) {
      const faucet = new web3.eth.Contract(Faucet.abi, faucetAddress)
      this.setState({ faucet })
    } else {
      window.alert('Faucet contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  claimTuviella = () => {
    this.setState({ loading: true })
      this.state.faucet.methods.claim(faucetAddress).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      tuviellaToken: {},
      faucet: {},
      tuviellaTokenBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        tuviellaTokenBalance={this.state.tuviellaTokenBalance}
        claimTuviella={this.claimTuviella}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
