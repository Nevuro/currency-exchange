const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");
const amountInput = document.querySelector("#amount");
const exchangeRateTxt = document.querySelector("#exchange-rate");
const swapBtn = document.querySelector("#swap-btn");
const fromFlag = document.querySelector("#from-flag");
const toFlag = document.querySelector("#to-flag");

// Cache for exchange rates
let rateCache = {};

// Helper function to format numbers with commas (e.g., 1234567.89 -> 1,234,567.89)
function formatNumberWithCommas(num) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
  }).format(num);
}

// Populate dropdown options
for (let currencyCode in countryList) {
  let selectedFrom = currencyCode === "USD" ? "selected" : "";
  let selectedTo = currencyCode === "EGP" ? "selected" : "";

  let optionTagFrom = `<option value="${currencyCode}" ${selectedFrom}>${currencyCode}</option>`;
  let optionTagTo = `<option value="${currencyCode}" ${selectedTo}>${currencyCode}</option>`;

  fromCurrency.insertAdjacentHTML("beforeend", optionTagFrom);
  toCurrency.insertAdjacentHTML("beforeend", optionTagTo);
}

// Update flag based on selected currency
function updateFlag(element, flagImg) {
  const code = element.value;
  const countryCode = countryList[code];
  flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch exchange rates with caching
async function fetchRates(baseCurrency) {
  if (rateCache[baseCurrency]) {
    return rateCache[baseCurrency];
  }

  try {
    const url = `https://open.er-api.com/v6/latest/${baseCurrency}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.result === "success") {
      rateCache[baseCurrency] = result.rates;
      return result.rates;
    } else {
      throw new Error("API error");
    }
  } catch (error) {
    exchangeRateTxt.innerText = "Network Error. Please try again.";
    return null;
  }
}

// Perform instant calculation with comma formatting
async function calculateExchange() {
  let rawAmount = amountInput.value.replace(/,/g, ''); // strip commas for calculation
  let amountVal = parseFloat(rawAmount);

  if (isNaN(amountVal) || amountVal <= 0) {
    exchangeRateTxt.innerText = "Please enter a valid amount.";
    return;
  }

  const baseCurrency = fromCurrency.value;
  const targetCurrency = toCurrency.value;

  const rates = await fetchRates(baseCurrency);
  if (rates && rates[targetCurrency]) {
    let rate = rates[targetCurrency];
    let totalExRate = amountVal * rate;
    
    // Format both input and output values with commas
    let formattedAmount = formatNumberWithCommas(amountVal);
    let formattedTotal = formatNumberWithCommas(totalExRate);

    exchangeRateTxt.innerText = `${formattedAmount} ${baseCurrency} = ${formattedTotal} ${targetCurrency}`;
  }
}

// --- Instant Event Listeners ---

amountInput.addEventListener("input", calculateExchange);

fromCurrency.addEventListener("change", (e) => {
  updateFlag(e.target, fromFlag);
  calculateExchange();
});

toCurrency.addEventListener("change", (e) => {
  updateFlag(e.target, toFlag);
  calculateExchange();
});

swapBtn.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;

  updateFlag(fromCurrency, fromFlag);
  updateFlag(toCurrency, toFlag);
  calculateExchange();
});

window.addEventListener("load", calculateExchange);
