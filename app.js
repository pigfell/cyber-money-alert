(() => {
  "use strict";
  const STORAGE_KEY = "cyber-money-alert-transactions-v1";
  const SETTINGS_KEY = "cyber-money-alert-settings-v1";
  const $ = (id) => document.getElementById(id);
  let transactions = loadTransactions();
  let currentFilter = "all";
  let toastTimer;

  function loadTransactions() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }
  function saveTransactions() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions.slice(0, 100))); }
    catch (_) { showToast("Không thể lưu dữ liệu trên thiết bị này."); }
  }
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); }
    catch (_) { return {}; }
  }
  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      autoSpeak: $("autoSpeak").checked,
      rate: Number($("speechRate").value)
    }));
  }
  function formatMoney(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  }
  function spellMoney(value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n) || n < 0) return "";
    try {
      return new Intl.NumberFormat("vi-VN", { style: "decimal", maximumFractionDigits: 0 }).format(n);
    } catch (_) { return String(n); }
  }
  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function speakText(text) {
    if (!("speechSynthesis" in window)) {
      showToast("Safari trên thiết bị này chưa hỗ trợ đọc văn bản.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = Number($("speechRate").value || 0.9);
    utterance.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const vietnamese = voices.find(v => /^vi(-|_)?vn$/i.test(v.lang)) ||
      voices.find(v => /^vi/i.test(v.lang));
    if (vietnamese) utterance.voice = vietnamese;
    utterance.onstart = () => { $("voiceStatus").textContent = vietnamese ? "Đã chọn giọng tiếng Việt có sẵn" : "Dùng giọng mặc định của iOS nếu có"; };
    utterance.onerror = () => showToast("Không phát được giọng đọc. Hãy thử lại.");
    window.speechSynthesis.speak(utterance);
  }
  function addDemoTransaction() {
    const amount = [50000, 150000, 500000, 1250000, 2500000, 5000000][Math.floor(Math.random() * 6)];
    const id = "DEMO-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    if (transactions.some(t => t.id === id)) return;
    const item = {
      id, amount, content: "GIAO DICH THU NGHIEM",
      createdAt: new Date().toISOString(), type: "incoming", demo: true
    };
    transactions.unshift(item);
    transactions = transactions.slice(0, 100);
    saveTransactions();
    render();
    if ($("autoSpeak").checked) {
      speakText("Cyber Money Alert. Bạn vừa nhận được " + spellMoney(amount) + " đồng.");
    }
    showToast("Đã tạo giao dịch thử " + formatMoney(amount));
  }
  function render() {
    const total = transactions.filter(t => t.type === "incoming").reduce((sum, t) => sum + Number(t.amount || 0), 0);
    $("totalAmount").innerHTML = `${new Intl.NumberFormat("vi-VN").format(total)} <small>₫</small>`;
    $("transactionCount").textContent = transactions.length;
    const shown = transactions.filter(t => currentFilter === "all" || t.type === "incoming");
    $("emptyState").style.display = shown.length ? "none" : "flex";
    $("transactionList").innerHTML = "";
    shown.forEach(t => {
      const row = document.createElement("div");
      row.className = "transaction";
      const icon = document.createElement("div");
      icon.className = "transaction-icon";
      icon.textContent = "↙";
      const main = document.createElement("div");
      main.className = "transaction-main";
      const title = document.createElement("div");
      title.className = "transaction-title";
      title.textContent = t.content || "Tiền vào";
      const meta = document.createElement("div");
      meta.className = "transaction-meta";
      const date = new Date(t.createdAt);
      meta.textContent = (Number.isNaN(date.getTime()) ? "" : date.toLocaleString("vi-VN")) + (t.demo ? " · GIAO DỊCH THỬ" : "");
      main.append(title, meta);
      const amount = document.createElement("div");
      amount.className = "transaction-amount";
      amount.textContent = "+" + formatMoney(Number(t.amount));
      row.append(icon, main, amount);
      $("transactionList").appendChild(row);
    });
  }
  function setupInstall() {
    let deferredPrompt = null;
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      deferredPrompt = event;
      $("installBtn").hidden = false;
    });
    $("installBtn").addEventListener("click", async () => {
      if (!deferredPrompt) {
        showToast("Trên iPhone: Safari → Chia sẻ → Thêm vào Màn hình chính.");
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      $("installBtn").hidden = true;
    });
  }
  function setupNotifications() {
    $("notifyBtn").addEventListener("click", async () => {
      if (!("Notification" in window)) {
        showToast("Trình duyệt không hỗ trợ thông báo web.");
        return;
      }
      const result = await Notification.requestPermission();
      $("notifyStatus").textContent = result === "granted" ? "Đã cấp quyền thông báo web" : "Chưa cấp quyền thông báo";
      showToast(result === "granted" ? "Đã bật thông báo cho web app." : "Bạn chưa cấp quyền thông báo.");
    });
  }
  function init() {
    const settings = loadSettings();
    if (typeof settings.autoSpeak === "boolean") $("autoSpeak").checked = settings.autoSpeak;
    if (settings.rate) $("speechRate").value = settings.rate;
    $("rateValue").textContent = Number($("speechRate").value).toFixed(2) + "×";
    $("testIncoming").addEventListener("click", addDemoTransaction);
    $("speakTest").addEventListener("click", () => speakText("Cyber Money Alert. Đây là giọng đọc thử. Bạn vừa nhận được hai triệu năm trăm nghìn đồng."));
    $("autoSpeak").addEventListener("change", saveSettings);
    $("speechRate").addEventListener("input", () => {
      $("rateValue").textContent = Number($("speechRate").value).toFixed(2) + "×";
      saveSettings();
    });
    $("clearHistory").addEventListener("click", () => {
      if (!transactions.length) return showToast("Lịch sử đang trống.");
      if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử giao dịch thử?")) {
        transactions = [];
        saveTransactions();
        render();
        showToast("Đã xóa lịch sử trên thiết bị.");
      }
    });
    document.querySelectorAll(".filter").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        render();
      });
    });
    setupInstall();
    setupNotifications();
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").catch(() => showToast("Không đăng ký được chế độ ngoại tuyến."));
    }
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    render();
  }
  document.addEventListener("DOMContentLoaded", init);
})();