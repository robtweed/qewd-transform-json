# qewd-transform-JSON: Transform JSON using a template
 
Rob Tweed <rtweed@mgateway.com>  
25 January 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

## Installing

       npm install qewd-transform-JSON
	   
## Using qewd-transform-json

  *qewd-transform-json* is a simple, yet powerful way of transforming JSON from one format to another.

  It takes an input JavaScript object, and transforms it to a new output JavaScript object, using 
  rules defined in a template object.  

  For example, the input object might look like this:

      var inputObj = {
        foo: {
          bar1: 'hello',
          bar2: 'world' 
        }
      };

  The template object defines the structure of the new output object, and you define the value of
  each of its leaf nodes in terms of an input object reference.

  Each element within the input object that is to be used as the value for an output object element is
  specified within the template as a quoted string, within which the value is inside double curly braces.
  For example:

      var templateObj = {
        a: '{{foo.bar1}}',
        b: {
          c: '{{foo.bar2}}'
        }
      };

  The module's *transform()* function is then used to create the output object, eg

      var transform = require('qewd-transform-json').transform;
      var newObj = transform(templateObj, inputObj);

  The output would be:

      {
        "a": "hello",
        "b": {
          "c": "world"
        }
      }

  You can also specify that the output object is to contain an array which is mapped from some 
  array within the input object.  For example, suppose the input object is:

      var inputObj = {
        foo: {
          bar1: 'hello',
          bar2: 'world' 
        },
        arr: [
          {
            name: 'Rob',
            city: 'London'
          },
          {
            name: 'Chris',
            city: 'Oxford'
          },
        ] 
      };


  We could map the names into an array within the output object by defining an array mapping rule in the
  template.  For example, see the *people* property in the template object below:

      var templateObj = {
        a: '{{foo.bar1}}',
        b: {
          c: '{{foo.bar2}}'
        },
        people: [
          '{{arr}}',
          {
            firstName: '{{name}}'
          }
        ]
      };

  *people* is defined as an array, containing two elements:

    - the first defines the array property to use within the input object.  In our case we want to use
      input.arr, so we just specify {{arr}}.

    - the second, if present, specifies the template object to apply for each people element.  This can be as
      simple or as complex as you like, and can define lower-level arrays if required.

    - if the second element isn't defined, the array specified in the first element is copied
      directly into the output property.

  The output object created from the example above would now look like this:

      {
        "a": "hello",
        "b": {
          "c": "world"
        },
        "people": [
          {
            "firstName": "Rob"
          },
          {
            "firstName": "Chris"
          }
        ]
      }


  Here's a more complex example:

      var inputObj = {
        foo: {
          bar1: 'hello',
          bar2: 'world' 
        },
        level2: {
          arr: [
            {
              name: 'Rob',
              address: {
                city: 'London'
              },
              hobbies: ['cycling', 'hifi']
            },
            {
              name: 'Chris',
              address: {
                city: 'Oxford'
              },
              hobbies: ['hill walking']
            },
          ]
        } 
      };

      var templateObj = {
        a: '{{foo.bar1}}',
        b: {
          c: '{{foo.bar2}}'
        },
        people: [
          '{{level2.arr}}',
          {
            firstName: '{{name}}',
            city: '{{address.city}}',
            likes: [
              '{{hobbies}}'
            ]
          }
        ]
      };

The output object created from this transformation would be:

      {
        "a": "hello",
        "b": {
          "c": "world"
        },
        "people": [
          {
            "firstName": "Rob",
            "city": "London",
            "likes": [
              "cycling",
              "hifi"
            ]
          },
          {
            "firstName": "Chris",
            "city": "Oxford",
            "likes": [
              "hill walking"
            ]
          }
        ]
      }




## License

 Copyright (c) 2017 M/Gateway Developments Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
