let betChoice = null;
let taiCount = 0;
let xiuCount = 0;
let winCount = 0;
let loseCount = 0;
let money = 250000;
let houseMoney = 1000000000000; 
let isRolling = false; 
let soundEnabled = true; 

document.addEventListener('DOMContentLoaded', function() {
    updateAllDisplays();
    addVisualEffects();
    
    const betInput = document.getElementById("bet-amount");
    if (betInput) {
        betInput.addEventListener('input', formatCurrencyInput);
        betInput.addEventListener('keypress', handleEnterKey);
    }
});

function addVisualEffects() {
    createFloatingParticles();
    enhanceButtonEffects();
    createMusicVisualizer();
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: rgba(255, 255, 255, 0.${Math.floor(Math.random() * 5) + 1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 15}s infinite linear;
        `;
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
}

function enhanceButtonEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', createRippleEffect);
        button.addEventListener('click', createClickEffect);
    });
}

function createMusicVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.className = 'music-visualizer';
    visualizer.innerHTML = Array(5).fill(0).map(() => '<div class="bar"></div>').join('');
    document.querySelector('.game-container').appendChild(visualizer);
}

function playSound(soundType) {
    if (!soundEnabled) return;
    
    try {
        switch(soundType) {
            case 'bet':
                createTone(440, 0.1); 
                break;
            case 'win':
                createTone(523, 0.3); 
                break;
            case 'lose':
                createTone(330, 0.2); 
                break;
            case 'jackpot':
                playJackpotSound(); 
                break;
            case 'dice':
                createTone(220, 0.05); 
                break;
        }
    } catch (e) {
        console.log('Sound not supported');
    }
}

function createTone(frequency, duration) {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playJackpotSound() {
    const frequencies = [523, 659, 784, 1047];
    frequencies.forEach((freq, index) => {
        setTimeout(() => createTone(freq, 0.2), index * 100);
    });
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function createClickEffect(e) {
    const button = e.currentTarget;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

function formatCurrencyInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
        value = parseInt(value).toLocaleString();
        e.target.value = value;
    }
}

function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (betChoice) {
            rollDice();
        }
    }
}

function getBetAmount() {
    let amount = document.getElementById("bet-amount").value.replace(/\D/g, "");
    amount = isNaN(amount) || amount <= 0 ? 100 : parseInt(amount);
    
    const maxBet = Math.floor(money * 0.5);
    if (amount > maxBet && maxBet > 0) {
        amount = maxBet;
        document.getElementById("bet-amount").value = amount.toLocaleString();
        showNotification(`Giới hạn cược tối đa: ${maxBet.toLocaleString()} VND`, 'warning');
    }
    
    return amount;
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    const colors = {
        info: 'linear-gradient(135deg, #667eea, #764ba2)',
        success: 'linear-gradient(135deg, #2ecc71, #27ae60)', 
        warning: 'linear-gradient(135deg, #f39c12, #e67e22)',
        error: 'linear-gradient(135deg, #e74c3c, #c0392b)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function placeBet(choice) {
    if (isRolling) {
        showNotification("Đang lắc xúc xắc, vui lòng đợi!", 'warning');
        return;
    }

    let betAmount = getBetAmount();

    if (money < 100) {
        showNotification("Bạn không đủ tiền để cược!", 'error');
        showResetMoneyButton();
        return;
    }

    if (betAmount > money) {
        showNotification("Bạn không có đủ tiền để đặt cược số này!", 'error');
        return;
    }

    betChoice = choice;
    updateButtonStates(true);
    
    playSound('bet');
    highlightBetChoice(choice);
    showNotification(`Đã cược ${choice} với số tiền ${betAmount.toLocaleString()} VND`, 'success');
    
    startCountdown();
}

function highlightBetChoice(choice) {
    document.querySelectorAll('.betting button').forEach(btn => {
        btn.style.boxShadow = '';
        btn.style.transform = '';
    });
    
    const buttons = document.querySelectorAll('.betting button');
    const targetButton = choice === 'Tài' ? buttons[0] : buttons[1];
    if (targetButton) {
        targetButton.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.6)';
        targetButton.style.transform = 'scale(1.05)';
    }
}

function updateButtonStates(hasBet) {
    const rollBtn = document.getElementById("roll-btn");
    const cancelBtn = document.getElementById("cancel-bet-btn");
    
    if (rollBtn) rollBtn.disabled = !hasBet || isRolling;
    if (cancelBtn) cancelBtn.disabled = !hasBet || isRolling;
}

function startCountdown() {
    const countdownElement = document.getElementById("countdown");
    if (!countdownElement) return;
    
    let timeLeft = 3;
    
    const updateCountdown = () => {
        if (timeLeft > 0) {
            countdownElement.innerHTML = `⏰ Lắc sau: <span style="color: #feca57; font-size: 1.2em;">${timeLeft}s</span>`;
            timeLeft--;
            setTimeout(updateCountdown, 1000);
        } else {
            countdownElement.textContent = "";
            updateButtonStates(true);
        }
    };
    
    updateCountdown();
}

function cancelBet() {
    if (!betChoice || isRolling) return;
    
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) countdownElement.textContent = "";
    
    updateButtonStates(false);
    betChoice = null;
    
    document.querySelectorAll('.betting button').forEach(btn => {
        btn.style.boxShadow = '';
        btn.style.transform = '';
    });
    
    showNotification("Đã hủy cược thành công!", 'info');
    playSound('bet');
}

function rollDice() {
    if (!betChoice || isRolling) {
        showNotification("Bạn cần chọn cược trước!", 'warning');
        return;
    }

    isRolling = true;
    let betAmount = getBetAmount();

    if (money < betAmount) {
        showNotification("Bạn không đủ tiền để cược!", 'error');
        isRolling = false;
        return;
    }
    
    money -= betAmount;
    updateAllDisplays();

    const dice1 = document.getElementById("dice1");
    const dice2 = document.getElementById("dice2"); 
    const dice3 = document.getElementById("dice3");
    const resultText = document.getElementById("result");
    const countdownElement = document.getElementById("countdown");
    
    if (countdownElement) countdownElement.textContent = "";
    
    [dice1, dice2, dice3].forEach(dice => {
        if (dice) {
            dice.textContent = "🎲";
            dice.classList.add("rolling", "shaking");
        }
    });
    
    if (resultText) {
        resultText.innerHTML = `<span style="color: #feca57;">🎲 Đang lắc xúc xắc...</span>`;
        resultText.className = '';
    }
    
    playSound('dice');
    addScreenShake();
    
    const shakeInterval = setInterval(() => {
        playSound('dice');
    }, 200);

    setTimeout(() => {
        clearInterval(shakeInterval);
        
        [dice1, dice2, dice3].forEach(dice => {
            if (dice) {
                dice.classList.remove("rolling", "shaking");
            }
        });

        const num1 = Math.floor(Math.random() * 6) + 1;
        const num2 = Math.floor(Math.random() * 6) + 1;
        const num3 = Math.floor(Math.random() * 6) + 1;
        const total = num1 + num2 + num3;
        const result = total >= 11 ? "Tài" : "Xỉu";

        setTimeout(() => {if (dice1) dice1.textContent = getDiceEmoji(num1);}, 200);
        setTimeout(() => {if (dice2) dice2.textContent = getDiceEmoji(num2);}, 400);
        setTimeout(() => {if (dice3) dice3.textContent = getDiceEmoji(num3);}, 600);

        setTimeout(() => {
            processGameResult(num1, num2, num3, total, result, betAmount);
            isRolling = false;
            updateButtonStates(false);
            betChoice = null;
            
            document.querySelectorAll('.betting button').forEach(btn => {
                btn.style.boxShadow = '';
                btn.style.transform = '';
            });
        }, 800);

    }, 3000);
}

function getDiceEmoji(num) {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[num - 1] || num.toString();
}

function addScreenShake() {
    document.body.style.animation = 'shake 0.5s ease-in-out infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
}

function processGameResult(num1, num2, num3, total, result, betAmount) {
    const resultText = document.getElementById("result");
    
    if (result === "Tài") taiCount++;
    else xiuCount++;

    const isWin = betChoice === result;
    const jackpot = checkJackpot();
    let jackpotMultiplier = jackpot ? jackpot.multiplier : (isWin ? 2 : 0);
    let winAmount = 0;

    if (jackpot) {
        if (jackpotMultiplier === 0) {
            winAmount = 0;
            houseMoney += betAmount;
        } else {
            winAmount = betAmount * jackpotMultiplier;
            if (winAmount > houseMoney) {
                winAmount = houseMoney;
                jackpotMultiplier = houseMoney / betAmount;
            }
        }
    } else if (isWin) {
        winAmount = betAmount * 2;
        if (winAmount > houseMoney) {
            winAmount = houseMoney;
        }
    } else {
        houseMoney += betAmount;
    }

    if (winAmount > 0) {
        money += winAmount;
        houseMoney -= winAmount;
    }

    displayResult(resultText, num1, num2, num3, total, result, winAmount, betAmount, jackpot, isWin);
    
    updateGameStats(jackpot, jackpotMultiplier, isWin);
    updateAllDisplays();
    
    checkSpecialConditions();
}

function displayResult(resultText, num1, num2, num3, total, result, winAmount, betAmount, jackpot, isWin) {
    if (!resultText) return;
    
    let message = `🎲 ${num1} + ${num2} + ${num3} = ${total} 🎲<br>`;
    
    if (jackpot) {
        if (jackpot.multiplier === 0) {
            message += `💥 <strong style="color: #e74c3c;">TẠCH HŨ!</strong><br>`;
            message += `<span style="color: #ff6b6b;">Bạn mất ${betAmount.toLocaleString()} VND</span>`;
            resultText.className = 'result-lose';
            playSound('lose');
            createFireworks(false);
        } else {
            message += `🔥 <strong style="color: #f39c12;">NỔ HŨ!</strong> 🔥<br>`;
            message += `<strong style="color: #2ecc71;">${result} - Thắng ${winAmount.toLocaleString()} VND!</strong>`;
            resultText.className = 'result-win';
            playSound('jackpot');
            createFireworks(true);
            showJackpotPopup(jackpot.message, winAmount, false);
        }
    } else if (isWin) {
        message += `<strong style="color: #2ecc71;">${result} - Thắng ${winAmount.toLocaleString()} VND!</strong>`;
        resultText.className = 'result-win';
        playSound('win');
        createConfetti();
    } else {
        message += `<strong style="color: #e74c3c;">${result} - Thua ${betAmount.toLocaleString()} VND</strong>`;
        resultText.className = 'result-lose';
        playSound('lose');
    }
    
    resultText.innerHTML = message;
}

function updateGameStats(jackpot, jackpotMultiplier, isWin) {
    if (jackpot) {
        if (jackpotMultiplier === 0) {
            loseCount++;
        } else {
            winCount++;
        }
    } else if (isWin) {
        winCount++;
    } else {
        loseCount++;
    }
}

function checkSpecialConditions() {
    if (houseMoney <= 0) {
        showNotification("🏆 Nhà cái đã phá sản! Bạn thắng chung cuộc!", 'success', 5000);
        houseMoney = 1000000000;
        money += 50000;
        createVictoryEffect();
    }
    
    if (money <= 0) {
        money = 0;
        showResetMoneyButton();
        showNotification("💸 Bạn đã hết tiền! Nhấn nút 'Nhận tiền mới' để tiếp tục.", 'warning', 5000);
    }
}

function createFireworks(isWin) {
    const colors = isWin ? ['#ffd700', '#ff6b6b', '#4ecdc4'] : ['#e74c3c', '#c0392b'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: 1000;
                animation: firework 1s ease-out forwards;
            `;
            document.body.appendChild(firework);
            
            setTimeout(() => firework.remove(), 1000);
        }, i * 100);
    }
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#feca57', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                z-index: 999;
                animation: confetti 3s ease-out forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 20);
    }
}

function createVictoryEffect() {
    const victory = document.createElement('div');
    victory.innerHTML = '🎉 CHIẾN THẮNG! 🎉';
    victory.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        font-weight: bold;
        color: #ffd700;
        z-index: 1001;
        animation: victory 2s ease-out forwards;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    `;
    document.body.appendChild(victory);
    
    setTimeout(() => victory.remove(), 2000);
}

function updateAllDisplays() {
    updateMoneyDisplay();
    updateStatsDisplay();
    updateHouseMoney();
    updateWinStats();
}

function updateMoneyDisplay() {
    const moneyElement = document.getElementById("money");
    if (moneyElement) {
        moneyElement.textContent = money.toLocaleString();
        
        if (money <= 10000) {
            moneyElement.style.color = '#e74c3c';
        } else if (money >= 1000000) {
            moneyElement.style.color = '#f39c12';
        } else {
            moneyElement.style.color = '#2ecc71';
        }
    }
}

function updateStatsDisplay() {
    const taiElement = document.getElementById("tai-count");
    const xiuElement = document.getElementById("xiu-count");
    
    if (taiElement) taiElement.textContent = taiCount;
    if (xiuElement) xiuElement.textContent = xiuCount;
}

function updateHouseMoney() {
    const houseElement = document.getElementById("house-money");
    if (houseElement) {
        houseElement.textContent = houseMoney.toLocaleString();
    }
}

function updateWinStats() {
    const totalGames = winCount + loseCount;
    const winRate = totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(1) : 0;

    const winCountElement = document.getElementById("win-count");
    const loseCountElement = document.getElementById("lose-count");
    const winRateElement = document.getElementById("win-rate");

    if (winCountElement) winCountElement.textContent = winCount;
    if (loseCountElement) loseCountElement.textContent = loseCount;
    if (winRateElement) {
        winRateElement.textContent = `${winRate}%`;
        
        if (winRate >= 60) {
            winRateElement.style.color = '#2ecc71';
        } else if (winRate >= 40) {
            winRateElement.style.color = '#f39c12';
        } else {
            winRateElement.style.color = '#e74c3c';
        }
    }
}

function showResetMoneyButton() {
    const resetBtn = document.getElementById("reset-money-btn");
    if (resetBtn) {
        resetBtn.style.display = "block";
        resetBtn.classList.add('pulse-animation');
    }
}

function resetMoney() {
    money = 250000;
    updateAllDisplays();
    
    const resetBtn = document.getElementById("reset-money-btn");
    if (resetBtn) {
        resetBtn.style.display = "none";
        resetBtn.classList.remove('pulse-animation');
    }
    
    showNotification("💰 Đã nhận 250,000 VND mới!", 'success');
    createConfetti();
}

function showJackpotPopup(message, amount, isFail = false) {
    const popup = document.createElement("div");
    popup.className = "jackpot-popup";
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 30px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 3px solid #fff;
        max-width: 400px;
        animation: jackpotPopup 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    if (isFail) {
        popup.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)";
        popup.style.color = "white";
    } else {
        popup.style.background = "linear-gradient(135deg, #f39c12, #e67e22)";
        popup.style.color = "white";
    }

    popup.innerHTML = `
        <div style="margin-bottom: 15px; font-size: 32px;">
            ${isFail ? '💥' : '🎊'}
        </div>
        <div style="margin-bottom: 10px;">${message}</div>
        <div style="font-size: 20px; opacity: 0.9;">
            ${isFail ? 'Chúc bạn may mắn lần sau!' : `+${amount.toLocaleString()} VND`}
        </div>
    `;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = 'jackpotPopupOut 0.5s ease-in forwards';
        setTimeout(() => popup.remove(), 500);
    }, 4000);
}

const jackpotRates = [
    { chance: 55, multiplier: 0, message: "💥 Tạch Hũ! Bạn không nhận được gì!" },
    { chance: 30, multiplier: 0.5, message: "🔄 Hoàn trả 50% tiền cược!" },
    { chance: 25, multiplier: 1, message: "💰 Hoàn trả 100% tiền cược!" },
    { chance: 20, multiplier: 2, message: "🎯 Nổ Hũ Nhỏ - x2 tiền cược!" },
    { chance: 15, multiplier: 5, message: "🔥 Nổ Hũ Lớn - x5 tiền cược!" },
    { chance: 10, multiplier: 10, message: "⚡ Siêu Nổ Hũ - x10 tiền cược!" },
    { chance: 5, multiplier: 50, message: "💎 Thần Tài Xuất Hiện - x50 tiền cược!" },
    { chance: 1, multiplier: 100, message: "👑 Hoàng Gia Jackpot - x100 tiền cược!" },
    { chance: 0.5, multiplier: 500, message: "🌟 SIÊU THẦN TÀI - x500 tiền cược!" },
    { chance: 0.1, multiplier: 1000, message: "🚀 HUYỀN THOẠI - x1000 tiền cược!" }
];

function checkJackpot() {
    const betAmount = getBetAmount();
    let jackpotChance = Math.random() * 100;
    
    if (betAmount >= 100000) jackpotChance *= 0.8;
    if (betAmount >= 500000) jackpotChance *= 0.7;
    
    let cumulativeChance = 0;

    for (let rate of jackpotRates) {
        cumulativeChance += rate.chance;
        if (jackpotChance < cumulativeChance) {
            return { 
                multiplier: rate.multiplier, 
                message: rate.message,
                type: rate.multiplier === 0 ? 'fail' : 'success'
            };
        }
    }

    return null;
}

function saveGameState() {
    const gameState = {
        money,
        taiCount,
        xiuCount,
        winCount,
        loseCount,
        houseMoney,
        timestamp: Date.now()
    };
    
    try {
        window.gameState = gameState;
    } catch (e) {
        console.log('Save not supported');
    }
}

function loadGameState() {
    try {
        if (window.gameState) {
            const state = window.gameState;
            if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                money = state.money || 250000;
                taiCount = state.taiCount || 0;
                xiuCount = state.xiuCount || 0;
                winCount = state.winCount || 0;
                loseCount = state.loseCount || 0;
                houseMoney = state.houseMoney || 1000000000000;
                updateAllDisplays();
            }
        }
    } catch (e) {
        console.log('Load not supported');
    }
}

setInterval(saveGameState, 5000);

document.addEventListener('keydown', function(e) {
    if (isRolling) return;
    
    switch(e.key) {
        case '1':
            e.preventDefault();
            placeBet('Tài');
            break;
        case '2':
            e.preventDefault();
            placeBet('Xỉu');
            break;
        case ' ':
            e.preventDefault();
            if (betChoice) rollDice();
            break;
        case 'Escape':
            e.preventDefault();
            cancelBet();
            break;
        case 'm':
        case 'M':
            e.preventDefault();
            toggleSound();
            break;
    }
});

function toggleSound() {
    soundEnabled = !soundEnabled;
    showNotification(
        soundEnabled ? '🔊 Đã bật âm thanh' : '🔇 Đã tắt âm thanh', 
        'info'
    );
}

window.addEventListener('load', function() {
    loadGameState();
    updateAllDisplays();
    
    addCustomStyles();
    
    showNotification('🎮 Chào mừng đến với Game Tài Xỉu!', 'success');
    showNotification('💡 Phím tắt: 1=Tài, 2=Xỉu, Space=Lắc, Esc=Hủy, M=Âm thanh', 'info', 5000);
});

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to { transform: scale(2); opacity: 0; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes firework {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(20); opacity: 0; }
        }
        
        @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes victory {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        @keyframes jackpotPopup {
            0% { transform: translate(-50%, -50%) scale(0) rotate(180deg); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1) rotate(90deg); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes jackpotPopupOut {
            to { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            100% { transform: translateY(-40px) rotate(360deg); opacity: 0.3; }
        }
        
        .pulse-animation {
            animation: pulse 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
        }
        
        .floating-particle {
            animation: float 20s infinite linear;
        }
        
        .music-visualizer {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 3px;
        }
        
        .music-visualizer .bar {
            width: 4px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            animation: musicBar 1s ease-in-out infinite alternate;
        }
        
        .music-visualizer .bar:nth-child(2) { animation-delay: 0.2s; }
        .music-visualizer .bar:nth-child(3) { animation-delay: 0.4s; }
        .music-visualizer .bar:nth-child(4) { animation-delay: 0.6s; }
        .music-visualizer .bar:nth-child(5) { animation-delay: 0.8s; }
        
        @keyframes musicBar {
            from { height: 10px; opacity: 0.3; }
            to { height: 25px; opacity: 1; }
        }
        
        .rolling {
            animation: roll 0.2s linear infinite;
        }
        
        .shaking {
            animation: shake 0.1s linear infinite;
        }
        
        @keyframes roll {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .result-win {
            animation: bounce 0.5s ease-out;
        }
        
        .result-lose {
            animation: shake 0.5s ease-out;
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0,-30px,0); }
            70% { transform: translate3d(0,-15px,0); }
            90% { transform: translate3d(0,-4px,0); }
        }
    `;
    document.head.appendChild(style);
}

window.placeBet = placeBet;
window.rollDice = rollDice;
window.cancelBet = cancelBet;
window.resetMoney = resetMoney;
window.toggleSound = toggleSound;
