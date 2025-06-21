document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const queryBtn = document.getElementById('queryBtn');
    const detailBtn = document.getElementById('detailBtn');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const resultContent = document.getElementById('resultContent');
    const studentName = document.getElementById('studentName');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const subjectScores = document.getElementById('subjectScores');
    const subjectGrid = document.getElementById('subjectGrid');
    const warningMessage = document.createElement('div');
    warningMessage.className = 'warning-message';
    warningMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> 该姓名成绩已查询过，不能重复查询';
    resultContent.parentNode.insertBefore(warningMessage, resultContent.nextSibling);
    
    // 科目配置
    const subjects = [
        { name: '语文', max: 150, color: '#FF6384' },
        { name: '数学', max: 150, color: '#36A2EB' },
        { name: '英语', max: 150, color: '#FFCE56' },
        { name: '物理', max: 80, color: '#4BC0C0' },
        { name: '化学', max: 70, color: '#9966FF' },
        { name: '政治', max: 50, color: '#FF9F40' },
        { name: '历史', max: 50, color: '#8AC926' },
        { name: '体育', max: 50, color: '#1982C4' }
    ];
    
    // 存储已查询的姓名和成绩
    const scoreCache = {};
    
    // 特殊姓名处理
    const specialNames = {
        '王承宇': 0,
        '魏雨婷': 0,
        '付超': -8,
        '李旭铎': 9999999,
        '舒玺达': 750,
    };
    
    // 生成符合要求的随机分数
    function generateTotalScore() {
        const rand = Math.random() * 100; // 生成0-100之间的随机数
        
        if (rand < 90) {
            // 90%概率生成300-600之间的分数
            return Math.floor(Math.random() * 301) + 300;
        } else if (rand < 95) {
            // 5%概率生成0-299之间的分数
            return Math.floor(Math.random() * 300);
        } else {
            // 5%概率生成601-750之间的分数
            return Math.floor(Math.random() * 150) + 601;
        }
    }
    
    // 生成各科分数
    function generateSubjectScores(total) {
        // 先给各科分配基础分
        const baseScores = subjects.map(subject => {
            let minScore;
            
            // 不同科目设置不同的最低分
            if (subject.name === '语文' || subject.name === '数学' || subject.name === '英语') {
                // 主科分数降低 - 最低55%
                minScore = Math.floor(subject.max * 0.55);
            } else if (subject.name === '物理' || subject.name === '化学' || 
                       subject.name === '政治' || subject.name === '历史') {
                // 副科分数提高 - 最低70%
                minScore = Math.floor(subject.max * 0.7);
            } else { // 体育
                // 体育至少35分 - 最低35分（满分50分）
                minScore = 35;
            }
            
            // 在最低分和满分之间随机
            return Math.floor(Math.random() * (subject.max - minScore + 1)) + minScore;
        });
        
        // 计算基础总分
        const baseTotal = baseScores.reduce((sum, score) => sum + score, 0);
        
        // 剩余分数分配
        const remaining = total - baseTotal;
        const scores = [...baseScores];
        
        // 如果总分不够，增加分数
        if (remaining > 0) {
            for (let i = 0; i < remaining; i++) {
                // 随机选择一科增加分数（但不能超过满分）
                let validSubjects = subjects
                    .map((_, idx) => idx)
                    .filter(idx => scores[idx] < subjects[idx].max);
                
                if (validSubjects.length === 0) break;
                
                const randomIdx = validSubjects[Math.floor(Math.random() * validSubjects.length)];
                scores[randomIdx]++;
            }
        }
        // 如果总分超过，减少分数
        else if (remaining < 0) {
            for (let i = 0; i < -remaining; i++) {
                // 随机选择一科减少分数（但不能低于0）
                let validSubjects = subjects
                    .map((_, idx) => idx)
                    .filter(idx => scores[idx] > 0);
                
                if (validSubjects.length === 0) break;
                
                const randomIdx = validSubjects[Math.floor(Math.random() * validSubjects.length)];
                scores[randomIdx]--;
            }
        }
        
        return scores;
    }
    
    // 更新分数显示（动画效果）
    function updateScoreDisplay(scoreElement, finalScore) {
        let currentScore = 0;
        const increment = Math.ceil(finalScore / 30);
        
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= finalScore) {
                currentScore = finalScore;
                clearInterval(timer);
            }
            scoreElement.textContent = currentScore;
        }, 30);
    }
    
    // 显示各科成绩
    function displaySubjectScores(scores) {
        subjectGrid.innerHTML = '';
        
        scores.forEach((score, index) => {
            const subject = subjects[index];
            const scorePercentage = Math.round((score / subject.max) * 100);
            
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.innerHTML = `
                <div class="subject-name">${subject.name}</div>
                <div class="subject-score">${score}</div>
                <div class="subject-max">满分 ${subject.max}</div>
                <div class="score-percentage">${scorePercentage}%</div>
            `;
            subjectGrid.appendChild(card);
        });
        
        // 显示科目成绩区域
        subjectScores.style.display = 'block';
    }
    
    // 查询按钮事件
    queryBtn.addEventListener('click', function() {
        const name = nameInput.value.trim();
        
        if (name === '') {
            alert('请输入您的姓名');
            return;
        }
        
        // 检查是否已查询过
        if (scoreCache[name]) {
            warningMessage.style.display = 'block';
            const scoreData = scoreCache[name];
            displayScore(name, scoreData.totalScore, scoreData.subjectScores);
            return;
        } else {
            warningMessage.style.display = 'none';
        }
        
        let totalScore;
        let subjectScoresArray;
        
        // 特殊姓名处理
        if (specialNames.hasOwnProperty(name)) {
            totalScore = specialNames[name];
            // 为特殊姓名生成合理的科目分数
            subjectScoresArray = generateSubjectScores(totalScore);
        } else {
            // 生成总成绩
            totalScore = generateTotalScore();
            // 生成各科成绩
            subjectScoresArray = generateSubjectScores(totalScore);
        }
        
        // 缓存成绩
        scoreCache[name] = {
            totalScore: totalScore,
            subjectScores: subjectScoresArray
        };
        
        // 显示结果
        displayScore(name, totalScore, subjectScoresArray);
    });
    
    // 显示分数
    function displayScore(name, totalScore, subjectScoresArray) {
        studentName.textContent = name + ' 同学，您的中考成绩为：';
        updateScoreDisplay(scoreDisplay, totalScore);
        
        // 切换显示
        resultPlaceholder.style.display = 'none';
        resultContent.style.display = 'block';
        
        // 初始隐藏科目成绩
        subjectScores.style.display = 'none';
        
        // 重置详情按钮文本
        detailBtn.innerHTML = '<i class="fas fa-book-open"></i> 查看各科成绩';
        
        // 存储生成的成绩用于详情显示
        generatedScores = subjectScoresArray;
    }
    
    // 详情按钮点击事件
    detailBtn.addEventListener('click', function() {
        if (subjectScores.style.display === 'none') {
            // 显示科目成绩
            displaySubjectScores(generatedScores);
            detailBtn.innerHTML = '<i class="fas fa-times"></i> 收起各科成绩';
        } else {
            // 隐藏科目成绩
            subjectScores.style.display = 'none';
            detailBtn.innerHTML = '<i class="fas fa-book-open"></i> 查看各科成绩';
        }
    });
    
    // 按回车键也可以查询
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            queryBtn.click();
        }
    });
    
    // 初始化
    resultContent.style.display = 'none';
    warningMessage.style.display = 'none';
});