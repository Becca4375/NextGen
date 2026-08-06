 const form = document.getElementById('studentForm');
        const startBtn = document.getElementById('startBtn');
        const fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            studentId: document.getElementById('studentId'),
            field: document.getElementById('field'),
            interest: document.getElementById('interest')
        };

        function validateField(id, value) {
            const errorNode = document.querySelector(`[data-error-for="${id}"]`);
            let message = '';

            if (id === 'name' && value.trim().length < 2) {
                message = 'Please enter your full name.';
            }
            if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = 'Please enter a valid email address.';
            }
            if (id === 'studentId' && value.trim().length < 4) {
                message = 'Student ID is required.';
            }
            if (id === 'field' && !value) {
                message = 'Please select your field.';
            }
            if (id === 'interest' && value.trim().length < 3) {
                message = 'Please tell us your main interest.';
            }

            errorNode.textContent = message;
            fields[id].classList.toggle('invalid', Boolean(message));
            return !message;
        }

        function checkFormValidity() {
            const isValid = Object.keys(fields).every((key) => validateField(key, fields[key].value));
            startBtn.disabled = !isValid;
            return isValid;
        }

        Object.keys(fields).forEach((key) => {
            fields[key].addEventListener('input', () => {
                validateField(key, fields[key].value);
                checkFormValidity();
            });
            fields[key].addEventListener('change', () => {
                validateField(key, fields[key].value);
                checkFormValidity();
            });
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!checkFormValidity()) return;

            const profile = {
                name: fields.name.value.trim(),
                email: fields.email.value.trim(),
                studentId: fields.studentId.value.trim(),
                field: fields.field.value,
                interest: fields.interest.value.trim()
            };

            localStorage.setItem('studentProfile', JSON.stringify(profile));
            window.location.href = 'gcgo.html';
        });

const interestInput = document.getElementById('interest');
const startBtn = document.getElementById('startBtn');

interestInput.addEventListener('input', () => {
  // Enables the button when the user types something
  if (interestInput.value.trim() !== '') {
    startBtn.disabled = false;
  } else {
    startBtn.disabled = true;
  }
});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  // Toggles the visibility of the nav links
  navLinks.classList.toggle('active');
});

// Optional: Close menu when a link inside is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});