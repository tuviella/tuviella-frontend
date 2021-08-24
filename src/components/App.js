import React, { Component } from 'react'
import Web3 from 'web3'
import TuviellaToken from '../abis/TuviellaToken.json'
import RandomToken from '../abis/randomToken.json'
import FaucetAbi from '../abis/Faucet.json'
import StakingAbi from '../abis/Staking.json'
import Navbar from './Navbar'
import Staking from './Staking'
import './App.css'
import chains from './AvailableChains'
import Faucet from './Faucet'
import AppInfo from './AppInfo'
import ChainInfo from './ChainInfo'
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
      this.setState({ loading: "INVALID_CHAIN" })
    } else {
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

  addTuviellaToken = async ()  => {
    this.setState({ loading: 'TRANSACTION' })
    try {
      const provider = window.web3.currentProvider

      await provider.sendAsync({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: this.state.chainInUse.tuviellaTokenAddress, // The address that the token is at.
            symbol: "TVT", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
            image: "data:image/jpeg;base64,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", // A string url of the token logo
          },
        },
      });
      this.setState({ loading: 'FALSE' })
    } catch (error) {
      console.log(error);
    }
  }

  claimTuViella = async ()  => {
    this.setState({ loading: 'TRANSACTION' })
      this.state.faucet.methods.claim(this.state.chainInUse.tuviellaTokenAddress).send({from: this.state.account}).on('receipt', (hash) => {
        //this.setState({ loading: 'FALSE' })
        window.location.reload()
      })
  }

  depositTuViella = async (ammountToDeposit)  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.tuviellaToken.methods.approve(this.state.chainInUse.stakingAddress, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
        this.state.staking.methods.deposit(0, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
          //this.setState({ loading: 'FALSE' })
          window.location.reload()
        })
    })
  }

  harvestTuViella = async ()  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.brrr(0).send({from: this.state.account}).on('receipt', async (hash) =>  {
        //let stakingPendingViellas = await this.state.staking.methods.pendingViellas(0, this.state.account).call()
        //this.setState({ loading: 'FALSE', stakingPendingViellas: stakingPendingViellas })
        window.location.reload()

    })
  }

  withdrawTuViella = async (ammountToWithdraw)  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.withdraw(0, window.web3.utils.toWei(ammountToWithdraw.toString(), 'Ether')).send({from: this.state.account}).on('receipt', async (hash) =>  {
        //let stakingPendingViellas = await this.state.staking.methods.pendingViellas(0, this.state.account).call()
        //this.setState({ loading: 'FALSE', stakingPendingViellas: stakingPendingViellas })
        window.location.reload()

    })
  }

  //Just for admin use
  createRandomTokenPool = async ()  => {
    this.state.staking.methods.add(1000, this.state.chainInUse.randomTokenAddress, 1).send({from: this.state.account})
  }

  depositRandomToken = async (ammountToDeposit)  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.randomToken.methods.approve(this.state.chainInUse.stakingAddress, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
        this.state.staking.methods.deposit(1, window.web3.utils.toWei(ammountToDeposit.toString(), 'Ether')).send({from: this.state.account}).on('receipt', (hash) => {
          //this.setState({ loading: 'FALSE' })
          window.location.reload()

        })
    })
  }

  harvestRandomToken = async ()  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.brrr(1).send({from: this.state.account}).on('receipt', async (hash) =>  {
        //let stakingPendingRandomToken = await this.state.staking.methods.pendingViellas(1, this.state.account).call()
        //this.setState({ loading: 'FALSE', stakingPendingRandomToken: stakingPendingRandomToken })
        window.location.reload()

    })
  }

  withdrawRandomToken = async (ammountToWithdraw)  => {
    this.setState({ loading: 'TRANSACTION'  })
      this.state.staking.methods.withdraw(1, window.web3.utils.toWei(ammountToWithdraw.toString(), 'Ether')).send({from: this.state.account}).on('confirmation', async (hash) =>  {
        //let stakingPendingRandomToken = await this.state.staking.methods.pendingViellas(1, this.state.account).call()
        //this.setState({ loading: 'FALSE', stakingPendingRandomToken: stakingPendingRandomToken })
        window.location.reload()

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
    if(this.state.loading === 'TRANSACTION') {
      content = <div><h2>Esperando al puto metamask...</h2><img src={dancingViello} className="d-inline-block align-top" alt="" /></div>
    } 

    if(this.state.loading === 'WEB3') {
      content = <div><h2>Cargando viellas...</h2><img src={dancingViello} className="d-inline-block align-top" alt="" /></div>
    } 
    
    if(this.state.loading === 'INVALID_CHAIN') {
      content = chains.map(function(chain, i){
        return <ChainInfo chain={chain} key={i} />;
      })

      content = <div>
      No hemos encontrado tus viellas en esta red, pero puedes buscarla en cualquiera de las que te mostramos a continuación: <br></br><br></br>
      {content}
      </div>
    } 
    
    if(this.state.loading === 'FALSE' && this.state.loading !== 'INVALID_CHAIN') {
      content = <div>
        <AppInfo chainInUse={this.state.chainInUse} addTuviellaToken={this.addTuviellaToken}/>
        <h2>¿Necesitas una Viella?</h2>
        <Faucet
          tuviellaTokenBalance={this.state.tuviellaTokenBalance}
          faucetTuviellaTokenBalance={this.state.faucetTuviellaTokenBalance}
          tuviellaSecs={this.state.tuviellaSecs}
          tuviellaExpiry={this.state.tuviellaExpiry}
          claimTuViella={this.claimTuViella}
          updateExpiry={this.updateExpiry}/>   
        <h2>Pon a tus viellas o tus tokens más preciados en remojo</h2>
        <Staking
        deposit={this.depositTuViella}
        withdraw={this.withdrawTuViella}
        harvest={this.harvestTuViella}
        stakingPending={this.state.stakingPendingViellas}
        stakingStaked={this.state.stakingStakedViellas}
        chainInUse={this.state.chainInUse}
        tokenBalance={this.state.tuviellaTokenBalance}
        claimTuViella={this.claimTuViella}
        tokenName="tuViella"  
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
