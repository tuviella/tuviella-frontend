class Chain {

  name = "-"
  id = "-"
  symbol = "-"
  rpcUrl = "-"
  blockExplorerUrl = "-"
  tuviellaTokenAddress = "-"
  faucetAddress = "-"
  stakingAddress = "-"
  randomTokenAddress = "-"

  constructor(name, id, symbol, rpcUrl, blockExplorerUrl, tuviellaTokenAddress, faucetAddress, stakingAddress, randomTokenAddress){
    this.name = name
    this.id = id
    this.symbol = symbol
    this.rpcUrl = rpcUrl
    this.blockExplorerUrl = blockExplorerUrl
    this.tuviellaTokenAddress = tuviellaTokenAddress
    this.faucetAddress = faucetAddress
    this.stakingAddress = stakingAddress
    this.randomTokenAddress = randomTokenAddress
  } 
  
}

export default Chain;
