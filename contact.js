const feedbackForm = document.getElementById('feedbackForm');
        const feedbackFields = {
            feedbackName: document.getElementById('feedbackName'),
            feedbackEmail: document.getElementById('feedbackEmail'),
            feedbackType: document.getElementById('feedbackType'),
            feedbackMessage: document.getElementById('feedbackMessage')
        };

        function validateFeedbackField(id, value) {
            const errorNode = document.querySelector(`[data-error-for="${id}"]`);
            let message = '';

            if (id === 'feedbackName' && value.trim().length < 2) {
                message = 'Please enter your name.';
            }
            if (id === 'feedbackEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = 'Please enter a valid email.';
            }
            if (id === 'feedbackType' && !value) {
                message = 'Choose a feedback type.';
            }
            if (id === 'feedbackMessage' && value.trim().length < 10) {
                message = 'Please enter a message with at least 10 characters.';
            }

            errorNode.textContent = message;
            feedbackFields[id].classList.toggle('is-valid', !message && value.trim() !== '');
            feedbackFields[id].classList.toggle('is-invalid', Boolean(message));
            feedbackFields[id].classList.toggle('invalid', Boolean(message));
            return !message;
        }

        Object.keys(feedbackFields).forEach((key) => {
            feedbackFields[key].addEventListener('input', () => validateFeedbackField(key, feedbackFields[key].value));
            feedbackFields[key].addEventListener('change', () => validateFeedbackField(key, feedbackFields[key].value));
        });

        feedbackForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const valid = Object.keys(feedbackFields).every((key) => validateFeedbackField(key, feedbackFields[key].value));
            if (!valid) return;
            const fullName = feedbackFields.feedbackName.value.trim();
            document.getElementById('formStatus').textContent = 'Thank you. Your feedback has been recorded.';
            feedbackForm.reset();
        });
