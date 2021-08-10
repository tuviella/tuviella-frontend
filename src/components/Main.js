import React, { Component } from 'react'
import viellaIcon from '../viella.png'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
        Current Network: {this.props.chainInUse.name}
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
            <td>{this.props.tuviellaExpiry} secs</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.claimTuviella()
              }}>
                CLAIM
              </button>
          </div>
        </div>

      </div>  
    );
  }
}

export default Main;
