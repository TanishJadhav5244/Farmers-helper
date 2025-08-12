// Import necessary modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

console.log('CO_API_KEY:', process.env.CO_API_KEY);

// Initialize Cohere client with your API key (store it securely in .env file)
const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({ apiKey: process.env.CO_API_KEY });

app.use(bodyParser.json());

// Other middleware like body-parser or your routes here
//app.use(express.json());

// Add these lines here, before routes or other middleware
app.use(cors());

// Define the chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await cohere.chat({
      model: 'command',
      message: userMessage
    });
    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    res.status(500).json({ error: 'Failed to get response from chatbot' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
