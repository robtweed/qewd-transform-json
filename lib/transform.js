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

var transform = function(templateObj, data, helpers) {

  function getActualValue(templateRef, data) {
    var pieces = templateRef.split("{{");
    var objRef = pieces[1];
    var before = pieces[0];
    pieces = objRef.split("}}");
    objRef = pieces[0];
    var after = pieces[1] || '';
    var fn = new Function('data', 'return data.' + objRef + ';');
    //console.log('fn: ' + fn);
    try {
      var result = fn(data);
      if (typeof result === 'string') result = before + result + after;
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
        return;
      }

      if (node[0] === '=' && node[1] === '>') {
        var fn = node.split('=>')[1];
        fn = fn.replace(/ /g,'');
        var pieces = fn.split('(');
        var fnName = pieces[0];
        var argStr = pieces[1].split(')')[0];
        argStr = argStr.replace(/ /g,'');
        var args = argStr.split(',');
        var argArr = [];
        if (args) {
          args.forEach(function(arg) {
            arg = '{{' + arg + '}}';
            arg = getActualValue(arg, data);
            argArr.push(arg);
          });
        }
        try {
          this.update(helpers[fnName](...argArr));
        }
        catch(err) {
          this.update('');
        }
    }

    }
  });
  return outputObj;
}

module.exports = transform;
