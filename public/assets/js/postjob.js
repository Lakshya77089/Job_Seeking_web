const salaryTypeSelect = document.getElementById('salary-type');
const fixedSalInput = document.getElementById('fixedsal');
const fromSalInput = document.getElementById('fromsal');
const toSalInput = document.getElementById('tosal');

salaryTypeSelect.addEventListener('change', () => {
  if (salaryTypeSelect.value === 'fixed') {
    fixedSalInput.style.display = 'block';
    fromSalInput.style.display = 'none';
    toSalInput.style.display = 'none';
  } else if (salaryTypeSelect.value === 'range') {
    fixedSalInput.style.display = 'none';
    fromSalInput.style.display = 'block';
    toSalInput.style.display = 'block';
  }
});

// Input validation for fixed salary
fixedSalInput.addEventListener('input', () => {
  if (fixedSalInput.value < 0) {
    fixedSalInput.value = 0; // Set value to 0 if less than 0
  }
});

// Input validation for range salary
fromSalInput.addEventListener('input', () => {
  if (fromSalInput.value < 0) {
    fromSalInput.value = 0; // Set value to 0 if less than 0
  }
});

toSalInput.addEventListener('input', () => {
  if (toSalInput.value < 0) {
    toSalInput.value = 0; // Set value to 0 if less than 0
  }
});