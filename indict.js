document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const surveyContainer = document.getElementById('survey-container');
    const startSurveyBtn = document.getElementById('start-survey-btn');
    const resultBtn = document.getElementById('show-results-btn');
    const backgroundMusic = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    let musicEnabled = true;
    let musicRetryTimer = null;
    let musicStartTimer = null;
    let scrollAnimationFrame = null;
    backgroundMusic.volume = 1;
    backgroundMusic.loop = true;

    const playMusic = () => {
        if (!musicEnabled || !backgroundMusic.paused) return Promise.resolve(true);
        return backgroundMusic.play()
            .then(() => {
                window.clearInterval(musicRetryTimer);
                musicRetryTimer = null;
                return true;
            })
            .catch(() => false);
    };

    const retryMusic = () => {
        if (musicEnabled) {
            playMusic();
        }
    };

    const smoothScrollToTop = () => {
        if (scrollAnimationFrame !== null) {
            window.cancelAnimationFrame(scrollAnimationFrame);
        }

        const startY = window.scrollY;
        const duration = 900;
        const startTime = performance.now();
        const easeInOut = (progress) => progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const animate = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            window.scrollTo({ top: startY * (1 - easeInOut(progress)), behavior: 'auto' });
            if (progress < 1) {
                scrollAnimationFrame = window.requestAnimationFrame(animate);
            } else {
                scrollAnimationFrame = null;
            }
        };

        scrollAnimationFrame = window.requestAnimationFrame(animate);
    };

    const scheduleHomeMusic = () => {
        window.clearTimeout(musicStartTimer);
        window.clearInterval(musicRetryTimer);
        musicStartTimer = window.setTimeout(() => {
            retryMusic();
            musicRetryTimer = window.setInterval(() => {
                retryMusic();
            }, 500);
            window.setTimeout(() => {
                window.clearInterval(musicRetryTimer);
                musicRetryTimer = null;
            }, 10000);
        }, 2000);
    };

    const updateMusicButton = () => {
        musicToggleBtn.textContent = musicEnabled ? 'BGM OFF' : 'BGM ON';
        musicToggleBtn.setAttribute('aria-pressed', String(!musicEnabled));
    };

    musicToggleBtn.addEventListener('click', () => {
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            playMusic();
        } else {
            window.clearTimeout(musicStartTimer);
            window.clearInterval(musicRetryTimer);
            backgroundMusic.pause();
        }
        updateMusicButton();
    });

    ['pointerdown', 'keydown'].forEach((eventName) => {
        document.addEventListener(eventName, () => {
            retryMusic();
        }, { passive: true });
    });

    backgroundMusic.addEventListener('ended', retryMusic);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) retryMusic();
    });
    backgroundMusic.addEventListener('canplay', () => {
        if (musicEnabled) scheduleHomeMusic();
    });
    scheduleHomeMusic();

    startSurveyBtn.addEventListener('click', () => {
        retryMusic();
        homeScreen.hidden = true;
        surveyContainer.hidden = false;
        document.body.classList.add('survey-mode');
        smoothScrollToTop();
    });

    // パスワード認証処理
    const passwordModal = document.getElementById('password-modal');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('result-password');
    const passwordError = document.getElementById('password-error');
    const closePasswordModal = () => {
        passwordModal.hidden = true;
        passwordForm.reset();
        passwordError.textContent = '';
    };

    resultBtn.addEventListener('click', () => {
        passwordModal.hidden = false;
        passwordInput.focus();
    });
    document.querySelector('.password-dialog-close').addEventListener('click', closePasswordModal);
    document.getElementById('password-cancel').addEventListener('click', closePasswordModal);
    passwordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const savedPassword = localStorage.getItem('surveyPassword') || '1234';
        if (passwordInput.value !== savedPassword) {
            passwordError.textContent = 'パスワードが正しくありません。';
            passwordInput.select();
            return;
        }
        window.location.href = 'about.html';
    });

    // 質問6「その他」の入力欄の表示切り替え
    const q6OtherCheckbox = document.getElementById('q6-other-checkbox');
    const q6OtherContainer = document.getElementById('q6-other-container');
    const q6OtherInput = document.getElementById('q6_other');
    if (q6OtherCheckbox && q6OtherContainer) {
        q6OtherCheckbox.addEventListener('change', () => {
            q6OtherContainer.style.display = q6OtherCheckbox.checked ? 'block' : 'none';
            q6OtherInput.required = q6OtherCheckbox.checked;
        });
    }

    // 質問9「その他」の入力欄の表示切り替え
    const q9OtherCheckbox = document.getElementById('q9-other-checkbox');
    const q9OtherContainer = document.getElementById('q9-other-container');
    const q9OtherInput = document.getElementById('q9_other');
    if (q9OtherCheckbox && q9OtherContainer) {
        q9OtherCheckbox.addEventListener('change', () => {
            q9OtherContainer.style.display = q9OtherCheckbox.checked ? 'block' : 'none';
            q9OtherInput.required = q9OtherCheckbox.checked;
        });
    }

    // 質問6・9は、選択肢のいずれか1つ以上の選択を必須にする
    const surveyForm = document.getElementById('survey-form');
    const requiredCheckboxGroups = [
        surveyForm?.querySelectorAll('input[name="type"]'),
        surveyForm?.querySelectorAll('input[name="situation"]')
    ].filter(Boolean);

    requiredCheckboxGroups.forEach((checkboxes) => {
        const updateValidity = () => {
            const message = Array.from(checkboxes).some((checkbox) => checkbox.checked)
                ? ''
                : 'いずれかを選択してください。';
            checkboxes.forEach((checkbox) => checkbox.setCustomValidity(message));
        };

        checkboxes.forEach((checkbox) => checkbox.addEventListener('change', updateValidity));
        updateValidity();
    });

    if (surveyForm) {
        const submitConfirmModal = document.getElementById('submit-confirm-modal');
        const submitCancel = document.getElementById('submit-cancel');
        const submitConfirm = document.getElementById('submit-confirm');
        const submitError = document.getElementById('submit-error');
        const submitConfirmTitle = document.getElementById('submit-confirm-title');
        const submitConfirmMessage = document.getElementById('submit-confirm-message');
        const submitLoading = document.getElementById('submit-loading');
        const submitComplete = document.getElementById('submit-complete');
        const pageClose = document.getElementById('page-close');
        let pendingAnswers = null;

        const closeSubmitConfirm = () => {
            submitConfirmModal.hidden = true;
            submitConfirmTitle.textContent = '投函確認';
            submitConfirmMessage.hidden = false;
            submitLoading.hidden = true;
            submitError.textContent = '';
            submitCancel.hidden = false;
            submitConfirm.hidden = false;
            submitComplete.hidden = true;
            pendingAnswers = null;
        };

        const returnToHome = () => {
            closeSubmitConfirm();
            surveyContainer.hidden = true;
            homeScreen.hidden = false;
            document.body.classList.remove('survey-mode');
            scheduleHomeMusic();
            smoothScrollToTop();
        };

        const saveSubmission = () => {
            if (!pendingAnswers) return;

            submitConfirmTitle.textContent = '投函中';
            submitConfirmMessage.hidden = true;
            submitLoading.hidden = false;
            submitError.textContent = '';
            submitCancel.hidden = true;
            submitConfirm.hidden = true;

            try {
                const storedSubmissions = localStorage.getItem('submissions');
                const submissions = storedSubmissions ? JSON.parse(storedSubmissions) : [];
                if (!Array.isArray(submissions)) {
                    throw new Error('保存済みの投函データが配列ではありません。');
                }
                submissions.push({
                    submittedAt: new Date().toISOString(),
                    answers: pendingAnswers
                });
                localStorage.setItem('submissions', JSON.stringify(submissions));
            } catch (error) {
                console.error('投函データの保存に失敗しました。', error);
                submitConfirmTitle.textContent = '投函確認';
                submitConfirmMessage.hidden = false;
                submitLoading.hidden = true;
                submitError.textContent = '投函データの保存に失敗しました。もう一度お試しください。';
                submitCancel.hidden = false;
                submitConfirm.hidden = false;
                return;
            }

            surveyForm.reset();
            q6OtherContainer?.style.setProperty('display', 'none');
            q9OtherContainer?.style.setProperty('display', 'none');
            if (q6OtherInput) q6OtherInput.required = false;
            if (q9OtherInput) q9OtherInput.required = false;
            requiredCheckboxGroups.flatMap((checkboxes) => Array.from(checkboxes)).forEach((checkbox) => {
                checkbox.dispatchEvent(new Event('change'));
            });
            window.setTimeout(() => {
                submitConfirmTitle.hidden = true;
                submitLoading.hidden = true;
                submitComplete.hidden = false;
                pageClose.focus();
            }, 450);
        };

        surveyForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(surveyForm);
            const answers = {};
            for (const [name, value] of formData.entries()) {
                if (name === 'type' || name === 'situation') {
                    answers[name] = answers[name] || [];
                    answers[name].push(value);
                } else {
                    answers[name] = value;
                }
            }

            pendingAnswers = answers;
            submitError.textContent = '';
            submitConfirmTitle.hidden = false;
            submitConfirmModal.hidden = false;
        });

        submitCancel.addEventListener('click', closeSubmitConfirm);
        submitConfirm.addEventListener('click', saveSubmission);

        pageClose.addEventListener('click', () => {
            returnToHome();
        });
    }
});