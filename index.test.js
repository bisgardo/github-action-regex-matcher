const {match} = require('./lib');

test('invalid pattern fails', () => {
  expect(() => match('(', 'input')).toThrowError('Invalid regular expression: /(/: Unterminated group');
});

test('no-match yields empty result', () => {
  const res = match('pattern', 'mismatch');
  expect(res).toEqual(new Map());
});

test('no-match with group yields empty result', () => {
  const res = match('(pattern)', 'mismatch');
  expect(res).toEqual(new Map());
});

test('match without group is captured', () => {
  const res = match('ab', 'ab');
  expect(res).toEqual(new Map([['_0', 'ab']]));
});

test('unnamed group matches are captured', () => {
  const res = match('(a)(b)', 'ab');
  expect(res).toEqual(new Map([['_0', 'ab'], ['_1', 'a'], ['_2', 'b']]));
});

test('named group matches are captured', () => {
  const res = match('(?<x>a)(?<y>b)', 'ab');
  expect(res).toEqual(new Map([['_0', 'ab'], ['_1', 'a'], ['x', 'a'], ['_2', 'b'], ['y', 'b']]));
});

test('unnamed and named group matches', () => {
  const res = match('(?<x>a)(b)', 'ab');
  expect(res).toEqual(new Map([['_0', 'ab'], ['_1', 'a'], ['x', 'a'], ['_2', 'b']]));
});

test('unmatched groups get empty value', () => {
  const res = match('a|(b)|(?<x>c)', 'a');
  expect(res).toEqual(new Map([['_0', 'a'], ['_1', ''], ['_2', ''], ['x', '']]));
});

test('empty group is captured', () => {
  const res = match('()', 'a');
  expect(res).toEqual(new Map([['_0', ''], ['_1', '']]));
});
test('tmp', () => {
  const res = match('^\\s*(.*?)\\s*$', ' bla bla ');
  expect(res).toEqual(new Map([['_0', ' bla bla '], ['_1', 'bla bla']]));
});
