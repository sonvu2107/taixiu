let money = 10000;
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

  // Xóa nội dung xúc xắc cũ
  dice1.textContent = "";
  dice2.textContent = "";
  dice3.textContent = "";
  resultText.textContent = "Lắc xúc xắc...";

  // Hiệu ứng rung
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

    // Cập nhật số điểm lên xúc xắc
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
      resultText.innerHTML = `Tổng: ${total} - <strong style="color: #32CD32;">${result} 🎉 Bạn thắng ${betAmount}💰!</strong>`;
    } else {
      money -= betAmount;
      resultText.innerHTML = `Tổng: ${total} - <strong style="color: #FF4500;">${result} 😢 Bạn thua ${betAmount}💰!</strong>`;
    }

    document.getElementById("money").textContent = money;

    // Kiểm tra nếu hết tiền thì hiện nút cấp tiền
    if (money <= 0) {
      money = 0;
      document.getElementById("reset-money-btn").style.display = "block";
    }

    document.getElementById("roll-btn").disabled = true;
    document.getElementById("cancel-bet-btn").disabled = true;
    betChoice = null;
  }, 3000);
}

function resetMoney() {
  if (money === 0) {
    money = 1000;
    document.getElementById("money").textContent = money;
    document.getElementById("reset-money-btn").style.display = "none"; // Ẩn nút sau khi cấp tiền
    alert("Bạn đã được cấp lại 1000💰 để tiếp tục chơi!");
  }
}

function checkResetButton() {
  if (money <= 0) {
    document.getElementById("reset-money-btn").style.display = "block"; // Hiện nút nếu hết tiền
  }
}

// Gọi checkResetButton() khi cập nhật tiền
function updateMoney(amount) {
  money = amount;
  document.getElementById("money").textContent = money;
  checkResetButton();
}

