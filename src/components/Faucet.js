import React, { Component } from 'react'
import viellaIcon from '../viellahash.png'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'


class Faucet extends Component {

  render() {

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
    <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            disabled={this.props.tuviellaExpiry > 0 }
            onClick={(event) => {
              event.preventDefault()
              this.props.claimTuViella()
            }}>
              {this.props.tuviellaExpiry > 0 ? "You can claim in: " + this.props.tuviellaExpiry + " secs" : "CLAIM!"}
            </button>

  </div>

    );
  }
}

export default Faucet;
