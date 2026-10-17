<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
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

// Record Your Plan form definitions. Every save adds a version; old versions are kept so responses submitted
// with an earlier form still show the questions they answered.
$db->exec("
    CREATE TABLE IF NOT EXISTS form_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schema TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");
$response_columns = $db->query("PRAGMA table_info(responses)")->fetchAll(PDO::FETCH_COLUMN, 1);
if (!in_array('form_version', $response_columns, true)) {
    // 0 = the form built into the site before it became editable
    $db->exec("ALTER TABLE responses ADD COLUMN form_version INTEGER NOT NULL DEFAULT 0");
}

// Projects table. Created once with the images that used to be built into the site as starter projects,
// so deleting every project later doesn't bring them back.
$has_projects = $db->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'projects'")->fetchColumn();
if (!$has_projects) {
    $db->exec("BEGIN IMMEDIATE");
    $db->exec("
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            name_en TEXT NOT NULL,
            name_ar TEXT NOT NULL,
            image TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    if ($db->query("SELECT COUNT(*) FROM projects")->fetchColumn() == 0) {
        $seed = $db->prepare("INSERT INTO projects (category, name_en, name_ar, image) VALUES (?, ?, ?, ?)");
        $starter = [
            ['residential', 'Residential Project', 'مشروع سكني', ['resProject', 'resProject2', 'resProject3']],
            ['commercial', 'Commercial Project', 'مشروع تجاري', ['comProject', 'comProject2', 'comProject3']],
            ['garden-terrace', 'Garden & Terrace', 'حديقة وتراس', ['garProject1', 'garProject2', 'garProject3']],
        ];
        $ar_digits = ['١', '٢', '٣'];
        foreach ($starter as [$category, $en, $ar, $files]) {
            foreach ($files as $i => $file) {
                $seed->execute([$category, "$en " . ($i + 1), "$ar " . $ar_digits[$i], "/project-images/$file.avif"]);
            }
        }
    }
    $db->exec("COMMIT");
}

const PROJECT_CATEGORIES = ['residential', 'commercial', 'garden-terrace'];
const IMAGE_TYPES = [
    'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/avif' => 'avif',
    'image/gif' => 'gif', 'image/heic' => 'heic', 'image/heif' => 'heif',
];

// Saves one uploaded image into /uploads. The extension comes from the detected file type, never from the
// client's file name, so nothing executable (e.g. a .php file) can be stored in the public uploads folder.
function saveImageUpload($file, $prefix) {
    if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) return null;
    $tmp = $file['tmp_name'];
    if (class_exists('finfo')) {
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
    } else {
        $info = @getimagesize($tmp);
        $mime = $info ? $info['mime'] : '';
    }
    if (!isset(IMAGE_TYPES[$mime])) return null;

    $upload_dir = __DIR__ . '/../uploads';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);
    $name = $prefix . '-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . IMAGE_TYPES[$mime];
    return move_uploaded_file($tmp, "$upload_dir/$name") ? "/uploads/$name" : null;
}

function uploadErrorMessage($file) {
    $code = $file['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE) return 'Image is too large for the server upload limit';
    if ($code === UPLOAD_ERR_NO_FILE) return 'Please choose an image';
    if ($code !== UPLOAD_ERR_OK) return 'Image upload failed';
    return 'Only image files (JPG, PNG, WebP, AVIF) are allowed';
}

// Only removes files this API uploaded; the starter images in /project-images are part of the site.
function deleteUploadedImage($path) {
    if (strpos($path, '/uploads/') !== 0) return;
    $file = realpath(__DIR__ . '/..' . $path);
    $dir = realpath(__DIR__ . '/../uploads');
    if ($file && $dir && strpos($file, $dir . DIRECTORY_SEPARATOR) === 0) @unlink($file);
}

function projectRow($r) {
    return ['id' => (int)$r['id'], 'category' => $r['category'], 'nameEn' => $r['name_en'], 'nameAr' => $r['name_ar'], 'image' => $r['image']];
}

// Validates the text fields shared by create and update; returns an error message or null
function validateProjectFields($data) {
    if (!in_array($data['category'] ?? '', PROJECT_CATEGORIES, true)) return 'Please choose a category';
    foreach (['nameEn' => 'English', 'nameAr' => 'Arabic'] as $key => $label) {
        $value = trim($data[$key] ?? '');
        if ($value === '') return "Please enter the $label name";
        if (mb_strlen($value) > 120) return "The $label name must be 120 characters or fewer";
    }
    return null;
}

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
// Health Check / Root Route
if ($path === '' || $path === '/') {
    echo json_encode([
        'status' => 'success', 
        'message' => 'API is running and database is connected.'
    ]);
    exit;
}

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

    // Every image question in the form (including ones added in the admin) is uploaded under its field id
    $uploaded = ['inspirationImages' => [], 'currentSpaceImages' => []];
    foreach ($files as $field => $file_data) {
        if (!preg_match('/^[A-Za-z0-9_]{1,64}$/', $field)) continue;
        if (!isset($uploaded[$field])) $uploaded[$field] = [];
        // Normalise single and multiple uploads into one list of files (at most 20 per question)
        $count = min(20, is_array($file_data['name']) ? count($file_data['name']) : 1);
        for ($i = 0; $i < $count; $i++) {
            $file = is_array($file_data['name'])
                ? ['error' => $file_data['error'][$i], 'tmp_name' => $file_data['tmp_name'][$i]]
                : $file_data;
            $path = saveImageUpload($file, $field);
            if ($path) $uploaded[$field][] = $path;
        }
    }
    $inspiration = $uploaded['inspirationImages'];
    $current = $uploaded['currentSpaceImages'];
    $form_version = max(0, (int)($data['formVersion'] ?? 0));
    unset($data['formVersion']);

    try {
        $db->beginTransaction();
        $db->prepare("INSERT INTO responses (created_at, form_version) VALUES (CURRENT_TIMESTAMP, ?)")->execute([$form_version]);
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
        // Images from questions added in the admin are kept with the other answers
        foreach ($uploaded as $field => $paths) {
            if (!in_array($field, ['inspirationImages', 'currentSpaceImages'], true)) $specifics[$field] = $paths;
        }
        
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
        SELECT r.id, r.created_at, r.form_version, s1.name, s1.email, s1.phone, s1.city, s2.project_type as projectType,
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
        $version = (int)$r['form_version'];
        unset($r['form_version']);
        $formatted[] = [
            'id' => $r['id'],
            'created_at' => $r['created_at'],
            'form_version' => $version,
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

// List Projects (public)
elseif ($path === '/projects' && $method === 'GET') {
    $rows = $db->query("SELECT * FROM projects ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode(array_map('projectRow', $rows));
}

// Add Project
elseif ($path === '/admin/projects' && $method === 'POST') {
    if (!$admin) { http_response_code(401); exit; }
    $error = validateProjectFields($_POST);
    $image = $error ? null : saveImageUpload($_FILES['image'] ?? [], 'project');
    if (!$error && !$image) $error = uploadErrorMessage($_FILES['image'] ?? []);
    if ($error) { http_response_code(422); echo json_encode(['error' => $error]); exit; }

    $db->prepare("INSERT INTO projects (category, name_en, name_ar, image) VALUES (?, ?, ?, ?)")
       ->execute([$_POST['category'], trim($_POST['nameEn']), trim($_POST['nameAr']), $image]);
    $stmt = $db->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->execute([$db->lastInsertId()]);
    echo json_encode(projectRow($stmt->fetch(PDO::FETCH_ASSOC)));
}

// Update Project (image is optional; the old uploaded image is removed when replaced)
elseif (preg_match('#^/admin/projects/(\d+)$#', $path, $matches) && $method === 'POST') {
    if (!$admin) { http_response_code(401); exit; }
    $stmt = $db->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->execute([$matches[1]]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$project) { http_response_code(404); echo json_encode(['error' => 'Project not found']); exit; }

    $error = validateProjectFields($_POST);
    $image = $project['image'];
    $has_new_image = isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE;
    if (!$error && $has_new_image) {
        $image = saveImageUpload($_FILES['image'], 'project');
        if (!$image) $error = uploadErrorMessage($_FILES['image']);
    }
    if ($error) { http_response_code(422); echo json_encode(['error' => $error]); exit; }

    $db->prepare("UPDATE projects SET category = ?, name_en = ?, name_ar = ?, image = ? WHERE id = ?")
       ->execute([$_POST['category'], trim($_POST['nameEn']), trim($_POST['nameAr']), $image, $project['id']]);
    if ($image !== $project['image']) deleteUploadedImage($project['image']);
    $stmt->execute([$project['id']]);
    echo json_encode(projectRow($stmt->fetch(PDO::FETCH_ASSOC)));
}

// Delete Project
elseif (preg_match('#^/admin/projects/(\d+)$#', $path, $matches) && $method === 'DELETE') {
    if (!$admin) { http_response_code(401); exit; }
    $stmt = $db->prepare("SELECT image FROM projects WHERE id = ?");
    $stmt->execute([$matches[1]]);
    $image = $stmt->fetchColumn();
    $db->prepare("DELETE FROM projects WHERE id = ?")->execute([$matches[1]]);
    if ($image) deleteUploadedImage($image);
    echo json_encode(['message' => 'Project deleted']);
}

// Current Record Your Plan form (public). version 0 with schema null means "use the built-in form".
elseif ($path === '/form' && $method === 'GET') {
    $row = $db->query("SELECT id, schema FROM form_versions ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode($row ? ['version' => (int)$row['id'], 'schema' => json_decode($row['schema'], true)] : ['version' => 0, 'schema' => null]);
}

// Every saved form version, so the admin can label answers given to older versions of the form
elseif ($path === '/admin/form/versions' && $method === 'GET') {
    if (!$admin) { http_response_code(401); exit; }
    $rows = $db->query("SELECT id, schema, created_at FROM form_versions ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(array_map(fn($r) => ['version' => (int)$r['id'], 'schema' => json_decode($r['schema'], true), 'created_at' => $r['created_at']], $rows));
}

// Publish a new version of the form
elseif ($path === '/admin/form' && $method === 'POST') {
    if (!$admin) { http_response_code(401); exit; }
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    $schema = $body['schema'] ?? null;
    if (strlen($raw) > 1000000 || !is_array($schema) || !isset($schema['steps']) || !is_array($schema['steps']) || count($schema['steps']) === 0) {
        http_response_code(422);
        echo json_encode(['error' => 'The form is not valid']);
        exit;
    }
    $db->prepare("INSERT INTO form_versions (schema) VALUES (?)")->execute([json_encode($schema, JSON_UNESCAPED_UNICODE)]);
    echo json_encode(['version' => (int)$db->lastInsertId()]);
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
