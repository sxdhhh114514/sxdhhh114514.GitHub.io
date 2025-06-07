// 管理后台脚本
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航
    initAdminNavigation();
    
    // 加载统计数据
    loadStats();
    
    // 加载用户数据
    loadUsers();
    
    // 加载感言数据
    loadSpeeches();
    
    // 添加用户按钮
    document.getElementById('addUserBtn').addEventListener('click', () => {
        document.getElementById('addUserModal').style.display = 'flex';
    });
    
    // 关闭模态框
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('addUserModal').style.display = 'none';
    });
});

// 初始化后台导航
function initAdminNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            document.querySelectorAll('.admin-nav a').forEach(a => {
                a.classList.remove('active');
            });
            
            // 添加active类到当前链接
            this.classList.add('active');
            
            // 隐藏所有内容区域
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // 显示目标内容区域
            const target = this.getAttribute('href');
            document.querySelector(target).classList.add('active');
        });
    });
}

// 加载统计数据
function loadStats() {
    const users = JSON.parse(localStorage.getItem('classUsers') || '[]');
    const speeches = JSON.parse(localStorage.getItem('classSpeeches') || '[]');
    const students = JSON.parse(localStorage.getItem('classStudents') || '[]');
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalSpeeches').textContent = speeches.length;
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalMedia').textContent = '6'; // 媒体文件数量
}

// 加载用户数据
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('classUsers') || '[]');
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.email || '未提供'}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><span class="status active">活跃</span></td>
            <td>
                <button class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 加载感言数据
function loadSpeeches() {
    const speeches = JSON.parse(localStorage.getItem('classSpeeches') || '[]');
    const tableBody = document.getElementById('speechesTableBody');
    tableBody.innerHTML = '';
    
    speeches.forEach((speech, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${speech.author}</td>
            <td>${speech.content.substring(0, 30)}${speech.content.length > 30 ? '...' : ''}</td>
            <td>${speech.date}</td>
            <td><span class="status active">已发布</span></td>
            <td>
                <button class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// 管理后台脚本 - 新增媒体管理功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航保持不变
    
    // 加载统计数据保持不变
    
    // 加载用户数据保持不变
    
    // 加载感言数据保持不变
    
    // 添加用户按钮保持不变
    
    // 关闭模态框保持不变
    
    // 新增：媒体管理功能
    initMediaManagement();
});

// 初始化媒体管理
function initMediaManagement() {
    // 媒体标签切换
    const mediaTabs = document.querySelectorAll('.media-tab');
    mediaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mediaTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.media-section').forEach(section => {
                section.classList.remove('active');
            });
            
            if (tab.dataset.tab === 'images') {
                document.getElementById('images-section').classList.add('active');
                loadImages();
            } else {
                document.getElementById('videos-section').classList.add('active');
                loadVideos();
            }
        });
    });
    
    // 图片上传按钮
    document.getElementById('uploadImageBtn').addEventListener('click', () => {
        document.getElementById('imageUploadArea').classList.remove('hidden');
    });
    
    // 取消图片上传
    document.getElementById('cancelImageUpload').addEventListener('click', () => {
        document.getElementById('imageUploadArea').classList.add('hidden');
        document.getElementById('imageInput').value = '';
    });
    
    // 图片上传处理
    const imageInput = document.getElementById('imageInput');
    const confirmImageUpload = document.getElementById('confirmImageUpload');
    
    imageInput.addEventListener('change', () => {
        confirmImageUpload.disabled = imageInput.files.length === 0;
    });
    
    confirmImageUpload.addEventListener('click', uploadImages);
    
    // 拖放上传功能
    const uploadArea = document.querySelector('.upload-area');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files;
            confirmImageUpload.disabled = false;
        }
    });
    
    // 添加视频按钮
    document.getElementById('addVideoBtn').addEventListener('click', () => {
        document.getElementById('videoForm').classList.remove('hidden');
    });
    
    // 取消添加视频
    document.getElementById('cancelVideoAdd').addEventListener('click', () => {
        document.getElementById('videoForm').classList.add('hidden');
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoId').value = '';
        document.getElementById('videoDescription').value = '';
    });
    
    // 保存视频
    document.getElementById('saveVideo').addEventListener('click', saveVideo);
    
    // 初始加载图片
    loadImages();
}

// 加载图片
function loadImages() {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';
    
    const images = JSON.parse(localStorage.getItem('classImages')) || [];
    
    images.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${image.url}" alt="${image.title || '班级图片'}">
            <div class="image-info">
                <div class="image-title">${image.title || '未命名图片'}</div>
                <div class="image-size">${formatFileSize(image.size)}</div>
            </div>
            <div class="image-actions">
                <button class="btn btn-sm btn-delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        imageGrid.appendChild(imageItem);
    });
    
    // 添加删除事件
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteImage);
    });
}

// 上传图片到ImgBB
async function uploadImages() {
    const files = document.getElementById('imageInput').files;
    if (files.length === 0) return;
    
    const uploadArea = document.getElementById('imageUploadArea');
    uploadArea.innerHTML = '<div class="uploading">上传中，请稍候...</div>';
    
    try {
        const images = JSON.parse(localStorage.getItem('classImages')) || [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // 使用ImgBB API上传图片
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                images.push({
                    url: result.data.url,
                    title: file.name,
                    size: file.size,
                    date: new Date().toISOString()
                });
            }
        }
        
        localStorage.setItem('classImages', JSON.stringify(images));
        loadImages();
        
        document.getElementById('imageUploadArea').classList.add('hidden');
        document.getElementById('imageInput').value = '';
        
        // 更新统计信息
        document.getElementById('totalMedia').textContent = images.length;
    } catch (error) {
        uploadArea.innerHTML = `
            <div class="upload-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>上传失败</h3>
                <p>${error.message || '请重试'}</p>
                <button class="btn btn-secondary" id="retryUpload">重试</button>
            </div>
        `;
        
        document.getElementById('retryUpload').addEventListener('click', () => {
            document.getElementById('imageUploadArea').classList.add('hidden');
            document.getElementById('uploadImageBtn').click();
        });
    }
}

// 删除图片
function deleteImage(e) {
    const index = e.target.closest('.btn-delete').dataset.index;
    const images = JSON.parse(localStorage.getItem('classImages')) || [];
    
    if (index >= 0 && index < images.length) {
        images.splice(index, 1);
        localStorage.setItem('classImages', JSON.stringify(images));
        loadImages();
        
        // 更新统计信息
        document.getElementById('totalMedia').textContent = images.length;
    }
}

// 加载视频
function loadVideos() {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';
    
    const videos = JSON.parse(localStorage.getItem('classVideos')) || [];
    
    videos.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.innerHTML = `
            <div class="video-thumb">
                <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}">
            </div>
            <div class="video-details">
                <div class="video-title">${video.title}</div>
                <div class="video-id">ID: ${video.id}</div>
                <div class="video-desc">${video.description || '无描述'}</div>
            </div>
            <div class="video-actions">
                <button class="btn btn-sm btn-edit" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        videoList.appendChild(videoItem);
    });
    
    // 添加事件
    document.querySelectorAll('.video-actions .btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteVideo);
    });
    
    document.querySelectorAll('.video-actions .btn-edit').forEach(btn => {
        btn.addEventListener('click', editVideo);
    });
}

// 保存视频
function saveVideo() {
    const title = document.getElementById('videoTitle').value.trim();
    const id = document.getElementById('videoId').value.trim();
    const description = document.getElementById('videoDescription').value.trim();
    
    if (!title || !id) {
        alert('请填写标题和视频ID');
        return;
    }
    
    const videos = JSON.parse(localStorage.getItem('classVideos')) || [];
    
    // 检查是否已存在
    const existingIndex = videos.findIndex(v => v.id === id);
    
    if (existingIndex >= 0) {
        videos[existingIndex] = { id, title, description };
    } else {
        videos.push({ id, title, description });
    }
    
    localStorage.setItem('classVideos', JSON.stringify(videos));
    loadVideos();
    
    document.getElementById('videoForm').classList.add('hidden');
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoId').value = '';
    document.getElementById('videoDescription').value = '';
}

// 删除视频
function deleteVideo(e) {
    const index = e.target.closest('.btn-delete').dataset.index;
    const videos = JSON.parse(localStorage.getItem('classVideos')) || [];
    
    if (index >= 0 && index < videos.length) {
        videos.splice(index, 1);
        localStorage.setItem('classVideos', JSON.stringify(videos));
        loadVideos();
    }
}

// 编辑视频
function editVideo(e) {
    const index = e.target.closest('.btn-edit').dataset.index;
    const videos = JSON.parse(localStorage.getItem('classVideos')) || [];
    
    if (index >= 0 && index < videos.length) {
        const video = videos[index];
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoId').value = video.id;
        document.getElementById('videoDescription').value = video.description || '';
        
        document.getElementById('videoForm').classList.remove('hidden');
    }
}

// 辅助函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
// 在initMediaManagement之前初始化学生管理
function initStudentManagement() {
    // 添加学生按钮
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        showStudentForm();
    });

    // 加载学生数据
    loadStudents();
}

// 加载学生数据到表格
function loadStudents() {
    const students = JSON.parse(localStorage.getItem('classStudents')) || studentData; // 默认使用初始数据
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.phone}</td>
            <td>
                <button class="btn btn-sm btn-edit" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 添加编辑和删除事件
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', editStudent);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteStudent);
    });
}

// 显示学生表单（添加或编辑）
function showStudentForm(student = null) {
    // 这里我们使用一个模态框来添加/编辑学生
    // 由于代码较长，我们简化处理：使用prompt和confirm
    // 实际项目中应该创建一个模态框
    const isEdit = student !== null;
    const title = prompt('请输入学生姓名', student?.name || '');
    if (title === null) return; // 用户取消

    const gender = prompt('请输入学生性别（男/女）', student?.gender || '男');
    if (gender === null) return;

    const phone = prompt('请输入学生电话', student?.phone || '');
    if (phone === null) return;

    const students = JSON.parse(localStorage.getItem('classStudents')) || [];

    if (isEdit) {
        // 编辑
        students[student.index] = { name: title, gender, phone };
    } else {
        // 添加
        students.push({ name: title, gender, phone });
    }

    localStorage.setItem('classStudents', JSON.stringify(students));
    loadStudents();
}

// 编辑学生
function editStudent(e) {
    const index = e.target.closest('.btn-edit').dataset.index;
    const students = JSON.parse(localStorage.getItem('classStudents')) || [];
    const student = students[index];
    student.index = index; // 临时存储索引
    showStudentForm(student);
}

// 删除学生
function deleteStudent(e) {
    const index = e.target.closest('.btn-delete').dataset.index;
    if (confirm('确定要删除这个学生吗？')) {
        const students = JSON.parse(localStorage.getItem('classStudents')) || [];
        students.splice(index, 1);
        localStorage.setItem('classStudents', JSON.stringify(students));
        loadStudents();
    }
}

// 在DOMContentLoaded事件中调用
document.addEventListener('DOMContentLoaded', () => {
    // ... 其他初始化代码 ...
    initStudentManagement(); // 初始化学生管理
});