document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const surveyContainer = document.getElementById('survey-container');
    const startSurveyBtn = document.getElementById('start-survey-btn');
    const resultBtn = document.getElementById('show-results-btn');
    const backgroundMusic = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const languageSelect = document.getElementById('language-select');
    let musicEnabled = true;
    let musicRetryTimer = null;
    let musicStartTimer = null;
    let scrollAnimationFrame = null;
    backgroundMusic.volume = 1;
    backgroundMusic.loop = true;

    const speechLanguageMap = {
        ja: 'ja-JP',
        en: 'en-US',
        de: 'de-DE',
        fr: 'fr-FR',
        zh: 'zh-CN',
        vi: 'vi-VN',
        th: 'th-TH',
        it: 'it-IT',
        es: 'es-ES',
        hi: 'hi-IN',
        ru: 'ru-RU',
        pt: 'pt-BR'
    };
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceFields = surveyContainer?.querySelectorAll('input[type="text"], textarea') || [];
    let activeRecognition = null;
    let selectedSpeechLanguage = languageSelect?.value || 'ja';

    const addVoiceInput = (field) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'voice-input-wrapper';
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'voice-input-btn';
        button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21H8v2h8v-2h-3v-3.08A7 7 0 0 0 19 11h-2Z"/></svg>';
        button.setAttribute('aria-label', '音声入力');
        button.title = '音声入力';
        wrapper.appendChild(button);

        if (!SpeechRecognition) {
            button.disabled = true;
            button.title = 'このブラウザーは音声入力に対応していません';
            return;
        }

        button.addEventListener('click', () => {
            if (activeRecognition) {
                activeRecognition.stop();
                activeRecognition = null;
                button.classList.remove('is-listening');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = speechLanguageMap[selectedSpeechLanguage] || 'ja-JP';
            recognition.interimResults = false;
            recognition.continuous = false;
            activeRecognition = recognition;
            button.classList.add('is-listening');

            recognition.addEventListener('result', (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join('');
                const separator = field.value && !/\s$/.test(field.value) ? ' ' : '';
                field.value += `${separator}${transcript}`;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            });
            recognition.addEventListener('error', (event) => {
                if (event.error !== 'aborted') {
                    console.error('音声入力に失敗しました。', event.error);
                }
            });
            recognition.addEventListener('end', () => {
                button.classList.remove('is-listening');
                if (activeRecognition === recognition) activeRecognition = null;
            });
            recognition.start();
        });
    };

    voiceFields.forEach(addVoiceInput);
    languageSelect?.addEventListener('change', () => {
        selectedSpeechLanguage = languageSelect.value;
    });

    const draftStorageKey = 'surveyDraft';
    localStorage.removeItem(draftStorageKey);
    const saveDraft = () => {
        const draft = Array.from(surveyContainer?.querySelectorAll('input, textarea') || [])
            .filter((field) => field.name)
            .map((field) => ({
                name: field.name,
                type: field.type,
                value: field.value,
                checked: field.type === 'checkbox' ? field.checked : undefined
            }));
        try {
            localStorage.setItem(draftStorageKey, JSON.stringify(draft));
        } catch (error) {
            console.error('入力途中の内容を保存できませんでした。', error);
        }
    };
    const restoreDraft = () => {
        let draft;
        try {
            draft = JSON.parse(localStorage.getItem(draftStorageKey) || '[]');
        } catch (error) {
            console.error('入力途中の内容を読み込めませんでした。', error);
            return;
        }
        if (!Array.isArray(draft)) return;
        const fieldsByName = new Map();
        Array.from(surveyContainer?.querySelectorAll('input, textarea') || []).forEach((field) => {
            if (!field.name) return;
            const fields = fieldsByName.get(field.name) || [];
            fields.push(field);
            fieldsByName.set(field.name, fields);
        });
        draft.forEach((savedField) => {
            const field = fieldsByName.get(savedField.name)?.find((candidate) =>
                candidate.type === savedField.type && (candidate.type !== 'checkbox' || candidate.value === savedField.value)
            );
            if (!field) return;
            if (field.type === 'checkbox') {
                field.checked = Boolean(savedField.checked);
                field.dispatchEvent(new Event('change'));
            } else {
                field.value = savedField.value || '';
            }
        });
    };
    const clearDraft = () => {
        localStorage.removeItem(draftStorageKey);
    };

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
        restoreDraft();
        window.dispatchEvent(new Event('languagechange'));
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
        const backHomeBtn = document.getElementById('back-home-btn');
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
            if (activeRecognition) {
                activeRecognition.stop();
                activeRecognition = null;
            }
            saveDraft();
            closeSubmitConfirm();
            surveyContainer.hidden = true;
            homeScreen.hidden = false;
            document.body.classList.remove('survey-mode');
            scheduleHomeMusic();
            smoothScrollToTop();
        };

        backHomeBtn.addEventListener('click', returnToHome);

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
            clearDraft();
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