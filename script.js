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

  alert(`Bạn đã cược ${choice} với mức cược ${betAmount} VND`);
  startCountdown();
}

function getBetAmount() {
  let amount = document.getElementById("bet-amount").value.replace(/\D/g, ""); 
  return isNaN(amount) || amount <= 0 ? 100 : parseInt(amount);
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
  document.getElementById("house-money").textContent = houseMoney.toLocaleString();
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
    let jackpot = checkJackpot();
    let jackpotMultiplier = jackpot ? jackpot.multiplier : 1;
    let winAmount = isWin ? betAmount * jackpotMultiplier : 0;

    if (jackpot && winAmount > houseMoney) {
      winAmount = houseMoney;
      jackpotMultiplier = houseMoney / betAmount;
    }

    if (isWin) {
      winCount++;
      money += winAmount;
      houseMoney -= winAmount;
      updateExp(20); // Cộng EXP khi thắng

      completeMission(1); // Cộng tiến độ cho nhiệm vụ "Thắng 3 ván"

      if (jackpot) {
        showJackpotPopup(jackpot.message, winAmount);
        resultText.innerHTML = `🔥 NỔ HŨ! 🔥 <br> Tổng: ${total} - <strong style="color: #FF0000;">${result} Bạn thắng ${winAmount.toLocaleString()} VND!</strong>`;
      } else {
        resultText.innerHTML = `Tổng: ${total} - <strong style="color: #32CD32;">${result} Bạn thắng ${winAmount.toLocaleString()} VND!</strong>`;
      }
    } else {
      loseCount++;
      money -= betAmount;
      houseMoney += betAmount;
      resultText.innerHTML = `Tổng: ${total} - <strong style="color: #FF4500;">${result} Bạn thua ${betAmount.toLocaleString()} VND!</strong>`;
    }

    document.getElementById("money").textContent = money.toLocaleString();
    updateWinStats();
    updateHouseMoney();

    // Cộng tiến độ cho nhiệm vụ "Chơi 5 ván"
    completeMission(0);

    if (houseMoney <= 0) {
      alert("🏆 Nhà cái đã phá sản! Bạn thắng chung cuộc!");
      houseMoney = 1000000000;
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
  document.getElementById("money").textContent = money.toLocaleString();

  // Kiểm tra nếu hết tiền thì hiện nút cấp tiền
  if (money <= 0) {
    document.getElementById("reset-money-btn").style.display = "block";
  } else {
    document.getElementById("reset-money-btn").style.display = "none";
  }
}

function showJackpotPopup(message, amount) {
  let popup = document.createElement("div");
  popup.classList.add("jackpot-popup");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "rgba(0, 0, 0, 0.8)";
  popup.style.color = "gold";
  popup.style.padding = "20px";
  popup.style.borderRadius = "10px";
  popup.style.fontSize = "24px";
  popup.style.fontWeight = "bold";
  popup.style.textAlign = "center";
  popup.style.zIndex = "1000";
  popup.style.boxShadow = "0px 0px 10px 5px rgba(255, 215, 0, 0.5)";

  popup.innerHTML = `
    <strong>${message}</strong><br>
    <span style="font-size: 30px; color: gold;">+${amount.toLocaleString()}💰</span>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}

// Xác suất nổ hũ với các mức thưởng
const jackpotRates = [
  { chance: 50, multiplier: 1, message: "Bạn đã nhận lại số tiền cược!" },
  {
    chance: 30,
    multiplier: 2,
    message: "Nổ Hũ , x2 tiền cược!",
  },
  { chance: 15, multiplier: 0, message: "Nổ Dái! Có cái dái thôi!" },
  {
    chance: 10,
    multiplier: 5,
    message: "Siêu Nổ Hũ, x5 tiền cược!",
  },
  {
    chance: 0.1,
    multiplier: 100,
    message: "Tài lộc quá lớn!!!! Nhận x100 tiền cược!!!",
  },
];

function checkJackpot() {
  let random = Math.random() * 100; // Số ngẫu nhiên từ 0 đến 100
  let cumulativeChance = 0; // Tổng xác suất tích lũy

  for (let rate of jackpotRates) {
    cumulativeChance += rate.chance;
    if (random < cumulativeChance) {
      return { multiplier: rate.multiplier, message: rate.message };
    }
  }

  return null; // Không nổ hũ
}
let level = 1;
let exp = 0;
let expToNextLevel = 100;
let money = 250000;
let hasSpun = false; // Kiểm soát vòng quay

// 🏆 Nhiệm vụ hàng ngày
let missions = [
  { text: "Chơi 5 ván", progress: 0, goal: 5, reward: 50 },
  { text: "Thắng 3 ván", progress: 0, goal: 3, reward: 100 },
];

function updateExp(amount) {
  exp += amount;
  if (exp >= expToNextLevel) {
    levelUp();
  }
  document.getElementById("player-level").textContent = level;
  document.getElementById("exp-fill").style.width = (exp / expToNextLevel) * 100 + "%";
  document.getElementById("player-exp").textContent = exp;
}

function levelUp() {
  level++;
  exp = 0;
  expToNextLevel += 50;
  alert(`🎉 Bạn đã lên cấp ${level}! Nhận 500 VND!`);
  money += 500;
}

function updateMissions() {
  let missionList = document.getElementById("mission-list");
  if (!missionList) return;
  missionList.innerHTML = "";
  missions.forEach((mission, index) => {
    let item = document.createElement("li");
    item.textContent = `${mission.text}: ${mission.progress}/${mission.goal}`;
    if (mission.progress >= mission.goal) {
      item.style.color = "lime";
    }
    missionList.appendChild(item);
  });
}

function completeMission(index) {
  if (missions[index].progress >= missions[index].goal) return;
  missions[index].progress++;
  if (missions[index].progress === missions[index].goal) {
    money += missions[index].reward;
    alert(`✅ Hoàn thành nhiệm vụ! Nhận ${missions[index].reward} VND!`);
  }
  updateMissions();
}

// 🎡 Vòng quay may mắn
function spinWheel() {
  if (hasSpun) {
    alert("🎡 Bạn đã quay hôm nay! Hãy quay lại vào ngày mai!");
    return;
  }
  hasSpun = true;
  let prizes = [100, 200, 500, 1000, 0];
  let reward = prizes[Math.floor(Math.random() * prizes.length)];
  if (reward > 0) {
    alert(`🎊 Chúc mừng! Bạn nhận được ${reward} VND từ vòng quay!`);
    money += reward;
  } else {
    alert("😢 Không may rồi! Chúc bạn may mắn lần sau!");
  }
  document.getElementById("spin-result").textContent = `🎁 Nhận ${reward} VND`;
}

document.getElementById("spin-wheel").addEventListener("click", spinWheel);
updateMissions();

// 📜 Menu Toggle
document.getElementById("toggle-menu").addEventListener("click", function () {
  document.querySelector(".menu-content").classList.toggle("active");
});

// 🏆 Chuyển tab menu
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));

    this.classList.add("active");
    document.getElementById(this.dataset.tab).classList.add("active");
  });
});

// 🎲 Cập nhật EXP khi chơi
function addExp(amount) {
  updateExp(amount);
}

// 🎰 Cập nhật khi thắng ván
function playerWin() {
  addExp(10);
  completeMission(1);
}

