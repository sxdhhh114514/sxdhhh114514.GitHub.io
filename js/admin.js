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