let money = 250000;
let betChoice = null;
let taiCount = 0;
let xiuCount = 0;

function placeBet(choice) {
  let betAmount = getBetAmount();

  if (money < 100) {
    alert("Bạn không đủ tiền để cược!");
    return;
  }

  if (betAmount > money) {
    alert("Bạn không có đủ tiền để đặt cược số này!");
    return;
  }

  betChoice = choice;
  document.getElementById("roll-btn").disabled = false;
  document.getElementById("cancel-bet-btn").disabled = false;

  alert(`Bạn đã cược ${choice} với mức cược ${betAmount}💰`);
  startCountdown();
}

function getBetAmount() {
  let amount = parseInt(document.getElementById("bet-amount").value);
  return isNaN(amount) || amount <= 0 ? 100 : amount;
}

function startCountdown() {
  let countdownElement = document.getElementById("countdown");
  let rollButton = document.getElementById("roll-btn");
  rollButton.disabled = true; // Disable ngay khi bắt đầu đếm ngược

  let timeLeft = 3;
  countdownElement.textContent = `Lắc sau: ${timeLeft}s`;

  let countdownInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      countdownElement.textContent = `Lắc sau: ${timeLeft}s`;
    } else {
      clearInterval(countdownInterval);
      countdownElement.textContent = "";
      rollButton.disabled = false; // Enable lại sau khi đếm ngược xong
    }
  }, 1000);
}

function cancelBet() {
  if (betChoice) {
    document.getElementById("countdown").textContent = "";
    document.getElementById("roll-btn").disabled = true;
    document.getElementById("cancel-bet-btn").disabled = true;
    betChoice = null;
    alert("Bạn đã hủy cược và nhận lại tiền!");
  }
}

let winCount = 0;
let loseCount = 0;

function updateWinStats() {
  let totalGames = winCount + loseCount;
  let winRate = totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(2) : 0;

  document.getElementById("win-count").textContent = winCount;
  document.getElementById("lose-count").textContent = loseCount;
  document.getElementById("win-rate").textContent = `${winRate}%`;
}

let houseMoney = 1000000000; // Quỹ nhà cái

function updateHouseMoney() {
  document.getElementById("house-money").textContent = houseMoney;
}

function rollDice() {
  if (!betChoice) {
    alert("Bạn cần chọn cược trước!");
    return;
  }

  let dice1 = document.getElementById("dice1");
  let dice2 = document.getElementById("dice2");
  let dice3 = document.getElementById("dice3");
  let resultText = document.getElementById("result");
  document.getElementById("countdown").textContent = "";

  dice1.textContent = "";
  dice2.textContent = "";
  dice3.textContent = "";
  resultText.textContent = "Lắc xúc xắc...";

  dice1.classList.add("shaking");
  dice2.classList.add("shaking");
  dice3.classList.add("shaking");

  setTimeout(() => {
    dice1.classList.remove("shaking");
    dice2.classList.remove("shaking");
    dice3.classList.remove("shaking");

    let num1 = Math.floor(Math.random() * 6) + 1;
    let num2 = Math.floor(Math.random() * 6) + 1;
    let num3 = Math.floor(Math.random() * 6) + 1;
    let total = num1 + num2 + num3;
    let result = total >= 11 ? "Tài" : "Xỉu";

    dice1.textContent = num1;
    dice2.textContent = num2;
    dice3.textContent = num3;

    if (result === "Tài") taiCount++;
    else xiuCount++;

    document.getElementById("tai-count").textContent = taiCount;
    document.getElementById("xiu-count").textContent = xiuCount;

    let betAmount = getBetAmount();
    let isWin = betChoice === result;
    let jackpot = checkJackpot(); // Kiểm tra có nổ hũ không
    let jackpotMultiplier = jackpot ? jackpot.multiplier : 1;
    let winAmount = isWin ? betAmount * jackpotMultiplier : 0;

    if (isWin) {
      money += winAmount; // Cộng đúng số tiền
      houseMoney -= winAmount;

      resultText.innerHTML = `Tổng: ${total} - <strong style="color: #32CD32;">${result} 🎉 Bạn thắng ${winAmount.toLocaleString()}💰!</strong>`;

      if (jackpot) {
        showJackpotPopup(jackpot.message, winAmount); // Hiển thị đúng số tiền
      }
    } else {
      money -= betAmount;
      houseMoney += betAmount;
      loseCount++;
      resultText.innerHTML = `Tổng: ${total} - <strong style="color: #FF4500;">${result} 😢 Bạn thua ${betAmount.toLocaleString()}💰!</strong>`;

      if (jackpot) {
        showJackpotPopup("Bạn không nổ hũ lần này 😢", 0);
      }
    }

    document.getElementById("money").textContent = money.toLocaleString();
    updateWinStats();
    updateHouseMoney();

    if (houseMoney <= 0) {
      alert("🎉 Nhà cái đã cạn tiền! Bạn thắng chung cuộc!");
      houseMoney = 1000000;
      money += 50000;
    }

    if (money <= 0) {
      money = 0;
      document.getElementById("reset-money-btn").style.display = "block";
    }

    document.getElementById("roll-btn").disabled = true;
    document.getElementById("cancel-bet-btn").disabled = true;
    betChoice = null;
  }, 3000);
}

function updateMoney(amount) {
  money = amount;
  document.getElementById("money").textContent = money;

  // Kiểm tra nếu hết tiền thì hiện nút cấp tiền
  if (money <= 0) {
    document.getElementById("reset-money-btn").style.display = "block";
  } else {
    document.getElementById("reset-money-btn").style.display = "none";
  }
}

function resetMoney() {
  money = 25000;
  updateMoney(money);
  document.getElementById("reset-money-btn").style.display = "none"; // Ẩn nút sau khi cấp tiền
  alert("Bạn đã được cấp lại 25000💰 để tiếp tục chơi!");
}

function showJackpotPopup(message, amount) {
  let popup = document.createElement("div");
  popup.classList.add("jackpot-popup");
  popup.innerHTML = `
    <strong>${message}</strong><br>
    <span style="font-size: 24px; color: gold;">+${amount.toLocaleString()}💰</span>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
}

// Xác suất nổ hũ với các mức thưởng
const jackpotRates = [
  { chance: 50, multiplier: 1, message: "Bạn đã nhận lại số tiền cược!" },
  {
    chance: 30,
    multiplier: 2,
    message: "🔥 Nổ Hũ 🎉 Nhận gấp đôi số tiền cược!",
  },
  { chance: 15, multiplier: 0, message: "🤡 Nổ Dái! Không nhận được gì!" },
  {
    chance: 10,
    multiplier: 5,
    message: "💥 Siêu Nổ Hũ! Nhận x5 số tiền cược!",
  },
  {
    chance: 0.1,
    multiplier: 100,
    message: "🔥🔥 Đại Nổ Hũ! Nhận x100 số tiền cược!!! 🎰💰",
  },
];

function checkJackpot() {
  let random = Math.random();

  if (random < 0.05) {
    // 5% nổ hũ
    return { multiplier: 10, message: "🔥 Nổ hũ! x10 số tiền cược! 🔥" };
  } else if (random < 0.1) {
    // 5% x2
    return { multiplier: 2, message: "🎉 May mắn! x2 số tiền cược! 🎉" };
  }

  return null; // Không nổ hũ
}
