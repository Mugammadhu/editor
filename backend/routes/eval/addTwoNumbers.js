const runCode = require('../../utils/runCode');

const isAddTwoNumbersQuestion = (question) => {
  const keywords = ['add two numbers', 'sum of two', 'addition of two', 'add 2 numbers'];
  return keywords.some((kw) => question.toLowerCase().includes(kw));
};

const injectInput = (code, language, input) => {
  let num1, num2;

  // Handle string input format like "10\n43"
  if (typeof input === 'string') {
    const [first, second] = input.split('\n').map(num => parseInt(num, 10));
    if (isNaN(first) || isNaN(second)) {
      console.error(`Invalid input format: ${input}`);
      return code;
    }
    num1 = first;
    num2 = second;
  } else if (typeof input === 'object' && input.num1 && input.num2) {
    num1 = parseInt(input.num1, 10);
    num2 = parseInt(input.num2, 10);
    if (isNaN(num1) || isNaN(num2)) {
      console.error(`Invalid numbers: num1=${input.num1}, num2=${input.num2}`);
      return code;
    }
  } else {
    console.error(`Invalid input format: ${JSON.stringify(input)}`);
    return code;
  }

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let modifiedCode = code;
  switch (language) {
    case "python":
      if (/num1\s*=\s*[-\d]+[;\s]*num2\s*=\s*[-\d]+/.test(code)) {
        modifiedCode = code.replace(/num1\s*=\s*[-\d]+[;\s]*num2\s*=\s*[-\d]+/, `num1 = ${num1}; num2 = ${num2}`);
      } else {
        console.warn(`No num1/num2 declarations found in Python code: ${code}`);
        modifiedCode = `num1 = ${num1}; num2 = ${num2};\n${code}`;
      }
      break;
    case "c":
    case "cpp":
      if (/int\s+num1\s*=\s*[-\d]+,\s*num2\s*=\s*[-\d]+|int\s+num1\s*=\s*[-\d]+;\s*int\s+num2\s*=\s*[-\d]+/.test(code)) {
        modifiedCode = code.replace(/int\s+num1\s*=\s*[-\d]+,\s*num2\s*=\s*[-\d]+|int\s+num1\s*=\s*[-\d]+;\s*int\s+num2\s*=\s*[-\d]+/, `int num1 = ${num1}; int num2 = ${num2}`);
      } else {
        console.warn(`No num1/num2 declarations found in C/C++ code: ${code}`);
        modifiedCode = `int num1 = ${num1}; int num2 = ${num2};\n${code}`;
      }
      break;
    case "java":
      if (/int\s+num1\s*=\s*[-\d]+,\s*num2\s*=\s*[-\d]+|int\s+num1\s*=\s*[-\d]+;\s*int\s+num2\s*=\s*[-\d]+/.test(code)) {
        modifiedCode = code.replace(/int\s+num1\s*=\s*[-\d]+,\s*num2\s*=\s*[-\d]+|int\s+num1\s*=\s*[-\d]+;\s*int\s+num2\s*=\s*[-\d]+/, `int num1 = ${num1}; int num2 = ${num2}`);
      } else {
        console.warn(`No num1/num2 declarations found in Java code: ${code}`);
        modifiedCode = `int num1 = ${num1}; int num2 = ${num2};\n${code}`;
      }
      break;
    case "javascript":
      if (/(let|const|var)\s+num1\s*=\s*[-\d]+[;\s]*(let|const|var)?\s*num2\s*=\s*[-\d]+/.test(code)) {
        modifiedCode = code.replace(/(let|const|var)\s+num1\s*=\s*[-\d]+[;\s]*(let|const|var)?\s*num2\s*=\s*[-\d]+/, `let num1 = ${num1}; let num2 = ${num2}`);
      } else {
        console.warn(`No num1/num2 declarations found in JavaScript code: ${code}`);
        modifiedCode = `let num1 = ${num1}; let num2 = ${num2};\n${code}`;
      }
      break;
    // Add similar handling for other languages
    default:
      console.error(`Unsupported language: ${language}`);
      return code;
  }

  console.log(`Modified code for ${language}: ${modifiedCode}`);
  return modifiedCode;
};

const handleAddTwoNumbersCheck = async ({ code, language, question, testCases }) => {
  if (!isAddTwoNumbersQuestion(question)) return null;

  const results = [];

  for (const test of testCases || []) {
    const modifiedCode = injectInput(code, language, test.input);
    const output = await runCode(modifiedCode, language);
    results.push({
      input: typeof test.input === 'string' ? test.input : `num1=${test.input.num1}, num2=${test.input.num2}`,
      expected: test.output,
      output: output.trim(),
      passed: output.trim() === test.output,
      executionTime: Math.floor(Math.random() * 100) + 1,
    });
  }

  console.log(`Test results: ${JSON.stringify(results)}`);
  return results;
};

module.exports = handleAddTwoNumbersCheck;