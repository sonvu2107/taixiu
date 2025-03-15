let money = 25000;
let betChoice = null;
let taiCount = 0;
let xiuCount = 0;
let winCount = 0;
let loseCount = 0;
let houseMoney = 1000000; // Quỹ nhà cái
let betAmount = 100; // Số tiền cược mặc định

// Cập nhật số tiền hiển thị
function updateMoney() {
    document.getElementById("money").textContent = money;
    document.getElementById("house-money").textContent = houseMoney;

    if (money <= 0) {
        document.getElementById("reset-money-btn").style.display = "block";
    } else {
        document.getElementById("reset-money-btn").style.display = "none";
    }
}

// Đặt cược
function placeBet(choice) {
    if (money < betAmount) {
        alert("Bạn không đủ tiền để cược!");
        return;
    }

    betChoice = choice;
    document.getElementById("roll-btn").disabled = false;
    document.getElementById("cancel-bet-btn").disabled = false;

    alert(`Bạn đã cược ${choice} với mức cược ${betAmount}💰`);
    startCountdown();
}

// Hủy cược
function cancelBet() {
    if (betChoice) {
        document.getElementById("countdown").textContent = "";
        document.getElementById("roll-btn").disabled = true;
        document.getElementById("cancel-bet-btn").disabled = true;
        betChoice = null;
        alert("Bạn đã hủy cược và nhận lại tiền!");
    }
}

// Bắt đầu đếm ngược trước khi lắc xúc xắc
function startCountdown() {
    let countdownElement = document.getElementById("countdown");
    let rollButton = document.getElementById("roll-btn");
    rollButton.disabled = true;

    let timeLeft = 3;
    countdownElement.textContent = `Lắc sau: ${timeLeft}s`;

    let countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            countdownElement.textContent = `Lắc sau: ${timeLeft}s`;
        } else {
            clearInterval(countdownInterval);
            countdownElement.textContent = "";
            rollButton.disabled = false;
        }
    }, 1000);
}

// Kiểm tra xác suất "nổ hũ"
const jackpotRates = [
    { chance: 50, multiplier: 1, message: "Bạn đã nhận lại số tiền cược!" },
    { chance: 30, multiplier: 2, message: "Nổ hũ 🎉 Nhận gấp đôi số tiền cược!" },
    { chance: 15, multiplier: 0, message: "Nổ dái 🤡 Không nhận được gì!" },
    { chance: 10, multiplier: 5, message: "CŨNG MAY MẮN ĐẤY 💥 Nhận x5 số tiền cược!" },
    { chance: 0.1, multiplier: 100, message: "TÀI LỘC QUÁ LỚN 🔥 Nhận x100 số tiền cược!!!" }
];

function checkJackpot() {
    let random = Math.random() * 100;
    let cumulativeChance = 0;

    for (let jackpot of jackpotRates) {
        cumulativeChance += jackpot.chance;
        if (random <= cumulativeChance) {
            showJackpotPopup(jackpot.message, betAmount * jackpot.multiplier);
            return jackpot.multiplier;
        }
    }
    return 1;
}

// Hiển thị thông báo "nổ hũ"
function showJackpotPopup(message, reward) {
    let popup = document.getElementById("jackpot-popup");
    let popupMessage = document.getElementById("jackpot-message");
    let popupAmount = document.getElementById("jackpot-amount");

    popupMessage.textContent = message;
    popupAmount.textContent = `+${reward}💰`;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

// Lắc xúc xắc
function rollDice() {
    if (!betChoice) {
        alert("Bạn cần chọn cược trước!");
        return;
    }

    let num1 = Math.floor(Math.random() * 6) + 1;
    let num2 = Math.floor(Math.random() * 6) + 1;
    let num3 = Math.floor(Math.random() * 6) + 1;
    let total = num1 + num2 + num3;
    let result = total >= 11 ? "Tài" : "Xỉu";

    let multiplier = checkJackpot(); // Kiểm tra "nổ hũ"
    let finalWinAmount = betAmount * multiplier;

    if (betChoice === result) {
        money += finalWinAmount;
        houseMoney -= finalWinAmount;
        winCount++;
    } else {
        money -= betAmount;
        houseMoney += betAmount;
        loseCount++;
    }

    updateMoney();
    document.getElementById("result").textContent = `Tổng: ${total} - Kết quả: ${result}`;

    document.getElementById("roll-btn").disabled = true;
    document.getElementById("cancel-bet-btn").disabled = true;
    betChoice = null;
}

// Chọn mức cược
function setBet(multiplier) {
    if (multiplier === 'all') {
        betAmount = money;
    } else {
        betAmount = 100 * multiplier;
    }

    if (betAmount > money) {
        betAmount = money;
    }

    document.getElementById("bet-amount-text").textContent = betAmount;
}
