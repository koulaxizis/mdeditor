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
let autoCloseEnabled = false; // Default value, will be set in init()

// Translations Object
const translations = {
    el: {
        pageTitle: 'Μινιμαλιστικός επεξεργαστής Markdown',
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
        pageTitle: 'Minimalist Markdown Editor',
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
const tipBanner = document.getElementById('tip-banner');
const tipText = document.getElementById('tip-text');
const focusToast = document.getElementById('focus-toast');

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

const charCountEl = document.getElementById('char-count');
const wordCountEl = document.getElementById('word-count');
const paraCountEl = document.getElementById('para-count');

// =============================================
// INITIALIZATION
// =============================================
function init() {
    if (!editor || !pageTitle) {
        console.error("Critical elements not found.");
        return;
    }

    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) editor.value = savedContent;
    
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    
    if (currentStatsMode === 'md-clean' && mdStatsToggle) mdStatsToggle.checked = true;
    else if (mdStatsToggle) mdStatsToggle.checked = false;
    
    // FIX: Load Auto-Close state from localStorage FIRST
    const savedAutoClose = localStorage.getItem(AUTO_CLOSE_KEY);
    autoCloseEnabled = (savedAutoClose === 'true');
    
    if (autoCloseToggle) {
        autoCloseToggle.checked = autoCloseEnabled;
        console.log("✓ Initial Auto-Close state loaded:", autoCloseEnabled);
    }
    
    showStickyTip();
    setViewMode('split');
    updatePreview();
    updateStats();
    
    setupEventListeners();
}

// =============================================
// STICKY TIP
// =============================================
function showStickyTip() {
    if (!tipBanner || !tipText) return;
    if (localStorage.getItem('tip-closed') === 'true') {
        tipBanner.classList.add('hidden');
        return;
    }
    
    const tipsForLang = tips[currentLanguage];
    const randomIndex = Math.floor(Math.random() * tipsForLang.length);
    tipText.textContent = tipsForLang[randomIndex];
    
    if (!document.querySelector('.close-tip-btn')) {
        const btn = document.createElement('span');
        btn.textContent = '✕';
        btn.className = 'close-tip-btn';
        btn.style.cssText = 'margin-left:15px; cursor:pointer; font-weight:bold; opacity:0.8; padding:2px 6px; border-radius:4px;';
        btn.onmouseover = () => { btn.style.opacity = '1'; btn.style.backgroundColor = 'rgba(255,255,255,0.2)'; };
        btn.onmouseout = () => { btn.style.opacity = '0.8'; btn.style.backgroundColor = 'transparent'; };
        btn.onclick = () => {
            tipBanner.classList.add('hidden');
            localStorage.setItem('tip-closed', 'true');
        };
        tipBanner.appendChild(btn);
    }
    tipBanner.classList.remove('hidden');
}

// =============================================
// GLOBAL FORMAT FUNCTION (FIXED LIST BUG)
// =============================================
window.insertFormat = function(format) {
    if (!editor) return;
    
    const startPos = editor.selectionStart;
    const endPos = editor.selectionEnd;
    const text = editor.value;
    const before = text.substring(0, startPos);
    const selected = text.substring(startPos, endPos);
    const after = text.substring(endPos);
    
    let newText, newCursorStart, newCursorEnd;
    
    // FIX: Corrected List format (was '- -', now '- ')
    if (format === '- ') {
        const lines = before.split('\n');
        const lastLine = lines[lines.length - 1];
        const hasListPrefix = /^\s*[-*]\s/.test(lastLine);
        
        if (hasListPrefix) {
            newText = text + '\n- ';
            newCursorStart = startPos + 2;
            newCursorEnd = newCursorStart;
        } else {
            newText = before + format + selected + after;
            newCursorStart = startPos + 2;
            newCursorEnd = newCursorStart + selected.length;
        }
    } else if (format.includes('# ') && !format.includes('[')) {
        const lines = selected.trim().split('\n').filter(l => l.trim());
        newText = before + (lines.length ? lines.map(l => format + l).join('\n') : format) + after;
        newCursorStart = startPos + format.length;
        newCursorEnd = newCursorStart + selected.length;
    } else if (format.includes('[') && format.includes(']')) {
        const urlMatch = format.match(/\((.*?)\)/);
        const url = urlMatch ? urlMatch[1] : '';
        newText = before + '[' + (selected.trim() ? selected : 'link') + '](' + url + ')' + after;
        newCursorStart = startPos + 1;
        newCursorEnd = newCursorStart + (selected.trim() ? selected.length : 4);
    } else if (format.includes('```\n')) {
        newText = before + format + '\n' + after;
        newCursorStart = startPos + format.length + 1;
        newCursorEnd = newCursorStart;
    } else if (format === '> ') {
        const lines = selected.split('\n');
        newText = before + lines.map(l => '> ' + l).join('\n') + after;
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
    editor.selectionStart = newCursorStart;
    editor.selectionEnd = newCursorEnd;
    editor.focus();
    
    updatePreview();
    updateStats();
    localStorage.setItem(STORAGE_KEY, editor.value);
};

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    // --- Editor Input ---
    editor.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, editor.value);
        updatePreview();
        updateStats();
    });

    // --- Toggles & Modes ---
    if (themeToggle) themeToggle.addEventListener('click', () => applyTheme(currentTheme === 'light' ? 'dark' : 'light'));
    if (langToggle) langToggle.addEventListener('click', () => applyLanguage(currentLanguage === 'el' ? 'en' : 'el'));
    
    if (modeEdit) modeEdit.addEventListener('click', () => setViewMode('edit'));
    if (modeLive) modeLive.addEventListener('click', () => setViewMode('live'));
    if (modePreview) modePreview.addEventListener('click', () => setViewMode('preview'));
    if (modeSplit) modeSplit.addEventListener('click', () => setViewMode('split'));
    
    if (modeFocus) modeFocus.addEventListener('click', () => {
        toggleFocusMode();
        if (pageBody.classList.contains('focus-mode')) showFocusToast();
    });
    
    if (mdStatsToggle) mdStatsToggle.addEventListener('change', e => {
        currentStatsMode = e.target.checked ? 'md-clean' : 'raw';
        localStorage.setItem(STATS_KEY, currentStatsMode);
        updateStats();
    });
    
    // --- AUTO-CLOSE TOGGLE (CRITICAL FIX) ---
    if (autoCloseToggle) {
        // Ensure state is synced on load (already done in init, but double-check here)
        autoCloseToggle.checked = autoCloseEnabled;
        
        autoCloseToggle.addEventListener('change', e => {
            autoCloseEnabled = e.target.checked;
            localStorage.setItem(AUTO_CLOSE_KEY, autoCloseEnabled);
            console.log("✓ Auto-Close updated via checkbox:", autoCloseEnabled);
        });
    }

    // --- Export ---
    if (exportMd) exportMd.addEventListener('click', () => downloadFile(editor.value, 'doc.md', 'text/markdown'));
    if (exportTxt) exportTxt.addEventListener('click', () => downloadFile(editor.value, 'doc.txt', 'text/plain'));
    if (exportPdf) exportPdf.addEventListener('click', () => window.print());

    // --- Cheatsheet ---
    if (cheatsheetBtn) cheatsheetBtn.addEventListener('click', () => { populateCheatsheet(); cheatsheetModal?.classList.remove('hidden'); });
    if (closeCheatsheet) closeCheatsheet.addEventListener('click', () => cheatsheetModal?.classList.add('hidden'));
    if (cheatsheetModal) cheatsheetModal.addEventListener('click', e => { if (e.target === cheatsheetModal) cheatsheetModal.classList.add('hidden'); });

    // --- Live Mode Click-to-Edit ---
    if (preview?.parentElement) {
        preview.parentElement.addEventListener('click', e => {
            if (pageBody.classList.contains('live-mode') && !pageBody.classList.contains('live-editing') && !e.target.closest('.toolbar') && !e.target.closest('.top-bar')) {
                e.stopPropagation();
                pageBody.classList.add('live-editing');
                editor.focus();
                editor.selectionStart = editor.selectionEnd = editor.value.length;
            }
        });
    }

    // --- CLEAR CONTENT BUTTON ---
    const clearBtn = document.getElementById('clear-content-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Είστε σίγουροι ότι θέλετε να εκκαθαρίσετε όλο το περιεχόμενο;')) {
                editor.value = '';
                localStorage.setItem(STORAGE_KEY, '');
                updatePreview();
                updateStats();
                editor.focus();
            }
        });
    }

    // --- KEYBOARD SHORTCUTS ---
    document.addEventListener('keydown', e => {
        const isEditorActive = document.activeElement === editor;
        
        if (e.key === 'Escape') {
            if (pageBody.classList.contains('focus-mode')) {
                toggleFocusMode();
                clearTimeout(window.focusToastTimer);
                if (focusToast) { focusToast.classList.remove('show'); setTimeout(() => focusToast.classList.add('hidden'), 300); }
            }
            if (pageBody.classList.contains('live-mode') && pageBody.classList.contains('live-editing')) {
                pageBody.classList.remove('live-editing');
                e.preventDefault();
            }
            if (cheatsheetModal && !cheatsheetModal.classList.contains('hidden')) {
                cheatsheetModal.classList.add('hidden');
                e.preventDefault();
            }
        }

        if (isEditorActive && (e.ctrlKey || e.metaKey)) {
            const key = e.key.toLowerCase();
            if (key === 'b') { e.preventDefault(); insertFormat('**'); }
            else if (key === 'i') { e.preventDefault(); insertFormat('*'); }
            else if (key === 'k') { e.preventDefault(); insertFormat('[link](https://example.com)'); }
            else if (key === 'h') { e.preventDefault(); insertFormat('# '); }
            else if (key === 'l') { e.preventDefault(); insertFormat('- '); }
        }
    });

    // ============================================
    // AUTO-CLOSE BRACKETS (COMPLETELY REWRITTEN)
    // ============================================
    if (editor) {
        editor.addEventListener('keydown', function(e) {
            // DEBUG LOGS
            console.log("KeyDown Event:", { 
                key: e.key, 
                length: e.key?.length, 
                enabled: autoCloseEnabled,
                activeElement: document.activeElement === editor,
                modifiers: { shift: e.shiftKey, ctrl: e.ctrlKey, meta: e.metaKey, alt: e.altKey }
            });
            
            // Check 1: Is Auto-Close enabled?
            if (!autoCloseEnabled) {
                console.log("❌ Auto-Close is DISABLED");
                return;
            }
            
            // Check 2: No modifier keys (Shift, Ctrl, etc.)
            if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
                console.log("❌ Modifier key pressed");
                return;
            }
            
            // Check 3: Is it a single character?
            if (typeof e.key !== 'string' || e.key.length !== 1) {
                console.log("❌ Not a single character");
                return;
            }
            
            const pairs = { 
                '(': ')', 
                '[': ']', 
                '{': '}', 
                '"': '"', 
                "'": "'", 
                '`': '`' 
            };
            
            // Special case: asterisk -> **
            if (e.key === '*') {
                console.log("✅ Processing * for bold");
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(pos, editor.selectionEnd);
                editor.setRangeText('**' + sel + '**', pos, pos + sel.length, 'select');
                editor.dispatchEvent(new Event('input'));
                return;
            }
            
            // Special case: underscore -> __
            if (e.key === '_') {
                console.log("✅ Processing _ for italic");
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(pos, editor.selectionEnd);
                editor.setRangeText('__' + sel + '__', pos, pos + sel.length, 'select');
                editor.dispatchEvent(new Event('input'));
                return;
            }
            
            // Regular pairs
            if (pairs[e.key]) {
                console.log(`✅ Processing pair: ${e.key}`);
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(pos, editor.selectionEnd);
                editor.setRangeText(e.key + sel + pairs[e.key], pos, pos + sel.length, 'select');
                editor.dispatchEvent(new Event('input'));
                return;
            }
            
            console.log("ℹ️ Character not in pairs list");
        });
    }
}

// =============================================
// FOCUS MODE TOAST NOTIFICATION
// =============================================
function showFocusToast() {
    if (!focusToast) return;
    focusToast.classList.remove('hidden');
    focusToast.classList.add('show');
    if (window.focusToastTimer) clearTimeout(window.focusToastTimer);
    window.focusToastTimer = setTimeout(() => {
        focusToast.classList.remove('show');
        setTimeout(() => focusToast.classList.add('hidden'), 300);
    }, 2000);
}

// =============================================
// HELPERS
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
    document.querySelectorAll('.stat-label').forEach((label, idx) => { 
        const keys = ['chars', 'words', 'paragraphs']; 
        if (keys[idx]) label.textContent = translations[lang][keys[idx]]; 
    });
    if (cheatsheetModal && !cheatsheetModal.classList.contains('hidden')) populateCheatsheet();
    const closeTip = document.querySelector('.close-tip-btn');
    if (closeTip) closeTip.title = translations[lang].closeTip || 'Close';
}

function setViewMode(mode) {
    pageBody.classList.remove('edit-only', 'preview-only', 'split-mode', 'live-mode', 'live-editing');
    [modeEdit, modeLive, modePreview, modeSplit].forEach(m => m?.classList.remove('active'));
    switch (mode) {
        case 'edit': pageBody.classList.add('edit-only'); modeEdit?.classList.add('active'); break;
        case 'live': pageBody.classList.add('live-mode'); modeLive?.classList.add('active'); break;
        case 'preview': pageBody.classList.add('preview-only'); modePreview?.classList.add('active'); break;
        default: pageBody.classList.add('split-mode'); modeSplit?.classList.add('active'); break;
    }
}

function toggleFocusMode() { 
    pageBody.classList.toggle('focus-mode'); 
    modeFocus?.classList.toggle('active'); 
}

function updatePreview() { 
    preview.innerHTML = typeof marked !== 'undefined' ? marked.parse(editor.value) : '<p style="color:red">Error</p>'; 
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

function populateCheatsheet() {
    const container = document.getElementById('cheatsheet-body');
    if (!container) return;
    const data = cheatsheetData[currentLanguage];
    const t = translations[currentLanguage];
    let html = `<div class="cheatsheet-section"><h3>${t.basic}</h3>`;
    data.basic.forEach(i => html += `<div class="cheatsheet-item"><h4>${i.title}</h4><p><small>${i.desc}</small></p><code>${i.example.replace(/\n/g, '<br>')}</code></div>`);
    html += `</div><div class="cheatsheet-section"><h3>${t.advanced}</h3>`;
    data.advanced.forEach(i => html += `<div class="cheatsheet-item"><h4>${i.title}</h4><p><small>${i.desc}</small></p><code>${i.example.replace(/\n/g, '<br>')}</code></div>`);
    html += `</div>`;
    container.innerHTML = html;
}

const cheatsheetData = {
    el: {
        basic: [
            { title: 'Κεφαλίδα 1', example: '# Κεφαλίδα', desc: 'Ένα #' },
            { title: 'Κεφαλίδα 2', example: '## Κεφαλίδα', desc: 'Δύο ##' },
            { title: 'Κεφαλίδα 3', example: '### Κεφαλίδα', desc: 'Τρία ###' },
            { title: 'Έντονο', example: '**τίτλος**', desc: 'Δύο αστερίσκοι' },
            { title: 'Πλάγιο', example: '*τίτλος*', desc: 'Ένας αστέρισκος' },
            { title: 'Σύνδεσμος', example: '[Τίτλος](url)', desc: '[Τίτλος](URL)' },
            { title: 'Λίστα', example: '- Στοιχείο', desc: 'Ξεκινά με -' },
            { title: 'Αριθμημένη', example: '1. Στοιχείο', desc: 'Ξεκινά με 1.' }
        ],
        advanced: [
            { title: 'Code Block', example: '```\ncode\n```', desc: 'Τρία backticks' },
            { title: 'Inline Code', example: '`code`', desc: 'Ένα backtick' },
            { title: 'Blockquote', example: '> Παράθεση', desc: 'Προσθήκη >' },
            { title: 'Εικόνα', example: '![Alt](url)', desc: 'Όμοιο με σύνδεσμο + !' },
            { title: 'Πίνακας', example: '| A | B |', desc: 'Χρήση |' },
            { title: 'Διαχωριστική', example: '---', desc: 'Τρεις παύλες' },
            { title: 'Υπογράμμιση', example: '<u>Text</u>', desc: 'HTML tag' },
            { title: 'Νέα Παράγραφος', example: '\\n\\n', desc: 'Δύο κενές γραμμές' }
        ]
    },
    en: {
        basic: [
            { title: 'Heading 1', example: '# Heading', desc: 'One #' },
            { title: 'Heading 2', example: '## Heading', desc: 'Two ##' },
            { title: 'Heading 3', example: '### Heading', desc: 'Three ###' },
            { title: 'Bold', example: '**text**', desc: 'Double asterisks' },
            { title: 'Italic', example: '*text*', desc: 'Single asterisk' },
            { title: 'Link', example: '[Title](url)', desc: '[Text](URL)' },
            { title: 'List', example: '- Item', desc: 'Starts with -' },
            { title: 'Ordered', example: '1. Item', desc: 'Starts with number.' }
        ],
        advanced: [
            { title: 'Code Block', example: '```\ncode\n```', desc: 'Triple backticks' },
            { title: 'Inline Code', example: '`code`', desc: 'Single backtick' },
            { title: 'Blockquote', example: '> Quote', desc: 'Add >' },
            { title: 'Image', example: '![Alt](url)', desc: 'Like link with !' },
            { title: 'Table', example: '| A | B |', desc: 'Use |' },
            { title: 'HR', example: '---', desc: 'Three dashes' },
            { title: 'Underline', example: '<u>Text</u>', desc: 'HTML tag' },
            { title: 'New Para', example: '\\n\\n', desc: 'Two empty lines' }
        ]
    }
};

function updateStats() {
    const text = editor.value;
    let c, w, p;
    if (currentStatsMode === 'md-clean') {
        const clean = text.replace(/^(#{1,6}\s)|^\s*[-*+]\s|^\s*\d+\.\s|\*\*(.*?)\*\*|\*(.*?)\*|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|`(.*?)`|^>\s+/gm, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
        c = clean.length;
        w = clean.trim() === '' ? 0 : clean.trim().split(/\s+/).filter(x => x).length;
        p = clean.split(/\n\s*\n/).filter(x => x.trim()).length;
    } else {
        c = text.length;
        w = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(x => x).length;
        p = text.split(/\n\s*\n/).filter(x => x.trim()).length;
    }
    if (charCountEl) charCountEl.textContent = c.toLocaleString();
    if (wordCountEl) wordCountEl.textContent = w.toLocaleString();
    if (paraCountEl) paraCountEl.textContent = p.toLocaleString();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();