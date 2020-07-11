import React, { Component } from 'react';
import JSONTree from 'react-json-tree'
const request = require('request');
var url = 'http://localhost:3000/results.json';
var jsonObject;
var serviceObject;

const MerkleViz = ({ service_id }) => {

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
       jsonObject = JSON.parse(body);
       serviceObject = jsonObject[0]
    }
  });

  const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};


  return (
        <div>
        <JSONTree hideRoot={true} data={serviceObject} theme={theme} invertTheme={true} />
        </div>
  );
};

export default MerkleViz;
