import React, { Component } from 'react'
import viellaIcon from '../viellahash.png'

class Staking extends Component {

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

    let ammountOfViellasToDeposit = 0; 
    let ammountOfViellasToWithdraw = 0; 

    return (
      <div id="content" className="mt-3">
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
            <td>{Math.round(window.web3.utils.fromWei(this.props.stakingStakedViellas.toString(), 'Ether')*100)/100} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
            <td>{Math.round(window.web3.utils.fromWei(this.props.stakingPendingViellas.toString(), 'Ether')*100)/100} <img src={viellaIcon} width="30" height="30" className="d-inline-block align-top" alt="" /></td>
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
                HARVEST
              </button>
          </div>
        </div>
        
        <div className="card mb-4" >
        <input 
            type="text" 
            name="deposit" 
            onChange={ (event) => ammountOfViellasToDeposit = event.target.value} />
        <div className="card-body">
          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) => {
              event.preventDefault()
              this.props.depositTuViella(ammountOfViellasToDeposit)
            }}>
              DEPOSIT VIELLAS
            </button>
          </div>
        </div>
        <div className="card mb-4" >

          <input 
            type="text" 
            name="withdraw" 
            onChange={ (event) => ammountOfViellasToWithdraw = event.target.value} />
                <div className="card-body">

          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) => {
              event.preventDefault()
              this.props.withdrawTuViella(ammountOfViellasToWithdraw)
            }}>
              WITHDRAW VIELLAS
            </button>
          </div>
        </div>
      </div>

    );
  }
}

export default Staking;
