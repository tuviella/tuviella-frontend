import React, { Component } from 'react'

class AppInfo extends Component {

  render() {

    return (
      <div id="content" className="mt-3">
        Current Network: {this.props.chainInUse.name}
        <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={(event) => {
              event.preventDefault()
              this.props.addTuviellaToken()
            }}>
              Add TuviellaToken To Metamask
            </button>
      </div>  
    );
  }
}

export default AppInfo;
