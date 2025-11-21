// ====== SELECT ELEMENTS ======
const drop = document.querySelectorAll(".options select");
const fromFlag = document.querySelector("#from-flag");
const toFlag = document.querySelector("#to-flag");
const button = document.querySelector("#exchange-button");
const fromcurr = document.querySelector("#from-currency");
const tocurr = document.querySelector("#to-currency");
const amountInput = document.querySelector("#amount-input");
const fresult = document.querySelector("#final-result");
// ====== FILL DROPDOWNS WITH CURRENCIES ======
for (let select of drop) {
  for (let curcode in countryList) {
    const newOptn = document.createElement("option");
    newOptn.value = curcode;
    newOptn.innerText = curcode;
    select.append(newOptn);
  }

  // default values (optional)
  if (select.id === "from-currency") {
    select.value = "USD";   // or "BDT" if you want
  }
  if (select.id === "to-currency") {
    select.value = "BDT";   // or "EUR" etc.
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ====== UPDATE FLAG WHEN CURRENCY CHANGES ======
const updateFlag = (element) => {
  const curcode = element.value;          // e.g. "USD"
  const countrycode = countryList[curcode];  // e.g. "US"
  const newsrc = `https://flagsapi.com/${countrycode}/shiny/64.png`;

  if (element.id === "from-currency") {
    fromFlag.src = newsrc;
  } else {
    toFlag.src = newsrc;
  }
};

// call once to sync flags with default selects
updateFlag(fromcurr);
updateFlag(tocurr);

// ====== HANDLE BUTTON CLICK (API CALL + CONVERSION) ======
button.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amountVal = parseFloat(amountInput.value);

  // basic validation
  if (!amountVal || amountVal <= 0) {
    amountVal = 1;
    amountInput.value = "1";
  }

  const from = fromcurr.value.toUpperCase(); // e.g. "USD"
  const to = tocurr.value.toUpperCase();     // e.g. "BDT"

  console.log("From:", from, "To:", to, "Amount:", amountVal);

  // FREE, NO-KEY API:
  const url = `https://open.er-api.com/v6/latest/${from}`;
  console.log("Fetching:", url);

  try {
    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data:", data);

    if (data.result !== "success") {
      throw new Error("API returned error: " + data["error-type"]);
    }

    const rate = data.rates[to]; // rate FROM -> TO
    if (!rate) {
      throw new Error(`No rate found for ${from} -> ${to}`);
    }

    const converted = amountVal * rate;

    console.log("Rate:", rate);
    fresult.innerText=`${amountVal} ${from} = ${converted} ${to}`;

    // Show to user (you can replace alert with innerText somewhere)
    
  } catch (err) {
    console.error(err);
    alert("Could not fetch exchange rate. Check console for details.");
  }
});
