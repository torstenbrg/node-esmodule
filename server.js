import express from "express";
import path from "path";
import { fileURLToPath } from 'url'
import { analyzeQuery } from './queryHandler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get('/api', (req, res) => {
    const analysis = analyzeQuery(req.query);
    res.status(200).json({
      status: "success",
      data: analysis
    });
  });

app.listen(5000, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:5000/ (${__filename})`);
});
