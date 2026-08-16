const questions = [
            { prompt: 'Which activity do you enjoy most?', media: '💡', options: [
                { text: 'Teaching others', value: { education: 5, women: 2 } },
                { text: 'Problem solving with technology', value: { innovation: 5, education: 2 } },
                { text: 'Community outreach', value: { health: 3, women: 3 } },
                { text: 'Designing impactful ideas', value: { climate: 3, innovation: 4 } }
            ] },
            { prompt: 'Which area on this impact map would you choose first?', media: '🌍', type: 'hotspot', options: [
                { text: 'Learning access', value: { education: 5 } },
                { text: 'Health awareness', value: { health: 5 } },
                { text: 'Environmental sustainability', value: { climate: 5 } },
                { text: 'Women leadership and mentorship', value: { women: 5 } }
            ] },
            { prompt: 'Listen to the short scenario. Which communication role feels most natural to you?', media: '🔊', type: 'audio', options: [
                { text: 'I explain ideas clearly to others', value: { education: 4, women: 3 } },
                { text: 'I prefer data and analytics', value: { innovation: 4, climate: 2 } },
                { text: 'I connect people and build trust', value: { women: 5, health: 2 } },
                { text: 'I present visually and creatively', value: { education: 3, climate: 2 } }
            ] },
            { prompt: 'Watch the project briefing, then choose how you would respond.', media: '🎬', type: 'video', options: [
                { text: 'Research the root cause', value: { innovation: 4, education: 2 } },
                { text: 'Create a practical community action', value: { health: 4, climate: 3 } },
                { text: 'Mobilize a support network', value: { women: 4, education: 2 } },
                { text: 'Build a digital solution', value: { innovation: 5 } }
            ] },
            { prompt: 'Which skill would you like to improve?', media: '📈', options: [
                { text: 'Leadership and mentoring', value: { women: 5, education: 3 } },
                { text: 'Public health awareness', value: { health: 5 } },
                { text: 'Sustainability planning', value: { climate: 5 } },
                { text: 'Coding and digital tools', value: { innovation: 5, education: 2 } }
            ] },
            { prompt: 'How do you prefer to work?', media: '🤝', options: [
                { text: 'Team-based projects', value: { women: 3, education: 2 } },
                { text: 'Independent research', value: { innovation: 4 } },
                { text: 'Community engagement', value: { health: 4, climate: 2 } },
                { text: 'Creative workshops', value: { education: 4, women: 2 } }
            ] },
            { prompt: 'Which outcome matters most to you?', media: '🏆', options: [
                { text: 'Improving access to learning', value: { education: 5 } },
                { text: 'Supporting health and wellbeing', value: { health: 5 } },
                { text: 'Reducing environmental harm', value: { climate: 5 } },
                { text: 'Empowering women and youth', value: { women: 5 } }
            ] },
            { prompt: 'How would you measure success?', media: '📊', options: [
                { text: 'More people gaining new skills', value: { education: 5 } },
                { text: 'Improved community health outcomes', value: { health: 5 } },
                { text: 'Less waste and greener behaviors', value: { climate: 5 } },
                { text: 'Stronger leadership and opportunities', value: { women: 5 } }
            ] },
            { prompt: 'Which project style feels right for you?', media: '🚀', options: [
                { text: 'A structured mentorship program', value: { women: 5, education: 2 } },
                { text: 'A practical health campaign', value: { health: 5 } },
                { text: 'A climate action initiative', value: { climate: 5 } },
                { text: 'A digital innovation project', value: { innovation: 5 } }
            ] }
        ];

        let currentIndex = 0;
        let selectedAnswers = Array(questions.length).fill(null);
        let timeLeft = 150;
        let timerId = null;
        let quizStarted = false;
        let quizLocked = false;

        const startScreen = document.getElementById('startScreen');
        const questionCard = document.getElementById('questionCard');
        const timerEl = document.getElementById('timer');
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const startQuizBtn = document.getElementById('startQuizBtn');
        const quizWarning = document.getElementById('quizWarning');
        const streakCount = document.getElementById('streakCount');
        const streakText = document.getElementById('streakText');
        const celebration = document.getElementById('celebration');

        function burstParticles() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            celebration.replaceChildren();
            Array.from({ length: 14 }, (_, index) => {
                const particle = document.createElement('i');
                particle.style.left = `${42 + (index % 5) * 4}%`;
                particle.style.top = '38%';
                particle.style.background = ['#8c1515', '#d9883d', '#2d8f8f', '#45634f'][index % 4];
                particle.style.setProperty('--x', `${(index % 7 - 3) * 24}px`);
                particle.style.setProperty('--y', `${-35 - (index % 4) * 24}px`);
                celebration.append(particle);
            });
            setTimeout(() => celebration.replaceChildren(), 800);
        }

        // Finds the leading goal in an answer so consecutive aligned answers can form a streak.
        function answerPillar(questionIndex) {
            const picked = selectedAnswers[questionIndex];
            if (picked === null) return null;
            const values = questions[questionIndex].options[picked].value;
            return Object.entries(values).sort((a, b) => b[1] - a[1])[0][0];
        }

        // Recalculates from all answered questions so navigating back never leaves a stale streak.
        function calculateStreak() {
            let pillar = null;
            let count = 0;
            let longest = 0;
            let longestPillar = null;
            selectedAnswers.forEach((answer, index) => {
                if (answer === null) return;
                const nextPillar = answerPillar(index);
                if (nextPillar === pillar) {
                    count += 1;
                } else {
                    pillar = nextPillar;
                    count = 1;
                }
                if (count > longest) {
                    longest = count;
                    longestPillar = pillar;
                }
            });
            return { count, pillar, longest, longestPillar };
        }

        // Updates the visual reward and makes the 10% score bonus transparent to the student.
        function updateStreak() {
            const streak = calculateStreak();
            streakCount.textContent = streak.count;
            if (!streak.count) {
                streakText.textContent = 'Choose answers to build your focus.';
            } else if (streak.count >= 3) {
                streakText.textContent = `${streak.pillar} focus unlocked - 10% score boost.`;
            } else {
                streakText.textContent = `${streak.pillar} focus - keep going for a boost.`;
            }
            document.querySelector('.streak-wrap').classList.toggle('is-active', streak.count >= 3);
            return streak;
        }

        function updateTimerDisplay() {
            const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
            const seconds = String(timeLeft % 60).padStart(2, '0');
            timerEl.textContent = `${minutes}:${seconds}`;
            document.querySelector('.timer-wrap').classList.toggle('is-urgent', timeLeft <= 30);
        }

        function stopTimer() {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            }
        }

        function startTimer() {
            if (timerId) return;

            timerId = setInterval(() => {
                timeLeft -= 1;
                updateTimerDisplay();

                if (timeLeft <= 0) {
                    stopTimer();
                    handleTimeout();
                }
            }, 1000);
        }

        function setWarning(message) {
            quizWarning.textContent = message;
            quizWarning.classList.toggle('visible', Boolean(message));
        }

        function updateProgress() {
            const answeredCount = selectedAnswers.filter((answer) => answer !== null).length;
            const percentage = quizStarted ? ((currentIndex + 1) / questions.length) * 100 : 0;
            progressText.textContent = `${Math.min(currentIndex + 1, questions.length)} / ${questions.length}`;
            progressBar.style.width = `${percentage}%`;
            prevBtn.style.visibility = currentIndex === 0 || !quizStarted ? 'hidden' : 'visible';
            nextBtn.textContent = currentIndex === questions.length - 1 ? 'Submit' : 'Next';
            nextBtn.disabled = !quizStarted;
            if (!quizStarted) {
                progressText.textContent = '0 / 9';
                progressBar.style.width = '0%';
            }
        }

        // Each media activity is generated locally so the assessment remains usable offline.
        function createScenarioAudio() {
            const rate = 8000, samples = 4800, bytes = new Uint8Array(44 + samples * 2), view = new DataView(bytes.buffer);
            const text = (offset, value) => [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
            text(0, 'RIFF'); view.setUint32(4, 36 + samples * 2, true); text(8, 'WAVEfmt '); view.setUint32(16, 16, true);
            view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, samples * 2, true);
            for (let index = 0; index < samples; index += 1) view.setInt16(44 + index * 2, Math.sin(index / rate * Math.PI * 880) * 7000 * (1 - index / samples), true);
            return `data:audio/wav;base64,${btoa(String.fromCharCode(...bytes))}`;
        }

        function mediaMarkup(question) {
            if (question.type === 'hotspot') return `<div class="hotspot-stage" role="group" aria-label="Choose an area on the impact map"><img src="images/hero-background.jpg" alt="Students collaborating in a community setting">${question.options.map((option, index) => `<button class="option-btn hotspot hotspot-${index}" type="button" data-index="${index}"><span>${index + 1}</span>${option.text}</button>`).join('')}<p>Select a numbered region on the image.</p></div>`;
            if (question.type === 'audio') return `<div class="media-player"><p>Scenario: a team needs someone to explain its plan clearly to community members.</p><audio class="scenario-audio" preload="metadata" src="${createScenarioAudio()}"></audio><div class="media-controls"><button type="button" data-audio-action="play">Play</button><button type="button" data-audio-action="pause">Pause</button><button type="button" data-audio-action="replay">Replay</button></div><small class="media-status" aria-live="polite">Ready to play.</small></div>`;
            if (question.type === 'video') return `<div class="video-scenario"><video class="scenario-video" muted playsinline poster="images/hero-background.jpg" aria-label="Project briefing video"></video><button type="button" class="video-start">Play briefing</button><p class="video-status" aria-live="polite">Play the briefing to unlock your answer choices.</p></div>`;
            return '';
        }

        function setupMedia(card, question) {
            if (question.type === 'audio') {
                const audio = card.querySelector('.scenario-audio'); const status = card.querySelector('.media-status');
                card.querySelectorAll('[data-audio-action]').forEach((button) => button.addEventListener('click', () => { const action = button.dataset.audioAction; if (action === 'replay') audio.currentTime = 0; action === 'pause' ? audio.pause() : audio.play(); }));
                audio.addEventListener('play', () => { status.textContent = 'Playing scenario.'; }); audio.addEventListener('pause', () => { if (!audio.ended) status.textContent = 'Paused.'; }); audio.addEventListener('ended', () => { status.textContent = 'Scenario finished. Choose your answer.'; });
            }
            if (question.type === 'video') {
                const video = card.querySelector('.scenario-video'), start = card.querySelector('.video-start'), status = card.querySelector('.video-status'), options = card.querySelector('.video-options');
                let released = false;
                const pauseAtPrompt = () => { if (released) return; released = true; video.pause(); options.classList.remove('is-locked'); status.textContent = 'Pause point: choose how you would respond.'; };
                video.addEventListener('timeupdate', () => { if (video.currentTime >= 1.8) pauseAtPrompt(); });
                // Record a short canvas animation into an HTML5 video, avoiding a remote media dependency.
                const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 360;
                const stream = canvas.captureStream?.(12);
                if (stream && window.MediaRecorder) {
                    const context = canvas.getContext('2d'); const chunks = [];
                    const drawFrame = () => { context.fillStyle = '#24372b'; context.fillRect(0, 0, 640, 360); context.fillStyle = '#f7f3ee'; context.font = 'bold 34px Georgia'; context.fillText('Community project briefing', 54, 145); context.fillStyle = '#e2b77d'; context.font = '22px sans-serif'; context.fillText('Listen. Learn. Build together.', 54, 198); };
                    const recorder = new MediaRecorder(stream); recorder.ondataavailable = (event) => chunks.push(event.data);
                    recorder.onstop = () => { video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })); start.disabled = false; status.textContent = 'Briefing ready to play.'; };
                    recorder.start(); const painter = setInterval(drawFrame, 80); setTimeout(() => { clearInterval(painter); recorder.stop(); }, 2500); start.disabled = true;
                }
                start.addEventListener('click', () => { start.hidden = true; status.textContent = 'Briefing playing…'; video.play().catch(() => {}); setTimeout(pauseAtPrompt, 1800); });
            }
        }

        function renderQuestion() {
            const question = questions[currentIndex];
            const selected = selectedAnswers[currentIndex];

            questionCard.classList.remove('swipe-left', 'swipe-right');
            questionCard.innerHTML = `
                <div class="question-media">${question.media}</div>
                <div class="question-meta">Question ${currentIndex + 1}</div>
                <h2>${question.prompt}</h2>
                ${mediaMarkup(question)}
                <div class="option-list ${question.type === 'video' ? 'video-options is-locked' : ''} ${question.options.some((option) => option.image) ? 'image-options' : ''}">
                    ${question.type === 'hotspot' ? '' : question.options.map((option, index) => `
                        <button class="option-btn ${selected === index ? 'selected' : ''}" type="button" data-index="${index}">
                            ${option.image ? `<img src="${option.image}" alt="" aria-hidden="true">` : ''}${option.text}
                        </button>
                    `).join('')}
                </div>
            `;

            setupMedia(questionCard, question);

            questionCard.querySelectorAll('.option-btn').forEach((button) => {
                button.addEventListener('click', () => {
                    if (quizLocked || button.disabled) return;
                    const optionIndex = Number(button.dataset.index);
                    selectedAnswers[currentIndex] = optionIndex;
                    updateStreak();
                    burstParticles();
                    setWarning('');
                    questionCard.classList.remove('swipe-left', 'swipe-right');
                    questionCard.classList.add('swipe-left');
                    button.classList.add('answer-picked');

                    setTimeout(() => {
                        if (currentIndex < questions.length - 1) {
                            currentIndex += 1;
                            renderQuestion();
                        } else {
                            submitQuiz();
                        }
                    }, 220);
                });
            });

            requestAnimationFrame(() => {
                questionCard.classList.add('card-in');
            });

            updateProgress();
        }

        function submitQuiz(timedOut = false) {
            const firstUnanswered = selectedAnswers.findIndex((answer) => answer === null);
            if (firstUnanswered !== -1 && !timedOut) {
                currentIndex = firstUnanswered;
                setWarning('Please answer all nine questions to unlock your results and analysis.');
                renderQuestion();
                return;
            }

            stopTimer();
            const scores = { education: 0, health: 0, climate: 0, women: 0, innovation: 0 };

            questions.forEach((question, index) => {
                const picked = selectedAnswers[index];
                if (picked === null) return;
                const optionValue = question.options[picked].value;

                Object.keys(scores).forEach((key) => {
                    scores[key] += optionValue[key] || 0;
                });
            });

            const streak = calculateStreak();
            if (streak.longest >= 3 && streak.longestPillar) {
                scores[streak.longestPillar] = Math.round(scores[streak.longestPillar] * 1.1);
            }

            const result = {
                title: 'Student Impact Match',
                profile: scores,
                topPillar: Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0],
                score: Math.max(...Object.values(scores)),
                streak: streak.longest,
                completed: true,
                timedOut,
                completedAt: new Date().toISOString()
            };

            localStorage.setItem('gcgoResult', JSON.stringify(result));
            // Results and analysis are intentionally one private post-quiz dashboard.
            window.location.href = 'results.html';
        }

        // Locks the assessment and records the answers available when the countdown ends.
        function handleTimeout() {
            quizLocked = true;
            questionCard.classList.add('is-timeout');
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            setWarning('Time is up. Your completed answers are being submitted.');
            setTimeout(() => submitQuiz(true), 700);
        }

        function startQuiz() {
            quizStarted = true;
            startScreen.hidden = true;
            questionCard.hidden = false;
            setWarning('');
            updateTimerDisplay();
            startTimer();
            renderQuestion();
        }

        prevBtn.addEventListener('click', () => {
            if (!quizStarted || quizLocked || currentIndex === 0) {
                return;
            }

            setWarning('');
            currentIndex -= 1;
            renderQuestion();
        });

        nextBtn.addEventListener('click', () => {
            if (!quizStarted || quizLocked) return;

            if (selectedAnswers[currentIndex] === null) {
                setWarning('Please select an answer before moving on.');
                return;
            }

            setWarning('');
            if (currentIndex < questions.length - 1) {
                questionCard.classList.remove('swipe-left', 'swipe-right');
                questionCard.classList.add('swipe-left');

                setTimeout(() => {
                    currentIndex += 1;
                    renderQuestion();
                }, 220);
            } else {
                submitQuiz();
            }
        });

        startQuizBtn.addEventListener('click', startQuiz);
        updateTimerDisplay();
        updateProgress();
        updateStreak();
