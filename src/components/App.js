import React, { Component } from 'react'
import Web3 from 'web3'
import TuviellaToken from '../abis/TuviellaToken.json'
import Faucet from '../abis/Faucet.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'
import chains from './AvailableChains'

const tuViellaAddress = "0x821B794bd6Fd2C696CCB4A36eCfe44ae292C0fBB"
const faucetAddress   = "0x8c26391Db9a262F6e3cDc25ae881bAe7e6Fa31eB"
//const stakingAddress   = "0x1d3Ec7C80CE511985670dB3276ab016C49df14Af"

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    let chainId = await web3.eth.getChainId()
    let chainInUse

    for (let chainIndex in chains){
      if(chains[chainIndex].id === chainId){
        chainInUse = chains[chainIndex]
      }
    }

    if(!chainInUse){
      //TODO: Get 1 of available chain from the ones defined in chains from availableChains file
      //Try to install chain?
      window.alert('Your network is not supported, Connect to BSC-TESTNET')
    }
    
    this.setState({ chainInUse })
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

    //TODO: Este dato no llega bien :(
    let tuviellaExpiry = await this.state.faucet.methods.getExpiryOf(this.state.account, tuViellaAddress).call()
    let tuviellaSecs = await this.state.faucet.methods.getSecsOf(tuViellaAddress).call()
    this.setState({ tuviellaExpiry: tuviellaExpiry.toString(), tuviellaSecs: tuviellaSecs.toString()})
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
      loading: true,
      chainInUse: undefined
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
      chainInUse={this.state.chainInUse}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account}
         />
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
