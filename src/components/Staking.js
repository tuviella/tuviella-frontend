import React, { Component } from 'react'

class Staking extends Component {

  render() {

    let ammountToDeposit = 0; 
    let ammountToWithdraw = 0; 

    return (
      <div id="content" className="mt-3">
        <h2>STAKING {this.props.tokenName.toString()}</h2>

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staked {this.props.tokenName.toString()}</th>
              <th scope="col">Viellas Pending to Harvest</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td>{Math.round(window.web3.utils.fromWei(this.props.stakingStaked.toString(), 'Ether')*100)/100 + " " + this.props.tokenName.toString() }</td>
            <td>{Math.round(window.web3.utils.fromWei(this.props.stakingPending.toString(), 'Ether')*100)/100 + " Viellas" }</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">
            <button
              disabled={this.props.stakingPending <= 0}
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.harvest()
              }}>
                HARVEST VIELLAS
              </button>
          </div>
        </div>
        
        <div className="card mb-4" >
        <input 
            type="text" 
            name="deposit" 
            onChange={ (event) => ammountToDeposit = event.target.value} />
        <div className="card-body">
          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) => {
              event.preventDefault()
              this.props.deposit(ammountToDeposit)
            }}>
              DEPOSIT {this.props.tokenName.toString()}
            </button>
          </div>
        </div>
        <div className="card mb-4" >

          <input 
            type="text" 
            name="withdraw" 
            onChange={ (event) => ammountToWithdraw = event.target.value} />
                <div className="card-body">

          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) => {
              event.preventDefault()
              this.props.withdraw(ammountToWithdraw)
            }}>
              WITHDRAW {this.props.tokenName.toString()}
            </button>
          </div>
        </div>
      </div>

    );
  }
}

export default Staking;
