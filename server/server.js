const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.status(201).send({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).send({ error: 'Error registering user' });
  }
});

app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the backend!' });
});

// Add a basic route to verify deployment
app.get('/', (req, res) => {
  res.send('Welcome to the Home Manager App!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
