import React, { Component } from 'react'
import Web3 from 'web3'
import TuviellaToken from '../abis/TuviellaToken.json'
import RandomToken from '../abis/randomToken.json'
import FaucetAbi from '../abis/Faucet.json'
import StakingAbi from '../abis/Staking.json'
import Navbar from './Navbar'
import Staking from './Staking'
import StakingViellas from './StakingViellas'
import './App.css'
import chains from './AvailableChains'
import Faucet from './Faucet'
import AppInfo from './AppInfo'
import dancingViello from '../dancingViello.gif'


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    let chainId = await web3.eth.getChainId()
    let chainInUse = null

    

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
      const tuviellaToken = new web3.eth.Contract(TuviellaToken.abi, chainInUse.tuviellaTokenAddress)
      this.setState({ tuviellaToken })
      let tuviellaTokenBalance = await tuviellaToken.methods.balanceOf(this.state.account).call(  )
      let faucetTuviellaTokenBalance = await tuviellaToken.methods.balanceOf(chainInUse.faucetAddress).call(  ) 
      this.setState({ tuviellaTokenBalance: tuviellaTokenBalance.toString() })
      this.setState({ faucetTuviellaTokenBalance: faucetTuviellaTokenBalance.toString() })
    } catch(e) {
      window.alert('tuviellaToken contract not deployed to detected network.')
    }

    try {
      const randomToken = new web3.eth.Contract(RandomToken.abi, chainInUse.randomTokenAddress)
      this.setState({ randomToken })
      let randomTokenBalance = await randomToken.methods.balanceOf(this.state.account).call(  )
      this.setState({ randomTokenBalance: randomTokenBalance.toString() })
    } catch(e) {
      window.alert('randomToken contract not deployed to detected network.')
    }

    try {
      const faucet = new web3.eth.Contract(FaucetAbi.abi, chainInUse.faucetAddress)
      this.setState({ faucet })
    } catch(e) {
      window.alert('Faucet contract not deployed to detected network.')
    }

    try {
      const staking = new web3.eth.Contract(StakingAbi.abi, chainInUse.stakingAddress)
      this.setState({ staking })
    } catch(e) {
      window.alert('Staking contract not deployed to detected network.')
    }

    let tuviellaExpiry = await this.state.faucet.methods.getExpiryOf(this.state.account, chainInUse.tuviellaTokenAddress).call()
    let tuviellaSecs = await this.state.faucet.methods.getSecsOf(chainInUse.tuviellaTokenAddress).call()
    let stakingStakedViellas = await this.state.staking.methods.userInfo(0, this.state.account).call()

    let stakingPendingRandomToken = await this.state.staking.methods.userInfo(1, this.state.account).call()
    let stakingStakedRandomToken = await this.state.staking.methods.userInfo(1, this.state.account).call()

    let stakingPendingViellas = await this.state.staking.methods.pendingViellas(0, this.state.account).call()

    this.setState({ stakingPendingRandomToken:stakingPendingRandomToken[1], stakingStakedRandomToken:stakingStakedRandomToken[0], stakingPendingViellas: stakingPendingViellas, stakingStakedViellas: stakingStakedViellas[0],tuviellaExpiry: tuviellaExpiry, tuviellaSecs: tuviellaSecs})
    this.setState({ loading: 'FALSE' })
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

  claimTuViella = async ()  => {
    this.setState({ loading: 'TRANSACTION' })
      this.state.faucet.methods.claim(this.state.chainInUse.tuviellaTokenAddress).send({from: this.state.account}).on('receipt', (hash) => {
        this.setState({ loading: 'FALSE' })
      })
  }

  depositTuViella = async (ammountToDeposit)  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.tuviellaToken.methods.approve(this.state.chainInUse.stakingAddress, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
        this.state.staking.methods.deposit(0, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
          this.setState({ loading: 'FALSE' })
        })
    })
  }

  harvestTuViella = async ()  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.brrr(0).send({from: this.state.account}).on('receipt', async (hash) =>  {
        let stakingPendingViellas = await this.state.staking.methods.pendingViellas(0, this.state.account).call()
        this.setState({ loading: 'FALSE', stakingPendingViellas: stakingPendingViellas })
    })
  }

  withdrawTuViella = async (ammountToWithdraw)  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.withdraw(0, window.web3.utils.toWei(ammountToWithdraw.toString(), 'Ether')).send({from: this.state.account}).on('receipt', async (hash) =>  {
        let stakingPendingViellas = await this.state.staking.methods.pendingViellas(0, this.state.account).call()
        this.setState({ loading: 'FALSE', stakingPendingViellas: stakingPendingViellas })
    })
  }

  //Just for admin use
  createRandomTokenPool = async ()  => {
    this.state.staking.methods.add(1000, this.state.chainInUse.randomTokenAddress, 1).send({from: this.state.account})
  }

  depositRandomToken = async (ammountToDeposit)  => {
    console.log(ammountToDeposit+ "!!!!!!");
    this.setState({ loading: 'TRANSACTION'  })
      this.state.randomToken.methods.approve(this.state.chainInUse.stakingAddress, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
        this.state.staking.methods.deposit(1, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
          this.setState({ loading: 'FALSE' })
        })
    })
  }

  harvestRandomToken = async ()  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.brrr(1).send({from: this.state.account}).on('receipt', async (hash) =>  {
        let stakingPendingRandomToken = await this.state.staking.methods.pendingViellas(1, this.state.account).call()
        this.setState({ loading: 'FALSE', stakingPendingRandomToken: stakingPendingRandomToken })
    })
  }

  withdrawRandomToken = async (ammountToWithdraw)  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.withdraw(1, window.web3.utils.toWei(ammountToWithdraw.toString(), 'Ether')).send({from: this.state.account}).on('receipt', async (hash) =>  {
        let stakingPendingRandomToken = await this.state.staking.methods.pendingViellas(1, this.state.account).call()
        this.setState({ loading: 'FALSE', stakingPendingRandomToken: stakingPendingRandomToken })
    })
  }

  updateExpiry = async ()  => {
    let tuviellaExpiry = await this.state.faucet.methods.getExpiryOf(this.state.account, this.state.chainInUse.tuviellaTokenAddress).call()
    this.setState({ tuviellaExpiry: tuviellaExpiry })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      tuviellaToken: {},
      faucet: {},
      staking: {},
      stakingPendingViellas: 0,
      stakingStakedViellas: 0,
      tuViellaTokenBalance: '0',
      faucetTuViellaTokenBalance: '0',
      tuviellaExpiry: 0,
      tuviellaSecs: 0,
      loading: 'WEB3',
      chainInUse: undefined,
      ammountToDeposit: 0,
      randomToken: {},
      randomTokenBalance: '0',
      stakingPendingRandomToken: 0,
      stakingStakedRandomToken: 0
    }
  }

  render() {
    let content
    if(this.state.loading == 'TRANSACTION') {
      content = <div><h2>Waiting transaction...</h2><img src={dancingViello} className="d-inline-block align-top" alt="" /></div>
    } 

    if(this.state.loading == 'WEB3') {
      content = <div><h2>Loading Page...</h2><img src={dancingViello} className="d-inline-block align-top" alt="" /></div>
    } 
    
    if(this.state.loading == 'FALSE') {
      content = <div>
        <AppInfo chainInUse={this.state.chainInUse}/>
        <Faucet
          tuviellaTokenBalance={this.state.tuviellaTokenBalance}
          faucetTuviellaTokenBalance={this.state.faucetTuviellaTokenBalance}
          tuviellaSecs={this.state.tuviellaSecs}
          tuviellaExpiry={this.state.tuviellaExpiry}
          claimTuViella={this.claimTuViella}
          updateExpiry={this.updateExpiry}/>   
        <StakingViellas
        depositTuViella={this.depositTuViella}
        withdrawTuViella={this.withdrawTuViella}
        harvestTuViella={this.harvestTuViella}
        stakingPendingViellas={this.state.stakingPendingViellas}
        stakingStakedViellas={this.state.stakingStakedViellas}
        chainInUse={this.state.chainInUse}
        tuviellaTokenBalance={this.state.tuviellaTokenBalance}
        faucetTuviellaTokenBalance={this.state.faucetTuviellaTokenBalance}
        tuviellaSecs={this.state.tuviellaSecs}
        tuviellaExpiry={this.state.tuviellaExpiry}
        claimTuViella={this.claimTuViella}
        updateExpiry={this.updateExpiry}  
        />
        <Staking
        deposit={this.depositRandomToken}
        withdraw={this.withdrawRandomToken}
        harvest={this.harvestRandomToken}
        stakingPending={this.state.stakingPendingRandomToken}
        stakingStaked={this.state.stakingStakedRandomToken}
        chainInUse={this.state.chainInUse}
        tokenBalance={this.state.randomTokenBalance}
        tokenName="randomRoken"
        />
      </div>
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
