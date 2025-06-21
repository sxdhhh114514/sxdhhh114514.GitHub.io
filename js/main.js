// js/index.js

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
                await addComment({
                    author: currentUser.get('username'),
                    content: content
                });
                
                document.getElementById('commentInput').value = '';
                loadComments();
                alert('感言已提交！感谢分享');
            } catch (error) {
                console.error('提交评论失败:', error);
                alert('提交失败，请重试');
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

        students.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = `student-card ${student.gender}`;

            // 创建学生卡片...
        });
    }
    
    // 可拖动主题切换按钮功能
    const themeSwitch = document.getElementById('themeSwitch');
    const themeButton = document.getElementById('themeButton');

    if (themeSwitch && themeButton) {
        // 主题切换功能...
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
        // 视频控制功能...
    }
});

// 加载评论
async function loadComments() {
    const speechContainer = document.getElementById('speechContainer');
    if (!speechContainer) return;
    
    try {
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
        // 创建评论项...
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