# qewd-transform-JSON: Transform JSON using a template
 
Rob Tweed <rtweed@mgateway.com>  
25 January 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

Special thanks to the Ripple Foundation [http://rippleosi.org  ](http://rippleosi.org) for
support and funding of this project.

## Installing

       npm install qewd-transform-json
	   
## Using qewd-transform-json

### Simple Transformations

  *qewd-transform-json* is a simple, yet powerful way of transforming JSON from one format to another. 

  The use case for which it's designed is where you're doing repetitive processing that involves 
  instances of a particular JSON document format being converted into some other JSON format.

  *qewd-transform-json* takes an instance of an input JavaScript object, and transforms it to a new output
  JavaScript object, using rules defined in a template object.  

  For example, the input object might look like this:

      var inputObj = {
        foo: {
          bar1: 'hello',
          bar2: 'world' 
        }
      };

  The important feature of the template object is that it defines the structure of the new output object, 
  as well as defining the value of each of its leaf nodes in terms of the input JSON document's
  property paths.

  Each element within the input object that is to be used as the value for an output object element is
  specified within the template as a quoted string, within which the value is inside double curly braces.
  For example:

      var templateObj = {
        a: '{{foo.bar1}}',
        b: {
          c: '{{foo.bar2}}',
          d: 'literal text',
          e: 'hello {{foo.bar2}} again'
        }
      };

  Note the *d* property in the template above is defined as literal text without any curly braces,
  so the literal text value will be used in the output object as a fixed value.

  Note also the *e* property in the template, showing how an input path reference can be
  embedded inside other literal text.

  The module's *transform()* function is then used to create the output object, eg

      var transform = require('qewd-transform-json').transform;
      var newObj = transform(templateObj, inputObj);

  The output would be:

      {
        "a": "hello",
        "b": {
          "c": "world",
          "d": "literal text",
          "e": "hello world again"
        }
      }

### Substituting Arrays


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

  - the first element defines the array property to use within the input object.  In our case we want to use
      input.arr, so we just specify {{arr}}.

  - the second element, if present, specifies the template object to create as each element of the output
    array.  
    Note that the input object properties you specify in the mappings are relative to the input 
    object's parent array 
    that you specified in the first element above.  So, in the example above, they are relative to the 
    input object's *{{arr}}* array.
    Hence, for the output object's *firstName* property, you merely specify *{{name}}*, which tells 
    the transformer to use the
    *name* property from each array element within the input object's *{{arr}} array.

    The template array object can be as
      simple or as complex as you like, and can define lower-level arrays and/or objects if required.


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

      // input object:

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

      // template object:

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


### Applying Your Own Custom Transformation Functions

Often you'll want to be able to perform more complex transformations.

The transform module contains three pre-defined functions that you may find useful:

- **either(path, defaultValue)**  If the path doesn't exist or contains an empty string value in the
  input object, then the literal string defined as the default value is used instead

- **getDate(path)**  If path is not defined (ie getDate() ), then the current date/time is returned in
  JavaScript date string format.  

- **getTime(path)** Uses the value of the specified input object path as a date, and returns it in getTime()
  format.

You can also define your own functions, eg:

      var myFn = function(input) {
          return 'xxxxxx ' + input + ' yyyyyyy ';
      };

Then use the following syntax in the template:

     property: '=> myFn(foo.bar1)',

*Note that the value must be quoted, to ensure that it's
a valid object-literal property value, despite its special syntax.  Spaces in the value will be ignored.*

This tells the transformer to apply your myFn() function to the foo.bar1 property from the input object.

Finally, if you've defined your own custom function, you add a third argument to the transform() function, 
through which you pass your custom function, eg:

      var newObj = transform(templateObj, inputObj, {myFn});

You may pass as many custom functions as you wish via this third argument.

Of course, this third argument isn't needed if you want to use any of the built-in functions.


So, for example:

      var myFn = function(input) {
          return 'xxxxxx ' + input + ' yyyyyyy';
      };

      var inputObj = {
        foo: {
          bar1: 'hello',
          bar2: 'world',
          date: '2017-04-04'
        },
        arr: [
          {
            city: 'London'
          },
          {
            name: 'Chris',
            city: 'Oxford'
          }
        ] 
      };

      var templateObj = {
        a: '{{foo.bar1}}',
        b: {
          c: '{{foo.bar2}}',
          d: 'literal text',
          e: '=> myFn(foo.bar2)',
          f: '=> either(foo.bar3, "foobar3!")',
          now: '=> getDate()',
          time: '=> getTime(foo.date)'
        },
        people: [
          '{{arr}}',
          {
            firstName: '=> either(name, "Rob")'
          }
        ]
      };

      var newObj = transform(templateObj, inputObj, {myFn});

will create the following output object:

      {
        "a": "hello",
        "b": {
          "c": "world",
          "d": "literal text",
          "e": "xxxxxx world yyyyyyy",
          "f": "foobar3!",
          "now": "2017-04-04T17:14:20.266Z",
          "time": 1491264000000
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


You can even define functions that use more than one input argument, eg:

      var myFn = function(input, input2) {
          return 'xxxxxx ' + input + ' yyyyyyy ' + input2 + ' zzzzz';
      };

      var templateObj = {
        a: '{{foo.bar1}}',
        b: {
          c: '{{foo.bar2}}',
          d: 'literal text',
          e: '=> myFn(foo.bar2, foo.bar1)'
        },
        people: [
          '{{arr}}',
          {
            firstName: '{{name}}'
          }
        ]
      };

This would produce the following output object:

      {
        "a": "hello",
        "b": {
          "c": "world",
          "d": "literal text",
          "e": "xxxxxx world yyyyyyy hello zzzzz"
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
