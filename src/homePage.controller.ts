import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import AuthDecorator from './decorator/auth.decorator';

@Controller('docs')
export class HomeController {
  constructor(private configService: ConfigService) {}

  @AuthDecorator()
  @Get()
  getHome(@Res() res: Response) {
    const nonce = res.locals.nonce;
    const BASE_URL =
      this.configService.get('CLIENT_URL') || 'http://localhost:3000';
    const serverStatus = this.getServerStatus();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation | Educational Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* ---------- CSS (مختصر، يمكنك نسخه من الرد السابق) ---------- */
        :root {
            --primary: #4f46e5;
            --primary-dark: #4338ca;
            --secondary: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #3b82f6;
            --dark: #1f2937;
            --light: #f9fafb;
            --border: #e5e7eb;
            --code-bg: #1e293b;
            --text-muted: #6b7280;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: var(--light); color: var(--dark); line-height: 1.5; }
        .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        .header {
            background: white;
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(8px);
            background: rgba(255,255,255,0.95);
        }
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .logo h1 {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--light);
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.875rem;
        }
        .status-badge {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--secondary);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }
        .base-url {
            font-family: monospace;
            background: var(--light);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
        }
        .main { display: flex; gap: 2rem; margin-top: 2rem; }
        .sidebar {
            width: 280px;
            flex-shrink: 0;
            position: sticky;
            top: 90px;
            height: fit-content;
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid var(--border);
        }
        .sidebar nav ul { list-style: none; }
        .sidebar nav ul li { margin-bottom: 0.5rem; }
        .sidebar nav ul li a {
            text-decoration: none;
            color: var(--dark);
            display: block;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            font-weight: 500;
        }
        .sidebar nav ul li a:hover { background: var(--light); color: var(--primary); }
        .content { flex: 1; min-width: 0; }
        .section {
            background: white;
            border-radius: 1rem;
            border: 1px solid var(--border);
            margin-bottom: 2rem;
            overflow: hidden;
        }
        .section-header {
            padding: 1rem 1.5rem;
            background: white;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 1.25rem;
        }
        .section-header:hover { background: var(--light); }
        .section-content { padding: 1.5rem; }
        .section-content.collapsed { display: none; }
        .endpoint {
            margin-bottom: 2rem;
            border-left: 3px solid var(--border);
            padding-left: 1rem;
        }
        .endpoint-method {
            display: inline-block;
            font-weight: 700;
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            margin-right: 0.75rem;
        }
        .method-get { background: #d1fae5; color: #065f46; }
        .method-post { background: #fed7aa; color: #92400e; }
        .method-put { background: #fef3c7; color: #b45309; }
        .method-patch { background: #c7d2fe; color: #3730a3; }
        .method-delete { background: #fee2e2; color: #991b1b; }
        .endpoint-path { font-family: monospace; font-size: 1rem; font-weight: 500; }
        .endpoint-desc { color: var(--text-muted); margin: 0.5rem 0; font-size: 0.875rem; }
        .details { margin-top: 1rem; }
        .details summary { cursor: pointer; font-weight: 500; color: var(--primary); margin-bottom: 0.5rem; }
        pre {
            background: var(--code-bg);
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-size: 0.875rem;
            margin: 0.5rem 0;
            position: relative;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #334155;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
        }
        .copy-btn:hover { background: #475569; }
        .badge {
            display: inline-block;
            background: var(--light);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
            margin-right: 0.5rem;
        }
        footer {
            text-align: center;
            margin-top: 3rem;
            padding: 1.5rem;
            color: var(--text-muted);
            font-size: 0.875rem;
            border-top: 1px solid var(--border);
        }
        @media (max-width: 768px) {
            .main { flex-direction: column; }
            .sidebar { width: 100%; position: static; margin-bottom: 1rem; }
            .container { padding: 1rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo"><h1><i class="fas fa-graduation-cap"></i> EduPlatform API</h1></div>
            <div class="status"><span class="status-badge"></span><span>Server: ${serverStatus.status}</span><span>Uptime: ${serverStatus.uptime}</span></div>
            <div class="base-url"><i class="fas fa-link"></i> Base URL: <code>/api/v1</code></div>
        </div>
    </div>
    <div class="container">
        <div class="main">
            <aside class="sidebar">
                <nav><ul>
                    <li><a href="#auth">🔐 Authentication</a></li>
                    <li><a href="#users">👥 Users</a></li>
                    <li><a href="#posts">📝 Posts</a></li>
                    <li><a href="#comments">💬 Comments</a></li>
                    <li><a href="#likes">❤️ Likes</a></li>
                    <li><a href="#followers">👥 Followers</a></li>
                    <li><a href="#lessons">📖 Lessons</a></li>
                    <li><a href="#courses">📚 Courses</a></li>
                    <li><a href="#exams">📝 Exams</a></li>
                    <li><a href="#homeworks">📓 Home Works</a></li>
                    <li><a href="#notes">📎 Notes</a></li>
                    <li><a href="#booked-lessons">📅 Booked Lessons</a></li>
                    <li><a href="#weekly-schedule">🗓️ Weekly Schedule</a></li>
                    <li><a href="#dashboard-student">📊 Student Dashboard</a></li>
                </ul></nav>
            </aside>
            <main class="content" id="main-content">
                <!-- ==================== AUTH SECTION ==================== -->
                <div class="section" id="auth">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-key"></i> Authentication</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/signup</span></div><div class="endpoint-desc">تسجيل مستخدم جديد</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123",
  "role": "student",
  "phone": "+201234567890",
  "address": "Cairo",
  "whatsApp": "+201234567890",
  "imageUrl": "https://example.com/avatar.jpg"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/auth/signup' -H 'Content-Type: application/json' -d '{"name":"John Doe","email":"john@example.com","password":"StrongPass123","role":"student","phone":"+201234567890","address":"Cairo","whatsApp":"+201234567890","imageUrl":"https://example.com/avatar.jpg"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/login</span></div><div class="endpoint-desc">تسجيل الدخول</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"email":"john@example.com","password":"StrongPass123"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/auth/login' -H 'Content-Type: application/json' -d '{"email":"john@example.com","password":"StrongPass123"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/logout</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">تسجيل الخروج</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/auth/logout' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/refresh</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">تحديث التوكن</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/auth/refresh' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/auth/me</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">بيانات المستخدم الحالي</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/auth/me' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== USERS SECTION ==================== -->
                <div class="section" id="users">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-users"></i> Users</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/users</span></div><div class="endpoint-desc">جلب جميع المستخدمين (معلمين / مراكز)</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?page=1&limit=10</code></p><p><strong>Request Body:</strong></p><pre><code>{"role":"teacher","name":"أحمد","educationalStage":"secondary"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/users?page=1&limit=10' -H 'Content-Type: application/json' -d '{"role":"teacher","name":"أحمد","educationalStage":"secondary"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/users/:id</span></div><div class="endpoint-desc">جلب مستخدم بواسطة المعرف</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?role=teacher</code></p><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/users/123e4567-e89b-12d3-a456-426614174000?role=teacher'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/users</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">تحديث بيانات المستخدم الحالي</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body Example (Teacher):</strong></p><pre><code>{
  "name": "أحمد محمد الجديد",
  "phone": "+20123456789",
  "address": "القاهرة",
  "bio": "مدرس رياضيات",
  "studyMaterial": "math",
  "experienceYear": 8,
  "sharePrice": 200,
  "classRooms": ["first year of secondary"]
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/users' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"name":"أحمد محمد الجديد","phone":"+20123456789","address":"القاهرة","bio":"مدرس رياضيات","studyMaterial":"math","experienceYear":8,"sharePrice":200,"classRooms":["first year of secondary"]}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/users/:userId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">حذف حساب المستخدم</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/users/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== POSTS SECTION ==================== -->
                <div class="section" id="posts">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-newspaper"></i> Posts</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/posts</span></div><div class="endpoint-desc">جلب جميع المنشورات</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?page=1</code></p><p><strong>Request Body:</strong></p><pre><code>{"role":"teacher","userId":"..."}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/posts?page=1' -H 'Content-Type: application/json' -d '{"role":"teacher","userId":"..."}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/posts/:postId</span></div><div class="endpoint-desc">جلب منشور واحد</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/posts/123e4567-e89b-12d3-a456-426614174000'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/posts</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">إنشاء منشور جديد</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"title":"إعلان مهم","content":"محتوى المنشور","imageUrl":"https://example.com/img.jpg"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/posts' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"title":"إعلان مهم","content":"محتوى المنشور","imageUrl":"https://example.com/img.jpg"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/posts/:postId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">تحديث منشور</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"title":"عنوان معدل"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/posts/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"title":"عنوان معدل"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/posts/:postId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">حذف منشور</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/posts/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== COMMENTS SECTION ==================== -->
                <div class="section" id="comments">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-comments"></i> Comments</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/comments/:postId</span></div><div class="endpoint-desc">جلب تعليقات منشور</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/comments/123e4567-e89b-12d3-a456-426614174000'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/comments/:postId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">إضافة تعليق</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"content":"تعليق مفيد"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/comments/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"content":"تعليق مفيد"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/comments/:commentId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">تحديث تعليق</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"content":"تعليق معدل"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/comments/123e4567-e89b-12d3-a456-426614174000?postId=...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"content":"تعليق معدل"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/comments/:commentId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">حذف تعليق</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/comments/123e4567-e89b-12d3-a456-426614174000?postId=...' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== LIKES SECTION ==================== -->
                <div class="section" id="likes">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-heart"></i> Likes</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/likes/:id</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">إضافة أو إلغاء إعجاب (بمعرف المستخدم المتابَع)</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/likes/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== FOLLOWERS SECTION ==================== -->
                <div class="section" id="followers">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-user-plus"></i> Followers</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/followers/:targetUserId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">متابعة / إلغاء متابعة مستخدم</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/followers/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== LESSONS SECTION ==================== -->
                <div class="section" id="lessons">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-book-open"></i> Lessons</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/lessons</span></div><div class="endpoint-desc">جلب جميع الدروس</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?page=1&id=teacherId</code></p><p><strong>Request Body:</strong></p><pre><code>{"title":"مقدمة"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/lessons?page=1&id=123e4567...' -H 'Content-Type: application/json' -d '{"title":"مقدمة"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/lessons/:lessonId</span></div><div class="endpoint-desc">جلب درس واحد</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/lessons/123e4567-e89b-12d3-a456-426614174000'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/lessons/:courseId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">إنشاء درس جديد</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"title":"الجبر","description":"شرح المعادلات","videoUrl":"https://example.com/video.mp4"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/lessons/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"title":"الجبر","description":"شرح المعادلات","videoUrl":"https://example.com/video.mp4"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/lessons/:lessonId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">تحديث درس</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"title":"عنوان جديد"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/lessons/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"title":"عنوان جديد"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/lessons/:lessonId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">حذف درس</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/lessons/123e4567-e89b-12d3-a456-426614174000?courseId=...' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== COURSES SECTION ==================== -->
                <div class="section" id="courses">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-chalkboard"></i> Courses</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/courses</span></div><div class="endpoint-desc">جلب جميع الكورسات</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?page=1&id=teacherId</code></p><p><strong>Request Body:</strong></p><pre><code>{"classRoom":"first year"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/courses?page=1&id=123e4567...' -H 'Content-Type: application/json' -d '{"classRoom":"first year"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/courses/:courseId</span></div><div class="endpoint-desc">جلب كورس واحد</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/courses/123e4567-e89b-12d3-a456-426614174000'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/courses</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">إنشاء كورس جديد</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"time":"2025-12-31T14:30:00Z","studyMaterial":"Math","classRoom":"Grade 1"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/courses' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"time":"2025-12-31T14:30:00Z","studyMaterial":"Math","classRoom":"Grade 1"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/courses/:lessonId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">تحديث كورس</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"time":"2025-12-31T15:00:00Z"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/courses/123e4567...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"time":"2025-12-31T15:00:00Z"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/courses/:courseId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">حذف كورس</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/courses/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== EXAMS SECTION ==================== -->
                <div class="section" id="exams">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-file-alt"></i> Exams</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/exams</span></div><div class="endpoint-desc">جلب جميع الامتحانات (يحتاج courseId query)</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?courseId=...</code></p><p><strong>Request Body:</strong></p><pre><code>{"title":"exam"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/exams?courseId=123e4567...' -H 'Content-Type: application/json' -d '{"title":"exam"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/exams/:examId</span></div><div class="endpoint-desc">جلب امتحان واحد</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/exams/123e4567-e89b-12d3-a456-426614174000'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/exams/:lessonId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">إنشاء امتحان</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?courseId=...</code></p><p><strong>Request Body:</strong></p><pre><code>{"fileUrl":"https://example.com/exam.pdf"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/exams/123e4567...?courseId=...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"fileUrl":"https://example.com/exam.pdf"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/exams/:examId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">تحديث الامتحان</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"fileUrl":"https://example.com/new-exam.pdf"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/exams/123e4567...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"fileUrl":"https://example.com/new-exam.pdf"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/exams/:examId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">حذف الامتحان</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/exams/123e4567...?courseId=...' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== HOME WORKS SECTION ==================== -->
                <div class="section" id="homeworks">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-home"></i> Home Works</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/home-works</span></div><div class="endpoint-desc">جلب جميع الواجبات</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?courseId=...</code></p><p><strong>Request Body:</strong></p><pre><code>{"title":"hw"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/home-works?courseId=...' -H 'Content-Type: application/json' -d '{"title":"hw"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/home-works/:homeWorkId</span></div><div class="endpoint-desc">جلب واجب واحد</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/home-works/123e4567...'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/home-works/:lessonId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">إنشاء واجب</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?courseId=...</code></p><p><strong>Request Body:</strong></p><pre><code>{"fileUrl":"https://example.com/hw.pdf"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/home-works/123e4567...?courseId=...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"fileUrl":"https://example.com/hw.pdf"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/home-works/:homeWorkId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">تحديث واجب</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"fileUrl":"https://example.com/hw-updated.pdf"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/home-works/123e4567...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"fileUrl":"https://example.com/hw-updated.pdf"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/home-works/:homeWorkId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">حذف واجب</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/home-works/123e4567...?courseId=...' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== NOTES SECTION ==================== -->
                <div class="section" id="notes">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-sticky-note"></i> Notes</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/notes</span></div><div class="endpoint-desc">جلب جميع الملاحظات</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?page=1&limit=10</code></p><p><strong>Request Body:</strong></p><pre><code>{"title":"note"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/notes?page=1' -H 'Content-Type: application/json' -d '{"title":"note"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/notes/:noteId</span></div><div class="endpoint-desc">جلب ملاحظة واحدة</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/notes/123e4567...'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/notes/:lessonId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">إنشاء ملاحظة</div><details class="details"><summary>Details & Example</summary><p><strong>Query Parameters:</strong> <code>?courseId=...</code></p><p><strong>Request Body:</strong></p><pre><code>{"fileUrl":"https://example.com/note.pdf"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/notes/123e4567...?courseId=...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"fileUrl":"https://example.com/note.pdf"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/notes/:noteId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">تحديث ملاحظة</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"fileUrl":"https://example.com/note-updated.pdf"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/notes/123e4567...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"fileUrl":"https://example.com/note-updated.pdf"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/notes/:noteId</span><span class="badge">🔒 Auth required (Teacher)</span></div><div class="endpoint-desc">حذف ملاحظة</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/notes/123e4567...?courseId=...' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== BOOKED LESSONS SECTION ==================== -->
                <div class="section" id="booked-lessons">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-calendar-check"></i> Booked Lessons</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/booked-lessons/:lessonId</span><span class="badge">🔒 Auth required (Student)</span></div><div class="endpoint-desc">حجز أو إلغاء حجز درس</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/booked-lessons/123e4567-e89b-12d3-a456-426614174000' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== WEEKLY SCHEDULE SECTION ==================== -->
                <div class="section" id="weekly-schedule">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-calendar-week"></i> Weekly Schedule</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/weekly-schedule/:centerId</span></div><div class="endpoint-desc">جلب الجدول الأسبوعي لمركز</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"classRoom":"third year of secondary"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/weekly-schedule/123e4567...' -H 'Content-Type: application/json' -d '{"classRoom":"third year of secondary"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/weekly-schedule</span><span class="badge">🔒 Auth required (Center)</span></div><div class="endpoint-desc">إنشاء جدول أسبوعي (full schedule)</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"classRoom":"Grade 1","dataDays":[{"day":"saturday","time":"09:00","teacherId":"uuid","studyMaterial":"math"}]}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/weekly-schedule' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"classRoom":"Grade 1","dataDays":[{"day":"saturday","time":"09:00","teacherId":"uuid","studyMaterial":"math"}]}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/weekly-schedule/:weeklyScheduleId</span><span class="badge">🔒 Auth required (Center)</span></div><div class="endpoint-desc">إضافة يوم دراسي إلى جدول</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"day":"sunday","time":"10:00","teacherId":"uuid","studyMaterial":"physics"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/api/v1/weekly-schedule/123e4567...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"day":"sunday","time":"10:00","teacherId":"uuid","studyMaterial":"physics"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/weekly-schedule/:id</span><span class="badge">🔒 Auth required (Center)</span></div><div class="endpoint-desc">تحديث حصة (TeacherDay)</div><details class="details"><summary>Details & Example</summary><p><strong>Request Body:</strong></p><pre><code>{"time":"11:00","studyMaterial":"chemistry"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X PATCH '${BASE_URL}/api/v1/weekly-schedule/123e4567...' -H 'Authorization: Bearer <your-token>' -H 'Content-Type: application/json' -d '{"time":"11:00","studyMaterial":"chemistry"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/weekly-schedule/:weeklyScheduleId</span><span class="badge">🔒 Auth required (Center)</span></div><div class="endpoint-desc">حذف جدول أسبوعي بالكامل</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/weekly-schedule/123e4567...' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/weekly-schedule/teacherDay:teacherDayId</span><span class="badge">🔒 Auth required (Center)</span></div><div class="endpoint-desc">حذف حصة معينة من الجدول</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X DELETE '${BASE_URL}/api/v1/weekly-schedule/teacherDay:123e4567...' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>

                <!-- ==================== STUDENT DASHBOARD SECTION ==================== -->
                <div class="section" id="dashboard-student">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-chart-line"></i> Student Dashboard</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/dashboard-student/lessons</span><span class="badge">🔒 Auth required (Student)</span></div><div class="endpoint-desc">الدروس المحجوزة للطالب</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/dashboard-student/lessons' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/dashboard-student/shares</span><span class="badge">🔒 Auth required (Student)</span></div><div class="endpoint-desc">الحصص المشتركة (مشاركات)</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/dashboard-student/shares' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/dashboard-student/exam-home-worke</span><span class="badge">🔒 Auth required (Student)</span></div><div class="endpoint-desc">الامتحانات والواجبات الخاصة بالطالب</div><details class="details"><summary>Details & Example</summary><p><strong>cURL:</strong></p><pre><code>curl -X GET '${BASE_URL}/api/v1/dashboard-student/exam-home-worke' -H 'Authorization: Bearer <your-token>'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                    </div>
                </div>
            </main>
        </div>
        <footer><p>API Version 1.0 | Documentation generated dynamically | © ${new Date().getFullYear()} Educational Platform</p></footer>
    </div>
    <script nonce="${nonce}">
        function toggleSection(header) {
            const content = header.nextElementSibling;
            content.classList.toggle('collapsed');
            const icon = header.querySelector('i:last-child');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-right');
        }

        function copyToClipboard(btn) {
            const pre = btn.closest('pre');
            if (pre) {
                const code = pre.querySelector('code');
                const text = code ? code.innerText : pre.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    btn.innerHTML = '✓ Copied!';
                    setTimeout(() => btn.innerHTML = 'Copy', 2000);
                }).catch(err => {
                    alert('Failed to copy. Select and copy manually.');
                });
            }
        }

        window.toggleSection = toggleSection;
        window.copyToClipboard = copyToClipboard;

        // التنقل السلس
        document.querySelectorAll('.sidebar a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, null, '#' + targetId);
                }
            });
        });
    </script>
</body>
</html>`;
    res.send(html);
  }

  private getServerStatus() {
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return {
      status: 'online',
      uptime: `${days}d ${hours}h ${minutes}m`,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      env: process.env.NODE_ENV || 'development',
    };
  }
}
