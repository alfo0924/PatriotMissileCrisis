let timeLeft = 60; // 倒數計時60秒
let timerInterval;
const correctAnswer = 330; // 正確答案：0.33秒 = 330毫秒

// Puzzle 1: Slider Puzzle
class SliderPuzzle {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.size = 3; // 3x3 grid
        this.tiles = [];
        this.emptyPos = {x: 2, y: 2};
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = `repeat(${this.size}, 100px)`;
        this.container.style.gridTemplateRows = `repeat(${this.size}, 100px)`;
        this.container.style.gap = '5px';

        let numbers = [...Array(this.size * this.size - 1).keys()].map(x => x + 1);
        numbers.push(null); // empty tile

        // Shuffle numbers
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        for (let i = 0; i < this.size * this.size; i++) {
            const tile = document.createElement('div');
            tile.style.width = '100px';
            tile.style.height = '100px';
            tile.style.backgroundColor = numbers[i] ? '#004400' : 'transparent';
            tile.style.color = '#00ff00';
            tile.style.display = 'flex';
            tile.style.justifyContent = 'center';
            tile.style.alignItems = 'center';
            tile.style.fontSize = '32px';
            tile.style.fontWeight = 'bold';
            tile.style.borderRadius = '5px';
            tile.style.cursor = numbers[i] ? 'pointer' : 'default';
            tile.textContent = numbers[i] || '';
            tile.dataset.index = i;
            if(numbers[i] === null) {
                this.emptyPos = {x: i % this.size, y: Math.floor(i / this.size)};
            }
            tile.addEventListener('click', () => this.moveTile(i));
            this.container.appendChild(tile);
            this.tiles.push(tile);
        }
    }

    moveTile(index) {
        const x = index % this.size;
        const y = Math.floor(index / this.size);
        const dx = Math.abs(x - this.emptyPos.x);
        const dy = Math.abs(y - this.emptyPos.y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // Swap tiles
            const emptyIndex = this.emptyPos.y * this.size + this.emptyPos.x;
            [this.tiles[index].textContent, this.tiles[emptyIndex].textContent] = [this.tiles[emptyIndex].textContent, this.tiles[index].textContent];
            [this.tiles[index].style.backgroundColor, this.tiles[emptyIndex].style.backgroundColor] = [this.tiles[emptyIndex].style.backgroundColor, this.tiles[index].style.backgroundColor];
            this.emptyPos = {x: x, y: y};
            this.checkWin();
        }
    }

    checkWin() {
        for(let i=0; i < this.tiles.length - 1; i++) {
            if(this.tiles[i].textContent != i + 1) return false;
        }
        // Puzzle solved
        this.onWin();
        return true;
    }

    onWin() {
        alert('任務成功！滑動拼圖完成！');
        document.dispatchEvent(new CustomEvent('puzzleCompleted', {detail: 'sliderPuzzle'}));
    }
}

// Puzzle 2: Color Matching
class ColorMatching {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.colors = ['#00ff00', '#ff0000', '#0000ff', '#ffff00'];
        this.pattern = [];
        this.userPattern = [];
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.pattern = [];
        this.userPattern = [];
        // Generate random pattern of 4 colors
        for(let i=0; i<4; i++) {
            this.pattern.push(this.colors[Math.floor(Math.random() * this.colors.length)]);
        }

        // Show pattern
        const patternDiv = document.createElement('div');
        patternDiv.style.display = 'flex';
        patternDiv.style.justifyContent = 'center';
        patternDiv.style.marginBottom = '10px';
        this.pattern.forEach(color => {
            const colorBlock = document.createElement('div');
            colorBlock.style.width = '40px';
            colorBlock.style.height = '40px';
            colorBlock.style.backgroundColor = color;
            colorBlock.style.margin = '0 5px';
            patternDiv.appendChild(colorBlock);
        });
        this.container.appendChild(patternDiv);

        // Create buttons for user to match
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.justifyContent = 'center';

        this.colors.forEach(color => {
            const btn = document.createElement('button');
            btn.style.backgroundColor = color;
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.style.margin = '0 5px';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', () => this.userClick(color));
            buttonsDiv.appendChild(btn);
        });
        this.container.appendChild(buttonsDiv);
    }

    userClick(color) {
        this.userPattern.push(color);
        if(this.userPattern.length === this.pattern.length) {
            this.checkMatch();
        }
    }

    checkMatch() {
        for(let i=0; i < this.pattern.length; i++) {
            if(this.pattern[i] !== this.userPattern[i]) {
                alert('答案錯誤！請再試一次。');
                this.userPattern = [];
                return;
            }
        }
        alert('任務成功！顏色匹配完成！');
        document.dispatchEvent(new CustomEvent('puzzleCompleted', {detail: 'colorMatching'}));
    }
}

// Puzzle 3: Memory Card Game
class MemoryGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cards = [];
        this.flipped = [];
        this.matched = 0;
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        const symbols = ['★', '☆', '▲', '△'];
        this.cards = symbols.concat(symbols); // pairs

        // Shuffle cards
        for(let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }

        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = 'repeat(4, 60px)';
        this.container.style.gridGap = '10px';

        this.cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.textContent = '';
            card.style.width = '60px';
            card.style.height = '60px';
            card.style.backgroundColor = '#004400';
            card.style.color = '#00ff00';
            card.style.display = 'flex';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.style.fontSize = '32px';
            card.style.borderRadius = '5px';
            card.style.cursor = 'pointer';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.addEventListener('click', () => this.flipCard(card));
            this.container.appendChild(card);
        });
    }

    flipCard(card) {
        if(this.flipped.length === 2 || card.textContent !== '') return;
        card.textContent = card.dataset.symbol;
        this.flipped.push(card);
        if(this.flipped.length === 2) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flipped;
        if(card1.dataset.symbol === card2.dataset.symbol) {
            this.matched += 2;
            if(this.matched === this.cards.length) {
                alert('任務成功！記憶配對完成！');
                document.dispatchEvent(new CustomEvent('puzzleCompleted', {detail: 'memoryGame'}));
            }
        } else {
            card1.textContent = '';
            card2.textContent = '';
        }
        this.flipped = [];
    }
}

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
        document.getElementById('puzzle').style.display = 'none';
        startVisualPuzzles();
    } else {
        document.getElementById('result').textContent = '答案錯誤！請再試一次。';
        document.getElementById('result').style.color = '#ff0000';
    }
}

// 遊戲結束
function gameOver(success) {
    const resultDiv = document.getElementById('result');
    document.getElementById('puzzle').style.display = 'none';
    if (success) {
        resultDiv.textContent = '成功！系統時鐘已校準，愛國者導彈發射，飛毛腿導彈被攔截！達蘭基地安全！';
        resultDiv.style.color = '#00ff00';
    } else {
        resultDiv.textContent = '失敗！時間已耗盡，飛毛腿導彈擊中達蘭基地，造成重大傷亡。';
        resultDiv.style.color = '#ff0000';
    }
}

// 啟動三個可視化謎題小遊戲
function startVisualPuzzles() {
    document.getElementById('visualPuzzles').style.display = 'block';
    window.sliderPuzzle = new SliderPuzzle('sliderPuzzleContainer');
    window.colorMatching = new ColorMatching('colorMatchingContainer');
    window.memoryGame = new MemoryGame('memoryGameContainer');
}

// 監聽所有謎題完成事件
let completedPuzzles = new Set();
document.addEventListener('puzzleCompleted', (e) => {
    completedPuzzles.add(e.detail);
    if(completedPuzzles.size === 3) {
        document.getElementById('visualPuzzles').style.display = 'none';
        document.getElementById('result').textContent = '恭喜！所有任務完成，飛毛腿導彈被成功攔截！';
        document.getElementById('result').style.color = '#00ff00';
    }
});

// 遊戲初始化
window.onload = () => {
    startTimer();
};
