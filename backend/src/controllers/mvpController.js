const { mvpRodadas } = require('../services/mvpService');

async function index(req, res) {
  try {
    const data = await mvpRodadas();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { index };
