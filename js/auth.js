// 初始化登录注册页面
document.addEventListener('DOMContentLoaded', () => {
    // 设置主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 初始化表单
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 应用保存的主题
    applySavedTheme();
});

// 处理登录
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // 保存当前用户
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 如果勾选"记住我"，设置长期存储
        if (remember) {
            localStorage.setItem('rememberedUser', JSON.stringify({
                username: user.username,
                token: btoa(`${username}:${password}`)
            }));
        }

        alert(`欢迎回来，${username}！`);
        window.location.href = 'index.html';
    } else {
        alert('用户名或密码错误！');
    }
}

// 处理注册
function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (password !== confirm) {
        alert('两次输入的密码不一致！');
        return;
    }

    // 检查用户是否已存在
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        alert('用户名已存在！');
        return;
    }

    // 创建新用户
    const newUser = {
        username,
        email,
        password,
        joined: new Date().toISOString(),
        role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('注册成功！即将跳转到首页');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// 主题切换功能
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // 更新按钮文本
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');

        if (newTheme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = '日间模式';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = '夜间模式';
        }
    }
}

// 应用保存的主题
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // 更新按钮状态
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');

            if (savedTheme === 'dark') {
                icon.className = 'fas fa-sun';
                text.textContent = '日间模式';
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = '夜间模式';
            }
        }
    }
}