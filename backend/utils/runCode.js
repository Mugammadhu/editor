const axios = require("axios");

const runCode = async (code, language, input = "") => {
  try {
    const response = await axios.post(
      process.env.PISTON_URL,
      {
        language,
        version: "*",
        files: [{ content: code }],
        stdin: input,
      },
      {
        timeout: getTimeout(language),
      }
    );

    const output = response.data.run.output || "";
    console.log(output)
    const stderr = response.data.run.stderr || "";
    console.log(`runCode: language=${language}, output="${output}", stderr="${stderr}"`);
    if (stderr) {
      return `Error: ${stderr}`;
    }
    return output;
  } catch (error) {
    console.error(`runCode error: ${error.message}`);
    return `Error: ${error.message}`;
  }
};

const getTimeout = (language) => {
  const slowLanguages = ["kotlin", "scala", "fsharp", "java"];
  return slowLanguages.includes(language) ? 30000 : 10000; // 30s or 10s
};

module.exports = runCode;