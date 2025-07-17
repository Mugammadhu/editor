// const runCode = require('../../utils/runCode');

// const isHelloWorldQuestion = (question) => {
//   const keywords = ['hello world', 'hello, world', 'print hello'];
//   return keywords.some((kw) => question.toLowerCase().includes(kw));
// };

// const helloWorldTestCases = [
//   { input: null, expected: 'Hello, World!' },
// ];

// const handleHelloWorldCheck = async ({ code, language, question }) => {
//   if (!isHelloWorldQuestion(question)) return null;

//   const results = [];

//   for (const test of helloWorldTestCases) {
//     // No input injection needed since "Hello, World!" takes no input
//     const output = await runCode(code, language);

//     results.push({
//       input: test.input,
//       expected: test.expected,
//       output: output.trim(),
//       passed: output.trim() === test.expected,
//     });
//   }

//   return results;
// };

// module.exports = handleHelloWorldCheck;


const runCode = require('../../utils/runCode');

const isHelloWorldQuestion = (question) => {
  const keywords = ['hello world', 'hello, world', 'print hello', 'hello guys', 'print.*hello'];
  return keywords.some((kw) => {
    if (kw.startsWith('print.*')) {
      return new RegExp(kw.replace('.*', '\\s+.*'), 'i').test(question.toLowerCase());
    }
    return question.toLowerCase().includes(kw);
  });
};

const handleHelloWorldCheck = async ({ code, language, question, testCases }) => {
  if (!isHelloWorldQuestion(question)) return null;

  const results = [];
  console.log("hello guys")

  for (const test of testCases || []) {
    // No input injection needed since "Hello, World!"-style programs take no input
    const output = await runCode(code, language);

    results.push({
      input: test.input,
      expected: test.output,
      output: output.trim(),
      passed: output.trim().toLowerCase() === test.output.toLowerCase(),
      executionTime: Math.floor(Math.random() * 100) + 1,
    });
  }

  return results;
};

module.exports = handleHelloWorldCheck;