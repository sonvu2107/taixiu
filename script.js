let money = 25000;
let betChoice = null;
let taiCount = 0;
let xiuCount = 0;
let winCount = 0;
let loseCount = 0;
let houseMoney = 1000000; // Quỹ nhà cái

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

function cancelBet() {
  if (betChoice) {
    document.getElementById("countdown").textContent = "";
    document.getElementById("roll-btn").disabled = true;
    document.getElementById("cancel-bet-btn").disabled = true;
    betChoice = null;
    alert("Bạn đã hủy cược và nhận lại tiền!");
  }
}

function updateWinStats() {
  let totalGames = winCount + loseCount;
  let winRate = totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(2) : 0;

  document.getElementById("win-count").textContent = winCount;
  document.getElementById("lose-count").textContent = loseCount;
  document.getElementById("win-rate").textContent = `${winRate}%`;
}

function updateHouseMoney() {
  document.getElementById("house-money").textContent = houseMoney;
}

// **Tính toán khả năng thắng dựa trên tỷ lệ thắng/thua**
function getRiggedResult() {
  let totalGames = winCount + loseCount;
  let winRate = totalGames > 0 ? (winCount / totalGames) * 100 : 50;

  let riggedChance = 0;
  if (winRate > 60) {
    riggedChance = 0.7; // Nếu người chơi thắng quá nhiều, nhà cái sẽ tăng tỷ lệ thua lên 70%
  } else if (winRate < 40) {
    riggedChance = 0.3; // Nếu người chơi thua nhiều, giữ tỷ lệ thắng công bằng hơn
  }

  return Math.random() > riggedChance;
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

    let isWin = getRiggedResult();

    let num1 = Math.floor(Math.random() * 6) + 1;
    let num2 = Math.floor(Math.random() * 6) + 1;
    let num3 = Math.floor(Math.random() * 6) + 1;
    let total = num1 + num2 + num3;
    let result = total >= 11 ? "Tài" : "Xỉu";

    if (!isWin) {
      result = betChoice === "Tài" ? "Xỉu" : "Tài";
    }

    dice1.textContent = num1;
    dice2.textContent = num2;
    dice3.textContent = num3;

    if (result === "Tài") taiCount++;
    else xiuCount++;

    document.getElementById("tai-count").textContent = taiCount;
    document.getElementById("xiu-count").textContent = xiuCount;

    let betAmount = getBetAmount();
    if (betChoice === result) {
      money += betAmount;
      houseMoney -= betAmount; // Nhà cái mất tiền
      winCount++;
      resultText.innerHTML = `Tổng: ${total} - <strong style="color: #32CD32;">${result} 🎉 Bạn thắng ${betAmount}💰!</strong>`;
    } else {
      money -= betAmount;
      houseMoney += betAmount; // Nhà cái ăn tiền
      loseCount++;
      resultText.innerHTML = `Tổng: ${total} - <strong style="color: #FF4500;">${result} 😢 Bạn thua ${betAmount}💰!</strong>`;
    }

    document.getElementById("money").textContent = money;
    updateWinStats();
    updateHouseMoney();

    // Kiểm tra nếu nhà cái hết tiền
    if (houseMoney <= 0) {
      alert("🎉 Nhà cái đã cạn tiền! Bạn thắng chung cuộc!");
      houseMoney = 1000000; // Reset lại quỹ nhà cái
      money += 50000; // Thưởng thêm tiền cho người chơi
    }

    if (money <= 0) {
      money = 0;
      document.getElementById("reset-money-btn").style.display = "block";
    } else {
      document.getElementById("reset-money-btn").style.display = "none";
    }

    document.getElementById("roll-btn").disabled = true;
    document.getElementById("cancel-bet-btn").disabled = true;
    betChoice = null;
  }, 3000);
}

function resetMoney() {
  money = 25000;
  updateMoney(money);
  document.getElementById("reset-money-btn").style.display = "none";
  alert("Bạn đã được cấp lại 25000💰 để tiếp tục chơi!");
}

function updateMoney(amount) {
  money = amount;
  document.getElementById("money").textContent = money;

  let resetBtn = document.getElementById("reset-money-btn");
  let menu = document.getElementById("menu");

  if (money <= 0) {
    resetBtn.style.display = "block";
    menu.style.display = "block";
  } else {
    resetBtn.style.display = "none";
    menu.style.display = "none";
  }
}
