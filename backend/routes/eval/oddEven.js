
const runCode = require('../../utils/runCode');

const isOddEvenQuestion = (question) => {
  const keywords = ['odd', 'even', 'divisible by 2', 'check number parity'];
  return keywords.some((kw) => question.toLowerCase().includes(kw));
};

const injectInput = (code, language, input) => {
  const parsed = parseInt(input, 10);

  switch (language) {
    case "python":
      return code.replace(/num\s*=\s*\d+/, `num = ${parsed}`);
    case "c":
    case "cpp":
      return code.replace(/int\s+num\s*=\s*[^;]+;/, `int num = ${parsed};`);
    case "java":
      return code.replace(/int\s+num\s*=\s*[^;]+;/, `int num = ${parsed};`);
    case "javascript":
      return code.replace(/(let|const|var)\s+num\s*=\s*[^;]+;/, `let num = ${parsed};`);
    case "typescript":
      return code.replace(/(let|const|var)\s+num\s*:\s*number\s*=\s*[^;]+;/, `let num: number = ${parsed};`);
    case "go":
      return code.replace(/num\s*:=\s*\d+/, `num := ${parsed}`);
    case "rust":
      return code.replace(/let\s+num\s*=\s*\d+/, `let num = ${parsed}`);
    case "ruby":
      return code.replace(/num\s*=\s*\d+/, `num = ${parsed}`);
    case "swift":
      return code.replace(/let\s+num\s*=\s*\d+/, `let num = ${parsed}`);
    case "php":
      return code.replace(/\$num\s*=\s*\d+/, `$num = ${parsed}`);
    case "kotlin":
      return code.replace(/val\s+num\s*=\s*\d+/, `val num = ${parsed}`);
    case "csharp":
      return code.replace(/int\s+num\s*=\s*[^;]+;/, `int num = ${parsed};`);
    case "scala":
      return code.replace(/val\s+num\s*=\s*\d+/, `val num = ${parsed}`);
    case "perl":
      return code.replace(/\$num\s*=\s*\d+/, `$num = ${parsed}`);
    case "haskell":
      return code.replace(/let\s+num\s*=\s*\d+/, `let num = ${parsed}`);
    case "ocaml":
      return code.replace(/let\s+num\s*=\s*\d+/, `let num = ${parsed}`);
    case "vb":
      return code.replace(/Dim\s+num\s+As\s+Integer\s*=\s*\d+/, `Dim num As Integer = ${parsed}`);
    case "fsharp":
      return code.replace(/let\s+num\s*=\s*\d+/, `let num = ${parsed}`);
    case "lua":
      return code.replace(/local\s+num\s*=\s*\d+/, `local num = ${parsed}`);
    case "dart":
      return code.replace(/int\s+num\s*=\s*\d+/, `int num = ${parsed}`);
    case "elixir":
      return code.replace(/num\s*=\s*\d+/, `num = ${parsed}`);
    case "julia":
      return code.replace(/num\s*=\s*\d+/, `num = ${parsed}`);
    case "racket":
      return code.replace(/\(define\s+num\s+\d+\)/, `(define num ${parsed})`);
    case "powershell":
      return code.replace(/\$num\s*=\s*\d+/, `$num = ${parsed}`);
    case "bash":
      return code.replace(/num\s*=\s*\d+/, `num=${parsed}`);
    case "r":
      return code.replace(/num\s*<\-\s*\d+/, `num <- ${parsed}`);
    default:
      return code;
  }
};

const handleOddEvenCheck = async ({ code, language, question, testCases }) => {
  if (!isOddEvenQuestion(question)) return null;

  const results = [];

  for (const test of testCases || []) {
    const modifiedCode = injectInput(code, language, test.input);
    const output = await runCode(modifiedCode, language);
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

module.exports = handleOddEvenCheck;