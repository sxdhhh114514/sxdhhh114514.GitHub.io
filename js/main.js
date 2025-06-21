// ============== LeanCloud 初始化 ==============
const APP_ID = 'oyl9RBhC3kt6oWWIP3DSIVYE-MdYXbMMI';
const APP_KEY = 'fbg0pdTHfsT8VtOoqmT8snIW';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// ============== 评论功能实现 ==============
let currentUser = null;

// 获取评论
async function getComments() {
    const query = new AV.Query('Comment');
    query.descending('createdAt');
    try {
        const comments = await query.find();
        return comments.map(comment => {
            return {
                id: comment.id,
                author: comment.get('author'),
                content: comment.get('content'),
                createdAt: comment.createdAt
            };
        });
    } catch (error) {
        console.error('获取评论失败:', error);
        throw error;
    }
}

// 添加评论
async function addComment(comment) {
    const Comment = AV.Object.extend('Comment');
    const newComment = new Comment();
    
    newComment.set('author', comment.author);
    newComment.set('content', comment.content);
    
    try {
        const savedComment = await newComment.save();
        return {
            id: savedComment.id,
            author: savedComment.get('author'),
            content: savedComment.get('content'),
            createdAt: savedComment.createdAt
        };
    } catch (error) {
        console.error('添加评论失败:', error);
        throw error;
    }
}

// 删除评论
async function deleteComment(commentId) {
    const comment = AV.Object.createWithoutData('Comment', commentId);
    try {
        await comment.destroy();
        return true;
    } catch (error) {
        console.error('删除评论失败:', error);
        throw error;
    }
}

// ============== 用户认证功能 ==============
// 用户登录
async function loginUser(username, password) {
    try {
        const user = await AV.User.logIn(username, password);
        return user;
    } catch (error) {
        console.error('登录失败:', error);
        throw error;
    }
}

// 获取当前用户
function getCurrentUser() {
    return AV.User.current();
}

// 用户登出
function logoutUser() {
    AV.User.logOut();
}

// ============== 页面功能实现 ==============
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子背景
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        },
        retina_detect: true
    });

    // 初始化当前用户
    currentUser = getCurrentUser();
    updateAuthUI();
    
    // 加载评论
    loadComments();
    
    // 评论提交
    const submitComment = document.getElementById('submitComment');
    if (submitComment) {
        submitComment.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                showLoginModal();
                return;
            }
            
            const content = document.getElementById('commentInput').value.trim();
            if (!content) {
                alert('请输入感言内容');
                return;
            }
            
            try {
                // 显示加载状态
                submitComment.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
                submitComment.disabled = true;
                
                await addComment({
                    author: currentUser.get('username'),
                    content: content
                });
                
                document.getElementById('commentInput').value = '';
                await loadComments();
                alert('感言已提交！感谢分享');
            } catch (error) {
                console.error('提交评论失败:', error);
                alert('提交失败，请重试');
            } finally {
                submitComment.innerHTML = '发表感言';
                submitComment.disabled = false;
            }
        });
    }
    
    // 登录弹窗
    const loginModal = document.getElementById('loginModal');
    const modalLoginForm = document.getElementById('modalLoginForm');
    if (modalLoginForm) {
        modalLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('modalUsername').value;
            const password = document.getElementById('modalPassword').value;
            
            try {
                const user = await loginUser(username, password);
                currentUser = user;
                updateAuthUI();
                hideLoginModal();
                alert('登录成功！');
            } catch (error) {
                alert('登录失败，请检查用户名和密码');
            }
        });
    }
    
    // 点击关闭按钮
    document.querySelector('.close').addEventListener('click', hideLoginModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideLoginModal();
        }
    });
    
    // 学生通讯录数据
    const students = [
        // 学生数据...
    ];

    // 加载学生通讯录
    const rosterContainer = document.getElementById('rosterContainer');
    if (rosterContainer) {
        rosterContainer.innerHTML = '';

        students.forEach((student, index) => {
            const studentCard = document.createElement('div');
            studentCard.className = `student-card ${student.gender} animate-on-scroll`;
            studentCard.style.transitionDelay = `${index * 0.1}s`;
            
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
                        <i class="fas fa-envelope"></i> ${student.email}
                    </div>
                </div>
            `;
            
            rosterContainer.appendChild(studentCard);
        });
        
        // 添加滚动观察器
        observeElements('.student-card');
    }
    
    // 照片墙数据
    const photos = [
        // 照片数据...
    ];
    
    // 加载照片墙
    const photoGrid = document.querySelector('.photo-grid');
    if (photoGrid) {
        photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item animate-on-scroll';
            photoItem.style.transitionDelay = `${index * 0.1}s`;
            
            photoItem.innerHTML = `
                <img src="${photo.url}" alt="${photo.caption}">
                <div class="photo-caption">${photo.caption}</div>
            `;
            
            photoGrid.appendChild(photoItem);
        });
        
        // 添加滚动观察器
        observeElements('.photo-item');
    }
    
    // 时间线数据
    const timelineEvents = [
        // 时间线数据...
    ];
    
    // 加载时间线
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timelineEvents.forEach((event, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
            
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <h3>${event.date}</h3>
                    <p>${event.description}</p>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
        
        // 添加滚动观察器
        observeElements('.timeline-item');
    }
    
    // 可拖动主题切换按钮功能
    const themeSwitch = document.getElementById('themeSwitch');
    const themeButton = document.getElementById('themeButton');

    if (themeSwitch && themeButton) {
        let isDragging = false;
        let offsetX, offsetY;

        themeButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            
            // 更新按钮图标
            const icon = themeButton.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                themeButton.querySelector('span').textContent = '日间模式';
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                themeButton.querySelector('span').textContent = '夜间模式';
            }
        });

        themeSwitch.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - themeSwitch.getBoundingClientRect().left;
            offsetY = e.clientY - themeSwitch.getBoundingClientRect().top;
            themeSwitch.classList.add('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // 限制在视口内
            const maxX = window.innerWidth - themeSwitch.offsetWidth;
            const maxY = window.innerHeight - themeSwitch.offsetHeight;
            
            themeSwitch.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
            themeSwitch.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            themeSwitch.classList.remove('dragging');
            
            // 保存位置
            localStorage.setItem('themeSwitchX', themeSwitch.style.left);
            localStorage.setItem('themeSwitchY', themeSwitch.style.top);
        });

        // 恢复位置
        const savedX = localStorage.getItem('themeSwitchX');
        const savedY = localStorage.getItem('themeSwitchY');
        const savedTheme = localStorage.getItem('theme');
        
        if (savedX && savedY) {
            themeSwitch.style.left = savedX;
            themeSwitch.style.top = savedY;
        }
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            const icon = themeButton.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeButton.querySelector('span').textContent = '日间模式';
        }
    }

    // 导航栏切换
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // 点击导航链接时关闭菜单
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 页面导航功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // 移动端关闭导航菜单
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // 视频功能
    const video = document.getElementById('graduationVideo');
    if (video) {
        video.addEventListener('play', () => {
            video.classList.add('playing');
        });
        
        video.addEventListener('pause', () => {
            video.classList.remove('playing');
        });
    }
});

// 加载评论
async function loadComments() {
    const speechContainer = document.getElementById('speechContainer');
    if (!speechContainer) return;
    
    try {
        // 显示加载状态
        speechContainer.innerHTML = '<div class="loader"></div>';
        
        const comments = await getComments();
        renderComments(comments);
    } catch (error) {
        speechContainer.innerHTML = '<div class="speech-error"><i class="fas fa-exclamation-triangle"></i> 加载评论失败，请刷新重试</div>';
    }
}

// 渲染评论
function renderComments(comments) {
    const speechContainer = document.getElementById('speechContainer');
    if (!speechContainer) return;
    
    speechContainer.innerHTML = '';
    
    if (comments.length === 0) {
        speechContainer.innerHTML = '<div class="no-comments">还没有毕业感言，快来第一个发表吧！</div>';
        return;
    }
    
    comments.forEach((comment, index) => {
        const speechItem = document.createElement('div');
        speechItem.className = 'speech-item';
        speechItem.style.animationDelay = `${index * 0.1}s`;
        speechItem.dataset.id = comment.id;
        
        const date = new Date(comment.createdAt);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        speechItem.innerHTML = `
            <div class="speech-header">
                <div class="speech-avatar">${comment.author.charAt(0)}</div>
                <div class="speech-author">${comment.author}</div>
                <div class="speech-date">${formattedDate}</div>
            </div>
            <div class="speech-content">${comment.content}</div>
        `;
        
        // 如果是当前用户的评论或管理员，添加删除按钮
        if (currentUser && (currentUser.get('username') === comment.author || currentUser.get('username') === 'admin')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-comment';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', async () => {
                if (confirm('确定要删除这条评论吗？')) {
                    speechItem.classList.add('deleting');
                    try {
                        await deleteComment(comment.id);
                        setTimeout(() => {
                            speechItem.remove();
                        }, 300);
                    } catch (error) {
                        speechItem.classList.remove('deleting');
                        alert('删除失败，请重试');
                    }
                }
            });
            speechItem.appendChild(deleteBtn);
        }
        
        speechContainer.appendChild(speechItem);
    });
}

// 更新用户界面
function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const adminLink = document.getElementById('adminLink');
    const commentForm = document.getElementById('commentForm');
    const authPrompt = document.getElementById('authPrompt');
    
    if (authBtn) {
        authBtn.textContent = currentUser ? '退出登录' : '登录/注册';
        authBtn.href = currentUser ? 'javascript:void(0)' : 'login.html';
        
        // 添加退出登录功能
        if (currentUser) {
            authBtn.onclick = () => {
                logoutUser();
                currentUser = null;
                updateAuthUI();
                alert('已退出登录');
                window.location.reload();
            };
        } else {
            authBtn.onclick = null;
        }
    }
    
    if (adminLink) {
        // 假设管理员用户名为"admin"
        adminLink.style.display = currentUser && currentUser.get('username') === 'admin' ? 'block' : 'none';
    }
    
    if (commentForm && authPrompt) {
        if (currentUser) {
            commentForm.style.display = 'block';
            authPrompt.style.display = 'none';
        } else {
            commentForm.style.display = 'none';
            authPrompt.style.display = 'block';
        }
    }
}

// 显示登录弹窗
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

// 隐藏登录弹窗
function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

// 滚动观察器
function observeElements(selector) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll(selector).forEach(element => {
        observer.observe(element);
    });
}