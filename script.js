// =============================================
// CONFIGURATION & STATE
// =============================================
const STORAGE_KEY = 'lumo-markdown-editor-content';
const THEME_KEY = 'lumo-editor-theme';
const LANGUAGE_KEY = 'lumo-editor-language';
const STATS_KEY = 'lumo-editor-stats-mode';
const AUTO_CLOSE_KEY = 'lumo-editor-auto-close';

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'el';
let currentTheme = localStorage.getItem(THEME_KEY) || 'light';
let currentStatsMode = localStorage.getItem(STATS_KEY) || 'md-clean';
let autoCloseEnabled = localStorage.getItem(AUTO_CLOSE_KEY) === 'true';

// Translations Object
const translations = {
    el: {
        pageTitle: 'Επεξεργαστής Markdown',
        editMode: 'Επεξεργασία',
        previewMode: 'Προεπισκόπηση',
        splitMode: 'Διπλό Panel',
        liveMode: '👁️ Live',
        focusMode: '⦿ Focus',
        exportMD: 'MD',
        exportTXT: 'TXT',
        exportPDF: 'PDF',
        cheatSheetTitle: 'Cheat Sheet Markdown',
        heading1: 'Κεφαλίδα 1ου επιπέδου',
        heading2: 'Κεφαλίδα 2ου επιπέδου',
        heading3: 'Κεφαλίδα 3ου επιπέδου',
        bold: 'Έντονο',
        italic: 'Πλάγιο',
        link: 'Σύνδεσμος',
        image: 'Εικόνα',
        list: 'Λίστα με κουκκίδες',
        orderedList: 'Αριθμημένη λίστα',
        codeBlock: 'Μπλοκ κώδικα',
        quote: 'Παράθεση',
        table: 'Πίνακας',
        chars: 'χαρακτήρες',
        words: 'λέξεις',
        paragraphs: 'παράγραφοι',
        cleanStats: 'MD Clean',
        autoClose: 'Auto-Close',
        basic: 'Βασικά',
        advanced: 'Προχωρημένα',
        closeTip: 'Κλείσιμο'
    },
    en: {
        pageTitle: 'Markdown Editor',
        editMode: 'Edit',
        previewMode: 'Preview',
        splitMode: 'Split View',
        liveMode: '👁️ Live',
        focusMode: '⦿ Focus',
        exportMD: 'MD',
        exportTXT: 'TXT',
        exportPDF: 'PDF',
        cheatSheetTitle: 'Markdown Cheat Sheet',
        heading1: 'Heading Level 1',
        heading2: 'Heading Level 2',
        heading3: 'Heading Level 3',
        bold: 'Bold',
        italic: 'Italic',
        link: 'Link',
        image: 'Image',
        list: 'Bullet List',
        orderedList: 'Ordered List',
        codeBlock: 'Code Block',
        quote: 'Quote',
        table: 'Table',
        chars: 'characters',
        words: 'words',
        paragraphs: 'paragraphs',
        cleanStats: 'MD Clean',
        autoClose: 'Auto-Close',
        basic: 'Basics',
        advanced: 'Advanced',
        closeTip: 'Close'
    }
};

// Tips - Sticky with close button
const tips = {
    el: [
        '💡 Χρησιμοποίησε `#` για τίτλους (# H1, ## H2, ### H3)',
        '💡 Έντονο κείμενο με `**κείμενο**`',
        '💡 Πλάγιο κείμενο με `*κείμενο*`',
        '💡 Συνδέσμους με `[κείμενο](url)`',
        '💡 Λίστες ξεκινούν με `-` ή `*`',
        '💡 Κώδικας inline: `code`',
        '💡 Blockquote: `> κείμενο`',
        '💡 Η τοπική αποθήκευση διατηρεί τα κείμενά σου',
        '💡 Active Focus Mode με το κουμπί ⦿',
        '💡 Activate MD Clean Stats για καθαρή καταμέτρηση λέξεων',
        '💡 Στο Live mode πάτα κλικ στο κείμενο για να γράψεις',
        '💡 Χρησιμοποίησε Ctrl+B για Bold, Ctrl+I για Italic'
    ],
    en: [
        '💡 Use `#` for headings (# H1, ## H2, ### H3)',
        '💡 Bold text with `**text**`',
        '💡 Italic text with `*text*`',
        '💡 Links with `[text](url)`',
        '💡 Lists start with `-` or `*`',
        '💡 Inline code: `code`',
        '💡 Blockquote: `> text`',
        '💡 Local storage keeps your texts safe',
        '💡 Activate Focus Mode with ⦿ button',
        '💡 Activate MD Clean Stats for word count without syntax',
        '💡 In Live mode click text to edit',
        '💡 Use Ctrl+B for Bold, Ctrl+I for Italic'
    ]
};

// =============================================
// DOM ELEMENTS
// =============================================
const editor = document.getElementById('editor');
const preview = document.getElementById('preview-content');
const pageBody = document.body;
const pageTitle = document.getElementById('page-title');
const formatBar = document.getElementById('format-bar');
const editorPanel = document.getElementById('edit-panel');
const tipBanner = document.getElementById('tip-banner');
const tipText = document.getElementById('tip-text');

// Buttons & Controls
const langToggle = document.getElementById('lang-toggle');
const themeToggle = document.getElementById('theme-toggle');
const modeEdit = document.getElementById('mode-edit');
const modeLive = document.getElementById('mode-live');
const modePreview = document.getElementById('mode-preview');
const modeSplit = document.getElementById('mode-split');
const modeFocus = document.getElementById('mode-focus');
const exportMd = document.getElementById('export-md');
const exportTxt = document.getElementById('export-txt');
const exportPdf = document.getElementById('export-pdf');
const cheatsheetBtn = document.getElementById('cheatsheet-btn');
const closeCheatsheet = document.getElementById('close-cheatsheet');
const cheatsheetModal = document.getElementById('cheatsheet-modal');
const mdStatsToggle = document.getElementById('md-stats-toggle');
const autoCloseToggle = document.getElementById('auto-close-toggle');

// Stats Elements
const charCountEl = document.getElementById('char-count');
const wordCountEl = document.getElementById('word-count');
const paraCountEl = document.getElementById('para-count');

// =============================================
// INITIALIZATION (ONCE)
// =============================================
function init() {
    if (!editor || !pageTitle) {
        console.error("Critical elements not found. Check HTML IDs.");
        return;
    }

    // Load saved content
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
        editor.value = savedContent;
    }
    
    // Apply saved settings immediately
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    
    if (currentStatsMode === 'md-clean' && mdStatsToggle) mdStatsToggle.checked = true;
    else if (mdStatsToggle) mdStatsToggle.checked = false;
    
    if (autoCloseEnabled && autoCloseToggle) autoCloseToggle.checked = true;
    
    // Show sticky tip ONCE
    showStickyTip();
    
    // Set default view mode FIRST
    setViewMode('split');
    
    // Initial render and stats
    updatePreview();
    updateStats();
    
    // Setup ALL event listeners
    setupEventListeners();
}

// =============================================
// STICKY TIP DISPLAY
// =============================================
function showStickyTip() {
    if (!tipBanner || !tipText) return;
    
    // Don't show if already closed before
    if (localStorage.getItem('tip-closed') === 'true') {
        tipBanner.classList.add('hidden');
        return;
    }
    
    const tipsForLang = tips[currentLanguage];
    const randomIndex = Math.floor(Math.random() * tipsForLang.length);
    tipText.textContent = tipsForLang[randomIndex];
    
    // Add close button only once
    if (!document.querySelector('.close-tip-btn')) {
        const closeTipBtn = document.createElement('span');
        closeTipBtn.textContent = '✕';
        closeTipBtn.className = 'close-tip-btn';
        closeTipBtn.title = translations[currentLanguage].closeTip || 'Close';
        closeTipBtn.style.cssText = 'margin-left:15px; cursor:pointer; font-weight:bold; font-size:1rem; opacity:0.8; transition:opacity 0.2s; padding:2px 6px; border-radius:4px;';
        closeTipBtn.onmouseover = () => { closeTipBtn.style.opacity = '1'; closeTipBtn.style.backgroundColor = 'rgba(255,255,255,0.2)'; };
        closeTipBtn.onmouseout = () => { closeTipBtn.style.opacity = '0.8'; closeTipBtn.style.backgroundColor = 'transparent'; };
        
        closeTipBtn.onclick = () => {
            tipBanner.classList.add('hidden');
            localStorage.setItem('tip-closed', 'true'); // Remember it was closed
        };
        
        tipBanner.appendChild(closeTipBtn);
    }
    
    tipBanner.classList.remove('hidden');
}

// =============================================
// GLOBAL FORMAT FUNCTION
// =============================================
window.insertFormat = function(format) {
    if (!editor) return;
    
    const startPos = editor.selectionStart;
    const endPos = editor.selectionEnd;
    const text = editor.value;
    const before = text.substring(0, startPos);
    const selected = text.substring(startPos, endPos);
    const after = text.substring(endPos);
    
    let newText;
    let newCursorStart, newCursorEnd;
    
    if (format.includes('# ') && !format.includes('[')) {
        const lines = selected.trim().split('\n').filter(l => l.trim());
        if (lines.length > 0) {
            newText = before + lines.map(line => format + line).join('\n') + after;
        } else {
            newText = before + format + after;
        }
        newCursorStart = startPos + format.length;
        newCursorEnd = newCursorStart + selected.length;
    } else if (format.includes('[') && format.includes(']')) {
        const urlMatch = format.match(/\((.*?)\)/);
        const url = urlMatch ? urlMatch[1] : '';
        if (selected.trim()) {
            newText = before + '[' + selected + '](' + url + ')' + after;
        } else {
            newText = before + '[link](' + url + ')' + after;
            newCursorStart = startPos + 1;
            newCursorEnd = newCursorStart;
        }
    } else if (format.includes('```\n')) {
        newText = before + format + '\n' + after;
        newCursorStart = startPos + format.length + 1;
        newCursorEnd = newCursorStart;
    } else if (format === '> ') {
        const lines = selected.split('\n');
        const wrappedLines = lines.map(line => '> ' + line).join('\n');
        newText = before + wrappedLines + after;
        newCursorStart = startPos + 2;
        newCursorEnd = newCursorStart + selected.length;
    } else if (format === '\n---\n') {
        newText = before + format + after;
        newCursorStart = startPos + format.length;
        newCursorEnd = newCursorStart;
    } else if (format === '<u>') {
        newText = before + format + selected + '</u>' + after;
        newCursorStart = startPos + 3;
        newCursorEnd = newCursorStart + selected.length;
    } else {
        newText = before + format + selected + format + after;
        newCursorStart = startPos + format.length;
        newCursorEnd = newCursorStart + selected.length;
    }
    
    editor.value = newText;
    
    if (newCursorStart !== undefined) {
        editor.selectionStart = newCursorStart;
        editor.selectionEnd = newCursorEnd;
    }
    
    editor.focus();
    updatePreview();
    updateStats();
    localStorage.setItem(STORAGE_KEY, editor.value);
};

// =============================================
// EVENT LISTENERS SETUP (ONCE ONLY)
// =============================================
function setupEventListeners() {
    // Editor input
    editor.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, editor.value);
        updatePreview();
        updateStats();
    });
    
    // Format bar show/hide
    editor.addEventListener('focus', () => {
        if (formatBar) formatBar.classList.remove('hidden');
    });
    
    editor.addEventListener('blur', (e) => {
        setTimeout(() => {
            const activeEl = document.activeElement;
            const isFormatButton = activeEl && (activeEl.classList.contains('fmt-btn') || activeEl.closest('.format-bar'));
            
            if (!isFormatButton && formatBar) formatBar.classList.add('hidden');
        }, 150);
    });
    
    // Prevent blur when clicking format buttons
    if (formatBar) {
        formatBar.addEventListener('mousedown', (e) => e.preventDefault());
    }
    
    // Theme toggle
    if (themeToggle) themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });
    
    // Language toggle
    if (langToggle) langToggle.addEventListener('click', () => {
        const newLang = currentLanguage === 'el' ? 'en' : 'el';
        applyLanguage(newLang);
    });
    
    // View modes
    if (modeEdit) modeEdit.addEventListener('click', () => setViewMode('edit'));
    if (modeLive) modeLive.addEventListener('click', () => setViewMode('live'));
    if (modePreview) modePreview.addEventListener('click', () => setViewMode('preview'));
    if (modeSplit) modeSplit.addEventListener('click', () => setViewMode('split'));
    if (modeFocus) modeFocus.addEventListener('click', () => toggleFocusMode());
    
    // Stats toggle
    if (mdStatsToggle) mdStatsToggle.addEventListener('change', (e) => {
        currentStatsMode = e.target.checked ? 'md-clean' : 'raw';
        localStorage.setItem(STATS_KEY, currentStatsMode);
        updateStats();
    });
    
    // Auto-close toggle
    if (autoCloseToggle) autoCloseToggle.addEventListener('change', (e) => {
        autoCloseEnabled = e.target.checked;
        localStorage.setItem(AUTO_CLOSE_KEY, autoCloseEnabled);
    });
    
    // Export buttons
    if (exportMd) exportMd.addEventListener('click', () => downloadFile(editor.value, 'document.md', 'text/markdown'));
    if (exportTxt) exportTxt.addEventListener('click', () => downloadFile(editor.value, 'document.txt', 'text/plain'));
    if (exportPdf) exportPdf.addEventListener('click', () => window.print());
    
    // Cheatsheet modal
    if (cheatsheetBtn) cheatsheetBtn.addEventListener('click', () => {
        populateCheatsheet();
        if (cheatsheetModal) cheatsheetModal.classList.remove('hidden');
    });
    
    if (closeCheatsheet) closeCheatsheet.addEventListener('click', () => {
        if (cheatsheetModal) cheatsheetModal.classList.add('hidden');
    });
    
    if (cheatsheetModal) cheatsheetModal.addEventListener('click', (e) => {
        if (e.target === cheatsheetModal) cheatsheetModal.classList.add('hidden');
    });
    
    // Live mode click-to-edit
    if (preview && preview.parentElement) {
        preview.parentElement.addEventListener('click', (e) => {
            if (pageBody.classList.contains('live-mode') && 
                !pageBody.classList.contains('live-editing') &&
                !e.target.closest('.toolbar') &&
                !e.target.closest('.top-bar')) {
                
                e.stopPropagation();
                pageBody.classList.add('live-editing');
                
                if (editor) {
                    editor.focus();
                    editor.selectionStart = editor.value.length;
                    editor.selectionEnd = editor.value.length;
                }
            }
        });
    }
    
    // KEYBOARD SHORTCUTS & AUTO-CLOSE
    document.addEventListener('keydown', (e) => {
        const isTypingInEditor = document.activeElement === editor;
        
        // ESCAPE
        if (e.key === 'Escape') {
            if (pageBody.classList.contains('focus-mode')) toggleFocusMode();
            if (pageBody.classList.contains('live-mode') && pageBody.classList.contains('live-editing')) {
                pageBody.classList.remove('live-editing');
                e.preventDefault();
            }
            if (cheatsheetModal && !cheatsheetModal.classList.contains('hidden')) {
                cheatsheetModal.classList.add('hidden');
            }
        }
        
        // Shortcuts (only in editor)
        if (isTypingInEditor && (e.ctrlKey || e.metaKey)) {
            const key = e.key.toLowerCase();
            if (key === 'b') { e.preventDefault(); insertFormat('**'); }
            else if (key === 'i') { e.preventDefault(); insertFormat('*'); }
            else if (key === 'k') { e.preventDefault(); insertFormat('[link](https://example.com)'); }
            else if (key === 'h') { e.preventDefault(); insertFormat('# '); }
            else if (key === 'l') { e.preventDefault(); insertFormat('- '); }
        }
    });
    
    // AUTO-CLOSE BRACKETS (in editor only)
    if (editor) {
        editor.addEventListener('keydown', (e) => {
            if (!autoCloseEnabled || e.shiftKey) return;
            
            const pairs = {'(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`'};
            
            // Special: asterisk → **
            if (e.key === '*') {
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(editor.selectionStart, editor.selectionEnd);
                editor.setRangeText('**' + sel + '**', pos, pos + sel.length, 'select');
                updatePreview(); updateStats(); localStorage.setItem(STORAGE_KEY, editor.value);
                return;
            }
            
            // Special: underscore → __
            if (e.key === '_') {
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(editor.selectionStart, editor.selectionEnd);
                editor.setRangeText('__' + sel + '__', pos, pos + sel.length, 'select');
                updatePreview(); updateStats(); localStorage.setItem(STORAGE_KEY, editor.value);
                return;
            }
            
            // Regular pairs
            if (pairs[e.key]) {
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(editor.selectionStart, editor.selectionEnd);
                editor.setRangeText(e.key + sel + pairs[e.key], pos, pos + sel.length, 'select');
                updatePreview(); updateStats(); localStorage.setItem(STORAGE_KEY, editor.value);
            }
        });
    }
}

// =============================================
// THEME & LANGUAGE HANDLERS
// =============================================
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
}

function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem(LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    if (pageTitle) pageTitle.textContent = translations[lang].pageTitle;
    
    document.querySelectorAll('[data-lang-key]').forEach(btn => {
        const key = btn.getAttribute('data-lang-key');
        if (translations[lang][key]) btn.textContent = translations[lang][key];
    });
    
    document.querySelectorAll('.stat-label').forEach((label, index) => {
        const key = label.dataset.langKey;
        if (index === 0 && key === 'chars') label.textContent = translations[lang].chars;
        if (index === 1 && key === 'words') label.textContent = translations[lang].words;
        if (index === 2 && key === 'paragraphs') label.textContent = translations[lang].paragraphs;
    });
    
    if (cheatsheetModal && !cheatsheetModal.classList.contains('hidden')) populateCheatsheet();
    
    // Update close tip button title
    const closeTipBtn = document.querySelector('.close-tip-btn');
    if (closeTipBtn) closeTipBtn.title = translations[lang].closeTip || 'Close';
}

// =============================================
// VIEW MODE HANDLER
// =============================================
function setViewMode(mode) {
    pageBody.classList.remove('edit-only', 'preview-only', 'split-mode', 'live-mode', 'live-editing');
    
    [modeEdit, modeLive, modePreview, modeSplit].forEach(m => m?.classList.remove('active'));
    
    switch (mode) {
        case 'edit': pageBody.classList.add('edit-only'); modeEdit?.classList.add('active'); break;
        case 'live': pageBody.classList.add('live-mode'); modeLive?.classList.add('active'); break;
        case 'preview': pageBody.classList.add('preview-only'); modePreview?.classList.add('active'); break;
        case 'split': default: pageBody.classList.add('split-mode'); modeSplit?.classList.add('active'); break;
    }
}

// =============================================
// FOCUS MODE TOGGLE
// =============================================
function toggleFocusMode() {
    pageBody.classList.toggle('focus-mode');
    modeFocus?.classList.toggle('active');
}

// =============================================
// MARKDOWN RENDERING
// =============================================
function updatePreview() {
    if (typeof marked !== 'undefined') preview.innerHTML = marked.parse(editor.value);
    else preview.innerHTML = '<p style="color:red">Error: marked library not loaded.</p>';
}

// =============================================
// EXPORT FUNCTIONS
// =============================================
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

// =============================================
// CHEATSHEET DATA (ENRICHED)
// =============================================
const cheatsheetData = {
    el: {
        basic: [
            { title: 'Κεφαλίδα 1', example: '# Κεφαλίδα 1', desc: 'Ένα # για H1' },
            { title: 'Κεφαλίδα 2', example: '## Κεφαλίδα 2', desc: 'Δύο ## για H2' },
            { title: 'Κεφαλίδα 3', example: '### Κεφαλίδα 3', desc: 'Τρία ### για H3' },
            { title: 'Έντονο', example: '**έντονο κείμενο**', desc: 'Δύο αστερίσκοι' },
            { title: 'Πλάγιο', example: '*πλάγιο κείμενο*', desc: 'Ένας αστέρισκος' },
            { title: 'Σύνδεσμος', example: '[Τίτλος](https://example.com)', desc: '[Ίσως](URL)' },
            { title: 'Λίστα', example: '- Στοιχείο 1\n- Στοιχείο 2', desc: 'Ξεκινά με -' },
            { title: 'Αριθμημένη Λίστα', example: '1. Πρώτο\n2. Δεύτερο', desc: 'Ξεκινά με αριθμό.' }
        ],
        advanced: [
            { title: 'Μπλοκ Κώδικα', example: '```\ncode here\n```', desc: 'Τρία backticks' },
            { title: 'Inline Κώδικας', example: '`code`', desc: 'Ένα backtick' },
            { title: 'Παράθεση', example: '> Παράθεση', desc: 'Προσθήκη >' },
            { title: 'Εικόνα', example: '![Alt Text](image.jpg)', desc: 'Όμοιο με σύνδεσμο με !' },
            { title: 'Πίνακας', example: '| Col1 | Col2 |\n|------|------|\n| A | B |', desc: 'Χρήση | για στήλες' },
            { title: 'Διαχωριστική Γραμμή', example: '---', desc: 'Τρεις παύλες' },
            { title: 'Υπογράμμιση', example: '<u>Υπογραμμισμένο</u>', desc: 'HTML tag' },
            { title: 'Νέα Παράγραφος', example: '\\n\\n', desc: 'Δύο κενές γραμμές' }
        ]
    },
    en: {
        basic: [
            { title: 'Heading 1', example: '# Heading 1', desc: 'One # for H1' },
            { title: 'Heading 2', example: '## Heading 2', desc: 'Two ## for H2' },
            { title: 'Heading 3', example: '### Heading 3', desc: 'Three ### for H3' },
            { title: 'Bold', example: '**bold text**', desc: 'Double asterisks' },
            { title: 'Italic', example: '*italic text*', desc: 'Single asterisk' },
            { title: 'Link', example: '[Title](https://example.com)', desc: '[Text](URL)' },
            { title: 'List', example: '- Item 1\n- Item 2', desc: 'Starts with -' },
            { title: 'Ordered List', example: '1. First\n2. Second', desc: 'Starts with number.' }
        ],
        advanced: [
            { title: 'Code Block', example: '```\ncode here\n```', desc: 'Triple backticks' },
            { title: 'Inline Code', example: '`code`', desc: 'Single backtick' },
            { title: 'Blockquote', example: '> Quote', desc: 'Add > at start' },
            { title: 'Image', example: '![Alt Text](image.jpg)', desc: 'Like link with !' },
            { title: 'Table', example: '| Col1 | Col2 |\n|------|------|\n| A | B |', desc: 'Use | for columns' },
            { title: 'Horizontal Rule', example: '---', desc: 'Three dashes' },
            { title: 'Underline', example: '<u>Underlined</u>', desc: 'HTML tag' },
            { title: 'New Paragraph', example: '\\n\\n', desc: 'Two empty lines' }
        ]
    }
};

function populateCheatsheet() {
    const container = document.getElementById('cheatsheet-body');
    if (!container) return;
    
    const data = cheatsheetData[currentLanguage];
    const t = translations[currentLanguage];
    
    let html = `<div class="cheatsheet-section"><h3>${t.basic}</h3>`;
    data.basic.forEach(item => {
        html += `<div class="cheatsheet-item"><h4>${item.title}</h4><p><small>${item.desc}</small></p><code>${item.example.replace(/\n/g, '<br>')}</code></div>`;
    });
    html += `</div><div class="cheatsheet-section"><h3>${t.advanced}</h3>`;
    data.advanced.forEach(item => {
        html += `<div class="cheatsheet-item"><h4>${item.title}</h4><p><small>${item.desc}</small></p><code>${item.example.replace(/\n/g, '<br>')}</code></div>`;
    });
    html += `</div>`;
    
    container.innerHTML = html;
}

// =============================================
// STATISTICS CALCULATION
// =============================================
function updateStats() {
    const text = editor.value;
    let charCount, wordCount, paragraphCount;
    
    if (currentStatsMode === 'md-clean') {
        const cleanText = text.replace(/^(#{1,6}\s)/gm, '').replace(/^\s*[-*+]\s+/gm, '').replace(/^\s*\d+\.\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/`(.*?)`/g, '$1').replace(/^>\s+/gm, '');
        
        charCount = cleanText.length;
        const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
        wordCount = cleanText.trim() === '' ? 0 : words.length;
        paragraphCount = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    } else {
        charCount = text.length;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        wordCount = text.trim() === '' ? 0 : words.length;
        paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    }
    
    if (charCountEl) charCountEl.textContent = charCount.toLocaleString();
    if (wordCountEl) wordCountEl.textContent = wordCount.toLocaleString();
    if (paraCountEl) paraCountEl.textContent = paragraphCount.toLocaleString();
}

// =============================================
// START INITIALIZATION
// =============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}