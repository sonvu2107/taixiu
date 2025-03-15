let money = 10000;
let betChoice = null;
let taiCount = 0;
let xiuCount = 0;

function placeBet(choice) {
    let betAmount = parseInt(document.getElementById("bet-amount").value);

    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Vui lòng nhập số tiền cược hợp lệ!");
        return;
    }
    if (betAmount > money) {
        alert("Bạn không đủ tiền để cược số này!");
        return;
    }

    betChoice = choice;
    document.getElementById("roll-btn").disabled = false;
    alert(`Bạn đã cược ${betAmount}💰 vào ${choice}`);
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

    let betAmount = parseInt(document.getElementById("bet-amount").value);
    
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

        // Danh sách kết quả có trọng số cao cho 4-4-1 và 6-3-1
        let weightedOutcomes = [
            [4, 4, 1], [4, 4, 1], [4, 4, 1], [4, 4, 1], 
            [6, 3, 1], [6, 3, 1], [6, 3, 1], [6, 3, 1], 
            [1, 2, 3], [2, 2, 2], [3, 3, 3], [5, 5, 6], 
            [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
        ];

        let selectedRoll = weightedOutcomes[Math.floor(Math.random() * weightedOutcomes.length)];
        let [num1, num2, num3] = selectedRoll;
        let total = num1 + num2 + num3;
        let result = total >= 11 ? "Tài" : "Xỉu";

        if (result === "Tài") taiCount++;
        else xiuCount++;

        document.getElementById("tai-count").textContent = taiCount;
        document.getElementById("xiu-count").textContent = xiuCount;

        dice1.textContent = num1;
        dice2.textContent = num2;
        dice3.textContent = num3;

        if (betChoice === result) {
            money += betAmount;
            resultText.innerHTML = `Tổng: ${total} - <strong style="color: #32CD32;">${result} 🎉 Bạn thắng ${betAmount}💰!</strong>`;
        } else {
            money -= betAmount;
            resultText.innerHTML = `Tổng: ${total} - <strong style="color: #FF4500;">${result} 😢 Bạn thua ${betAmount}💰!</strong>`;
        }

        document.getElementById("money").textContent = money;
        document.getElementById("roll-btn").disabled = true;
        betChoice = null;
    }, 3000);
}
