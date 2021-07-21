import React, { Component } from 'react'
class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.tuviellaTokenBalance.toString(), 'Ether')} TVT</td>
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
