import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

import { DEFAULT_FORM_CONFIG } from "./src/constants/defaultFormConfig";

const db = new Database("database.db");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-admin-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS form_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS form_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Admin User if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run("admin", hashedPassword);
}

// Seed Default Form Config if not exists
const configExists = db.prepare("SELECT * FROM form_config LIMIT 1").get();
if (!configExists) {
  const config = JSON.stringify(DEFAULT_FORM_CONFIG);
  db.prepare("INSERT INTO form_config (config) VALUES (?)").run(config);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Auth Middleware
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API ROUTES ---

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token });
});

// Save Form Response
app.post("/api/form/responses", upload.fields([
  { name: 'inspirationImages', maxCount: 5 },
  { name: 'currentSpaceImages', maxCount: 5 }
]), (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const data = { ...req.body };
    
    // Parse JSON strings back to objects if they were stringified on client
    Object.keys(data).forEach(key => {
      try {
        data[key] = JSON.parse(data[key]);
      } catch (e) {
        // Not a JSON string, keep as is
      }
    });

    // Add file paths to data
    if (files['inspirationImages']) {
      data.inspirationImages = files['inspirationImages'].map(f => `/uploads/${f.filename}`);
    }
    if (files['currentSpaceImages']) {
      data.currentSpaceImages = files['currentSpaceImages'].map(f => `/uploads/${f.filename}`);
    }

    const jsonData = JSON.stringify(data);
    db.prepare("INSERT INTO form_responses (data) VALUES (?)").run(jsonData);
    res.status(201).json({ message: "Response saved successfully" });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save response" });
  }
});

// Get All Responses (Admin)
app.get("/api/admin/responses", authenticateAdmin, (req, res) => {
  const responses = db.prepare("SELECT * FROM form_responses ORDER BY created_at DESC").all();
  res.json(responses.map((r: any) => ({ ...r, data: JSON.parse(r.data) })));
});

// Delete Response (Admin)
app.delete("/api/admin/responses/:id", authenticateAdmin, (req, res) => {
  db.prepare("DELETE FROM form_responses WHERE id = ?").run(req.params.id);
  res.json({ message: "Response deleted" });
});

// Get Form Config
app.get("/api/form/config", (req, res) => {
  const config: any = db.prepare("SELECT * FROM form_config ORDER BY id DESC LIMIT 1").get();
  if (!config) {
    return res.json({ config: null });
  }
  res.json({ config: JSON.parse(config.config) });
});

// Update Form Config (Admin)
app.post("/api/admin/form/config", authenticateAdmin, (req, res) => {
  try {
    const config = JSON.stringify(req.body);
    db.prepare("INSERT INTO form_config (config) VALUES (?)").run(config);
    res.json({ message: "Config updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update config" });
  }
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
