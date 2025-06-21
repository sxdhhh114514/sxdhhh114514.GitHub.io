// js/register.js
// ============== LeanCloud 初始化 ==============
const APP_ID = 'oyl9RBhC3kt6oWWIP3DSIVYE-MdYXbMMI';
const APP_KEY = 'fbg0pdTHfsT8VtOoqmT8snIW';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// ============== 用户注册功能 ==============
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('regPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    
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
            document.body.classList.remove('dark-theme');
        }
    };
    
    initTheme();
    
    // 密码强度检测
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = 0;
            
            if (password.length >= 8) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;
            
            passwordStrength.style.width = `${strength}%`;
            
            if (strength < 50) {
                passwordStrength.style.background = '#e74c3c';
            } else if (strength < 75) {
                passwordStrength.style.background = '#f39c12';
            } else {
                passwordStrength.style.background = '#2ecc71';
            }
        });
    }
    
    // 注册表单提交
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // 验证密码匹配
            if (password !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }
            
            // 创建用户对象
            const user = new AV.User();
            user.setUsername(username);
            user.setPassword(password);
            user.setEmail(email);
            
            try {
                await user.signUp();
                alert('注册成功！请登录您的账户');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('注册失败:', error);
                alert(`注册失败: ${error.message}`);
            }
        });
    }
});