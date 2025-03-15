let money = 1000;
let betChoice = null;
let taiCount = 0;
let xiuCount = 0;

function placeBet(choice) {
    if (money < 100) {
        alert("Bạn không đủ tiền để cược!");
        return;
    }
    betChoice = choice;
    document.getElementById("roll-btn").disabled = false;
    alert(`Bạn đã cược ${choice} 100💰`);
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
        // Xóa hiệu ứng rung
        dice1.classList.remove("shaking");
        dice2.classList.remove("shaking");
        dice3.classList.remove("shaking");

        // Sinh số ngẫu nhiên từ 1 đến 6
        let num1 = Math.floor(Math.random() * 6) + 1;
        let num2 = Math.floor(Math.random() * 6) + 1;
        let num3 = Math.floor(Math.random() * 6) + 1;
        let total = num1 + num2 + num3;

        // Hiển thị kết quả
        dice1.textContent = num1;
        dice2.textContent = num2;
        dice3.textContent = num3;

        let result = total >= 11 ? "Tài" : "Xỉu";

        if (result === "Tài") taiCount++;
        else xiuCount++;

        document.getElementById("tai-count").textContent = taiCount;
        document.getElementById("xiu-count").textContent = xiuCount;

        // Kiểm tra thắng thua
        if (betChoice === result) {
            money += 100;
            resultText.innerHTML = `Tổng: ${total} - <strong style="color: #00ff00;">${result} 🎉 (Bạn thắng!)</strong>`;
        } else {
            money -= 100;
            resultText.innerHTML = `Tổng: ${total} - <strong style="color: #ff0000;">${result} 😢 (Bạn thua rồi thằng ngu!)</strong>`;
        }

        document.getElementById("money").textContent = money;
        document.getElementById("roll-btn").disabled = true;
        betChoice = null;
    }, 1500);
}
