let timeLeft = 60; // 總倒數計時60秒
let timerInterval;
let currentTask = 1;
const correctAnswerTask1 = 330; // 任務1正確答案：0.33秒 = 330毫秒
const targetFrequency = { min: 45, max: 55 }; // 任務2目標頻率範圍
const correctSequence = ['red', 'green', 'blue', 'red']; // 任務3正確序列
let userSequence = [];

// 開始倒數計時
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `剩餘時間：${timeLeft}秒`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver(false);
        }
    }, 1000);
}

// 任務1：提交時鐘校準答案
function submitTask1() {
    const userAnswer = parseFloat(document.getElementById('answer1').value);
    if (userAnswer === correctAnswerTask1) {
        document.getElementById('result').textContent = '任務1完成！系統時鐘已校準。';
        document.getElementById('result').style.color = '#00ff00';
        document.getElementById('task1').style.display = 'none';
        document.getElementById('task2').style.display = 'block';
        currentTask = 2;
    } else {
        document.getElementById('result').textContent = '答案錯誤！請再試一次。';
        document.getElementById('result').style.color = '#ff0000';
    }
}

// 任務2：雷達頻率校準
document.getElementById('radar-slider').addEventListener('input', function() {
    const frequency = this.value;
    document.getElementById('frequency').textContent = frequency;
});

function submitTask2() {
    const frequency = parseInt(document.getElementById('radar-slider').value);
    if (frequency >= targetFrequency.min && frequency <= targetFrequency.max) {
        document.getElementById('result').textContent = '任務2完成！雷達頻率校準成功。';
        document.getElementById('result').style.color = '#00ff00';
        document.getElementById('task2').style.display = 'none';
        document.getElementById('task3').style.display = 'block';
        currentTask = 3;
    } else {
        document.getElementById('result').textContent = '頻率不在目標範圍內！請調整。';
        document.getElementById('result').style.color = '#ff0000';
    }
}

// 任務3：發射序列
document.querySelectorAll('.seq-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (userSequence.length < correctSequence.length) {
            const color = this.getAttribute('data-color');
            userSequence.push(color);
            document.getElementById('sequence-input').textContent = userSequence.join(' -> ');
        }
    });
});

function submitTask3() {
    if (userSequence.length !== correctSequence.length) {
        document.getElementById('result').textContent = '序列未完成！請按完整序列。';
        document.getElementById('result').style.color = '#ff0000';
        return;
    }
    if (userSequence.every((val, index) => val === correctSequence[index])) {
        clearInterval(timerInterval);
        gameOver(true);
    } else {
        document.getElementById('result').textContent = '序列錯誤！請重試。';
        document.getElementById('result').style.color = '#ff0000';
    }
}

function resetTask3() {
    userSequence = [];
    document.getElementById('sequence-input').textContent = '';
}

// 遊戲結束
function gameOver(success) {
    const resultDiv = document.getElementById('result');
    document.getElementById('task-area').style.display = 'none';
    document.getElementById('missile').style.animationPlayState = 'paused';
    if (success) {
        resultDiv.textContent = '成功！所有任務完成，愛國者導彈發射，飛毛腿導彈被攔截！達蘭基地安全！';
        resultDiv.style.color = '#00ff00';
    } else {
        resultDiv.textContent = '失敗！時間已耗盡，飛毛腿導彈擊中達蘭基地，造成重大傷亡。';
        resultDiv.style.color = '#ff0000';
    }
}

// 遊戲初始化
window.onload = () => {
    startTimer();
};
