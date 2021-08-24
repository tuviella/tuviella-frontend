import Chain from "./Chain"
import {mumbaiFaucetAddress, mumbaiStakingAddress, mumbaiTuViellaAddress, mumbaiRandomTokenAddress, xdaiTuViellaAddress, xdaiFaucetAddress, xdaiStakingAddress, xdaiRandomTokenAddress} from './Contracts'

let chains = []

//Chain: Name, id, Token, rcp, scanner, TuviellaTokenAddress, FaucetAddress, StakingAddress

chains.push(new Chain("xDai", 100, "xDai", "https://rpc.xdaichain.com/", "https://rpc.xdaichain.com/", 
                        xdaiTuViellaAddress, xdaiFaucetAddress, xdaiStakingAddress, xdaiRandomTokenAddress))



/*chains.push(new Chain("BSC-Testnet", 97, "BNB", "https://data-seed-prebsc-1-s1.binance.org:8545/", "https://testnet.bscscan.com", 
                        "0xd6940a18e6E145a5695829268f0A8721d63750D4", "0x44124633fe8f24928b1Dbe9Ed38e36f86D511C11", "0x7B7EC6bd3068d50B5Ea7970B72CdA2Dc74B11683"))
*/
chains.push(new Chain("Mumbai Testnet", 80001, "MATIC", "https://rpc-mumbai.matic.today", "https://mumbai-explorer.matic.today", 
                        mumbaiTuViellaAddress, mumbaiFaucetAddress, mumbaiStakingAddress, mumbaiRandomTokenAddress))

export default chains;

