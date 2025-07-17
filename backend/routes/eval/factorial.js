const runCode = require('../../utils/runCode');

const isFactorialQuestion = (question) => {
  const keywords = ['factorial', 'calculate the factorial'];
  return keywords.some((kw) => question.toLowerCase().includes(kw));
};

const factorialTestCases = [
  { input: { n: '5' }, expected: '120' },
  { input: { n: '0' }, expected: '1' },
  { input: { n: '3' }, expected: '6' },
];

const injectInput = (code, language, input) => {
  const n = parseInt(input.n, 10);

  switch (language) {
    case "python":
      return code.replace(/n\s*=\s*\d+/, `n = ${n}`);
    case "c":
    case "cpp":
    case "csharp":
    case "java":
      return code.replace(/int\s+n\s*=\s*[^;]+;/, `int n = ${n};`);
    case "javascript":
    case "typescript":
      return code.replace(/(let|const|var)\s+n\s*=?\s*[^;]+;/, `let n = ${n};`);
    case "go":
      return code.replace(/n\s*:=\s*\d+/, `n := ${n}`);
    case "rust":
      return code.replace(/let\s+n\s*=\s*\d+/, `let n = ${n}`);
    case "ruby":
    case "elixir":
    case "julia":
      return code.replace(/n\s*=\s*\d+/, `n = ${n}`);
    case "swift":
      return code.replace(/let\s+n\s*=\s*\d+/, `let n = ${n}`);
    case "php":
      return code.replace(/\$n\s*=\s*\d+/, `$n = ${n}`);
    case "kotlin":
      return code.replace(/val\s+n\s*=\s*\d+/, `val n = ${n}`);
    case "scala":
      return code.replace(/val\s+n\s*=\s*\d+/, `val n = ${n}`);
    case "perl":
      return code.replace(/my\s+\$n\s*=\s*\d+/, `my $n = ${n}`);
    case "haskell":
    case "fsharp":
    case "ocaml":
      return code.replace(/let\s+n\s*=\s*\d+/, `let n = ${n}`);
    case "vb":
      return code.replace(/Dim\s+n\s+As\s+Integer\s*=\s*\d+/, `Dim n As Integer = ${n}`);
    case "lua":
      return code.replace(/local\s+n\s*=\s*\d+/, `local n = ${n}`);
    case "dart":
      return code.replace(/int\s+n\s*=\s*\d+/, `int n = ${n}`);
    case "racket":
      return code.replace(/\(define\s+n\s+\d+\)/, `(define n ${n})`);
    case "powershell":
      return code.replace(/\$n\s*=\s*\d+/, `$n = ${n}`);
    case "bash":
      return code.replace(/n\s*=\s*\d+/, `n=${n}`);
    case "r":
      return code.replace(/n\s*<-\s*\d+/, `n <- ${n}`);
    default:
      console.error(`Unsupported language: ${language}`);
      return code;
  }
};

const handleFactorialCheck = async ({ code, language, question }) => {
  if (!isFactorialQuestion(question)) return null;

  const results = [];

  for (const test of factorialTestCases) {
    try {
      const modifiedCode = injectInput(code, language, test.input);
      console.log(`Modified code for ${language}, input n=${test.input.n}:\n${modifiedCode}`);
      const output = await runCode(modifiedCode, language);

      results.push({
        input: `n=${test.input.n}`,
        expected: test.expected,
        output: output.trim(),
        passed: output.trim() === test.expected,
      });
    } catch (error) {
      console.error(`Error running test case for ${language}: ${error.message}`);
      results.push({
        input: `n=${test.input.n}`,
        expected: test.expected,
        output: `Error: ${error.message}`,
        passed: false,
      });
    }
  }

  return results;
};

module.exports = handleFactorialCheck;
