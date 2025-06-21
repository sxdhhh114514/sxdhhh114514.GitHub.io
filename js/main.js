// js/index.js

// ============== LeanCloud 初始化 ==============
const APP_ID = 'oyl9RBhC3kt6oWWIP3DSIVYE-MdYXbMMI';
const APP_KEY = 's0nc1AP6rtNsEkDgdC7eTezo';

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
        { name: "舒玺达（站长）", gender: "male", phone: "18723143414", email: "18723143414@163.com" },
        { name: "王承宇", gender: "male", phone: "15213020708", email: "sb@example.com" },
        { name: "刘弋辉", gender: "male", phone: "15123884479", email: "2150001648@qq.com" },
        { name: "吴俊凡", gender: "male", phone: "13212332863", email: "none@example.com" },
        { name: "辜晨宇", gender: "male", phone: "15702396614", email: "none@example.com" },
        { name: "邓淳文", gender: "male", phone: "18983408697", email: "none@example.com" },
        { name: "任子硕", gender: "male", phone: "不知道联系用qq吧", email: "2256208106@qq.com" },
        { name: "冯博谦", gender: "male", phone: "19908322715", email: "2481163010@qq.com" },
        { name: "何长城", gender: "male", phone: "13648361513", email: "2408496418@qq.com" },
        { name: "谢丰洋", gender: "male", phone: "15923024809", email: "none" },
        { name: "刘彦铄", gender: "female", phone: "18109073782", email: "none" },
        { name: "刘义琳", gender: "female", phone: "19122803368", email: "none" },
        { name: "蔡祉琦", gender: "female", phone: "18323740812", email: "none" },
        { name: "殷浩铭", gender: "male", phone: "13648384585", email: "none" },
        { name: "阳忻洹", gender: "female", phone: "18523887010", email: "none" },
        { name: "冉芸希", gender: "female", phone: "16602332765", email: "none" },
        { name: "朱婉丽", gender: "female", phone: "15223075856", email: "none" },
        { name: "张紫嫣", gender: "female", phone: "18983623151", email: "none" },
        { name: "傅思涵", gender: "female", phone: "15213292078", email: "none" },
        { name: "丁哲男", gender: "male", phone: "19122168226", email: "none" },
        { name: "李黛佳", gender: "female", phone: "none", email: "none" },
        { name: "傅超", gender: "male", phone: "18223196240", email: "none" },
        { name: "刘思语", gender: "female", phone: "13996810711", email: "none" },
        { name: "袁瑶", gender: "female", phone: "18523349053", email: "none" },
        { name: "屈宏潮", gender: "male", phone: "13350391585", email: "none" },
        { name: "张申博", gender: "male", phone: "13372791587", email: "none" },
        { name: "谭梦瑶", gender: "female", phone: "13668060315", email: "none" },
        { name: "周恩毓", gender: "female", phone: "13002305402", email: "none" },
        { name: "罗丹敏", gender: "female", phone: "13648311944", email: "none" },
        { name: "李旭铎", gender: "male", phone: "18725614539", email: "none" },
        { name: "方惠云", gender: "female", phone: "15223393128", email: "none" },
        { name: "魏煜婷", gender: "female", phone: "17338389821", email: "none" },
    ];

    // 加载学生通讯录
    const rosterContainer = document.getElementById('rosterContainer');
    if (rosterContainer) {
        rosterContainer.innerHTML = '';

        students.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = `student-card ${student.gender}`;

            const avatar = document.createElement('div');
            avatar.className = 'student-avatar';

            const genderIcon = document.createElement('i');
            genderIcon.className = student.gender === 'male' ? 'fas fa-male' : 'fas fa-female';
            avatar.appendChild(genderIcon);

            const info = document.createElement('div');
            info.className = 'student-info';

            const name = document.createElement('div');
            name.className = 'student-name';
            name.textContent = student.name;

            const phone = document.createElement('div');
            phone.className = 'student-contact';
            phone.innerHTML = `<i class="fas fa-phone"></i> ${student.phone}`;

            const email = document.createElement('div');
            email.className = 'student-contact';
            email.innerHTML = `<i class="fas fa-envelope"></i> ${student.email}`;

            info.appendChild(name);
            info.appendChild(phone);
            info.appendChild(email);

            studentCard.appendChild(avatar);
            studentCard.appendChild(info);

            rosterContainer.appendChild(studentCard);
        });
    }
    
    // 可拖动主题切换按钮功能
    const themeSwitch = document.getElementById('themeSwitch');
    const themeButton = document.getElementById('themeButton');

    if (themeSwitch && themeButton) {
        const icon = themeButton.querySelector('i');
        const text = themeButton.querySelector('span');

        // 初始化主题
        const initTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.body.classList.add('dark-theme');
                if (icon) icon.className = 'fas fa-sun';
                if (text) text.textContent = '日间模式';
            } else {
                document.body.classList.remove('dark-theme');
                if (icon) icon.className = 'fas fa-moon';
                if (text) text.textContent = '夜间模式';
            }
        };

        // 主题切换功能
        themeButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');

            if (document.body.classList.contains('dark-theme')) {
                if (icon) icon.className = 'fas fa-sun';
                if (text) text.textContent = '日间模式';
                localStorage.setItem('theme', 'dark');
            } else {
                if (icon) icon.className = 'fas fa-moon';
                if (text) text.textContent = '夜间模式';
                localStorage.setItem('theme', 'light');
            }
        });

        // 初始化
        initTheme();
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
        // 创建视频UI元素
        const videoContainer = video.parentElement;

        // 添加播放按钮覆盖层
        const videoOverlay = document.createElement('div');
        videoOverlay.className = 'video-overlay';
        videoOverlay.innerHTML = `
            <i class="fas fa-play"></i>
            <div class="video-title">毕业纪念视频</div>
            <div class="video-subtitle">点击播放我们的珍贵回忆</div>
        `;
        videoContainer.appendChild(videoOverlay);

        // 创建控制条
        const videoControls = document.createElement('div');
        videoControls.className = 'video-controls';
        videoControls.innerHTML = `
            <button class="control-btn play-pause"><i class="fas fa-play"></i></button>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            <div class="time-display">00:00 / 00:00</div>
            <button class="control-btn volume-btn"><i class="fas fa-volume-up"></i></button>
            <div class="volume-container">
                <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="1">
            </div>
            <button class="control-btn fullscreen-btn"><i class="fas fa-expand"></i></button>
        `;
        videoContainer.appendChild(videoControls);

        // 获取UI元素
        const playPauseBtn = videoControls.querySelector('.play-pause');
        const progressBar = videoControls.querySelector('.progress-bar');
        const progressContainer = videoControls.querySelector('.progress-container');
        const timeDisplay = videoControls.querySelector('.time-display');
        const volumeBtn = videoControls.querySelector('.volume-btn');
        const volumeSlider = videoControls.querySelector('.volume-slider');
        const fullscreenBtn = videoControls.querySelector('.fullscreen-btn');

        // 播放/暂停功能
        const togglePlay = () => {
            if (video.paused) {
                video.play().catch(e => console.log('视频播放失败:', e));
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                videoOverlay.classList.add('hidden');
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        };

        // 点击覆盖层播放视频
        videoOverlay.addEventListener('click', togglePlay);

        // 控制条播放按钮
        playPauseBtn.addEventListener('click', togglePlay);

        // 进度条更新
        video.addEventListener('timeupdate', () => {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;

            // 更新时间显示
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            };

            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        });

        // 点击进度条跳转
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            video.currentTime = percent * video.duration;
        });

        // 音量控制
        volumeSlider.addEventListener('input', () => {
            video.volume = volumeSlider.value;
            volumeBtn.innerHTML = video.volume > 0 ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
        });

        volumeBtn.addEventListener('click', () => {
            if (video.volume > 0) {
                video.volume = 0;
                volumeSlider.value = 0;
                volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                video.volume = 1;
                volumeSlider.value = 1;
                volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });

        // 全屏功能
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                videoContainer.requestFullscreen().catch(err => {
                    console.error(`全屏请求错误: ${err.message}`);
                });
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                }
            }
        });

        // 视频结束重置
        video.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            videoOverlay.classList.remove('hidden');
        });

        // 加载元数据
        video.addEventListener('loadedmetadata', () => {
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            };

            timeDisplay.textContent = `00:00 / ${formatTime(video.duration)}`;
        });

        // 初始设置
        video.volume = 1;
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
        const speechItem = document.createElement('div');
        speechItem.className = 'speech-item';
        speechItem.style.animationDelay = `${index * 0.1}s`;
        
        const header = document.createElement('div');
        header.className = 'speech-header';
        
        const avatar = document.createElement('div');
        avatar.className = 'speech-avatar';
        avatar.textContent = comment.author.charAt(0);
        
        const author = document.createElement('div');
        author.className = 'speech-author';
        author.textContent = comment.author;
        
        const date = document.createElement('div');
        date.className = 'speech-date';
        date.textContent = new Date(comment.createdAt).toLocaleDateString();
        
        header.appendChild(avatar);
        header.appendChild(author);
        header.appendChild(date);
        
        const content = document.createElement('div');
        content.className = 'speech-content';
        content.textContent = comment.content;
        
        speechItem.appendChild(header);
        speechItem.appendChild(content);
        
        // 添加删除按钮（管理员或本人）
        if (currentUser && (currentUser.get('username') === 'admin' || currentUser.get('username') === comment.author)) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-comment';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = '删除评论';
            deleteBtn.onclick = async () => {
                if (confirm('确定要删除这条评论吗？')) {
                    try {
                        await deleteComment(comment.id);
                        loadComments();
                    } catch (error) {
                        console.error('删除评论失败:', error);
                        alert('删除评论失败，请重试');
                    }
                }
            };
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