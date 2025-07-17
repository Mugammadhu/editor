const handleHelloWorldCheck = require('./eval/helloWorld');
const handleAddTwoNumbersCheck = require('./eval/addTwoNumbers');
const handleSquareRootCheck = require('./eval/squareRoot');
const handleOddEvenCheck = require('./eval/oddEven');
const handleFactorialCheck = require('./eval/factorial');

const isHelloWorldQuestion = (question) => {
  const keywords = ['hello world', 'hello, world', 'print hello', 'hello guys', 'print.*hello'];
  return keywords.some((kw) => {
    if (kw.startsWith('print.*')) {
      return new RegExp(kw.replace('.*', '\\s+.*'), 'i').test(question.toLowerCase());
    }
    return question.toLowerCase().includes(kw);
  });
};

const handlers = [
  {
    match: isHelloWorldQuestion,
    handler: handleHelloWorldCheck,
  },
  {
    match: (q) => /add two numbers|sum of two|addition of two|add 2 numbers/i.test(q),
    handler: handleAddTwoNumbersCheck,
  },
  {
    match: (q) => /square root|sqrt|find root/i.test(q),
    handler: handleSquareRootCheck,
  },
  {
    match: (q) => /odd|even|divisible by 2/i.test(q),
    handler: handleOddEvenCheck,
  },
  {
    match: (q) => /factorial|calculate the factorial/i.test(q),
    handler: handleFactorialCheck,
  },
];

const resolveHandler = (question) => {
  for (const { match, handler } of handlers) {
    if (match(question)) {
      return handler;
    }
  }
  return null;
};

module.exports = resolveHandler;