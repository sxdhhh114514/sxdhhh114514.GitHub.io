// js/admin.js
// ============== LeanCloud 初始化 ==============
const APP_ID = 'oyl9RBhC3kt6oWWIP3DSIVYE-MdYXbMMI';
const APP_KEY = 'fbg0pdTHfsT8VtOoqmT8snIW';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// ============== 管理功能实现 ==============
document.addEventListener('DOMContentLoaded', async () => {
    // 检查管理员权限
    const currentUser = AV.User.current();
    if (!currentUser || currentUser.get('username') !== 'admin') {
        alert('您没有权限访问此页面');
        window.location.href = 'index.html';
        return;
    }
    
    // 导航栏切换
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // 退出登录
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AV.User.logOut();
            window.location.href = 'index.html';
        });
    }
    
    // 主题初始化
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    };
    
    initTheme();
    
    // 加载统计数据
    async function loadStatistics() {
        try {
            // 用户统计
            const userQuery = new AV.Query('_User');
            const userCount = await userQuery.count();
            document.getElementById('userCount').textContent = userCount;
            
            // 评论统计
            const commentQuery = new AV.Query('Comment');
            const commentCount = await commentQuery.count();
            document.getElementById('commentCount').textContent = commentCount;
            
            // 今日新增评论
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const todayQuery = new AV.Query('Comment');
            todayQuery.greaterThanOrEqualTo('createdAt', today);
            const todayCount = await todayQuery.count();
            document.getElementById('todayCount').textContent = todayCount;
        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    }
    
    // 加载评论
    async function loadComments() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;
        
        try {
            const query = new AV.Query('Comment');
            query.descending('createdAt');
            const comments = await query.find();
            
            commentsList.innerHTML = '';
            
            if (comments.length === 0) {
                commentsList.innerHTML = '<div class="no-comments">暂无评论</div>';
                return;
            }
            
            comments.forEach(comment => {
                // 创建评论项...
            });
        } catch (error) {
            console.error('加载评论失败:', error);
            commentsList.innerHTML = '<div class="error">加载评论失败，请刷新重试</div>';
        }
    }
    
    // 加载用户
    async function loadUsers() {
        const usersTableBody = document.getElementById('usersTableBody');
        if (!usersTableBody) return;
        
        try {
            const query = new AV.Query('_User');
            query.descending('createdAt');
            const users = await query.find();
            
            usersTableBody.innerHTML = '';
            
            if (users.length === 0) {
                usersTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">暂无用户</td></tr>';
                return;
            }
            
            users.forEach(user => {
                // 创建用户行...
            });
        } catch (error) {
            console.error('加载用户失败:', error);
            usersTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">加载用户失败</td></tr>';
        }
    }
    
    // 加载所有数据
    loadStatistics();
    loadComments();
    loadUsers();
});