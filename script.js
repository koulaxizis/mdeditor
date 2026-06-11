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

// Tips - Now sticky with close button
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
let editor = document.getElementById('editor');
const preview = document.getElementById('preview-content');
const pageBody = document.body;
const pageTitle = document.getElementById('page-title');
const formatBar = document.getElementById('format-bar');
const editorPanel = document.getElementById('edit-panel');
const tipBanner = document.getElementById('tip-banner');
const tipText = document.getElementById('tip-text');
const closeTipBtn = document.createElement('span'); // Create close button dynamically

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

// Track if format bar click is pending
let formatButtonClickPending = false;

// =============================================
// INITIALIZATION
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
    
    // Apply saved settings
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    
    // Stats toggle state
    if (currentStatsMode === 'md-clean') {
        if (mdStatsToggle) mdStatsToggle.checked = true;
    } else {
        if (mdStatsToggle) mdStatsToggle.checked = false;
    }
    
    // Auto-close toggle state
    if (autoCloseEnabled) {
        if (autoCloseToggle) autoCloseToggle.checked = true;
    }
    
    // Set random tip (STICKY)
    showStickyTip();
    
    // Initial render and stats
    updatePreview();
    updateStats();
    
    // Setup event listeners (ONLY ONCE!)
    setupEventListeners();
    
    // FIX: Initialize to SPLIT MODE correctly
    setViewMode('split');
}

// =============================================
// STICKY TIP DISPLAY
// =============================================
function showStickyTip() {
    if (!tipBanner || !tipText) return;
    
    const tipsForLang = tips[currentLanguage];
    const randomIndex = Math.floor(Math.random() * tipsForLang.length);
    tipText.textContent = tipsForLang[randomIndex];
    
    // Add close button
    if (tipBanner.children.length < 3) { // Avoid duplicate if called multiple times
        closeTipBtn.textContent = '✕';
        closeTipBtn.className = 'close-tip-btn';
        closeTipBtn.title = translations[currentLanguage].closeTip || 'Close';
        closeTipBtn.style.cssText = 'margin-left:15px; cursor:pointer; font-weight:bold; font-size:1rem; opacity:0.8; transition:opacity 0.2s;';
        closeTipBtn.onmouseover = () => closeTipBtn.style.opacity = '1';
        closeTipBtn.onmouseout = () => closeTipBtn.style.opacity = '0.8';
        
        closeTipBtn.onclick = () => {
            tipBanner.classList.add('hidden');
        };
        
        tipBanner.appendChild(closeTipBtn);
    }
    
    tipBanner.classList.remove('hidden');
}

// =============================================
// GLOBAL FORMAT FUNCTION
// =============================================
function doInsertFormat(format) {
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
        // Headers
        const lines = selected.trim().split('\n').filter(l => l.trim());
        if (lines.length > 0) {
            newText = before + lines.map(line => format + line).join('\n') + after;
        } else {
            newText = before + format + after;
        }
        newCursorStart = startPos + format.length;
        newCursorEnd = newCursorStart + selected.length;
    } else if (format.includes('[') && format.includes(']')) {
        // Links
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
        // Code blocks
        newText = before + format + '\n' + after;
        newCursorStart = startPos + format.length + 1;
        newCursorEnd = newCursorStart;
    } else if (format === '> ') {
        // Blockquotes
        const lines = selected.split('\n');
        const wrappedLines = lines.map(line => '> ' + line).join('\n');
        newText = before + wrappedLines + after;
        newCursorStart = startPos + 2;
        newCursorEnd = newCursorStart + selected.length;
    } else {
        // Simple wrapping (bold, italic, lists)
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
}

window.insertFormat = doInsertFormat;

// =============================================
// EVENT LISTENERS SETUP
// =============================================
function setupEventListeners() {
    // =================== EDITOR INPUT ===================
    editor.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, editor.value);
        updatePreview();
        updateStats();
    });
    
    // =================== FORMAT BAR SHOW/HIDE (IMPROVED) ===================
    editor.addEventListener('focus', () => {
        if (formatBar) formatBar.classList.remove('hidden');
    });
    
    editor.addEventListener('blur', (e) => {
        setTimeout(() => {
            const activeEl = document.activeElement;
            const isFormatButton = activeEl && (activeEl.classList.contains('fmt-btn') || activeEl.closest('.format-bar'));
            
            if (!isFormatButton) {
                if (formatBar) formatBar.classList.add('hidden');
            }
        }, 150);
    });
    
    if (formatBar) {
        formatBar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            formatButtonClickPending = true;
        });
    }
    
    // =================== THEME TOGGLE ===================
    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });
    
    // =================== LANGUAGE TOGGLE ===================
    langToggle.addEventListener('click', () => {
        const newLang = currentLanguage === 'el' ? 'en' : 'el';
        applyLanguage(newLang);
    });
    
    // =================== VIEW MODES ===================
    if (modeEdit) modeEdit.addEventListener('click', () => setViewMode('edit'));
    if (modeLive) modeLive.addEventListener('click', () => setViewMode('live'));
    if (modePreview) modePreview.addEventListener('click', () => setViewMode('preview'));
    if (modeSplit) modeSplit.addEventListener('click', () => setViewMode('split'));
    if (modeFocus) modeFocus.addEventListener('click', () => toggleFocusMode());
    
    // =================== STATS TOGGLE ===================
    if (mdStatsToggle) {
        mdStatsToggle.addEventListener('change', (e) => {
            currentStatsMode = e.target.checked ? 'md-clean' : 'raw';
            localStorage.setItem(STATS_KEY, currentStatsMode);
            updateStats();
        });
    }
    
    // =================== AUTO-CLOSE TOGGLE ===================
    if (autoCloseToggle) {
        autoCloseToggle.addEventListener('change', (e) => {
            autoCloseEnabled = e.target.checked;
            localStorage.setItem(AUTO_CLOSE_KEY, autoCloseEnabled);
        });
    }
    
    // =================== EXPORT BUTTONS ===================
    if (exportMd) exportMd.addEventListener('click', () => downloadFile(editor.value, 'document.md', 'text/markdown'));
    if (exportTxt) exportTxt.addEventListener('click', () => downloadFile(editor.value, 'document.txt', 'text/plain'));
    if (exportPdf) exportPdf.addEventListener('click', () => window.print());
    
    // =================== CHEATSHEET MODAL ===================
    if (cheatsheetBtn) cheatsheetBtn.addEventListener('click', () => {
        populateCheatsheet();
        if (cheatsheetModal) cheatsheetModal.classList.remove('hidden');
    });
    
    if (closeCheatsheet) closeCheatsheet.addEventListener('click', () => {
        if (cheatsheetModal) cheatsheetModal.classList.add('hidden');
    });
    
    if (cheatsheetModal) cheatsheetModal.addEventListener('click', (e) => {
        if (e.target === cheatsheetModal) {
            cheatsheetModal.classList.add('hidden');
        }
    });
    
    // =================== TRUE LIVE MODE LOGIC ===================
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
    
    // =================== KEYBOARD HANDLERS ===================
    // Document-level listener for global shortcuts that don't conflict with browser
    document.addEventListener('keydown', (e) => {
        // Only intercept if we are NOT typing in a modal or other input
        const isTypingInEditor = document.activeElement === editor;
        
        // ESCAPE KEY
        if (e.key === 'Escape') {
            if (pageBody.classList.contains('focus-mode')) {
                toggleFocusMode();
            }
            if (pageBody.classList.contains('live-mode') && pageBody.classList.contains('live-editing')) {
                pageBody.classList.remove('live-editing');
                e.preventDefault();
            }
            if (cheatsheetModal && !cheatsheetModal.classList.contains('hidden')) {
                cheatsheetModal.classList.add('hidden');
            }
        }
        
        // KEYBOARD SHORTCUTS (Ctrl/Cmd+B, I, K, H, L)
        // We only intercept if we are inside the editor to avoid blocking browser shortcuts
        if (isTypingInEditor && (e.ctrlKey || e.metaKey)) {
            const key = e.key.toLowerCase();
            if (key === 'b') {
                e.preventDefault();
                doInsertFormat('**');
            } else if (key === 'i') {
                e.preventDefault();
                doInsertFormat('*');
            } else if (key === 'k') {
                e.preventDefault();
                doInsertFormat('[link](https://example.com)');
            } else if (key === 'h') {
                e.preventDefault();
                doInsertFormat('# ');
            } else if (key === 'l') {
                e.preventDefault();
                doInsertFormat('- ');
            }
        }
    });
    
    // AUTO-CLOSE BRACKETS (in editor only)
    if (editor) {
        editor.addEventListener('keydown', (e) => {
            if (!autoCloseEnabled) return;
            
            // Skip if Shift is pressed
            if (e.shiftKey) return;
            
            const pairs = {
                '(': ')',
                '[': ']',
                '{': '}',
                '"': '"',
                "'": "'",
                '`': '`'
            };
            
            // Special case: asterisk for bold/italic
            if (e.key === '*') {
                e.preventDefault();
                const startPos = editor.selectionStart;
                const endPos = editor.selectionEnd;
                const text = editor.value;
                const before = text.substring(0, startPos);
                const selected = text.substring(startPos, endPos);
                const after = text.substring(endPos);
                
                const newText = before + '**' + selected + '**' + after;
                editor.value = newText;
                
                editor.selectionStart = startPos + 1;
                editor.selectionEnd = startPos + 1 + selected.length;
                editor.focus();
                
                updatePreview();
                updateStats();
                localStorage.setItem(STORAGE_KEY, editor.value);
                return;
            }
            
            // Special case: underscore for italic
            if (e.key === '_') {
                e.preventDefault();
                const startPos = editor.selectionStart;
                const endPos = editor.selectionEnd;
                const text = editor.value;
                const before = text.substring(0, startPos);
                const selected = text.substring(startPos, endPos);
                const after = text.substring(endPos);
                
                const newText = before + '__' + selected + '__' + after;
                editor.value = newText;
                
                editor.selectionStart = startPos + 1;
                editor.selectionEnd = startPos + 1 + selected.length;
                editor.focus();
                
                updatePreview();
                updateStats();
                localStorage.setItem(STORAGE_KEY, editor.value);
                return;
            }
            
            if (pairs[e.key]) {
                e.preventDefault();
                const startPos = editor.selectionStart;
                const endPos = editor.selectionEnd;
                const text = editor.value;
                const before = text.substring(0, startPos);
                const selected = text.substring(startPos, endPos);
                const after = text.substring(endPos);
                
                const closingChar = pairs[e.key];
                editor.value = before + e.key + selected + closingChar + after;
                
                editor.selectionStart = startPos + 1;
                editor.selectionEnd = startPos + 1 + selected.length;
                editor.focus();
                
                updatePreview();
                updateStats();
                localStorage.setItem(STORAGE_KEY, editor.value);
            }
        });
    }
}

// =============================================
// THEME HANDLER
// =============================================
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
}

// =============================================
// LANGUAGE HANDLER
// =============================================
function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem(LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    if (pageTitle) pageTitle.textContent = translations[lang].pageTitle;
    
    const buttons = document.querySelectorAll('[data-lang-key]');
    buttons.forEach(btn => {
        const key = btn.getAttribute('data-lang-key');
        if (translations[lang][key]) {
            btn.textContent = translations[lang][key];
        }
    });
    
    // Update close tip button text if exists
    if (closeTipBtn) {
        closeTipBtn.title = translations[lang].closeTip || 'Close';
    }
    
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach((label, index) => {
        const key = label.dataset.langKey;
        if (index === 0 && key === 'chars') label.textContent = translations[lang].chars;
        if (index === 1 && key === 'words') label.textContent = translations[lang].words;
        if (index === 2 && key === 'paragraphs') label.textContent = translations[lang].paragraphs;
    });
    
    if (cheatsheetModal && !cheatsheetModal.classList.contains('hidden')) {
        populateCheatsheet();
    }
}

// =============================================
// VIEW MODE HANDLER (FIXED INITIAL STATE)
// =============================================
function setViewMode(mode) {
    pageBody.classList.remove('edit-only', 'preview-only', 'split-mode', 'live-mode', 'live-editing');
    
    if (modeEdit) modeEdit.classList.remove('active');
    if (modeLive) modeLive.classList.remove('active');
    if (modePreview) modePreview.classList.remove('active');
    if (modeSplit) modeSplit.classList.remove('active');
    
    switch (mode) {
        case 'edit':
            pageBody.classList.add('edit-only');
            if (modeEdit) modeEdit.classList.add('active');
            break;
        case 'live':
            pageBody.classList.add('live-mode');
            if (modeLive) modeLive.classList.add('active');
            break;
        case 'preview':
            pageBody.classList.add('preview-only');
            if (modePreview) modePreview.classList.add('active');
            break;
        case 'split':
        default:
            pageBody.classList.add('split-mode');
            if (modeSplit) modeSplit.classList.add('active');
            break;
    }
}

// =============================================
// FOCUS MODE TOGGLE
// =============================================
function toggleFocusMode() {
    pageBody.classList.toggle('focus-mode');
    if (modeFocus) modeFocus.classList.toggle('active');
}

// =============================================
// MARKDOWN RENDERING
// =============================================
function updatePreview() {
    const markdown = editor.value;
    if (typeof marked !== 'undefined') {
        preview.innerHTML = marked.parse(markdown);
    } else {
        console.error("Marked library not loaded.");
        preview.innerHTML = '<p style="color:red">Error: Markdown parser not found.</p>';
    }
}

// =============================================
// EXPORT FUNCTIONS
// =============================================
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =============================================
// CHEATSHEET DATA (ENRICHED)
// =============================================
const cheatsheetData = {
    el: {
        basic: [
            { title: 'Κεφαλίδα 1', example: '# Κεφαλίδα 1', desc: 'Χρησιμοποίησε ένα # για H1' },
            { title: 'Κεφαλίδα 2', example: '## Κεφαλίδα 2', desc: 'Δύο #' για H2' },
            { title: 'Κεφαλίδα 3', example: '### Κεφαλίδα 3', desc: 'Τρία #' για H3' },
            { title: 'Έντονο', example: '**έντονο κείμενο**', desc: 'Δύο αστερίσκοι' },
            { title: 'Πλάγιο', example: '*πλάγιο κείμενο*', desc: 'Ένας αστέρισκος' },
            { title: 'Σύνδεσμος', example: '[Τίτλος](https://example.com)', desc: 'Γραμματική: [Ίσως](URL)' },
            { title: 'Λίστα', example: '- Στοιχείο 1\n- Στοιχείο 2', desc: 'Αρχίζει με - ή *' },
            { title: 'Αριθμημένη Λίστα', example: '1. Πρώτο\n2. Δεύτερο', desc: 'Αρχίζει με αριθμό.' }
        ],
        advanced: [
            { title: 'Μπλοκ Κώδικα', example: '```\ncode here\n```', desc: 'Τρία backticks πριν και μετά' },
            { title: 'Inline Κώδικας', example: '`code`', desc: 'Ένα backtick για inline' },
            { title: 'Παράθεση', example: '> Παράθεση', desc: 'Προσθήκη > στην αρχή γραμμής' },
            { title: 'Εικόνα', example: '![Alt Text](image.jpg)', desc: 'Όμοιο με σύνδεσμο, αλλά με !' },
            { title: 'Πίνακας', example: '| Col1 | Col2 |\n|------|------|\n| A    | B    |', desc: 'Χρησιμοποίησε | για στήλες' },
            { title: 'Διαχωριστική Γραμμή', example: '---', desc: 'Τρεις παύλες για γραμμή' },
            { title: 'Υπογράμμιση', example: '<u>Υπογραμμισμένο</u>', desc: 'HTML tag για υπογράμμιση' },
            { title: 'Κενό Γραμμής', example: '\\n\\n', desc: 'Δύο κενές γραμμές για νέα παράγραφο' }
        ]
    },
    en: {
        basic: [
            { title: 'Heading 1', example: '# Heading 1', desc: 'One # for H1' },
            { title: 'Heading 2', example: '## Heading 2', desc: 'Two ## for H2' },
            { title: 'Heading 3', example: '### Heading 3', desc: 'Three ### for H3' },
            { title: 'Bold', example: '**bold text**', desc: 'Double asterisks' },
            { title: 'Italic', example: '*italic text*', desc: 'Single asterisk' },
            { title: 'Link', example: '[Title](https://example.com)', desc: 'Syntax: [Text](URL)' },
            { title: 'List', example: '- Item 1\n- Item 2', desc: 'Starts with - or *' },
            { title: 'Ordered List', example: '1. First\n2. Second', desc: 'Starts with number.' }
        ],
        advanced: [
            { title: 'Code Block', example: '```\ncode here\n```', desc: 'Triple backticks before and after' },
            { title: 'Inline Code', example: '`code`', desc: 'Single backtick for inline' },
            { title: 'Blockquote', example: '> Quote', desc: 'Add > at start of line' },
            { title: 'Image', example: '![Alt Text](image.jpg)', desc: 'Like link but with !' },
            { title: 'Table', example: '| Col1 | Col2 |\n|------|------|\n| A    | B    |', desc: 'Use | for columns' },
            { title: 'Horizontal Rule', example: '---', desc: 'Three dashes for line' },
            { title: 'Underline', example: '<u>Underlined</u>', desc: 'HTML tag for underline' },
            { title: 'New Paragraph', example: '\\n\\n', desc: 'Two empty lines for new paragraph' }
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
        html += `
            <div class="cheatsheet-item">
                <h4>${item.title}</h4>
                <p><small>${item.desc}</small></p>
                <code>${item.example.replace(/\n/g, '<br>')}</code>
            </div>
        `;
    });
    html += `</div>`;
    
    html += `<div class="cheatsheet-section"><h3>${t.advanced}</h3>`;
    data.advanced.forEach(item => {
        html += `
            <div class="cheatsheet-item">
                <h4>${item.title}</h4>
                <p><small>${item.desc}</small></p>
                <code>${item.example.replace(/\n/g, '<br>')}</code>
            </div>
        `;
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
        const cleanText = text
            .replace(/^(#{1,6}\s)/gm, '')
            .replace(/^\s*[-*+]\s+/gm, '')
            .replace(/^\s*\d+\.\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/^>\s+/gm, '');
        
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