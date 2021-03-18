import React, { Component } from 'react';
import { Tree, treeUtil } from 'react-d3-tree';
const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
var json_url = window.location.href + '/results.json';

class CenteredTree extends Component {
  constructor(props) {
   super(props);
   this.state = {
     translate: {x: window.outerWidth/2.5, y: window.outerHeight/4},
     service_id : this.props.service_id,
     json_data: undefined,
     tree: undefined,
     json_tree: [],
     tree_string: ''
   };

  // Parse the info obtained from the results url
  treeUtil.parseJSON(json_url).then((json_data) => {this.setState({ json_data })}).catch((err) => console.error(err));
};

  render() {
    // get the tasks and rebuild merkletree
    if (typeof this.state.json_data !== 'undefined')
    {
        var results = this.state.json_data[0][this.state.service_id].results;
        var tasks = this.state.json_data[0][this.state.service_id].tasks;
        this.state.tree = new MerkleTree(tasks, SHA256)
        this.state.tree_string = this.state.tree.toString()
    }
      return (

        <div id="treeWrapper" style={{width: '75em', height: '50em'}} ref={tc => (this.treeContainer = tc)}>
          <pre>
            {this.state.tree_string}
          </pre>
        </div>
    );
  }
}

export default CenteredTree;
