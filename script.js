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
        autoClose: 'Auto-Close'
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
        autoClose: 'Auto-Close'
    }
};

// Tips
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
        '💡 Στο Live mode πάτα κλικ στο κείμενο για να γράψεις'
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
        '💡 In Live mode click text to edit'
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
const tipBanner = document.getElementById('tip-banner');
const tipText = document.getElementById('tip-text');
const mdStatsToggle = document.getElementById('md-stats-toggle');
const autoCloseToggle = document.getElementById('auto-close-toggle');

// Stats Elements
const charCountEl = document.getElementById('char-count');
const wordCountEl = document.getElementById('word-count');
const paraCountEl = document.getElementById('para-count');

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
    
    // Set random tip
    showRandomTip();
    
    // Initial render and stats
    updatePreview();
    updateStats();
    
    // Setup event listeners (ONLY ONCE!)
    setupEventListeners();
}

// =============================================
// EVENT LISTENERS SETUP - CENTRALIZED
// =============================================
function setupEventListeners() {
    // =================== EDITOR INPUT ===================
    editor.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, editor.value);
        updatePreview();
        updateStats();
    });
    
    // =================== FORMAT BAR ===================
    editor.addEventListener('focus', () => {
        if (formatBar) formatBar.classList.remove('hidden');
    });
    
    editor.addEventListener('blur', () => {
        if (formatBar) formatBar.classList.add('hidden');
    });
    
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
    
    if (editor) {
        editor.addEventListener('blur', (e) => {
            if (pageBody.classList.contains('live-mode') && pageBody.classList.contains('live-editing')) {
                setTimeout(() => {
                    const activeEl = document.activeElement;
                    const isFormatBtn = activeEl && activeEl.classList.contains('fmt-btn');
                    const isToolbar = activeEl && activeEl.closest('.toolbar');
                    const isCheatsheet = activeEl && activeEl.closest('.modal');
                    
                    if (!isFormatBtn && !isToolbar && !isCheatsheet) {
                        pageBody.classList.remove('live-editing');
                    }
                }, 150);
            }
        });
        
        // =================== KEYBOARD SHORTCUTS & AUTO-CLOSE ===================
        editor.addEventListener('keydown', (e) => {
            // ESCAPE KEY
            if (e.key === 'Escape') {
                if (pageBody.classList.contains('focus-mode')) {
                    toggleFocusMode();
                }
                if (pageBody.classList.contains('live-mode') && pageBody.classList.contains('live-editing')) {
                    pageBody.classList.remove('live-editing');
                    e.preventDefault();
                }
                return;
            }
            
            // AUTO-CLOSE BRACKETS
            if (autoCloseEnabled) {
                const pairs = {
                    '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`'
                };
                
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
                    return;
                }
            }
            
            // KEYBOARD SHORTCUTS (Ctrl+B, Ctrl+I, Ctrl+K, Ctrl+H)
            if (e.ctrlKey || e.metaKey) {
                if (e.key.toLowerCase() === 'b') {
                    e.preventDefault();
                    insertFormat('**');
                }
                if (e.key.toLowerCase() === 'i') {
                    e.preventDefault();
                    insertFormat('*');
                }
                if (e.key.toLowerCase() === 'k') {
                    e.preventDefault();
                    insertFormat('[link](https://example.com)');
                }
                if (e.key.toLowerCase() === 'h') {
                    e.preventDefault();
                    insertFormat('# ');
                }
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
// VIEW MODE HANDLER
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
// RANDOM TIP
// =============================================
function showRandomTip() {
    const tipsForLang = tips[currentLanguage];
    const randomIndex = Math.floor(Math.random() * tipsForLang.length);
    if (tipText) tipText.textContent = tipsForLang[randomIndex];
    if (tipBanner) tipBanner.classList.remove('hidden');
    
    setTimeout(() => {
        if (tipBanner) tipBanner.classList.add('hidden');
    }, 5000);
}

// =============================================
// CHEATSHEET DATA & POPULATION
// =============================================
const cheatsheetData = {
    el: [
        { title: 'Κεφαλίδα 1', example: '# Κεφαλίδα 1' },
        { title: 'Κεφαλίδα 2', example: '## Κεφαλίδα 2' },
        { title: 'Κεφαλίδα 3', example: '### Κεφαλίδα 3' },
        { title: 'Έντονο', example: '**έντονο κείμενο**' },
        { title: 'Πλάγιο', example: '*πλάγιο κείμενο*' },
        { title: 'Σύνδεσμος', example: '[Τίτλος](https://example.com)' },
        { title: 'Εικόνα', example: '![Alt](image.jpg)' },
        { title: 'Λίστα', example: '- Στοιχείο 1\n- Στοιχείο 2' },
        { title: 'Αριθμημένη Λίστα', example: '1. Πρώτο\n2. Δεύτερο' },
        { title: 'Κώδικας', example: '```\ncode here\n```' },
        { title: 'Παράθεση', example: '> Παράθεση' },
        { title: 'Πίνακας', example: '| Col1 | Col2 |\n|------|------|\n| A    | B    |' }
    ],
    en: [
        { title: 'Heading 1', example: '# Heading 1' },
        { title: 'Heading 2', example: '## Heading 2' },
        { title: 'Heading 3', example: '### Heading 3' },
        { title: 'Bold', example: '**bold text**' },
        { title: 'Italic', example: '*italic text*' },
        { title: 'Link', example: '[Title](https://example.com)' },
        { title: 'Image', example: '![Alt](image.jpg)' },
        { title: 'List', example: '- Item 1\n- Item 2' },
        { title: 'Ordered List', example: '1. First\n2. Second' },
        { title: 'Code', example: '```\ncode here\n```' },
        { title: 'Quote', example: '> Quote' },
        { title: 'Table', example: '| Col1 | Col2 |\n|------|------|\n| A    | B    |' }
    ]
};

function populateCheatsheet() {
    const container = document.getElementById('cheatsheet-body');
    if (!container) return;
    
    const items = cheatsheetData[currentLanguage];
    
    container.innerHTML = items.map(item => `
        <div class="cheatsheet-item">
            <h3>${item.title}</h3>
            <p>${item.example.replace(/\n/g, '<br>')}</p>
            <code>${item.example}</code>
        </div>
    `).join('');
}

// =============================================
// FORMAT BUTTON INSERT FUNCTION (GLOBAL)
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
    
    if (format.includes('# ')) {
        // Headers - add # before each line
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
};

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