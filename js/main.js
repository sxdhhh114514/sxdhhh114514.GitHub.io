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
        });
        
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            doDrag(touch.clientX, touch.clientY);
        });
        
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

    // ============== 原有功能保持不变 ==============
    
    // 导航栏切换
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // 学生通讯录数据
    const students = [
        { name: "舒玺达", gender: "male", phone: "18723143414", email: "18723143414@163.com" },
        { name: "王承宇", gender: "male", phone: "15213020708", email: "lisi@example.com" },
        { name: "刘思雨", gender: "male", phone: "13996810711", email: "none@example.com" },
        { name: "赵六", gender: "male", phone: "13600136000", email: "zhaoliu@example.com" },
        { name: "钱七", gender: "female", phone: "13500135000", email: "qianqi@example.com" },
        { name: "孙八", gender: "male", phone: "13400134000", email: "sunba@example.com" },
        { name: "周九", gender: "female", phone: "13300133000", email: "zhoujiu@example.com" },
        { name: "吴十", gender: "male", phone: "13200132000", email: "wushi@example.com" }
    ];
    
    // 加载学生通讯录
    const rosterContainer = document.getElementById('rosterContainer');
    if (rosterContainer) {
        students.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = `student-card ${student.gender}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'student-avatar';
            avatar.innerHTML = `<i class="fas fa-user"></i>`;
            
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
    
    // 毕业感言数据
    const speeches = [
        { author: "李明", date: "2025-06-10", content: "三年的初中生活转瞬即逝，感谢老师们的辛勤付出和同学们的陪伴。我会永远珍藏这段美好的回忆！" },
        { author: "王芳", date: "2025-06-11", content: "在这个班级里，我不仅学到了知识，更学会了如何与人相处。感谢每一位同学，你们让我的初中生活如此精彩！" },
        { author: "张伟", date: "2025-06-12", content: "从初一到初三，我们一起成长，一起奋斗。虽然即将分别，但我们的友谊长存！" }
    ];
    
    // 加载毕业感言
    const speechContainer = document.getElementById('speechContainer');
    if (speechContainer) {
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
            
            if (commentInput.value.trim() === '') {
                alert('请输入感言内容');
                return;
            }
            
            alert('感言已提交！感谢分享（注：由于技术原因，其他人可能无法看到您的留言）');
            commentInput.value = '';
        });
    }
    
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
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // 视频自动播放（在用户交互后）
    const video = document.getElementById('graduationVideo');
    if (video) {
        document.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(e => console.log('视频播放失败:', e));
            }
        }, { once: true });
    }
});