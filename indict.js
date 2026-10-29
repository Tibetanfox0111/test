document.addEventListener('DOMContentLoaded', () => {
    // 集計結果ボタンの生成と配置
    const resultBtn = document.createElement('button');
    resultBtn.id = 'show-results-btn';
    resultBtn.textContent = '訴状を見る';

    // ボタンのスタイル設定（画面左上に固定表示）
    Object.assign(resultBtn.style, {
        position: 'fixed',
        top: '15px',
        left: '15px',
        padding: '8px 16px',
        backgroundColor: '#2c3e50',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: '1000',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });

    document.body.appendChild(resultBtn);

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
    passwordModal.addEventListener('click', (event) => {
        if (event.target === passwordModal) closePasswordModal();
    });
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
        const submissionCompleteModal = document.getElementById('submission-complete-modal');
        let pendingAnswers = null;

        const closeSubmitConfirm = () => {
            submitConfirmModal.hidden = true;
            pendingAnswers = null;
        };

        const saveSubmission = () => {
            const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            submissions.push({
                submittedAt: new Date().toISOString(),
                answers: pendingAnswers
            });
            localStorage.setItem('submissions', JSON.stringify(submissions));
            closeSubmitConfirm();
            surveyForm.reset();
            q6OtherContainer?.style.setProperty('display', 'none');
            q9OtherContainer?.style.setProperty('display', 'none');
            if (q6OtherInput) q6OtherInput.required = false;
            if (q9OtherInput) q9OtherInput.required = false;
            requiredCheckboxGroups.flat().forEach((checkbox) => {
                checkbox.dispatchEvent(new Event('change'));
            });
            submissionCompleteModal.hidden = false;
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
            submitConfirmModal.hidden = false;
        });

        submitCancel.addEventListener('click', closeSubmitConfirm);
        submitConfirm.addEventListener('click', saveSubmission);
        submitConfirmModal.addEventListener('click', (event) => {
            if (event.target === submitConfirmModal) closeSubmitConfirm();
        });

        document.getElementById('submission-complete-close').addEventListener('click', () => {
            submissionCompleteModal.hidden = true;
        });
        document.getElementById('page-close').addEventListener('click', () => {
            submissionCompleteModal.hidden = true;
            document.querySelector('.survey-container').hidden = true;
            resultBtn.hidden = true;
            window.close();
        });
    }
});