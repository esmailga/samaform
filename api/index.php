<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Database Connection (SQLite)
$db_file = __DIR__ . '/../database.db';
try {
    $db = new PDO("sqlite:$db_file");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Initialize Database Tables
$db->exec("
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
        name TEXT, email TEXT, phone TEXT, city TEXT,
        FOREIGN KEY(response_id) REFERENCES responses(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS response_step2 (
        response_id INTEGER PRIMARY KEY,
        project_type TEXT,
        FOREIGN KEY(response_id) REFERENCES responses(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS response_step3 (
        response_id INTEGER PRIMARY KEY,
        budget_tier TEXT, budget_exact TEXT, area_tier TEXT, area_exact TEXT, timeline TEXT, project_details TEXT,
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
");

// Seed Admin User if empty
$stmt = $db->query("SELECT COUNT(*) FROM users");
if ($stmt->fetchColumn() == 0) {
    $user = 'admin';
    $pass = password_hash('admin123', PASSWORD_DEFAULT);
    $db->prepare("INSERT INTO users (username, password) VALUES (?, ?)")->execute([$user, $pass]);
}

// Simple Router
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/api';
// Handle both /api/admin and /api/index.php/admin
$path = preg_replace('#^' . preg_quote($base_path) . '(?:/index\.php)?#', '', $request_uri);
$path = explode('?', $path)[0];
$method = $_SERVER['REQUEST_METHOD'];

// Auth Helper
$secret = "super-secret-admin-key";
function verifyToken($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    list($header, $payload, $signature) = $parts;
    $valid_sig = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(hash_hmac('sha256', $header . "." . $payload, $secret, true)));
    if ($signature !== $valid_sig) return false;
    $data = json_decode(base64_decode($payload), true);
    if (!$data || !isset($data['exp']) || $data['exp'] < time()) return false;
    return $data;
}

$auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = str_replace('Bearer ', '', $auth_header);
$admin = verifyToken($token, $secret);

// --- ROUTES ---

// Admin Login
if ($path === '/admin/login' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$data['username']]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($u && password_verify($data['password'], $u['password'])) {
        $header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256'])));
        $payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode(['id' => $u['id'], 'username' => $u['username'], 'exp' => time() + 86400])));
        $sig = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true)));
        echo json_encode(['token' => "$header.$payload.$sig"]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
} 

// Save Response
elseif ($path === '/form/responses' && $method === 'POST') {
    $data = $_POST;
    $files = $_FILES;
    
    // Parse JSON strings
    foreach ($data as $key => $val) {
        $decoded = json_decode($val, true);
        if (json_last_error() === JSON_ERROR_NONE) $data[$key] = $decoded;
    }

    $inspiration = [];
    $current = [];
    $upload_dir = __DIR__ . '/../uploads';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    foreach (['inspirationImages', 'currentSpaceImages'] as $field) {
        if (isset($files[$field])) {
            // Handle both single and multiple files
            $file_data = $files[$field];
            if (is_array($file_data['name'])) {
                $count = count($file_data['name']);
                for ($i = 0; $i < $count; $i++) {
                    if ($file_data['error'][$i] === UPLOAD_ERR_OK) {
                        $ext = pathinfo($file_data['name'][$i], PATHINFO_EXTENSION);
                        $name = $field . '-' . time() . '-' . rand(1000, 9999) . '.' . $ext;
                        if (move_uploaded_file($file_data['tmp_name'][$i], "$upload_dir/$name")) {
                            if ($field === 'inspirationImages') $inspiration[] = "/uploads/$name";
                            else $current[] = "/uploads/$name";
                        }
                    }
                }
            } else {
                if ($file_data['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($file_data['name'], PATHINFO_EXTENSION);
                    $name = $field . '-' . time() . '-' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($file_data['tmp_name'], "$upload_dir/$name")) {
                        if ($field === 'inspirationImages') $inspiration[] = "/uploads/$name";
                        else $current[] = "/uploads/$name";
                    }
                }
            }
        }
    }

    try {
        $db->beginTransaction();
        $db->exec("INSERT INTO responses (created_at) VALUES (CURRENT_TIMESTAMP)");
        $rid = $db->lastInsertId();

        $db->prepare("INSERT INTO response_step1 (response_id, name, email, phone, city) VALUES (?, ?, ?, ?, ?)")
           ->execute([$rid, $data['name'] ?? '', $data['email'] ?? '', $data['phone'] ?? '', $data['city'] ?? '']);

        $db->prepare("INSERT INTO response_step2 (response_id, project_type) VALUES (?, ?)")
           ->execute([$rid, $data['projectType'] ?? '']);

        $db->prepare("INSERT INTO response_step3 (response_id, budget_tier, budget_exact, area_tier, area_exact, timeline, project_details) VALUES (?, ?, ?, ?, ?, ?, ?)")
           ->execute([$rid, $data['budgetTier'] ?? '', $data['budgetExact'] ?? '', $data['areaTier'] ?? '', $data['areaExact'] ?? '', $data['timeline'] ?? '', $data['projectDetails'] ?? '']);

        $known = ['name', 'email', 'phone', 'city', 'projectType', 'budgetTier', 'budgetExact', 'areaTier', 'areaExact', 'timeline', 'projectDetails', 'inspirationImages', 'currentSpaceImages'];
        $specifics = [];
        foreach ($data as $k => $v) if (!in_array($k, $known)) $specifics[$k] = $v;
        
        $db->prepare("INSERT INTO response_step4 (response_id, specifics) VALUES (?, ?)")->execute([$rid, json_encode($specifics)]);
        $db->prepare("INSERT INTO response_step5 (response_id, inspiration_images, current_space_images) VALUES (?, ?, ?)")->execute([$rid, json_encode($inspiration), json_encode($current)]);

        $db->commit();
        echo json_encode(['message' => 'Response saved successfully']);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Get Responses
elseif ($path === '/admin/responses' && $method === 'GET') {
    if (!$admin) { http_response_code(401); exit; }
    $stmt = $db->query("
        SELECT r.id, r.created_at, s1.name, s1.email, s1.phone, s1.city, s2.project_type as projectType,
               s3.budget_tier as budgetTier, s3.budget_exact as budgetExact, s3.area_tier as areaTier, s3.area_exact as areaExact,
               s3.timeline, s3.project_details as projectDetails, s4.specifics,
               s5.inspiration_images as inspirationImages, s5.current_space_images as currentSpaceImages
        FROM responses r
        LEFT JOIN response_step1 s1 ON r.id = s1.response_id
        LEFT JOIN response_step2 s2 ON r.id = s2.response_id
        LEFT JOIN response_step3 s3 ON r.id = s3.response_id
        LEFT JOIN response_step4 s4 ON r.id = s4.response_id
        LEFT JOIN response_step5 s5 ON r.id = s5.response_id
        ORDER BY r.created_at DESC
    ");
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $formatted = [];
    foreach ($res as $r) {
        $spec = json_decode($r['specifics'], true) ?: [];
        $insp = json_decode($r['inspirationImages'], true) ?: [];
        $curr = json_decode($r['currentSpaceImages'], true) ?: [];
        unset($r['specifics']);
        $formatted[] = [
            'id' => $r['id'],
            'created_at' => $r['created_at'],
            'data' => array_merge($r, $spec, ['inspirationImages' => $insp, 'currentSpaceImages' => $curr])
        ];
    }
    echo json_encode($formatted);
}

// Delete Response
elseif (preg_match('#^/admin/responses/(\d+)$#', $path, $matches) && $method === 'DELETE') {
    if (!$admin) { http_response_code(401); exit; }
    $db->prepare("DELETE FROM responses WHERE id = ?")->execute([$matches[1]]);
    echo json_encode(['message' => 'Response deleted']);
}

// Update Credentials
elseif ($path === '/admin/update-credentials' && $method === 'POST') {
    if (!$admin) { http_response_code(401); exit; }
    $data = json_decode(file_get_contents('php://input'), true);
    $hashed = password_hash($data['newPassword'], PASSWORD_DEFAULT);
    $db->prepare("UPDATE users SET username = ?, password = ? WHERE id = ?")->execute([$data['newUsername'], $hashed, $admin['id']]);
    echo json_encode(['message' => 'Credentials updated successfully']);
}

else {
    http_response_code(404);
    echo json_encode(['error' => 'Not found', 'path' => $path]);
}
