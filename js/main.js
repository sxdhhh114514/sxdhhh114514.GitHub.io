document.addEventListener('DOMContentLoaded', () => {
    // ============== 可拖动主题切换按钮功能 ==============
    const themeSwitch = document.getElementById('themeSwitch');
    const themeButton = document.getElementById('themeButton');

    // 确保元素存在
    if (themeSwitch && themeButton) {
        const icon = themeButton.querySelector('i');
        const text = themeButton.querySelector('span');

        // 初始化主题
        const initTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // 优先使用本地存储的主题，其次使用系统偏好
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

        // 初始化按钮位置
        const initButtonPosition = () => {
            const savedPosition = localStorage.getItem('btnPosition');
            if (savedPosition) {
                const { x, y } = JSON.parse(savedPosition);
                themeSwitch.style.left = `${x}px`;
                themeSwitch.style.top = `${y}px`;
                themeSwitch.style.right = 'unset';
            } else {
                // 默认位置（右上角）
                themeSwitch.style.right = '20px';
                themeSwitch.style.top = '60px';
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

        // 拖拽功能实现
        let isDragging = false;
        let offsetX, offsetY;

        const startDrag = (clientX, clientY) => {
            isDragging = true;
            themeSwitch.classList.add('dragging');

            const rect = themeSwitch.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;

            // 添加过渡禁用以防止拖动时抖动
            themeSwitch.style.transition = 'none';
        };

        const doDrag = (clientX, clientY) => {
            if (!isDragging) return;

            // 计算新位置
            let x = clientX - offsetX;
            let y = clientY - offsetY;

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
        };

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                themeSwitch.classList.remove('dragging');

                // 恢复过渡效果
                themeSwitch.style.transition = '';

                // 保存位置到本地存储
                const rect = themeSwitch.getBoundingClientRect();
                localStorage.setItem('btnPosition', JSON.stringify({
                    x: rect.left,
                    y: rect.top
                }));
            }
        };

        // 鼠标事件
        themeSwitch.addEventListener('mousedown', (e) => {
            if (e.target === themeSwitch || e.target === themeButton) {
                startDrag(e.clientX, e.clientY);
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            doDrag(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', endDrag);

        // 触摸事件
        themeSwitch.addEventListener('touchstart', (e) => {
            if (e.target === themeSwitch || e.target === themeButton) {
                const touch = e.touches[0];
                startDrag(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            doDrag(touch.clientX, touch.clientY);
        }, { passive: false });

        document.addEventListener('touchend', endDrag);

        // 窗口调整大小时重新定位按钮
        window.addEventListener('resize', () => {
            const savedPosition = localStorage.getItem('btnPosition');
            if (savedPosition) {
                const { x, y } = JSON.parse(savedPosition);

                // 确保按钮在可视区域内
                const winWidth = window.innerWidth;
                const winHeight = window.innerHeight;
                const elWidth = themeSwitch.offsetWidth;
                const elHeight = themeSwitch.offsetHeight;

                const newX = Math.max(0, Math.min(x, winWidth - elWidth));
                const newY = Math.max(0, Math.min(y, winHeight - elHeight));

                themeSwitch.style.left = `${newX}px`;
                themeSwitch.style.top = `${newY}px`;
                themeSwitch.style.right = 'unset';

                // 更新存储位置
                localStorage.setItem('btnPosition', JSON.stringify({
                    x: newX,
                    y: newY
                }));
            }
        });

        // 初始化
        initTheme();
        initButtonPosition();
    }

    // ============== 导航栏功能 ==============

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

    // ============== 学生通讯录功能 ==============

    // 学生通讯录数据
    const students = [
        { name: "舒玺达（站长）", gender: "male", phone: "18723143414", email: "18723143414@163.com" },
        { name: "王承宇", gender: "male", phone: "15213020708", email: "sb@example.com" },
        { name: "刘弋辉", gender: "male", phone: "15123884479", email: "2150001648@qq.com" },
        { name: "吴俊凡", gender: "male", phone: "13212332863", email: "none@example.com" },
        { name: "辜晨宇", gender: "male", phone: "15702396614", email: "none@example.com" },
        { name: "邓淳文", gender: "male", phone: "18983408697", email: "none@example.com" },
        { name: "任子硕", gender: "male", phone: "不知道联系用qq吧", email: "这是qq邮箱前面是qq号2256208106@qq.com" },
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
        // 清空容器以防重复加载
        rosterContainer.innerHTML = '';

        students.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = `student-card ${student.gender}`;

            const avatar = document.createElement('div');
            avatar.className = 'student-avatar';

            // 使用性别图标
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
    // ============== 毕业感言功能 ==============

    // 毕业感言数据
    const speeches = [
        { author: "舒玺达", date: "2025-06-10", content: "三年的初中生活转瞬即逝，感谢老师们的辛勤付出和同学们的陪伴。我会永远珍藏这段美好的回忆！" },
        { author: "王芳", date: "2025-06-11", content: "在这个班级里，我不仅学到了知识，更学会了如何与人相处。感谢每一位同学，你们让我的初中生活如此精彩！" },
        { author: "张伟", date: "2025-06-12", content: "从初一到初三，我们一起成长，一起奋斗。虽然即将分别，但我们的友谊长存！" }
    ];
     // 加载毕业感言
    const speechContainer = document.getElementById('speechContainer');
    if (speechContainer) {
        // 清空容器以防重复加载
        speechContainer.innerHTML = '';

        speeches.forEach((speech, index) => {
            const speechItem = document.createElement('div');
            speechItem.className = 'speech-item';
            speechItem.style.animationDelay = `${index * 0.2}s`;

            const header = document.createElement('div');
            header.className = 'speech-header';

            const avatar = document.createElement('div');
            avatar.className = 'speech-avatar';
            avatar.textContent = speech.author.charAt(0);

            const author = document.createElement('div');
            author.className = 'speech-author';
            author.textContent = speech.author;

            const date = document.createElement('div');
            date.className = 'speech-date';
            date.textContent = speech.date;

            header.appendChild(avatar);
            header.appendChild(author);
            header.appendChild(date);

            const content = document.createElement('div');
            content.className = 'speech-content';
            content.textContent = speech.content;

            speechItem.appendChild(header);
            speechItem.appendChild(content);

            speechContainer.appendChild(speechItem);
        });
    }

    // 毕业感言提交功能
    const commentForm = document.getElementById('commentForm');
    const commentInput = document.getElementById('commentInput');
    const submitComment = document.getElementById('submitComment');

    if (commentForm && commentInput && submitComment) {
        submitComment.addEventListener('click', (e) => {
            e.preventDefault();

            const content = commentInput.value.trim();
            if (!content) {
                alert('请输入感言内容');
                return;
            }

            // 创建新感言
            const newSpeech = {
                author: "我",
                date: new Date().toISOString().split('T')[0],
                content: content
            };

            // 添加到感言列表
            const speechItem = document.createElement('div');
            speechItem.className = 'speech-item';
            speechItem.style.animation = 'fadeIn 0.6s ease forwards';
            speechItem.style.opacity = '0';

            const header = document.createElement('div');
            header.className = 'speech-header';

            const avatar = document.createElement('div');
            avatar.className = 'speech-avatar';
            avatar.textContent = newSpeech.author.charAt(0);

            const author = document.createElement('div');
            author.className = 'speech-author';
            author.textContent = newSpeech.author;

            const date = document.createElement('div');
            date.className = 'speech-date';
            date.textContent = newSpeech.date;

            header.appendChild(avatar);
            header.appendChild(author);
            header.appendChild(date);

            const contentElem = document.createElement('div');
            contentElem.className = 'speech-content';
            contentElem.textContent = newSpeech.content;

            speechItem.appendChild(header);
            speechItem.appendChild(contentElem);

            if (speechContainer) {
                speechContainer.appendChild(speechItem);

                // 滚动到新添加的感言
                setTimeout(() => {
                    speechItem.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }

            // 清空输入框
            commentInput.value = '';

            alert('感言已提交！感谢分享（由于技术问题可能会出现刷新留言消失的情况）');
        });
    }

    // ============== 页面导航功能 ==============

    // 平滑滚动
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

    // ============== 视频功能 ==============

    // 视频控制功能
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

        // 点击视频容器播放视频
        videoContainer.addEventListener('click', (e) => {
            if (e.target === videoContainer || e.target === video) {
                togglePlay();
            }
        });

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

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 只在视频可见且聚焦时响应
            if (!videoContainer.getBoundingClientRect().top < window.innerHeight) return;

            switch(e.key) {
                case ' ':
                    if (document.activeElement === document.body) {
                        togglePlay();
                        e.preventDefault();
                    }
                    break;
                case 'ArrowLeft':
                    video.currentTime -= 5;
                    break;
                case 'ArrowRight':
                    video.currentTime += 5;
                    break;
                case 'ArrowUp':
                    video.volume = Math.min(video.volume + 0.1, 1);
                    volumeSlider.value = video.volume;
                    break;
                case 'ArrowDown':
                    video.volume = Math.max(video.volume - 0.1, 0);
                    volumeSlider.value = video.volume;
                    break;
                case 'f':
                    fullscreenBtn.click();
                    break;
                case 'm':
                    volumeBtn.click();
                    break;
            }
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
        video.muted = false;
    }

    // ============== 其他优化 ==============

    // 添加加载完成后的动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});
// 添加在文件末尾
// ============== 页面跳转动画 ==============
document.addEventListener('DOMContentLoaded', () => {
  // 页面加载完成后隐藏动画
  setTimeout(() => {
    const transitionElement = document.getElementById('pageTransition');
    if (transitionElement) {
      transitionElement.style.display = 'none';
    }
  }, 1000);
  
  // 处理页面跳转动画
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // 排除锚点链接和外部链接
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || 
          href.includes('lz.qaiu.top') || href.includes('share.feijipan.com') ||
          href.includes('zzxx.cqedu.cn') || href.includes('img.wjwj.top')) {
        return;
      }
      
      e.preventDefault();
      
      // 显示过渡动画
      const transitionElement = document.getElementById('pageTransition');
      if (transitionElement) {
        transitionElement.style.display = 'flex';
        transitionElement.querySelector('.transition-overlay').style.animation = 'slideIn 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
      }
      
      // 导航到新页面
      setTimeout(() => {
        window.location.href = href;
      }, 800);
    });
  });
});
// 在原有JS基础上添加以下内容

document.addEventListener('DOMContentLoaded', () => {
  // ... 原有代码 ...
  
  // 为卡片添加顺序变量
  document.querySelectorAll('.glass-container').forEach((card, index) => {
    card.style.setProperty('--card-order', index);
  });
  
  // ... 原有代码 ...
});