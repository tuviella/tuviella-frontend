import React, { Component } from 'react'

class ChainInfo extends Component {

  render() {

    return ( 
    <div id="chainInfo">
      <h3>{this.props.chain.name}</h3>
      <h5>Info</h5>
      <p><b>ID: </b>{this.props.chain.id}</p>
      <p><b>Symbol: </b>{this.props.chain.symbol}</p>
      <p><b>rpcUrl: </b>{this.props.chain.rpcUrl}</p>
      <p><b>blockExplorerUrl: </b>{this.props.chain.blockExplorerUrl}</p>
      <h3>Tokens</h3>
      <p><b>TuviellaTokenAddress: </b>{this.props.chain.tuviellaTokenAddress}</p>
      <p><b>randomTokenAddress: </b>{this.props.chain.randomTokenAddress}</p>
      <p><b>faucetAddress: </b>{this.props.chain.faucetAddress}</p>
      <p><b>stakingAddress: </b>{this.props.chain.stakingAddress}</p>
      <br></br>
    </div>
    );
  }
}

export default ChainInfo;
