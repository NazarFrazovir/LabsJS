const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form");
const successMessage = document.getElementById("successMessage");

const countries = {
  Україна: ['Київ', 'Львів', 'Одеса'],
  Польща: ['Варшава', 'Краків', 'Гданськ']
};

// === Перемикання табів ===
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
    successMessage.textContent = '';
  });
});

// === Показати/приховати пароль ===
document.querySelectorAll('.toggle').forEach(icon => {
  icon.addEventListener('click', () => {
    const input = icon.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// === Динамічне оновлення міст ===
const countrySelect = document.querySelector('[name="country"]');
const citySelect = document.querySelector('[name="city"]');

Object.keys(countries).forEach(country => {
  const opt = document.createElement("option");
  opt.value = country;
  opt.textContent = country;
  countrySelect.appendChild(opt);
});

countrySelect.addEventListener("change", () => {
  citySelect.innerHTML = '';
  if (countrySelect.value) {
    countries[countrySelect.value].forEach(city => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
    citySelect.disabled = false;
  } else {
    citySelect.disabled = true;
  }
});

// === Валідація реєстраційної форми ===
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  let valid = true;

  const setError = (input, msg) => {
    const group = input.parentElement;
    group.classList.add('error');
    group.classList.remove('success');
    group.querySelector("small").textContent = msg;
  };

  const setSuccess = input => {
    const group = input.parentElement;
    group.classList.remove('error');
    group.classList.add('success');
    group.querySelector("small").textContent = '';
  };

  const checkLength = (input, min, max) => {
    if (input.value.length < min || input.value.length > max) {
      setError(input, `Має бути від ${min} до ${max} символів`);
      return false;
    }
    setSuccess(input);
    return true;
  };

  const checkEmail = input => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(input.value)) {
      setError(input, "Некоректний email");
      return false;
    }
    setSuccess(input);
    return true;
  };

  const checkPasswordMatch = () => {
    const pass = form.password;
    const conf = form.confirmPassword;
    if (pass.value !== conf.value) {
      setError(conf, "Паролі не збігаються");
      return false;
    }
    setSuccess(conf);
    return true;
  };

  const checkPhone = input => {
    const re = /^\+380\d{9}$/;
    if (!re.test(input.value)) {
      setError(input, "Невірний формат телефону");
      return false;
    }
    setSuccess(input);
    return true;
  };

  const checkDOB = input => {
    const date = new Date(input.value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (date > today) {
      setError(input, "Дата народження не може бути у майбутньому");
      return false;
    } else if (age < 12) {
      setError(input, "Вам має бути не менше 12 років");
      return false;
    }
    setSuccess(input);
    return true;
  };

  const inputs = form.querySelectorAll("input, select");
  inputs.forEach(input => input.parentElement.classList.remove("error"));

  valid &= checkLength(form.firstName, 3, 15);
  valid &= checkLength(form.lastName, 3, 15);
  valid &= checkEmail(form.email);
  valid &= checkLength(form.password, 6, 50);
  valid &= checkPasswordMatch();
  valid &= checkPhone(form.phone);
  valid &= checkDOB(form.dob);
  valid &= form.sex.value ? (setSuccess(form.sex), true) : (setError(form.sex, "Оберіть стать"), false);
  valid &= form.country.value ? (setSuccess(form.country), true) : (setError(form.country, "Оберіть країну"), false);
  valid &= form.city.value ? (setSuccess(form.city), true) : (setError(form.city, "Оберіть місто"), false);

  if (valid) {
    successMessage.textContent = "Успішна реєстрація!";
    form.reset();
    inputs.forEach(i => i.parentElement.classList.remove("success"));
    citySelect.disabled = true;
  }
});

// === Валідація авторизації ===
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const username = form.username;
  const pass = form.loginPassword;
  let valid = true;

  if (!username.value.trim()) {
    username.parentElement.classList.add('error');
    valid = false;
  } else {
    username.parentElement.classList.remove('error');
  }

  if (pass.value.length < 6) {
    pass.parentElement.classList.add('error');
    valid = false;
  } else {
    pass.parentElement.classList.remove('error');
  }

  if (valid) {
    successMessage.textContent = "Успішна авторизація!";
    form.reset();
  }
});

