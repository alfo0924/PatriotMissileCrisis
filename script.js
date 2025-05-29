let timeLeft = 60; // 倒數計時60秒
let timerInterval;
const correctAnswer = 330; // 正確答案：0.33秒 = 330毫秒

// 第二個任務狀態
let secondMissionActive = false;

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

// 提交答案
function submitAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    if (userAnswer === correctAnswer) {
        clearInterval(timerInterval);
        document.getElementById('result').textContent = '';
        startSecondMission();
    } else {
        document.getElementById('result').textContent = '答案錯誤！請再試一次。';
        document.getElementById('result').style.color = '#ff0000';
    }
}

// 遊戲結束
function gameOver(success) {
    const resultDiv = document.getElementById('result');
    document.getElementById('puzzle').style.display = 'none';
    document.getElementById('secondMission').style.display = 'none';
    if (success) {
        resultDiv.textContent = '成功！系統時鐘已校準，愛國者導彈發射，飛毛腿導彈被攔截！達蘭基地安全！';
        resultDiv.style.color = '#00ff00';
    } else {
        resultDiv.textContent = '失敗！時間已耗盡，飛毛腿導彈擊中達蘭基地，造成重大傷亡。';
        resultDiv.style.color = '#ff0000';
    }
}

// 啟動第二個任務
function startSecondMission() {
    secondMissionActive = true;
    document.getElementById('secondMission').style.display = 'block';
    document.getElementById('result').textContent = '第一個任務成功！請完成第二個任務以啟動防禦系統。';
    document.getElementById('result').style.color = '#00ff00';
    // 初始化拖放事件
    const draggable = document.getElementById('draggable');
    const target = document.getElementById('target');

    draggable.addEventListener('dragstart', dragStart);
    target.addEventListener('dragover', dragOver);
    target.addEventListener('drop', drop);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', 'dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (secondMissionActive) {
        // 將紅色方塊移動到目標區域
        const draggable = document.getElementById('draggable');
        draggable.style.left = 'calc(100% - 70px)';
        // 顯示成功訊息並結束遊戲
        document.getElementById('secondResult').textContent = '任務成功！防禦系統啟動，飛毛腿導彈被攔截！';
        gameOver(true);
    }
}

// 遊戲初始化
window.onload = () => {
    startTimer();
};
