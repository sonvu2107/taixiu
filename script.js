let money = 10000;
let betChoice = null;
let taiCount = 0;
let xiuCount = 0;
let countdown = null;
let countdownTime = 5;

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
  let countdownDisplay = document.getElementById("countdown");
  countdownTime = 5;
  countdownDisplay.textContent = `Lắc xúc xắc sau: ${countdownTime}s`;

  countdown = setInterval(() => {
    countdownTime--;
    countdownDisplay.textContent = `Lắc xúc xắc sau: ${countdownTime}s`;

    if (countdownTime <= 0) {
      clearInterval(countdown);
      rollDice();
    }
  }, 1000);
}

function cancelBet() {
  if (betChoice) {
    clearInterval(countdown);
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
    document.getElementById("roll-btn").disabled = true;
    document.getElementById("cancel-bet-btn").disabled = true;
    betChoice = null;
  }, 3000);
}
