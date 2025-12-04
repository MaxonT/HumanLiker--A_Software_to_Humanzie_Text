(function(){
  'use strict';

  // Theme handling
  const selTheme = document.getElementById('themeSelect');
  function applyTheme(v){
    if(!v || v==='auto'){ document.documentElement.setAttribute('data-theme','auto'); }
    else { document.documentElement.setAttribute('data-theme', v); }
  }
  selTheme && selTheme.addEventListener('change', e=> applyTheme(e.target.value));

  // Lang handling
  const i18n = {
  en:{
    nav_dashboard:'Dashboard', nav_demo:'Demo', nav_docs:'Docs', nav_terms:'Terms', nav_privacy:'Privacy', nav_cookies:'Cookies',
    appearance:'System', system:'System', light:'Light', dark:'Dark', language:'English',
    hero_title:'Make AI sound human — naturally.', hero_sub:'HumanLiker rewrites model outputs into clear, warm, and natural language.',
    try_now:'Try Now', read_docs:'Read Docs',
    tone_acc:'Tone Accuracy', hl_score:'Human‑Likeness', token_cost:'Token Cost', rpm:'Rewrites/min', progress:'Progress %',
    input_text:'Input text', output_text:'Output text', tone:'Tone', grade:'Formality', humanize:'Humanize', copy:'Copy',
    terms_title:'Terms of Service', terms_intro:'By using HumanLiker, you agree to these terms. Do not misuse or abuse the service. We may update these terms to reflect improvements.',
    terms_use:'Use only for lawful and ethical purposes.', terms_priv:'We respect your privacy; see the Privacy Policy.', terms_ip:'You retain your content; we only process it to provide the service.',
    privacy_title:'Privacy Policy', privacy_intro:'We collect the minimum necessary data to operate the demo. No trackers by default. We store preferences only after your consent.',
    privacy_data:'Data minimization and purpose limitation.', privacy_storage:'Short retention for logs; you can request deletion.', privacy_cookies:'See Cookies for preferences and analytics.',
    cookies_title:'Cookies & Preferences', cookies_intro:'We use cookies to remember your theme, language, and consent. Optional analytics only with your opt‑in.',
    cookies_prefs:'Preference cookies: theme, language, UI layout.', cookies_analytics:'Analytics cookies: off by default; opt‑in only.', cookies_control:'You can clear cookies in your browser at any time.'
  },
  zh:{
    nav_dashboard:'仪表盘', nav_demo:'演示', nav_docs:'文档', nav_terms:'条款', nav_privacy:'隐私', nav_cookies:'Cookie',
    appearance:'系统', system:'系统', light:'浅色', dark:'深色', language:'中文',
    hero_title:'让 AI 说人话。', hero_sub:'HumanLiker 将模型输出改写得更自然、更温暖、更清晰。',
    try_now:'立即试用', read_docs:'阅读文档',
    tone_acc:'语气准确率', hl_score:'类人度', token_cost:'Token 成本', rpm:'每分钟改写数', progress:'进度 %',
    input_text:'输入文本', output_text:'输出文本', tone:'语气', grade:'正式度', humanize:'改写', copy:'复制',
    terms_title:'服务条款', terms_intro:'使用 HumanLiker 即表示您同意这些条款。请勿滥用服务。我们可能因改进而更新条款。',
    terms_use:'仅用于合法、合伦理的目的。', terms_priv:'我们重视隐私；详见隐私政策。', terms_ip:'内容归您所有；我们只为提供服务而处理。',
    privacy_title:'隐私政策', privacy_intro:'我们仅收集运行演示所需的最少数据。默认无跟踪。仅在您同意后保存偏好。',
    privacy_data:'数据最小化与目的限制。', privacy_storage:'日志短期保留；您可申请删除。', privacy_cookies:'关于偏好与分析，见 Cookie 说明。',
    cookies_title:'Cookie 与偏好', cookies_intro:'我们使用 Cookie 记住主题、语言与同意。分析仅在您选择同意时启用。',
    cookies_prefs:'偏好 Cookie：主题、语言、布局。', cookies_analytics:'分析 Cookie：默认关闭，仅在同意后开启。', cookies_control:'您可随时在浏览器中清除 Cookie。'
  },
  es:{
    nav_dashboard:'Panel', nav_demo:'Demo', nav_docs:'Docs', nav_terms:'Términos', nav_privacy:'Privacidad', nav_cookies:'Cookies',
    appearance:'Sistema', system:'Sistema', light:'Claro', dark:'Oscuro', language:'Español',
    hero_title:'Haz que la IA suene humana, de forma natural.', hero_sub:'HumanLiker reescribe salidas en un lenguaje claro y natural.',
    try_now:'Probar', read_docs:'Leer docs',
    tone_acc:'Precisión de tono', hl_score:'Human‑Likeness', token_cost:'Costo de tokens', rpm:'Reescrituras/min', progress:'Progreso %',
    input_text:'Texto de entrada', output_text:'Texto de salida', tone:'Tono', grade:'Formalidad', humanize:'Humanizar', copy:'Copiar',
    terms_title:'Términos de servicio', terms_intro:'Al usar HumanLiker aceptas estos términos. No abuses del servicio. Podemos actualizarlos.',
    terms_use:'Usa solo con fines lícitos y éticos.', terms_priv:'Respetamos tu privacidad; ver Política de privacidad.', terms_ip:'Tu contenido es tuyo; lo procesamos para ofrecer el servicio.',
    privacy_title:'Política de privacidad', privacy_intro:'Recopilamos lo mínimo necesario para el demo. Sin rastreadores por defecto. Preferencias tras tu consentimiento.',
    privacy_data:'Minimización de datos y propósito.', privacy_storage:'Retención corta de registros; puedes solicitar borrado.', privacy_cookies:'Consulta Cookies para preferencias y analítica.',
    cookies_title:'Cookies y preferencias', cookies_intro:'Usamos cookies para tema, idioma y consentimiento. Analítica opcional con tu aceptación.',
    cookies_prefs:'Preferencias: tema, idioma, diseño.', cookies_analytics:'Analítica: desactivada por defecto; opt‑in.', cookies_control:'Puedes borrar cookies en tu navegador.'
  },
  fr:{
    nav_dashboard:'Tableau de bord', nav_demo:'Démo', nav_docs:'Docs', nav_terms:'Conditions', nav_privacy:'Confidentialité', nav_cookies:'Cookies',
    appearance:'Système', system:'Système', light:'Clair', dark:'Sombre', language:'Français',
    hero_title:'Faites sonner l’IA comme un humain — naturellement.', hero_sub:'HumanLiker réécrit en un langage clair et naturel.',
    try_now:'Essayer', read_docs:'Lire docs',
    tone_acc:'Précision du ton', hl_score:'Human‑Likeness', token_cost:'Coût tokens', rpm:'Réécritures/min', progress:'Progression %',
    input_text:'Texte d’entrée', output_text:'Texte de sortie', tone:'Ton', grade:'Niveau', humanize:'Humaniser', copy:'Copier',
    terms_title:'Conditions d’utilisation', terms_intro:'En utilisant HumanLiker, vous acceptez ces conditions. N’abusez pas du service. Nous pouvons les mettre à jour.',
    terms_use:'Usage légal et éthique uniquement.', terms_priv:'Respect de la vie privée ; voir Politique.', terms_ip:'Vous gardez votre contenu ; nous le traitons pour le service.',
    privacy_title:'Politique de confidentialité', privacy_intro:'Collecte minimale nécessaire. Pas de traqueurs par défaut. Préférences après consentement.',
    privacy_data:'Minimisation et finalité.', privacy_storage:'Rétention courte ; droit à l’effacement.', privacy_cookies:'Voir Cookies pour préférences et analyses.',
    cookies_title:'Cookies & préférences', cookies_intro:'Cookies pour thème, langue, consentement. Analyses en opt‑in.',
    cookies_prefs:'Préférences : thème, langue, UI.', cookies_analytics:'Analyses : off par défaut.', cookies_control:'Vous pouvez effacer les cookies.'
  },
  hi:{
    nav_dashboard:'डैशबोर्ड', nav_demo:'डेमो', nav_docs:'दस्तावेज़', nav_terms:'शर्तें', nav_privacy:'गोपनीयता', nav_cookies:'कुकीज़',
    appearance:'सिस्टम', system:'सिस्टम', light:'लाइट', dark:'डार्क', language:'हिंदी',
    hero_title:'एआई को स्वाभाविक रूप से मानवीय बनाएं।', hero_sub:'HumanLiker पाठ को साफ़, गर्म और स्वाभाविक भाषा में लिखता है।',
    try_now:'अभी आज़माएँ', read_docs:'डॉक्स पढ़ें',
    tone_acc:'टोन शुद्धता', hl_score:'मानवीयता', token_cost:'टोकन लागत', rpm:'रीराइट/मिनट', progress:'प्रगति %',
    input_text:'इनपुट टेक्स्ट', output_text:'आउटपुट टेक्स्ट', tone:'टोन', grade:'औपचारिकता', humanize:'मानवीकरण', copy:'कॉपी',
    terms_title:'सेवा की शर्तें', terms_intro:'HumanLiker का उपयोग कर आप शर्तों से सहमत हैं। दुरुपयोग न करें।',
    terms_use:'केवल वैध और नैतिक उपयोग।', terms_priv:'हम गोपनीयता का सम्मान करते हैं; नीति देखें।', terms_ip:'सामग्री आपकी है; सेवा हेतु प्रक्रिया।',
    privacy_title:'गोपनीयता नीति', privacy_intro:'डेमो के लिए न्यूनतम डेटा। डिफ़ॉल्ट रूप से कोई ट्रैकर नहीं। सहमति के बाद वरीयताएँ।',
    privacy_data:'डेटा न्यूनता और उद्देश्य।', privacy_storage:'लॉग अल्पकालिक; हटाने का अनुरोध संभव।', privacy_cookies:'कुकीज़ विवरण देखें।',
    cookies_title:'कुकीज़ और वरीयताएँ', cookies_intro:'थीम, भाषा, सहमति याद रखने हेतु कुकीज़। विश्लेषण केवल ऑप्ट‑इन पर।',
    cookies_prefs:'वरीयता कुकीज़: थीम, भाषा, UI।', cookies_analytics:'विश्लेषण कुकीज़: डिफ़ॉल्ट बंद।', cookies_control:'ब्राउज़र में कुकीज़ साफ़ करें।'
  },
  ar:{
    nav_dashboard:'لوحة التحكم', nav_demo:'تجربة', nav_docs:'الوثائق', nav_terms:'الشروط', nav_privacy:'الخصوصية', nav_cookies:'الكوكيز',
    appearance:'النظام', system:'النظام', light:'فاتح', dark:'داكن', language:'العربية',
    hero_title:'اجعل الذكاء الاصطناعي يبدو بشرياً — بشكل طبيعي.', hero_sub:'يعيد HumanLiker صياغة المخرجات إلى لغة واضحة وطبيعية.',
    try_now:'جرّب الآن', read_docs:'اقرأ الوثائق',
    tone_acc:'دقة النبرة', hl_score:'الطابع البشري', token_cost:'تكلفة الرموز', rpm:'إعادة/دقيقة', progress:'التقدم %',
    input_text:'نص الإدخال', output_text:'نص الإخراج', tone:'النبرة', grade:'الرسمية', humanize:'تحسين', copy:'نسخ',
    terms_title:'شروط الخدمة', terms_intro:'باستخدامك HumanLiker فإنك توافق على الشروط. لا تسيء الاستخدام.',
    terms_use:'استخدام قانوني وأخلاقي فقط.', terms_priv:'نحترم خصوصيتك؛ راجع السياسة.', terms_ip:'محتواك ملك لك؛ نُعالجه لتقديم الخدمة.',
    privacy_title:'سياسة الخصوصية', privacy_intro:'نجمع الحد الأدنى لتشغيل النسخة التجريبية. لا تتبع افتراضيًا.',
    privacy_data:'تقليل البيانات ووضوح الغرض.', privacy_storage:'احتفاظ قصير بالسجلات، مع حق الحذف.', privacy_cookies:'راجع الكوكيز للتفضيلات والتحليلات.',
    cookies_title:'الكوكيز والتفضيلات', cookies_intro:'نستخدم الكوكيز لتذكر السمة واللغة والموافقة. التحليلات اختيارية.',
    cookies_prefs:'كوكيز التفضيلات: السمة واللغة وواجهة المستخدم.', cookies_analytics:'كوكيز التحليلات: مع تفعيل صريح.', cookies_control:'يمكنك مسح الكوكيز في المتصفح.'
  },
  pt:{
    nav_dashboard:'Painel', nav_demo:'Demo', nav_docs:'Docs', nav_terms:'Termos', nav_privacy:'Privacidade', nav_cookies:'Cookies',
    appearance:'Sistema', system:'Sistema', light:'Claro', dark:'Escuro', language:'Português',
    hero_title:'Faça a IA soar humana — naturalmente.', hero_sub:'HumanLiker reescreve saídas em linguagem clara e natural.',
    try_now:'Experimentar', read_docs:'Ler docs',
    tone_acc:'Precisão do tom', hl_score:'Semelhança humana', token_cost:'Custo de tokens', rpm:'Reescritas/min', progress:'Progresso %',
    input_text:'Texto de entrada', output_text:'Texto de saída', tone:'Tom', grade:'Formalidade', humanize:'Humanizar', copy:'Copiar',
    terms_title:'Termos de serviço', terms_intro:'Ao usar o HumanLiker, você concorda com estes termos. Não abuse do serviço.',
    terms_use:'Apenas uso legal e ético.', terms_priv:'Respeitamos sua privacidade; veja a política.', terms_ip:'Seu conteúdo é seu; processamos para prestar o serviço.',
    privacy_title:'Política de privacidade', privacy_intro:'Coletamos o mínimo necessário para o demo. Sem rastreadores por padrão. Preferências após consentimento.',
    privacy_data:'Minimização de dados e finalidade.', privacy_storage:'Retenção curta; pode solicitar exclusão.', privacy_cookies:'Veja Cookies para preferências e análises.',
    cookies_title:'Cookies e preferências', cookies_intro:'Usamos cookies para tema, idioma e consentimento. Análises apenas com opt‑in.',
    cookies_prefs:'Preferências: tema, idioma, UI.', cookies_analytics:'Análises: desligadas por padrão.', cookies_control:'Você pode limpar cookies no navegador.'
  },
  ja:{
    nav_dashboard:'ダッシュボード', nav_demo:'デモ', nav_docs:'ドキュメント', nav_terms:'利用規約', nav_privacy:'プライバシー', nav_cookies:'クッキー',
    appearance:'システム', system:'システム', light:'ライト', dark:'ダーク', language:'日本語',
    hero_title:'AIを自然に「人間らしく」。', hero_sub:'HumanLikerは出力を自然で読みやすい文章に書き換えます。',
    try_now:'今すぐ試す', read_docs:'ドキュメント',
    tone_acc:'トーン精度', hl_score:'人間らしさ', token_cost:'トークンコスト', rpm:'リライト/分', progress:'進捗 %',
    input_text:'入力テキスト', output_text:'出力テキスト', tone:'トーン', grade:'フォーマル度', humanize:'人間味付け', copy:'コピー',
    terms_title:'利用規約', terms_intro:'HumanLikerの利用により、規約に同意したものとみなします。乱用は禁止です。',
    terms_use:'合法かつ倫理的な目的のみ。', terms_priv:'プライバシーを尊重します。', terms_ip:'コンテンツの権利はあなたにあります。',
    privacy_title:'プライバシーポリシー', privacy_intro:'デモ運用に必要な最小限のデータのみ収集します。',
    privacy_data:'データ最小化と目的限定。', privacy_storage:'ログの短期保持と削除の要請可。', privacy_cookies:'クッキー詳細をご確認ください。',
    cookies_title:'クッキーと設定', cookies_intro:'テーマ・言語・同意を記憶するために使用します。',
    cookies_prefs:'設定クッキー：テーマ、言語、UI。', cookies_analytics:'解析クッキー：デフォルト無効。', cookies_control:'ブラウザで削除できます。'
  }
};
  const selLang = document.getElementById('langSelect');
  if(selLang){
    selLang.innerHTML = ['en','zh'].map(l=>'<option value="'+l+'">'+(l==='en'?'English':'中文')+'</option>').join('');
    selLang.addEventListener('change', e=> applyLang(e.target.value));
  }
  function applyLang(lang){
  const dict = i18n[lang] || i18n.en;
  // Set direction for Arabic
  const rtl = (lang === 'ar');
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  // Update labels
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.textContent = dict[key];
  });
});
  }
  applyLang('en'); // default

  // Footer
  (function renderFooter(){
    const target = document.getElementById('footer'); if(!target) return;
    const email = 'support@humanliker.app';
    target.innerHTML = [
      '<span class="footer-split"><span class="copyright-symbol">©</span> <strong>HumanLiker</strong> v0.4 Demo</span>',
      '<span class="footer-split">No trackers. Preferences saved only after consent.</span>',
      '<span class="footer-split">Support: <a href="mailto:'+email+'">'+email+'</a></span>'
    ].join('');
  })();

  // KPI counters (demo values)
  function animateNumber(el, to, suffix='', duration=600){
    const start = performance.now();
    const from = 0;
    function step(t){
      const p = Math.min(1, (t-start)/duration);
      const v = from + (to-from)*p;
      el.textContent = (suffix==='%'?Math.round(v)+suffix: (Math.round(v*10)/10)) + (suffix && suffix!=='%' ? suffix : '');
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  animateNumber(document.getElementById('kpiTone'), 82, '%', 650);
  animateNumber(document.getElementById('kpiHuman'), 9.1, '', 650);
  animateNumber(document.getElementById('kpiCost'), 14.3, '', 650);
  animateNumber(document.getElementById('kpiRPM'), 26, '', 650);
  animateNumber(document.getElementById('kpiProgress'), 73, '%', 650);

  // Demo "humanize"
  const inputArea = document.getElementById('inputArea');
  const outputArea = document.getElementById('outputArea');
  const runBtn = document.getElementById('runBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyHint = document.getElementById('copyHint');

  function humanizeText(t, tone, grade){
    // Demo rule-based tweaks (offline, no API)
    t = (t||'').trim();
    if(!t) return '';
    // Normalize whitespace and sentence casing
    t = t.replace(/\s+/g,' ').replace(/(^\w|[\.\!\?]\s+\w)/g, s=> s.toUpperCase());
    // Tone adjustments
    if(tone==='friendly'){ t = "Hey — " + t; }
    if(tone==='concise'){ t = t.replace(/\b(essentially|basically|actually)\b/gi,'').replace(/\s{2,}/g,' '); }
    if(tone==='confident'){ t = t.replace(/\b(might|maybe|perhaps)\b/gi,'will'); }
    // Formality
    if(grade==='formal'){ t = t.replace(/\b(can't|won't|don't)\b/gi, m=>({'can\'t':'cannot','won\'t':'will not','don\'t':'do not'}[m.toLowerCase()])); }
    return t;
  }

  runBtn && runBtn.addEventListener('click', ()=>{
    outputArea.value = humanizeText(inputArea.value, document.getElementById('toneSelect').value, document.getElementById('gradeSelect').value);
  });

  copyBtn && copyBtn.addEventListener('click', ()=>{
    if(!outputArea.value){ copyHint.textContent = 'Nothing to copy.'; return; }
    outputArea.select(); document.execCommand('copy');
    copyHint.textContent = 'Copied ✓'; setTimeout(()=> copyHint.textContent = '', 1000);
  });
})();