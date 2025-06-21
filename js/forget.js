// js/forget.js
// ============== LeanCloud 初始化 ==============
const APP_ID = 'oyl9RBhC3kt6oWWIP3DSIVYE-MdYXbMMI';
const APP_KEY = 's0nc1AP6rtNsEkDgdC7eTezo';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// ============== 找回密码功能 ==============
document.addEventListener('DOMContentLoaded', () => {
    const forgetForm = document.getElementById('forgetForm');
    
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
    
    // 主题初始化
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-the极客时间e');
        }
    };
    
    initTheme();
    
    // 找回密码表单提交
    if (forgetForm) {
        forgetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('forgetEmail').value;
            
            try {
                await AV.User.requestPasswordReset(email);
                alert(`密码重置链接已发送至 ${email}，请查收您的邮箱`);
            } catch (error) {
                console.error('发送重置邮件失败:', error);
                alert(`发送重置邮件失败: ${error.message}`);
            }
        });
    }
});