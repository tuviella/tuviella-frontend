import React, { Component } from 'react'
import Web3 from 'web3'
import TuviellaToken from '../abis/TuviellaToken.json'
import Faucet from '../abis/Faucet.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

const tuViellaAddress = "0xd6940a18e6E145a5695829268f0A8721d63750D4"
const faucetAddress   = "0x44124633fe8f24928b1Dbe9Ed38e36f86D511C11"

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    try {
      const tuviellaToken = new web3.eth.Contract(TuviellaToken.abi, tuViellaAddress)
      this.setState({ tuviellaToken })
      let tuviellaTokenBalance = await tuviellaToken.methods.balanceOf(this.state.account).call(  )
      let faucetTuviellaTokenBalance = await tuviellaToken.methods.balanceOf(faucetAddress).call(  ) 
      this.setState({ tuviellaTokenBalance: tuviellaTokenBalance.toString() })
      this.setState({ faucetTuviellaTokenBalance: faucetTuviellaTokenBalance.toString() })
    } catch(e) {
      window.alert('tuviellaToken contract not deployed to detected network.')
    }

    try {
      const faucet = new web3.eth.Contract(Faucet.abi, faucetAddress)
      this.setState({ faucet })
    } catch(e) {
      window.alert('Faucet contract not deployed to detected network.')
    }

  
    let tuviellaExpiry = await this.state.faucet.methods.getExpiryOf(tuViellaAddress).call()
    console.log(tuviellaExpiry)
    let tuviellaSecs = await this.state.faucet.methods.getSecsOf(tuViellaAddress).call()
    console.log("SECS: " + tuviellaSecs)
    this.setState({ tuviellaSecs: tuviellaSecs.toString()})
    


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

  claimTuviella = async ()  => {
    this.setState({ loading: true })
      this.state.faucet.methods.claim(tuViellaAddress).send({from: this.state.account}).on('transactionHash', (hash) => {
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
      faucetTuviellaTokenBalance: '0',
      tuviellaExpiry: '0',
      tuviellaSecs: '0',
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
      faucetTuviellaTokenBalance={this.state.faucetTuviellaTokenBalance}
      tuviellaSecs={this.state.tuviellaSecs}
      tuviellaExpiry={this.state.tuviellaExpiry}
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
