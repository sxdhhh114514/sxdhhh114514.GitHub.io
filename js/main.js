// 学生数据
const studentData = [
    { name: "张明", phone: "13800138000", gender: "男" },
    { name: "李华", phone: "13900139000", gender: "女" },
    { name: "王芳", phone: "13700137000", gender: "女" },
    { name: "刘伟", phone: "13600136000", gender: "男" },
    { name: "陈静", phone: "13500135000", gender: "女" },
    { name: "赵强", phone: "13400134000", gender: "男" },
    { name: "周涛", phone: "13300133000", gender: "男" },
    { name: "吴燕", phone: "13200132000", gender: "女" },
    { name: "郑浩", phone: "13100131000", gender: "男" },
    { name: "孙梅", phone: "13000130000", gender: "女" },
    { name: "钱超", phone: "12900129000", gender: "男" },
    { name: "冯丽", phone: "12800128000", gender: "女" }
];

// 毕业感言数据
const speeches = [
    { author: "张明", content: "三年时光转瞬即逝，感谢老师和同学们的陪伴！", date: "2025-06-10" },
    { author: "李华", content: "初中生活是我最珍贵的回忆，永远记得我们一起奋斗的日子。", date: "2025-06-12" },
    { author: "王老师", content: "看着你们从懵懂少年成长为有志青年，老师为你们感到骄傲！", date: "2025-06-15" }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 渲染学生通讯录
    renderStudentRoster();
    
    // 渲染毕业感言
    renderSpeeches();
    
    // 初始化导航菜单
    initNavigation();
    
    // 检查登录状态
    checkLoginStatus();
    
    // 添加评论功能
    setupCommentForm();
});

// 渲染学生通讯录
function renderStudentRoster() {
    const rosterContainer = document.querySelector('.roster-container');
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
    const speechContainer = document.querySelector('.speech-container');
    speechContainer.innerHTML = '';
    
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

// 检查登录状态
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authBtn = document.getElementById('authBtn');
    const commentForm = document.getElementById('commentForm');
    
    if (currentUser) {
        authBtn.textContent = currentUser.username;
        authBtn.href = 'javascript:void(0);';
        authBtn.addEventListener('click', logout);
        
        // 显示评论表单
        const loginPrompt = document.querySelector('.login-prompt');
        if (loginPrompt) loginPrompt.style.display = 'none';
    } else {
        authBtn.textContent = '登录';
        authBtn.href = 'login.html';
        
        // 隐藏评论表单
        const loginPrompt = document.querySelector('.login-prompt');
        if (loginPrompt) loginPrompt.style.display = 'block';
    }
}

// 设置评论表单
function setupCommentForm() {
    const submitBtn = document.getElementById('submitComment');
    if (!submitBtn) return;
    
    submitBtn.addEventListener('click', () => {
        const commentInput = document.getElementById('commentInput');
        const comment = commentInput.value.trim();
        
        if (!comment) {
            alert('请输入毕业感言内容');
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('请先登录后再发表感言');
            return;
        }
        
        // 创建新的感言
        const newSpeech = {
            author: currentUser.username,
            content: comment,
            date: new Date().toISOString().split('T')[0]
        };
        
        // 添加到感言列表
        speeches.unshift(newSpeech);
        renderSpeeches();
        
        // 清空输入框
        commentInput.value = '';
        
        alert('感言发表成功！');
    });
}

// 退出登录
function logout() {
    localStorage.removeItem('currentUser');
    alert('您已成功退出登录');
    location.reload();
}