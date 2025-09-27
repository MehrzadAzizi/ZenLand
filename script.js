
const words = ["game", "love", "dark", "coin", "fire", "mint", "jump", "code"];
let selectedWord = "";
let errorCount = 0;
let wrongIndex = 0;
let gameEnded = false;
let walletAddress = null;

const recipientAddress = "0xeedC4027deFa2f41b9faC477B9F389389b1EEc64"; // آدرس مقصد
const tokenAmount = "0.001"; // مقدار توکن ZTC

window.onload = () => {
  setupBoxes();
  selectNewWord();
};

function setupBoxes() {
  const correctRow = document.getElementById("correctRow");
  const wrongRow = document.getElementById("wrongRow");

  correctRow.innerHTML = "";
  wrongRow.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const box = document.createElement("div");
    box.className = "box";
    correctRow.appendChild(box);
  }

  for (let i = 0; i < 8; i++) {
    const box = document.createElement("div");
    box.className = "box";
    wrongRow.appendChild(box);
  }

  document.getElementById("errorCount").textContent = "0";
  document.getElementById("wordInput").value = "";
  document.getElementById("wordInput").disabled = false;
  document.getElementById("startBtn").textContent = "Start Game";
  document.getElementById("startBtn").disabled = false;

  errorCount = 0;
  wrongIndex = 0;
  gameEnded = false;
}

function selectNewWord() {
  selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  console.log("کلمه انتخاب‌شده:", selectedWord);
}

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      return true;
    } catch (err) {
      console.error("اتصال به والت ناموفق بود:", err);
      return false;
    }
  } else {
    alert("🦊 لطفاً MetaMask یا والت مشابه نصب کنید.");
    return false;
  }
}

async function sendZTC() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: ethers.utils.parseEther(tokenAmount)
    });

    alert("📤 تراکنش ارسال شد. منتظر تأیید...");
    await tx.wait();
    alert(`✅ ${tokenAmount} ZTC با موفقیت ارسال شد به ${recipientAddress}`);
    return true;
  } catch (err) {
    console.error("❌ خطا در ارسال تراکنش:", err);
    alert("❌ تراکنش ناموفق بود.");
    return false;
  }
}

document.getElementById("startBtn").addEventListener("click", async () => {
  const inputEl = document.getElementById("wordInput");

  if (gameEnded) {
    setupBoxes();
    selectNewWord();
    return;
  }

  const input = inputEl.value.toUpperCase();
  const correctBoxes = document.querySelectorAll("#correctRow .box");
  const wrongBoxes = document.querySelectorAll("#wrongRow .box");
  const errorDisplay = document.getElementById("errorCount");

  if (!/^[A-Z]$/.test(input)) {
    alert("فقط یک حرف انگلیسی وارد کن.");
    inputEl.value = "";
    return;
  }

  // بررسی اتصال والت
  if (!walletAddress) {
    const connected = await connectWallet();
    if (!connected) return;
  }

  // ارسال توکن ZTC
  const success = await sendZTC();
  if (!success) return;

  // بررسی حرف واردشده در کل کلمه
  let found = false;
  for (let i = 0; i < selectedWord.length; i++) {
    if (selectedWord[i] === input && correctBoxes[i].textContent === "") {
      correctBoxes[i].textContent = input;
      correctBoxes[i].style.color = "green";
      found = true;
    }
  }

  if (!found) {
    if (wrongIndex < wrongBoxes.length) {
      wrongBoxes[wrongIndex].textContent = input;
      wrongBoxes[wrongIndex].style.color = "red";
      wrongIndex++;
      errorCount++;
      errorDisplay.textContent = errorCount;
    }
  }

  inputEl.value = "";

  const currentCorrect = Array.from(correctBoxes).map(box => box.textContent).join("");
  if (currentCorrect === selectedWord) {
    alert("🎉 آفرین! کلمه رو کامل حدس زدی.");
    endGame();
  } else if (errorCount >= 8) {
    alert(`❌ باختی! کلمه درست بود: ${selectedWord}`);
    endGame();
  }
});

function endGame() {
  document.getElementById("wordInput").disabled = true;
  document.getElementById("startBtn").textContent = "شروع دوباره";
  gameEnded = true;
}
