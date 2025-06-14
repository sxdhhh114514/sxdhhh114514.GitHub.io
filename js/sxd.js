// 计算年龄的函数
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    // 如果当前月份小于出生月份，或者月份相同但当前日期小于出生日期
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

// 设置生日日期（2010年4月15日）
const birthDate = '2010-04-15';
const age = calculateAge(birthDate);

// 更新页面上的年龄
document.getElementById('age').textContent = age;
document.getElementById('currentAge').textContent = age;

// 添加动态效果
document.addEventListener('DOMContentLoaded', function() {
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, 300 * index);
    });

    // 背景浮动效果
    const background = document.querySelector('.background');
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        background.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });
    
    // 音乐播放控制
    const bgMusic = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    // 检查是否允许自动播放
    let playAttempted = false;
    
    playBtn.addEventListener('click', function() {
        bgMusic.play().then(() => {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';
        }).catch(error => {
            console.log('播放失败:', error);
            // 显示播放错误提示
            alert('音乐播放失败，请检查浏览器设置或尝试刷新页面');
        });
    });
    
    pauseBtn.addEventListener('click', function() {
        bgMusic.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'flex';
    });
    
    // 尝试自动播放（需要用户交互）
    document.addEventListener('click', function firstInteraction() {
        if (!playAttempted) {
            bgMusic.play().then(() => {
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'flex';
            }).catch(error => {
                console.log('自动播放失败:', error);
                // 显示播放按钮
                playBtn.style.display = 'flex';
            });
            playAttempted = true;
            document.removeEventListener('click', firstInteraction);
        }
    });
    
    // 添加键盘快捷键控制音乐
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (bgMusic.paused) {
                bgMusic.play();
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'flex';
            } else {
                bgMusic.pause();
                pauseBtn.style.display = 'none';
                playBtn.style.display = 'flex';
            }
        }
    });
    
    // 移动端触摸事件支持
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
});