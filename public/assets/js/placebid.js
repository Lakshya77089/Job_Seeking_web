const bidinput = document.getElementById('bidamount-input');
const daysinput = document.getElementById('days-input');

bidinput.addEventListener('input', function() {
  if (this.value < 0) {
    this.value = 0;
  }
});

daysinput.addEventListener('input', function() {
  if (this.value < 0) {
    this.value = 0;
  }
});

const paidAmountElement = document.getElementById('paid-amount');
const feeAmountElement = document.getElementById('fee-amount');
const levyAmountElement = document.getElementById('levy-amount');
const netAmountElement = document.getElementById('net-amount-value');

function updateValues() {
  const bidAmount = parseFloat(bidinput.value);
  const days = parseFloat(daysinput.value);

  if (!isNaN(bidAmount) && !isNaN(days) && bidAmount > 0 && days > 0) { // check if bidAmount and days are valid numbers and greater than 0
    const fee = bidAmount * 0.02; 
    const levy = bidAmount * 0.03; // assuming a fixed levy of $20
    const netAmount = bidAmount - fee - levy; // Calculate the net amount

    paidAmountElement.textContent = `$${bidAmount.toFixed(2)}`;
    feeAmountElement.textContent = `$${fee.toFixed(2)}`;
    levyAmountElement.textContent = `$${levy.toFixed(2)}`;
    netAmountElement.textContent = `$${netAmount.toFixed(2)}`;
  } else {
    // Reset the values to zero if the input is invalid or empty
    paidAmountElement.textContent = `$0.00`;
    feeAmountElement.textContent = `$0.00`;
    levyAmountElement.textContent = `$0.00`;
    netAmountElement.textContent = `$0.00`;
  }
}

// Call the updateValues function when the page loads
updateValues();

// Call the updateValues function when the user types something in the "Bid Amount" input box
bidinput.addEventListener('input', updateValues);

// Also call the updateValues function when the user types something in the "Days" input box
daysinput.addEventListener('input', updateValues); 