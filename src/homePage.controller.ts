import { Controller, Get, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import RolesDecorator from './decorator/roles.decorator';
import AuthDecorator from './decorator/auth.decorator';

@Controller('docs')
export class HomeController {
  constructor(private configService: ConfigService) {}

  @RolesDecorator()
  @AuthDecorator()
  @Get()
  getHome(@Res() res: Response, @Req() req: Request) {
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
        /* جميع الـ CSS كما في الكود السابق (تم حذفه للاختصار) */
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
                    <li><a href="#lessons">📖 Lessons</a></li>
                    <li><a href="#schedule">📅 Weekly Schedule</a></li>
                    <li><a href="#posts">📝 Posts</a></li>
                    <li><a href="#comments">💬 Comments</a></li>
                    <li><a href="#likes">❤️ Likes</a></li>
                    <li><a href="#followers">👥 Followers</a></li>
                    <li><a href="#bookings">📅 Bookings</a></li>
                </ul></nav>
            </aside>
            <main class="content" id="main-content"></main>
        </div>
        <footer><p>API Version 1.0 | Documentation generated dynamically | © ${new Date().getFullYear()} Educational Platform</p></footer>
    </div>
    <script nonce="${nonce}">
        // بيانات الـ endpoints
        const endpointsData = {
            auth: {
                name: "Authentication",
                icon: "fa-key",
                endpoints: [
                    { method: "POST", path: "/auth/signup", description: "Register a new user", requestBody: { example: { name: "John Doe", email: "john@example.com", password: "StrongPass123", role: "student", phone: "01234567890", address: "Cairo", age: 20, nationality: "Egyptian" } } },
                    { method: "POST", path: "/auth/login", description: "Login with email and password", requestBody: { example: { email: "john@example.com", password: "StrongPass123" } } },
                    { method: "POST", path: "/auth/logout", description: "Logout (clears cookie)", auth: true }
                ]
            },
            users: {
                name: "Users",
                icon: "fa-users",
                endpoints: [
                    { method: "GET", path: "/users", description: "Get all teachers or centers with filters (public)", queryParams: "?role=teacher&name=...&page=1&limit=10" },
                    { method: "GET", path: "/users/:id", description: "Get a specific user (requires role in body)", body: { role: "teacher" } },
                    { method: "PATCH", path: "/users/:id", description: "Update own profile", auth: true, requestBody: { example: { name: "New Name", phone: "0111111111" } } },
                    { method: "DELETE", path: "/users/:id", description: "Delete own account", auth: true }
                ]
            },
            lessons: {
                name: "Lessons",
                icon: "fa-book-open",
                endpoints: [
                    { method: "GET", path: "/lessons", description: "Get lessons for a teacher (public)", queryParams: "?teacherId=uuid&classRoom=...&studyMaterial=...&page=1&limit=10" },
                    { method: "GET", path: "/lessons/:id", description: "Get a single lesson (public)" },
                    { method: "POST", path: "/lessons", description: "Create a new lesson (teacher only)", auth: true, requestBody: { example: { title: "Algebra Basics", classRoom: "first year of secondary", studyMaterial: "math", description: "Introduction to algebra", vedioUrl: "https://example.com/video.mp4" } } },
                    { method: "PATCH", path: "/lessons/:id", description: "Update lesson (owner teacher)", auth: true, requestBody: { example: { title: "Updated Title" } } },
                    { method: "DELETE", path: "/lessons/:id", description: "Delete lesson (owner teacher)", auth: true }
                ]
            },
            schedule: {
                name: "Weekly Schedule",
                icon: "fa-calendar-week",
                endpoints: [
                    { method: "GET", path: "/weeklys", description: "Get weekly schedule", body: { centerId: "uuid", classRoom: "third year of secondary" } },
                    { method: "POST", path: "/weeklys", description: "Create a weekly schedule (center only)", auth: true, requestBody: { example: { classRoom: "third year of secondary", dataDays: [{ day: "saturday", time: "09:00", teacherId: "uuid", studyMaterial: "math" }] } } },
                    { method: "PATCH", path: "/weeklys/:id", description: "Update a specific teacherDay slot (center only)", auth: true, requestBody: { example: { time: "10:00", studyMaterial: "physics" } } },
                    { method: "DELETE", path: "/weeklys/:id", description: "Delete a specific teacherDay slot (center only)", auth: true }
                ]
            },
            posts: {
                name: "Posts",
                icon: "fa-newspaper",
                endpoints: [
                    { method: "GET", path: "/posts", description: "Get posts by user (public)", queryParams: "?userId=uuid&role=teacher&page=1&limit=10" },
                    { method: "GET", path: "/posts/:id", description: "Get a single post (public)" },
                    { method: "POST", path: "/posts", description: "Create a post (teacher/center only)", auth: true, requestBody: { example: { title: "Important Announcement", content: "We have a new course starting next week." } } },
                    { method: "PATCH", path: "/posts/:id", description: "Update post (owner only)", auth: true, requestBody: { example: { title: "Updated Title" } } },
                    { method: "DELETE", path: "/posts/:id", description: "Delete post (owner only)", auth: true }
                ]
            },
            comments: {
                name: "Comments",
                icon: "fa-comments",
                endpoints: [
                    { method: "GET", path: "/comments", description: "Get all comments for a post (public)", queryParams: "?postId=uuid&page=1&limit=10" },
                    { method: "GET", path: "/comments/:id", description: "Get a single comment (public)" },
                    { method: "POST", path: "/comments", description: "Create a comment (authenticated)", auth: true, requestBody: { example: { postId: "uuid", content: "Great post!" } } },
                    { method: "PATCH", path: "/comments/:id", description: "Update own comment", auth: true, requestBody: { example: { content: "Updated comment" } } },
                    { method: "DELETE", path: "/comments/:id", description: "Delete own comment", auth: true }
                ]
            },
            likes: {
                name: "Likes",
                icon: "fa-heart",
                endpoints: [
                    { method: "POST", path: "/likes", description: "Toggle like on a post (authenticated)", auth: true, requestBody: { example: { id: "post-uuid" } } }
                ]
            },
            followers: {
                name: "Followers",
                icon: "fa-user-plus",
                endpoints: [
                    { method: "POST", path: "/followers", description: "Toggle follow a teacher/center (authenticated)", auth: true, requestBody: { example: { id: "target-user-uuid" } } }
                ]
            },
            bookings: {
                name: "Bookings",
                icon: "fa-calendar-check",
                endpoints: [
                    { method: "POST", path: "/bookeds", description: "Toggle booking a teacher day (student only)", auth: true, requestBody: { example: { id: "teacher-day-uuid" } } }
                ]
            }
        };

        function generateCurl(endpoint) {
            let curl = \`curl -X \${endpoint.method}\`;
            if (endpoint.auth) curl += " -H 'Authorization: Bearer <your-token>'";
            curl += \` '${BASE_URL}/api/v1\${endpoint.path}'\`;
            if (endpoint.queryParams) curl = curl.replace(/'$/, \`?\${endpoint.queryParams}'\`);
            if (endpoint.requestBody) curl += " -H 'Content-Type: application/json' -d '" + JSON.stringify(endpoint.requestBody.example, null, 2) + "'";
            if (endpoint.body && !endpoint.requestBody) curl += " -H 'Content-Type: application/json' -d '" + JSON.stringify(endpoint.body, null, 2) + "'";
            return curl;
        }

        function renderSections() {
            const main = document.getElementById('main-content');
            if (!main) return;
            main.innerHTML = '';
            for (const [key, section] of Object.entries(endpointsData)) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'section';
                sectionDiv.id = key;
                sectionDiv.innerHTML = \`
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas \${section.icon}"></i> \${section.name}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        \${section.endpoints.map(ep => {
                            let detailsHtml = '';
                            if (ep.queryParams) detailsHtml += \`<p><strong>Query Parameters:</strong> <code>\${ep.queryParams}</code></p>\`;
                            if (ep.body) detailsHtml += \`<p><strong>Request Body:</strong></p><pre><code>\${JSON.stringify(ep.body, null, 2)}</code><button class="copy-btn" onclick="copyToClipboard(this)"><i class="fas fa-copy"></i> Copy</button></pre>\`;
                            if (ep.requestBody) detailsHtml += \`<p><strong>Request Body Example:</strong></p><pre><code>\${JSON.stringify(ep.requestBody.example, null, 2)}</code><button class="copy-btn" onclick="copyToClipboard(this)"><i class="fas fa-copy"></i> Copy</button></pre>\`;
                            const curl = generateCurl(ep);
                            detailsHtml += \`<p><strong>cURL:</strong></p><pre><code>\${curl}</code><button class="copy-btn" onclick="copyToClipboard(this)"><i class="fas fa-copy"></i> Copy</button></pre>\`;
                            return \`
                                <div class="endpoint">
                                    <div>
                                        <span class="endpoint-method method-\${ep.method.toLowerCase()}">\${ep.method}</span>
                                        <span class="endpoint-path">\${ep.path}</span>
                                        \${ep.auth ? '<span class="badge"><i class="fas fa-lock"></i> Auth required</span>' : ''}
                                    </div>
                                    <div class="endpoint-desc">\${ep.description}</div>
                                    <details class="details">
                                        <summary>Details & Example</summary>
                                        \${detailsHtml}
                                    </details>
                                </div>
                            \`;
                        }).join('')}
                    </div>
                \`;
                main.appendChild(sectionDiv);
            }
        }

        window.toggleSection = function(header) {
            const content = header.nextElementSibling;
            content.classList.toggle('collapsed');
            const icon = header.querySelector('i:last-child');
            if (content.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            } else {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            }
        };

        window.copyToClipboard = function(btn) {
            const pre = btn.closest('pre');
            if (pre) {
                const code = pre.querySelector('code');
                const text = code ? code.innerText : pre.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i> Copy', 2000);
                });
            }
        };

        document.querySelectorAll('.sidebar a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        renderSections();
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
    const uptimeStr = `${days}d ${hours}h ${minutes}m`;
    return {
      status: 'online',
      uptime: uptimeStr,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      env: process.env.NODE_ENV || 'development',
    };
  }
}
