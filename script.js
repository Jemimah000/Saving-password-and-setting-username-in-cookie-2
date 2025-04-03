const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById("pin");
const sha256HashView = document.getElementById("sha256-hash");
const resultView = document.getElementById("result");

// Store data in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve data from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clear local storage (for debugging)
function clearStorage() {
  localStorage.clear();
}

// Generate SHA256 hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate or retrieve the SHA256 hash of a random 3-digit number
async function getSHA256Hash() {
  let storedHash = retrieve("sha256");
  if (storedHash) {
    return storedHash;
  }

  const randomNum = getRandomNumber(MIN, MAX).toString();
  const hash = await sha256(randomNum);

  store("sha256", hash);
  store("originalNumber", randomNum); // Debugging: Store the original number
  return hash;
}

// Display the SHA256 hash on the page
async function main() {
  sha256HashView.innerHTML = "Generating...";
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Check if the entered number matches the generated SHA256 hash
async function checkHash() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = "💡 Please enter a 3-digit number!";
    resultView.classList.remove("hidden");
    return;
  }

  const userHash = await sha256(pin);
  const storedHash = sha256HashView.innerHTML;

  if (userHash === storedHash) {
    resultView.innerHTML = "🎉 Success! You cracked the hash!";
    resultView.style.backgroundColor = "#28a745"; // Green for success
  } else {
    resultView.innerHTML = "❌ Incorrect guess. Try again!";
    resultView.style.backgroundColor = "#dc3545"; // Red for failure
  }
  resultView.classList.remove("hidden");
}

// Ensure only numbers are entered in the input field
pinInput.addEventListener("input", (e) => {
  pinInput.value = e.target.value.replace(/\D/g, "").slice(0, 3);
});

// Attach event listener to the "Check" button
document.getElementById("check").addEventListener("click", checkHash);

// Run the main function on page load
main();
