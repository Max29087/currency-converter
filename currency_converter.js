const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Currency options populate
for (let select of dropdowns) {
    for (code in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = code;
        newOption.value = code;
        if (select.name === "from" && code === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && code === "BDT") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag image when currency changes
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// ✅ Using ExchangeRate-API
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amountVal = amount.value;

    if (amountVal === "" || amountVal <= 0) {
        amountVal = 1;
        amount.value = 1;
    }

    const API_KEY = "e885160b504b3fb562238c3b";
    const URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurr.value}`;

    try {
        let response = await fetch(URL);
        let data = await response.json();
        console.log("API Response:", data);

        if (data && data.result === "success") {
            let rate = data.conversion_rates[toCurr.value];
            let convertedAmount = (amountVal * rate).toFixed(2);
            document.querySelector(".msg").innerText =
                `${amountVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
        } else {
            document.querySelector(".msg").innerText = "Something went wrong. 😢";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        document.querySelector(".msg").innerText = "Something went wrong. 😢";
    }
});
