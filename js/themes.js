// 主题切换功能
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', toggleTheme);
    applySavedTheme();
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // 更新按钮文本
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');

    if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = '日间模式';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = '夜间模式';
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // 更新按钮状态
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');

        if (savedTheme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = '日间模式';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = '夜间模式';
        }
    }
}