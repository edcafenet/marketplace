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

  return (
        <div>
        <JSONTree hideRoot={true} data={serviceObject} />
        </div>
  );
};

export default MerkleViz;
