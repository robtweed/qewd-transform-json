/*

 ----------------------------------------------------------------------------
 | qewd-transform-json: Transform JSON using a template                     |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  28 March 2017

*/

var traverse = require('traverse');

var mapArray = function(dataArray, templateObj) {
  if (Array.isArray(dataArray)) {
    var outputArr = [];
    dataArray.forEach(function(obj) {
      var result = transform(templateObj, obj);
      outputArr.push(result);
    });
    return outputArr;
  }
  else {
    return '';
  }
}

var transform = function(templateObj, data) {

  function getActualValue(templateRef, data) {
    var objRef = templateRef.split("{{")[1];
    objRef = objRef.split("}}")[0];
    var fn = new Function('data', 'return data.' + objRef + ';');
    try {
      var result = fn(data);
      return result;
    }
    catch(err) {
      return '';
    }
  }

  var outputObj = traverse(templateObj).map(function(node) {
    if (typeof node === 'function') {
      this.update(node(data));
    }

    else if (Array.isArray(node)) {
      if (node[0].indexOf('{{') !== -1) {
        var dataArr = getActualValue(node[0], data);
        var template = node[1];
        if (template) {
          var outputArr = mapArray(dataArr, template);
          this.update(outputArr);
        }
        else {
          this.update(dataArr);
        }
      }
    }

    else if (typeof node === 'string') {
      if (node.indexOf('{{') !== -1) {
        this.update(getActualValue(node, data));
      }
    }
  });
  return outputObj;
}

module.exports = transform;
