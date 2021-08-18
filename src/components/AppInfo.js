import React, { Component } from 'react'

class AppInfo extends Component {

  render() {

    return (
      <div id="content" className="mt-3">
        Current Network: {this.props.chainInUse.name}
      </div>  
    );
  }
}

export default AppInfo;
