'use strict';

const transform = require('../../').transform;

describe('tests/qewd-transform-json:', () => {
  it('transform string interpolation (curly brackets)', () => {
      const expected = {
        foo: 'quux'
      };

      const template = {
        foo: '{{bar}}'
      };
      const data = {
        bar: 'quux'
      };
      const actual = transform(template, data);

      expect(actual).toEqual(expected);
    });

  it('transform string interpolation (square brackets)', () => {
    const expected = {
      foo: 'quux'
    };

    const template = {
      foo: '{{["bar"]}}'
    };
    const data = {
      bar: 'quux'
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform string interpolation (errors)', () => {
    const expected = {
      foo: ''
    };

    const template = {
      foo: '{{a.b.c}}'
    };
    const data = {};
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform string interpolation (undefined)', () => {
    const expected = {
      foo: ''
    };

    const template = {
      foo: '{{bar}}'
    };
    const data = {};
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform string interpolation (null)', () => {
    const expected = {
      foo: ''
    };

    const template = {
      foo: '{{bar}}'
    };
    const data = {
      bar: null
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform string interpolation (number)', () => {
    const expected = {
      foo: 5
    };

    const template = {
      foo: '{{bar}}'
    };
    const data = {
      bar: 5
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform string interpolation (before + number)', () => {
    const expected = {
      foo: 'before5'
    };

    const template = {
      foo: 'before{{bar}}'
    };
    const data = {
      bar: 5
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform string interpolation (after + number)', () => {
    const expected = {
      foo: '5after'
    };

    const template = {
      foo: '{{bar}}after'
    };
    const data = {
      bar: 5
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform string interpolation (object)', () => {
    const expected = {
      foo: {
        a: 'b'
      }
    };

    const template = {
      foo: '{{bar}}'
    };
    const data = {
      bar: {
        a: 'b'
      }
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform node function', () => {
    const expected = {
      foo: 'quux'
    };

    const template = {
      foo: (x) => x.bar
    };
    const data = {
      bar: 'quux'
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform node function (<!delete>)', () => {
    const expected = {};

    const template = {
      foo: () => '<!delete>'
    };
    const data = {
      bar: 'quux'
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform array', () => {
    const expected = {
      foo: [
        { value: 'value1' },
        { value: 'value2' }
      ]
    };

    const template = {
      foo: [
        '{{bar}}',
        {
          value: '{{baz}}'
        }
      ]
    };
    const data = {
      bar: [
        { baz: 'value1' },
        { baz: 'value2' }
      ]
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  xit('transform array (as is)', () => {
    const expected = {
      foo: [
        { baz: 'value1' },
        { baz: 'value2' }
      ]
    };

    const template = {
      foo: [
        '{{bar}}'
      ]
    };
    const data = {
      bar: [
        { baz: 'value1' },
        { baz: 'value2' }
      ]
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform with array (data not array)', () => {
    const expected = {
      foo: []
    };

    const template = {
      foo: [
        '{{bar}}',
        {
          value: '{{baz}}'
        }
      ]
    };
    const data = {
      bar: 'not array'
    };
    const actual = transform(template, data);

    expect(actual).toEqual(expected);
  });

  it('transform with helpers', () => {
    const expected = {
      foo: 'quux'
    };

    const template = {
      foo: '=> fn()'
    };
    const data = {};
    const helpers = {
      fn: () => 'quux'
    };
    const actual = transform(template, data, helpers);

    expect(actual).toEqual(expected);
  });

  it('transform with helpers (<!delete>)', () => {
    const expected = {};

    const template = {
      foo: '=> fn()'
    };
    const data = {};
    const helpers = {
      fn: () => '<!delete>'
    };
    const actual = transform(template, data, helpers);

    expect(actual).toEqual(expected);
  });

  it('transform with helpers (args: true)', () => {
    const expected = {
      foo: true
    };

    const template = {
      foo: '=> fn(true)'
    };
    const data = {};
    const helpers = {
      fn: (x) => x
    };
    const actual = transform(template, data, helpers);

    expect(actual).toEqual(expected);
  });

  it('transform with helpers (args: false)', () => {
    const expected = {
      foo: false
    };

    const template = {
      foo: '=> fn(false)'
    };
    const data = {};
    const helpers = {
      fn: (x) => x
    };
    const actual = transform(template, data, helpers);

    expect(actual).toEqual(expected);
  });

  it('transform with helpers (args: "string value")', () => {
    const expected = {
      foo: 'quux'
    };

    const template = {
      foo: '=> fn("quux")'
    };
    const data = {};
    const helpers = {
      fn: (x) => x
    };
    const actual = transform(template, data, helpers);

    expect(actual).toEqual(expected);
  });

  it('transform with helpers (args: \'string value\')', () => {
    const expected = {
      foo: 'quux'
    };

    const template = {
      foo: '=> fn(\'quux\')'
    };
    const data = {};
    const helpers = {
      fn: (x) => x
    };
    const actual = transform(template, data, helpers);

    expect(actual).toEqual(expected);
  });

  describe('#built-in helpers', () => {
    it('either', () => {
      const expected = {
        foo: 'value',
        bar: 'zyx'
      };

      const template = {
        foo: '=> either(baz, "abc")',
        bar: '=> either(quux, "zyx")',
      };
      const data = {
        baz: 'value'
      };
      const actual = transform(template, data);

      expect(actual).toEqual(expected);
    });

    it('getDate', () => {
      const template = {
        foo: '=> getDate()',
        bar: '=> getDate(2019-02-02T01:02:03.000Z)',
      };
      const data = {};

      const actual = transform(template, data);
      const now = new Date().getTime();

      expect(actual.foo.getTime()).toBe(now);
      expect(actual.bar.getTime()).toBe(1549069323000);
    });

    it('getTime', () => {
      const expected = {
        foo: '',
        bar: 1546300800000
      };

      const template = {
        foo: '=> getTime()',
        bar: '=> getTime(2019-01-01T00:00:00.000Z)',
      };
      const data = {
        baz: 'value'
      };
      const actual = transform(template, data);

      expect(actual).toEqual(expected);
    });

    it('now', () => {
      const template = {
        foo: '=> now()',
      };
      const data = {};
      const actual = transform(template, data);

      expect(actual.foo).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
    });

    it('removePrefix', () => {
      const expected = {
        foo: 'test'
      };
      const template = {
        foo: '=> removePrefix(test, "Practitioner/")',
      };
      const data = {
        test: 'Practitioner/test'
      };
      const actual = transform(template, data);

      expect(actual).toEqual(expected);
    });
  });
});
