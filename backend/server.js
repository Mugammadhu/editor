const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/execute', async (req, res) => {
  try {
    const { script, language, stdin, versionIndex } = req.body;
    
    if (!script || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: "43754600ceb6f534cefd7fe53aa0bf73",
      clientSecret: "bb8042315e97026316f565075b5782f0e9b92defb9001237519cb1264cde6c8b",
      script,
      language,
      stdin: stdin || '',
      versionIndex: versionIndex || '0'
    });

    res.json(response.data);
  } catch (error) {
    console.error('Execution error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});