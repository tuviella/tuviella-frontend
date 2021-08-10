class Chain {

  name = "-"
  id = "-"
  symbol = "-"
  rpcUrl = "-"
  blockExplorerUrl = "-"
  tuviellaTokenAddress = "-"
  faucetAddress = "-"

  constructor(name, id, symbol, rpcUrl, blockExplorerUrl, tuviellaTokenAddress, faucetAddress){
    this.name = name
    this.id = id
    this.symbol = symbol
    this.rpcUrl = rpcUrl
    this.blockExplorerUrl = blockExplorerUrl
    this.tuviellaTokenAddress = tuviellaTokenAddress
    this.faucetAddress = faucetAddress
  }
  
}

export default Chain;
