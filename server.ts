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

const db = new Database("database.db");
db.pragma('foreign_keys = ON');
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-admin-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS response_step1 (
    response_id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    FOREIGN KEY(response_id) REFERENCES responses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS response_step2 (
    response_id INTEGER PRIMARY KEY,
    project_type TEXT,
    FOREIGN KEY(response_id) REFERENCES responses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS response_step3 (
    response_id INTEGER PRIMARY KEY,
    budget_tier TEXT,
    budget_exact TEXT,
    area_tier TEXT,
    area_exact TEXT,
    timeline TEXT,
    project_details TEXT,
    FOREIGN KEY(response_id) REFERENCES responses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS response_step4 (
    response_id INTEGER PRIMARY KEY,
    specifics TEXT,
    FOREIGN KEY(response_id) REFERENCES responses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS response_step5 (
    response_id INTEGER PRIMARY KEY,
    inspiration_images TEXT,
    current_space_images TEXT,
    FOREIGN KEY(response_id) REFERENCES responses(id) ON DELETE CASCADE
  );
`);

// Seed Admin User if not exists (only if table is empty)
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync(ADMIN_PASS, 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(ADMIN_USER, hashedPassword);
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

    // 1. Insert into master responses table
    const result = db.prepare("INSERT INTO responses (created_at) VALUES (CURRENT_TIMESTAMP)").run();
    const responseId = result.lastInsertRowid;

    // 2. Insert Step 1
    db.prepare("INSERT INTO response_step1 (response_id, name, email, phone, city) VALUES (?, ?, ?, ?, ?)")
      .run(responseId, data.name || '', data.email || '', data.phone || '', data.city || '');

    // 3. Insert Step 2
    db.prepare("INSERT INTO response_step2 (response_id, project_type) VALUES (?, ?)")
      .run(responseId, data.projectType || '');

    // 4. Insert Step 3
    db.prepare("INSERT INTO response_step3 (response_id, budget_tier, budget_exact, area_tier, area_exact, timeline, project_details) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(responseId, data.budgetTier || '', data.budgetExact || '', data.areaTier || '', data.areaExact || '', data.timeline || '', data.projectDetails || '');

    // 5. Insert Step 4 (Specifics)
    const specifics: any = {};
    const knownKeys = ['name', 'email', 'phone', 'city', 'projectType', 'budgetTier', 'budgetExact', 'areaTier', 'areaExact', 'timeline', 'projectDetails', 'inspirationImages', 'currentSpaceImages'];
    Object.keys(data).forEach(key => {
      if (!knownKeys.includes(key)) {
        specifics[key] = data[key];
      }
    });
    db.prepare("INSERT INTO response_step4 (response_id, specifics) VALUES (?, ?)")
      .run(responseId, JSON.stringify(specifics));

    // 6. Insert Step 5 (Images)
    db.prepare("INSERT INTO response_step5 (response_id, inspiration_images, current_space_images) VALUES (?, ?, ?)")
      .run(responseId, JSON.stringify(data.inspirationImages || []), JSON.stringify(data.currentSpaceImages || []));

    res.status(201).json({ message: "Response saved successfully" });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save response" });
  }
});

// Get All Responses (Admin)
app.get("/api/admin/responses", authenticateAdmin, (req, res) => {
  const responses = db.prepare(`
    SELECT 
      r.id, r.created_at,
      s1.name, s1.email, s1.phone, s1.city,
      s2.project_type as projectType,
      s3.budget_tier as budgetTier, s3.budget_exact as budgetExact, 
      s3.area_tier as areaTier, s3.area_exact as areaExact,
      s3.timeline, s3.project_details as projectDetails,
      s4.specifics,
      s5.inspiration_images as inspirationImages,
      s5.current_space_images as currentSpaceImages
    FROM responses r
    LEFT JOIN response_step1 s1 ON r.id = s1.response_id
    LEFT JOIN response_step2 s2 ON r.id = s2.response_id
    LEFT JOIN response_step3 s3 ON r.id = s3.response_id
    LEFT JOIN response_step4 s4 ON r.id = s4.response_id
    LEFT JOIN response_step5 s5 ON r.id = s5.response_id
    ORDER BY r.created_at DESC
  `).all();

  const formattedResponses = responses.map((r: any) => {
    const specifics = JSON.parse(r.specifics || '{}');
    const inspirationImages = JSON.parse(r.inspirationImages || '[]');
    const currentSpaceImages = JSON.parse(r.currentSpaceImages || '[]');
    
    // Reconstruct the data object as the frontend expects it
    const data = {
      ...r,
      ...specifics,
      inspirationImages,
      currentSpaceImages
    };
    
    // Remove individual columns that are now part of data
    delete data.specifics;
    
    return {
      id: r.id,
      created_at: r.created_at,
      data
    };
  });

  res.json(formattedResponses);
});

// Delete Response (Admin)
app.delete("/api/admin/responses/:id", authenticateAdmin, (req, res) => {
  db.prepare("DELETE FROM responses WHERE id = ?").run(req.params.id);
  res.json({ message: "Response deleted" });
});

// Update Admin Credentials (Admin)
app.post("/api/admin/update-credentials", authenticateAdmin, (req, res) => {
  const { newUsername, newPassword } = req.body;
  if (!newUsername || !newPassword) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    // Assuming there's only one admin user or we update the current one
    db.prepare("UPDATE users SET username = ?, password = ? WHERE id = ?").run(newUsername, hashedPassword, (req as any).user.id);
    res.json({ message: "Credentials updated successfully" });
  } catch (err) {
    console.error("Update credentials error:", err);
    res.status(500).json({ error: "Failed to update credentials" });
  }
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
