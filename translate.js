(() => {
    const languages = {
        en: 'English',
        de: 'Deutsch',
        fr: 'Français',
        zh: '中文',
        vi: 'Tiếng Việt',
        th: 'ไทย',
        it: 'Italiano',
        es: 'Español',
        hi: 'हिन्दी',
        ru: 'Русский',
        pt: 'Português'
    };
    const prompts = [
        ['あなたの学校名を教えてください。', 'What is your school name?', 'Wie heißt deine Schule?', 'Quel est le nom de votre école ?', '请填写学校名称。', 'Tên trường của bạn là gì?', 'โรงเรียนของคุณชื่ออะไร', 'Qual è il nome della tua scuola?', '¿Cuál es el nombre de tu escuela?', 'आपके विद्यालय का नाम क्या है?', 'Как называется ваша школа?', 'Qual é o nome da sua escola?'],
        ['あなたの学校がある都道府県と市町村を入力してください。', 'Enter the prefecture and municipality where your school is located.', 'Gib die Präfektur und Gemeinde deiner Schule ein.', 'Saisissez la préfecture et la commune de votre école.', '请输入学校所在的都道府县和市町村。', 'Nhập tỉnh và thành phố nơi trường của bạn tọa lạc.', 'กรอกจังหวัดและเทศบาลที่โรงเรียนของคุณตั้งอยู่', 'Inserisci la prefettura e il comune della tua scuola.', 'Introduce la prefectura y el municipio donde está tu escuela.', 'अपने विद्यालय का प्रान्त और नगर दर्ज करें।', 'Укажите префектуру и муниципалитет школы.', 'Digite a província e o município onde sua escola está localizada.'],
        ['あなたの学年を教えてください。', 'What grade are you in?', 'In welcher Klasse bist du?', 'Quelle est votre année scolaire ?', '请填写年级。', 'Bạn đang học lớp mấy?', 'คุณเรียนอยู่ชั้นปีที่เท่าไร', 'In che classe sei?', '¿En qué curso estás?', 'आप किस कक्षा में हैं?', 'В каком вы классе?', 'Em que série você está?'],
        ['あなたの組を教えてください。', 'What is your class group?', 'Welche Klasse/Gruppe hast du?', 'Quelle est votre classe ?', '请填写班级。', 'Bạn thuộc tổ nào?', 'คุณอยู่ห้องไหน', 'Qual è la tua sezione?', '¿Cuál es tu grupo?', 'आपका वर्ग कौन सा है?', 'Какой у вас класс?', 'Qual é a sua turma?'],
        ['あなたの出席番号を教えてください。', 'What is your attendance number?', 'Wie lautet deine Schülernummer?', 'Quel est votre numéro d’élève ?', '请填写学号。', 'Số thứ tự của bạn là bao nhiêu?', 'หมายเลขประจำตัวของคุณคืออะไร', 'Qual è il tuo numero di matricola?', '¿Cuál es tu número de lista?', 'आपकी उपस्थिति संख्या क्या है?', 'Какой у вас номер в списке?', 'Qual é o seu número de chamada?'],
        ['された・されているのはどのようなことですか？', 'What happened or is happening to you?', 'Was ist dir passiert oder passiert gerade?', 'Que vous est-il arrivé ou vous arrive-t-il ?', '发生了什么？', 'Điều gì đã hoặc đang xảy ra với bạn?', 'เกิดอะไรขึ้นกับคุณ', 'Che cosa ti è successo o ti sta succedendo?', '¿Qué te ha ocurrido o te está ocurriendo?', 'आपके साथ क्या हुआ या हो रहा है?', 'Что с вами произошло или происходит?', 'O que aconteceu ou está acontecendo com você?'],
        ['具体的にはどのような行為ですか？', 'What specifically happened?', 'Was genau ist passiert?', 'Que s’est-il passé exactement ?', '具体发生了什么行为？', 'Cụ thể hành vi đó là gì?', 'เกิดการกระทำอะไรขึ้นโดยเฉพาะ', 'Che cosa è successo esattamente?', '¿Qué ocurrió exactamente?', 'विशेष रूप से क्या हुआ?', 'Что именно произошло?', 'O que aconteceu especificamente?'],
        ['その行為をされたのはいつ頃ですか？現在のなおされている場合はいつ頃からされていますか？', 'When did this happen? If it is ongoing, when did it start?', 'Wann ist das passiert? Wenn es weitergeht, wann hat es begonnen?', 'Quand cela s’est-il produit ? Si cela continue, quand cela a-t-il commencé ?', '这件事是什么时候发生的？如果仍在继续，是什么时候开始的？', 'Việc này xảy ra khi nào? Nếu vẫn tiếp diễn, bắt đầu từ khi nào?', 'เหตุการณ์นี้เกิดขึ้นเมื่อใด หากยังเกิดอยู่ เริ่มตั้งแต่เมื่อใด', 'Quando è successo? Se continua, quando è iniziato?', '¿Cuándo ocurrió? Si continúa, ¿cuándo comenzó?', 'यह कब हुआ? यदि जारी है, तो कब से शुरू हुआ?', 'Когда это произошло? Если продолжается, когда началось?', 'Quando isso aconteceu? Se continua, quando começou?'],
        ['その行為をされたのはどのときですか？', 'When did this happen?', 'Wann ist das passiert?', 'Quand cela s’est-il produit ?', '这件事发生在什么时候？', 'Việc đó xảy ra vào lúc nào?', 'เหตุการณ์นี้เกิดขึ้นเมื่อใด', 'Quando è successo?', '¿Cuándo ocurrió?', 'यह कब हुआ?', 'Когда это произошло?', 'Quando isso aconteceu?'],
        ['その行為を行った教員の名前を教えてください。', 'What is the name of the teacher involved?', 'Wie heißt die beteiligte Lehrkraft?', 'Quel est le nom de l’enseignant concerné ?', '请填写相关教师姓名。', 'Tên giáo viên liên quan là gì?', 'ครูที่เกี่ยวข้องชื่ออะไร', 'Qual è il nome dell’insegnante coinvolto?', '¿Cómo se llama el profesor implicado?', 'संबंधित शिक्षक का नाम क्या है?', 'Как зовут учителя?', 'Qual é o nome do professor envolvido?'],
        ['その行為によって怪我をした場合、どのような症状を発症したか、具体的に教えてください。', 'If you were injured, describe your symptoms in detail.', 'Wenn du verletzt wurdest, beschreibe bitte die Symptome genau.', 'Si vous avez été blessé, décrivez précisément vos symptômes.', '如果受伤，请详细说明症状。', 'Nếu bị thương, hãy mô tả chi tiết các triệu chứng.', 'หากได้รับบาดเจ็บ โปรดอธิบายอาการโดยละเอียด', 'Se ti sei ferito, descrivi i sintomi in dettaglio.', 'Si resultaste herido, describe los síntomas con detalle.', 'यदि चोट लगी हो, तो लक्षणों का विस्तार से वर्णन करें।', 'Если вы получили травму, подробно опишите симптомы.', 'Se você se machucou, descreva os sintomas em detalhes.'],
        ['その行為を行った教員の懲戒としてどんな内容を希望しますか？', 'What disciplinary action would you like for the teacher?', 'Welche disziplinarischen Maßnahmen wünschst du dir?', 'Quelle mesure disciplinaire souhaitez-vous pour l’enseignant ?', '你希望对该教师采取什么纪律处分？', 'Bạn mong muốn hình thức kỷ luật nào đối với giáo viên?', 'คุณต้องการให้ลงโทษทางวินัยครูอย่างไร', 'Quale provvedimento disciplinare desideri per l’insegnante?', '¿Qué medida disciplinaria deseas para el profesor?', 'आप शिक्षक के लिए किस अनुशासनात्मक कार्रवाई की इच्छा रखते हैं?', 'Какого дисциплинарного взыскания вы хотите для учителя?', 'Que medida disciplinar você deseja para o professor?']
    ];
    const options = [
        ['肉体的体罰', 'Physical punishment', 'Körperliche Bestrafung', 'Punition physique', '身体惩罚', 'Trừng phạt thể chất', 'การลงโทษทางร่างกาย', 'Punizione fisica', 'Castigo físico', 'शारीरिक दंड', 'Физическое наказание', 'Punição física'],
        ['精神的体罰', 'Emotional abuse', 'Psychische Bestrafung', 'Punition psychologique', '精神惩罚', 'Bạo hành tinh thần', 'การลงโทษทางจิตใจ', 'Punizione psicologica', 'Castigo psicológico', 'मानसिक दंड', 'Психологическое наказание', 'Punição psicológica'],
        ['過度な叱責', 'Excessive reprimand', 'Übermäßiger Tadel', 'Réprimande excessive', '过度训斥', 'Khiển trách quá mức', 'การตำหนิรุนแรงเกินไป', 'Rimprovero eccessivo', 'Reprimenda excesiva', 'अत्यधिक फटकार', 'Чрезмерный выговор', 'Repreensão excessiva'],
        ['その他', 'Other', 'Andere', 'Autre', '其他', 'Khác', 'อื่น ๆ', 'Altro', 'Otro', 'अन्य', 'Другое', 'Outro'],
        ['登校中', 'On the way to school', 'Auf dem Schulweg', 'En allant à l’école', '上学途中', 'Trên đường đi học', 'ระหว่างไปโรงเรียน', 'Durante il tragitto verso scuola', 'De camino a la escuela', 'विद्यालय जाते समय', 'По дороге в школу', 'A caminho da escola'],
        ['授業中', 'During class', 'Im Unterricht', 'En classe', '上课时', 'Trong giờ học', 'ระหว่างเรียน', 'Durante la lezione', 'Durante la clase', 'कक्षा के दौरान', 'На уроке', 'Durante a aula'],
        ['休み時間中', 'During break', 'In der Pause', 'Pendant la récréation', '课间', 'Trong giờ nghỉ', 'ช่วงพัก', 'Durante la pausa', 'Durante el recreo', 'अवकाश के दौरान', 'На перемене', 'Durante o intervalo'],
        ['下校中', 'On the way home', 'Auf dem Heimweg', 'En rentrant de l’école', '放学途中', 'Trên đường về nhà', 'ระหว่างกลับบ้าน', 'Durante il tragitto verso casa', 'De camino a casa', 'विद्यालय से लौटते समय', 'По дороге домой', 'A caminho de casa'],
        ['部活中', 'During club activities', 'Bei der AG', 'Pendant le club', '社团活动中', 'Trong hoạt động câu lạc bộ', 'ระหว่างกิจกรรมชมรม', 'Durante l’attività sportiva', 'Durante la actividad extraescolar', 'क्लब गतिविधि के दौरान', 'На занятиях клуба', 'Durante a atividade do clube']
    ];
    const common = {
        '訴訟箱': ['Complaint Box', 'Beschwerdebox', 'Boîte à plaintes', '投诉箱', 'Hộp khiếu nại', 'กล่องร้องเรียน', 'Cassetta dei reclami', 'Buzón de quejas', 'शिकायत पेटी', 'Ящик жалоб', 'Caixa de reclamações'],
        '学生相談窓口アプリ': ['Student support app', 'Beratungs-App für Schüler', 'Application de soutien aux élèves', '学生咨询应用', 'Ứng dụng tư vấn học sinh', 'แอปให้คำปรึกษานักเรียน', 'App di supporto agli studenti', 'Aplicación de apoyo estudiantil', 'छात्र सहायता ऐप', 'Приложение поддержки учащихся', 'Aplicativo de apoio ao estudante'],
        'これは教員からの体罰や叱責で悩みを抱えている生徒の相談アプリです': ['This app helps students troubled by physical punishment or reprimands from teachers.', 'Diese App unterstützt Schüler, die unter körperlicher Bestrafung oder Tadel durch Lehrkräfte leiden.', 'Cette application aide les élèves confrontés aux punitions physiques ou aux réprimandes des enseignants.', '这是为因教师体罚或训斥而烦恼的学生提供咨询的应用。', 'Ứng dụng này hỗ trợ học sinh gặp vấn đề với việc bị giáo viên phạt hoặc khiển trách.', 'แอปนี้ให้คำปรึกษาแก่นักเรียนที่มีปัญหาจากการลงโทษหรือการตำหนิของครู', 'Questa app aiuta gli studenti turbati da punizioni fisiche o rimproveri degli insegnanti.', 'Esta aplicación ayuda a estudiantes preocupados por castigos físicos o reprimendas de profesores.', 'यह ऐप शिक्षकों की शारीरिक सज़ा या फटकार से परेशान छात्रों की सहायता करता है।', 'Это приложение помогает учащимся, столкнувшимся с физическим наказанием или выговорами учителей.', 'Este aplicativo ajuda estudantes que sofrem com punições físicas ou repreensões de professores.'],
        '投函する': ['Submit', 'Einreichen', 'Envoyer', '提交', 'Gửi', 'ส่ง', 'Invia', 'Enviar', 'जमा करें', 'Отправить', 'Enviar'],
        '訴状を見る': ['View submissions', 'Einreichungen ansehen', 'Voir les plaintes', '查看提交内容', 'Xem đơn', 'ดูรายการส่ง', 'Visualizza invii', 'Ver envíos', 'प्रविष्टियाँ देखें', 'Посмотреть обращения', 'Ver envios'],
        'ここに回答': ['Your answer', 'Deine Antwort', 'Votre réponse', '请输入回答', 'Câu trả lời', 'คำตอบของคุณ', 'La tua risposta', 'Tu respuesta', 'आपका उत्तर', 'Ваш ответ', 'Sua resposta'],
        '必須': ['Required', 'Erforderlich', 'Obligatoire', '必填', 'Bắt buộc', 'จำเป็น', 'Obbligatorio', 'Obligatorio', 'आवश्यक', 'Обязательно', 'Obrigatório'],
        '匿名希望の方は書かないでください': ['Leave blank if you wish to remain anonymous', 'Bei anonymer Meldung bitte leer lassen', 'Laissez vide si vous souhaitez rester anonyme', '如希望匿名，请不要填写', 'Nếu muốn ẩn danh, vui lòng không điền', 'หากต้องการไม่เปิดเผยชื่อ โปรดเว้นว่างไว้', 'Lascia vuoto se desideri restare anonimo', 'Déjalo en blanco si deseas permanecer anónimo', 'यदि आप गुमनाम रहना चाहते हैं तो खाली छोड़ें', 'Если хотите сохранить анонимность, оставьте поле пустым', 'Deixe em branco se desejar permanecer anônimo'],
        '体罰や叱責に関する相談アプリ 訴訟箱': ['Student support app: Complaint Box', 'Beratungs-App: Beschwerdebox', 'Application de soutien : Boîte à plaintes', '体罚与训斥咨询应用：投诉箱', 'Ứng dụng tư vấn: Hộp khiếu nại', 'แอปให้คำปรึกษา: กล่องร้องเรียน', 'App di supporto: Cassetta dei reclami', 'Aplicación de apoyo: Buzón de quejas', 'छात्र सहायता ऐप: शिकायत पेटी', 'Приложение поддержки: Ящик жалоб', 'Aplicativo de apoio: Caixa de reclamações'],
        'いずれかを選択してください。': ['Please select at least one option.', 'Bitte wähle mindestens eine Option.', 'Veuillez sélectionner au moins une option.', '请选择至少一个选项。', 'Vui lòng chọn ít nhất một mục.', 'โปรดเลือกอย่างน้อยหนึ่งตัวเลือก', 'Seleziona almeno un’opzione.', 'Selecciona al menos una opción.', 'कृपया कम से कम एक विकल्प चुनें।', 'Выберите хотя бы один вариант.', 'Selecione pelo menos uma opção.'],
        'パスワードが正しくありません。': ['The password is incorrect.', 'Das Passwort ist falsch.', 'Le mot de passe est incorrect.', '密码不正确。', 'Mật khẩu không chính xác.', 'รหัสผ่านไม่ถูกต้อง', 'La password non è corretta.', 'La contraseña no es correcta.', 'पासवर्ड गलत है।', 'Неверный пароль.', 'A senha está incorreta.'],
        'パスワード': ['Password', 'Passwort', 'Mot de passe', '密码', 'Mật khẩu', 'รหัสผ่าน', 'Password', 'Contraseña', 'पासवर्ड', 'Пароль', 'Senha'],
        'キャンセル': ['Cancel', 'Abbrechen', 'Annuler', '取消', 'Hủy', 'ยกเลิก', 'Annulla', 'Cancelar', 'रद्द करें', 'Отмена', 'Cancelar'],
        '確認': ['Confirm', 'Bestätigen', 'Confirmer', '确认', 'Xác nhận', 'ยืนยัน', 'Conferma', 'Confirmar', 'पुष्टि करें', 'Подтвердить', 'Confirmar'],
        '投函確認': ['Submission confirmation', 'Einreichungsbestätigung', 'Confirmation de l’envoi', '提交确认', 'Xác nhận gửi', 'ยืนยันการส่ง', 'Conferma invio', 'Confirmación de envío', 'जमा करने की पुष्टि', 'Подтверждение отправки', 'Confirmação do envio'],
        '投函します。よろしいですか？': ['Submit this report?', 'Meldung einreichen?', 'Envoyer ce signalement ?', '要提交此报告吗？', 'Gửi báo cáo này?', 'ส่งรายงานนี้หรือไม่', 'Inviare questa segnalazione?', '¿Enviar este informe?', 'क्या यह रिपोर्ट जमा करें?', 'Отправить это обращение?', 'Enviar este relatório?'],
        '投函いたしました': ['Submitted', 'Eingereicht', 'Envoyé', '已提交', 'Đã gửi', 'ส่งแล้ว', 'Inviato', 'Enviado', 'जमा किया गया', 'Отправлено', 'Enviado'],
        'ページを閉じる': ['Close page', 'Seite schließen', 'Fermer la page', '关闭页面', 'Đóng trang', 'ปิดหน้า', 'Chiudi pagina', 'Cerrar página', 'पृष्ठ बंद करें', 'Закрыть страницу', 'Fechar página'],
        '訴状一覧': ['Submission list', 'Liste der Einreichungen', 'Liste des plaintes', '提交列表', 'Danh sách đơn', 'รายการส่ง', 'Elenco degli invii', 'Lista de envíos', 'प्रविष्टियों की सूची', 'Список обращений', 'Lista de envios'],
        '学生相談窓口アプリ・訴訟箱': ['Student support app - Complaint Box', 'Schülerberatungs-App - Beschwerdebox', 'Application de soutien aux élèves - Boîte à plaintes', '学生咨询应用 - 投诉箱', 'Ứng dụng tư vấn học sinh - Hộp khiếu nại', 'แอปให้คำปรึกษานักเรียน - กล่องร้องเรียน', 'App di supporto agli studenti - Cassetta dei reclami', 'Aplicación de apoyo estudiantil - Buzón de quejas', 'छात्र सहायता ऐप - शिकायत पेटी', 'Приложение поддержки учащихся - Ящик жалоб', 'Aplicativo de apoio ao estudante - Caixa de reclamações'],
        '訴訟箱 - 提出一覧': ['Complaint Box - Submissions', 'Beschwerdebox - Einreichungen', 'Boîte à plaintes - Soumissions', '投诉箱 - 提交列表', 'Hộp khiếu nại - Danh sách đơn', 'กล่องร้องเรียน - รายการส่ง', 'Cassetta dei reclami - Invii', 'Buzón de quejas - Envíos', 'शिकायत पेटी - प्रविष्टियाँ', 'Ящик жалоб - Обращения', 'Caixa de reclamações - Envios'],
        'パスワード変更': ['Change password', 'Passwort ändern', 'Modifier le mot de passe', '修改密码', 'Đổi mật khẩu', 'เปลี่ยนรหัสผ่าน', 'Cambia password', 'Cambiar contraseña', 'पासवर्ड बदलें', 'Изменить пароль', 'Alterar senha'],
        'パスワードを変更しました': ['Password changed', 'Passwort geändert', 'Mot de passe modifié', '密码已更改', 'Đã đổi mật khẩu', 'เปลี่ยนรหัสผ่านแล้ว', 'Password modificata', 'Contraseña cambiada', 'पासवर्ड बदल गया', 'Пароль изменён', 'Senha alterada'],
        '閉じる': ['Close', 'Schließen', 'Fermer', '关闭', 'Đóng', 'ปิด', 'Chiudi', 'Cerrar', 'बंद करें', 'Закрыть', 'Fechar'],
        'いいえ': ['No', 'Nein', 'Non', '否', 'Không', 'ไม่', 'No', 'No', 'नहीं', 'Нет', 'Não'],
        'はい': ['Yes', 'Ja', 'Oui', '是', 'Có', 'ใช่', 'Sì', 'Sí', 'हाँ', 'Да', 'Sim'],
        '投函しています…': ['Submitting…', 'Wird eingereicht…', 'Envoi en cours…', '正在提交…', 'Đang gửi…', 'กำลังส่ง…', 'Invio in corso…', 'Enviando…', 'जमा किया जा रहा है…', 'Отправка…', 'Enviando…'],
        '提出人数：': ['Submissions: ', 'Einreichungen: ', 'Soumissions : ', '提交人数：', 'Số đơn: ', 'จำนวนการส่ง: ', 'Invii: ', 'Envíos: ', 'प्रविष्टियाँ: ', 'Обращений: ', 'Envios: '],
        '未回答': ['No answer', 'Keine Antwort', 'Pas de réponse', '未回答', 'Chưa trả lời', 'ไม่มีคำตอบ', 'Nessuna risposta', 'Sin respuesta', 'कोई उत्तर नहीं', 'Нет ответа', 'Sem resposta'],
        'その他の回答': ['Other answer', 'Andere Antwort', 'Autre réponse', '其他回答', 'Câu trả lời khác', 'คำตอบอื่น ๆ', 'Altra risposta', 'Otra respuesta', 'अन्य उत्तर', 'Другой ответ', 'Outra resposta'],
        'この訴状を取り下げますか？': ['Withdraw this submission?', 'Diese Einreichung zurückziehen?', 'Retirer cette plainte ?', '要撤回此提交吗？', 'Rút đơn này?', 'ถอนรายการนี้หรือไม่', 'Ritirare questo invio?', '¿Retirar este envío?', 'क्या इस प्रविष्टि को वापस लें?', 'Отозвать это обращение?', 'Retirar este envio?'],
        '取り下げをすると、戻ることはありません。本当に削除しますか？': ['This cannot be undone. Delete it?', 'Dies kann nicht rückgängig gemacht werden. Löschen?', 'Cette action est irréversible. Supprimer ?', '此操作无法撤销。确定删除吗？', 'Không thể hoàn tác. Xóa?', 'ไม่สามารถย้อนกลับได้ ลบหรือไม่', 'Non è possibile annullare. Eliminare?', 'No se puede deshacer. ¿Eliminar?', 'इसे वापस नहीं किया जा सकता। हटाएँ?', 'Это действие нельзя отменить. Удалить?', 'Não é possível desfazer. Excluir?'],
        '現在のパスワード': ['Current password', 'Aktuelles Passwort', 'Mot de passe actuel', '当前密码', 'Mật khẩu hiện tại', 'รหัสผ่านปัจจุบัน', 'Password attuale', 'Contraseña actual', 'वर्तमान पासवर्ड', 'Текущий пароль', 'Senha atual'],
        '新しいパスワード': ['New password', 'Neues Passwort', 'Nouveau mot de passe', '新密码', 'Mật khẩu mới', 'รหัสผ่านใหม่', 'Nuova password', 'Nueva contraseña', 'नया पासवर्ड', 'Новый пароль', 'Nova senha'],
        '新しいパスワード（確認）': ['New password (confirm)', 'Neues Passwort (Bestätigung)', 'Nouveau mot de passe (confirmation)', '新密码（确认）', 'Mật khẩu mới (xác nhận)', 'รหัสผ่านใหม่ (ยืนยัน)', 'Nuova password (conferma)', 'Nueva contraseña (confirmar)', 'नया पासवर्ड (पुष्टि)', 'Новый пароль (подтверждение)', 'Nova senha (confirmação)'],
        '保存': ['Save', 'Speichern', 'Enregistrer', '保存', 'Lưu', 'บันทึก', 'Salva', 'Guardar', 'सहेजें', 'Сохранить', 'Salvar'],
        '提出内容': ['Submission details', 'Details der Einreichung', 'Détails de la plainte', '提交内容', 'Chi tiết đơn', 'รายละเอียดการส่ง', 'Dettagli invio', 'Detalles del envío', 'प्रविष्टि विवरण', 'Детали обращения', 'Detalhes do envio'],
        '入力画面へ戻る': ['Back to form', 'Zurück zum Formular', 'Retour au formulaire', '返回填写页面', 'Quay lại biểu mẫu', 'กลับไปยังแบบฟอร์ม', 'Torna al modulo', 'Volver al formulario', 'फ़ॉर्म पर वापस जाएँ', 'Вернуться к форме', 'Voltar ao formulário'],
        'ホーム画面へ戻る': ['Back to home', 'Zurück zur Startseite', 'Retour à l’accueil', '返回主页', 'Quay lại trang chủ', 'กลับหน้าหลัก', 'Torna alla home', 'Volver al inicio', 'होम पर वापस जाएँ', 'Вернуться на главную', 'Voltar à página inicial'],
        '削除': ['Delete', 'Löschen', 'Supprimer', '删除', 'Xóa', 'ลบ', 'Elimina', 'Eliminar', 'हटाएँ', 'Удалить', 'Excluir'],
        'まだ提出された回答はありません。': ['No submissions yet.', 'Noch keine Einreichungen.', 'Aucune réponse soumise.', '尚无提交内容。', 'Chưa có câu trả lời nào.', 'ยังไม่มีการส่งคำตอบ', 'Nessun invio ancora.', 'Aún no hay respuestas.', 'अभी कोई प्रविष्टि नहीं है।', 'Пока нет обращений.', 'Ainda não há respostas.']
    };
    const translateButton = document.getElementById('translate-btn');
    const languageSelect = document.getElementById('language-select');
    const originalTitle = document.title;
    if (!translateButton || !languageSelect) return;

    const japaneseOption = document.createElement('option');
    japaneseOption.value = 'ja';
    japaneseOption.textContent = '日本語';
    languageSelect.appendChild(japaneseOption);
    Object.entries(languages).forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        languageSelect.appendChild(option);
    });

    const languageIndex = (code) => Object.keys(languages).indexOf(code) + 1;
    const translateText = (text, code) => {
        const index = languageIndex(code);
        if (text.startsWith('提出人数：')) {
            return `${common['提出人数：'][index - 1]}${text.slice('提出人数：'.length)}`;
        }
        if (text.startsWith('訴状(')) {
            const number = text.match(/\d+/)?.[0] || '';
            return `${['Submission', 'Einreichung', 'Plainte', '提交', 'Đơn', 'รายการ', 'Invio', 'Envío', 'प्रविष्टि', 'Обращение', 'Envio'][index - 1]} (${number})`;
        }
        const commonTranslation = common[text]?.[index - 1];
        if (commonTranslation) return commonTranslation;
        const prompt = prompts.find((item) => text.includes(item[0]));
        if (prompt) {
            return text.replace(itemText(text, prompt[0]), prompt[index])
                .replace('（複数回答可）', ['(select all that apply)', '(Mehrfachauswahl möglich)', '(sélection multiple possible)', '（可多选）', '(có thể chọn nhiều)', '(เลือกได้หลายข้อ)', '(selezione multipla)', '(selección múltiple)', '(एकाधिक चयन)', '(можно выбрать несколько)', '(selecione várias)'][index - 1]);
        }
        const option = options.find((item) => text === item[0]);
        return option ? option[index] : text;
    };
    const itemText = (text, source) => text.includes(source) ? source : text;
    const textNodeSources = new WeakMap();
    const translatePage = (code) => {
        const isJapanese = code === 'ja';
        document.documentElement.lang = isJapanese ? 'ja' : code;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach((textNode) => {
            const parent = textNode.parentElement;
            if (!parent || parent.closest('script, style, select') || parent.id === 'translate-btn' || parent.classList.contains('music-toggle-btn')) return;
            const original = textNodeSources.get(textNode) || textNode.textContent;
            textNodeSources.set(textNode, original);
            if (!original.trim()) return;
            if (isJapanese) {
                textNode.textContent = original;
                return;
            }
            const leading = original.match(/^\s*/)[0];
            const trailing = original.match(/\s*$/)[0];
            const source = original.trim().replace(/^\((.*)\)$/, '$1').replace(/\s*（必須）|\s*\(必須\)/g, '');
            const translated = translateText(source, code);
            textNode.textContent = `${leading}${translated}${source !== original.trim() ? ' (Required)' : ''}${trailing}`;
        });
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((element) => {
            const source = element.dataset.jpPlaceholder || element.placeholder;
            element.dataset.jpPlaceholder = source;
            element.placeholder = isJapanese ? source : (common[source]?.[languageIndex(code) - 1] || source);
        });
        translateButton.textContent = 'TRANSLATE';
        languageSelect.hidden = true;
        if (!isJapanese) {
            const titleSource = originalTitle.replace(/ - .*/, '').replace('学生相談窓口アプリ・', '');
            document.title = `${translateText(titleSource, code)}${originalTitle.includes('提出一覧') ? ` - ${translateText('訴状一覧', code)}` : ''}`;
        } else {
            document.title = originalTitle;
        }
    };
    translateButton.addEventListener('click', () => { languageSelect.hidden = !languageSelect.hidden; });
    languageSelect.addEventListener('change', () => translatePage(languageSelect.value));
    languageSelect.value = 'ja';
    translatePage('ja');
    window.addEventListener('languagechange', () => translatePage(languageSelect.value));
})();
