import React, { Component } from 'react'
import viellaIcon from '../viellahash.png'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

class Main extends Component {



  render() {

    const renderTime = ({ remainingTime }) => {
      if (remainingTime === 0) {
        return <div className="timer">Available to Claim</div>;
      }
    
      return (
        <div className="timer">
          <div className="text">You can claim in:</div>
          <div className="value">{remainingTime}</div>
          <div className="text">seconds</div>
        </div>
      );
    };

    return (
      <div id="content" className="mt-3">
        Current Network: {this.props.chainInUse.name}

        <h2>FAUCET</h2>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Your Balance</th>
              <th scope="col">Faucet Balance</th>
              <th scope="col">Time left to claim</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td>{window.web3.utils.fromWei(this.props.tuviellaTokenBalance.toString(), 'Ether')} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
            <td>{window.web3.utils.fromWei(this.props.faucetTuviellaTokenBalance.toString(), 'Ether')} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
            <td>
            <CountdownCircleTimer
              isPlaying={this.props.tuviellaExpiry > 0 ? true : false}
              duration={this.props.tuviellaExpiry > 0 ? this.props.tuviellaExpiry : 0}
              colors={[
                ['#A30000', 0.33],
                ['#004777', 0.33],
                ['#F7B801', 0.33],

              ]}
              onComplete={this.props.updateExpiry()}
            >
              {renderTime}

            </CountdownCircleTimer>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">
            <button
              disabled={this.props.tuviellaExpiry > 0 }
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.claimTuViella()
              }}>
                CLAIM
              </button>
          </div>
        </div>

        <h2>STAKING</h2>

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staked Viellas</th>
              <th scope="col">Viellas Pending to Harvest</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td>{window.web3.utils.fromWei(this.props.stakingStakedViellas.toString(), 'Ether')} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
            <td>{window.web3.utils.fromWei(this.props.stakingPendingViellas.toString(), 'Ether')} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">
            <button
              disabled={this.props.stakingPendingViellas <= 0}
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.harvestTuViella()
              }}>
                HARVEST {this.props.stakingPendingViellas}
              </button>
          </div>
        </div>
        <div className="card mb-4" >

        <div className="card-body">
          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) => {
              event.preventDefault()
              this.props.depositTuViella()
            }}>
              DEPOSIT 10 VIELLAS
            </button>
          </div>
        </div>


      </div>  
    );
  }
}

export default Main;
