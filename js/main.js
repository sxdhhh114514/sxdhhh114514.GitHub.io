// 学生数据
const studentData = [
    { name: "舒玺达", phone: "18723143414", gender: "男" },
    { name: "王承宇", phone: "15213020708", gender: "男" },
    { name: "刘思雨", phone: "13996810711", gender: "女" },
    { name: "刘弋辉", phone: "18996101182", gender: "男" },
    { name: "固城宇", phone: "15702396614", gender: "男" },
    { name: "吴俊凡", phone: "13212332863", gender: "男" }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 渲染学生通讯录
    renderStudentRoster();
    
    // 渲染毕业感言
    renderSpeeches();
    
    // 初始化用户系统
    initAuthSystem();
    
    // 初始化主题切换
    initThemeToggle();
    
    // 初始化导航菜单
    initNavigation();
    
    // 检查登录状态
    checkLoginStatus();
});

// 渲染学生通讯录
function renderStudentRoster() {
    const rosterContainer = document.getElementById('rosterContainer');
    rosterContainer.innerHTML = '';
    
    studentData.forEach(student => {
        const genderIcon = student.gender === '男' ? 'mars' : 'venus';
        const genderClass = student.gender === '男' ? 'male' : 'female';
        
        const studentCard = document.createElement('div');
        studentCard.className = `student-card ${genderClass}`;
        studentCard.innerHTML = `
            <div class="student-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-contact">
                    <i class="fas fa-phone"></i> ${student.phone}
                </div>
                <div class="student-contact">
                    <i class="fas fa-${genderIcon}"></i> ${student.gender}
                </div>
            </div>
        `;
        rosterContainer.appendChild(studentCard);
    });
}

// 渲染毕业感言
function renderSpeeches() {
    const speechContainer = document.getElementById('speechContainer');
    speechContainer.innerHTML = '';
    
    const speeches = JSON.parse(localStorage.getItem('classSpeeches')) || [];
    
    speeches.forEach((speech, index) => {
        const initials = speech.author.substring(0, 1);
        const delay = index * 200;
        
        const speechItem = document.createElement('div');
        speechItem.className = 'speech-item';
        speechItem.style.animationDelay = `${delay}ms`;
        speechItem.innerHTML = `
            <div class="speech-header">
                <div class="speech-avatar">${initials}</div>
                <div class="speech-author">${speech.author}</div>
                <div class="speech-date">${speech.date}</div>
            </div>
            <div class="speech-content">
                ${speech.content}
            </div>
        `;
        speechContainer.appendChild(speechItem);
    });
}

// 初始化用户系统
function initAuthSystem() {
    const authBtn = document.getElementById('authBtn');
    const loginPrompt = document.getElementById('loginPrompt');
    const submitComment = document.getElementById('submitComment');
    
    // 登录/注册按钮
    authBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser) {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('currentUser');
                checkLoginStatus();
            }
        } else {
            window.location.href = 'login.html';
        }
    });
    
    // 登录提示
    if (loginPrompt) {
        loginPrompt.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    
    // 评论提交
    submitComment.addEventListener('click', () => {
        const commentInput = document.getElementById('commentInput');
        const comment = commentInput.value.trim();
        
        if (!comment) {
            alert('请输入毕业感言内容');
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('请先登录后再发表感言');
            window.location.href = 'login.html';
            return;
        }
        
        // 创建新的感言
        const newSpeech = {
            author: currentUser.username,
            content: comment,
            date: new Date().toLocaleDateString()
        };
        
        // 添加到感言列表
        const speeches = JSON.parse(localStorage.getItem('classSpeeches') || '[]');
        speeches.unshift(newSpeech);
        localStorage.setItem('classSpeeches', JSON.stringify(speeches));
        
        // 重新渲染
        renderSpeeches();
        
        // 清空输入框
        commentInput.value = '';
        
        alert('感言发表成功！');
    });
}

// 检查登录状态
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authBtn = document.getElementById('authBtn');
    const loginPrompt = document.querySelector('.login-prompt');
    const adminLink = document.getElementById('adminLink');
    
    if (currentUser) {
        authBtn.textContent = currentUser.username;
        
        // 显示评论表单
        if (loginPrompt) loginPrompt.style.display = 'none';
        
        // 管理员显示后台链接
        if (currentUser.role === 'admin') {
            adminLink.style.display = 'inline-block';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        authBtn.textContent = '登录/注册';
        
        // 隐藏评论表单
        if (loginPrompt) loginPrompt.style.display = 'block';
        adminLink.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('themeSwitch');
    const themeButton = document.getElementById('themeButton');
    const icon = themeButton.querySelector('i');
    const text = themeButton.querySelector('span');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.className = 'fas fa-sun';
        text.textContent = '切换到亮色主题';
    }
    
    // 检查本地存储中的按钮位置
    const savedPosition = localStorage.getItem('btnPosition');
    if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        themeSwitch.style.left = `${x}px`;
        themeSwitch.style.top = `${y}px`;
        themeSwitch.style.right = 'unset';
    }
// 初始化主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    // 应用保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
        text.textContent = '日间模式';
    }
    
    // 主题切换
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = '日间模式';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = '夜间模式';
        }
    });
}
    // 拖拽功能实现
    let isDragging = false;
    let offsetX, offsetY;
    
    themeSwitch.addEventListener('mousedown', (e) => {
        if (e.target === themeSwitch || e.target === themeButton) {
            isDragging = true;
            themeSwitch.classList.add('dragging');
            
            // 计算鼠标相对于元素内部的偏移
            const rect = themeSwitch.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // 计算新位置
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        
        // 限制在窗口范围内
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const elWidth = themeSwitch.offsetWidth;
        const elHeight = themeSwitch.offsetHeight;
        
        x = Math.max(0, Math.min(x, winWidth - elWidth));
        y = Math.max(0, Math.min(y, winHeight - elHeight));
        
        // 应用新位置
        themeSwitch.style.left = `${x}px`;
        themeSwitch.style.top = `${y}px`;
        themeSwitch.style.right = 'unset';
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            themeSwitch.classList.remove('dragging');
            
            // 保存位置到本地存储
            const rect = themeSwitch.getBoundingClientRect();
            localStorage.setItem('btnPosition', JSON.stringify({
                x: rect.left,
                y: rect.top
            }));
        }
    });
    
    // 添加触摸事件支持（用于移动设备）
    themeSwitch.addEventListener('touchstart', (e) => {
        if (e.target === themeSwitch || e.target === themeButton) {
            isDragging = true;
            themeSwitch.classList.add('dragging');
            
            const touch = e.touches[0];
            const rect = themeSwitch.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            
            e.preventDefault();
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        let x = touch.clientX - offsetX;
        let y = touch.clientY - offsetY;
        
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const elWidth = themeSwitch.offsetWidth;
        const elHeight = themeSwitch.offsetHeight;
        
        x = Math.max(0, Math.min(x, winWidth - elWidth));
        y = Math.max(0, Math.min(y, winHeight - elHeight));
        
        themeSwitch.style.left = `${x}px`;
        themeSwitch.style.top = `${y}px`;
        themeSwitch.style.right = 'unset';
    });
    
    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            themeSwitch.classList.remove('dragging');
            
            const rect = themeSwitch.getBoundingClientRect();
            localStorage.setItem('btnPosition', JSON.stringify({
                x: rect.left,
                y: rect.top
            }));
        }
    });
});
// 初始化导航菜单
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // 平滑滚动
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // 关闭移动端菜单
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}