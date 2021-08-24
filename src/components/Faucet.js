import React, { Component } from 'react'
import viellaIcon from '../viellahash.png'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'


class Faucet extends Component {

  render() {

    const renderTime = ({ remainingTime }) => {
      if (remainingTime === 0) {
        return <div className="timer" margin="auto" ><button
        disabled={this.props.tuviellaExpiry > 0 }
        type="submit"
        className="btn btn-link btn-block btn-sm"
        onClick={(event) => {
          event.preventDefault()
          this.props.claimTuViella()
        }}>
          CLAIM
        </button>
        </div>;
      }
    
      return (
        <div className="timer">
          <div className="text">You can claim in:</div>
          <div className="value">{(Math.floor(remainingTime / 60)) + ":" +  Math.floor(remainingTime % 60)}</div>
        </div>
      );
    };

    return ( 
    <div id="faucet" className="mt-3">

    <h3>FAUCET</h3>
    <table className="table table-borderless text-muted text-center">
      <thead>
        <tr>
          <th scope="col">Your Balance</th>
          <th scope="col">Faucet Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td>{Math.round(window.web3.utils.fromWei(this.props.tuviellaTokenBalance.toString(), 'Ether')*100)/100} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
        <td>{Math.round(window.web3.utils.fromWei(this.props.faucetTuviellaTokenBalance.toString(), 'Ether')*100)/100} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
        </tr>
      </tbody>
    </table>
    <CountdownCircleTimer
          isPlaying={this.props.tuviellaExpiry > 0 ? true : false}
          initialRemainingTime={this.props.tuviellaExpiry > 0 ? this.props.tuviellaSecs - this.props.tuviellaExpiry : 0}
          duration={this.props.tuviellaSecs}
          colors={[
            ['#DC2700', 0.33],
            ['#F5EA14', 0.33],
            ['#F5EA14', 0.33],

          ]}
          onComplete={""}
        >
          {renderTime}

        </CountdownCircleTimer>
  </div>

    );
  }
}

export default Faucet;
