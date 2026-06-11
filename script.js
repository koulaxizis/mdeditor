// =============================================
// CONFIGURATION & STATE
// =============================================
const STORAGE_KEY = 'lumo-markdown-editor-content';
const THEME_KEY = 'lumo-editor-theme';
const LANGUAGE_KEY = 'lumo-editor-language';
const STATS_KEY = 'lumo-editor-stats-mode';
const AUTO_CLOSE_KEY = 'lumo-editor-auto-close';

// VERSION CONFIGURATION
const APP_VERSION = "1.0.5";
const LAST_UPDATE_DATE = "11/06/2026";

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'el';
let currentTheme = localStorage.getItem(THEME_KEY) || 'light';
let currentStatsMode = localStorage.getItem(STATS_KEY) || 'md-clean';
let autoCloseEnabled = false;
let wordWrapEnabled = true; // Default: On
const WORDS_PER_MINUTE = 200;

// Translations
const translations = {
    el: {
        pageTitle: 'Μινιμαλιστικός επεξεργαστής Markdown',
        editMode: 'Επεξεργασία', previewMode: 'Προεπισκόπηση', splitMode: 'Διπλό Panel',
        liveMode: '👁️ Live', focusMode: '⦿ Focus', exportMD: 'MD', exportTXT: 'TXT',
        exportPDF: 'PDF', exportHTML: 'HTML', openFile: 'Άνοιγμα', cheatSheetTitle: 'Cheat Sheet Markdown',
        chars: 'χαρακτήρες', words: 'λέξεις', paragraphs: 'παράγραφοι', readingTime: 'ανάγνωση',
        cleanStats: 'MD Clean', autoClose: 'Auto-Close', basic: 'Βασικά', advanced: 'Προχωρημένα',
        closeTip: 'Κλείσιμο', shortcuts: 'Συντομεύσεις Πληκτρολογίου', exitMode: 'Έξοδος Λειτουργίας',
        fullGuide: 'Πλήρης Οδηγός Markdown', commonmark: 'CommonMark Spec', mdDesc: 'Η Markdown είναι μια ελαφριά γλώσσα.',
        bold: 'Έντονο', italic: 'Πλάγιο', link: 'Σύνδεσμος', list: 'Λίστα', strikethrough: 'Διαγράμμιση',
        toastSaved: 'Αυτόματη αποθήκευση ολοκληρώθηκε.',
        toastExport: 'Εξαγωγή ως {type} ολοκληρώθηκε.',
        toastError: 'Σφάλμα κατά τη διαδικασία.',
        toastLoaded: 'Το αρχείο φορτώθηκε επιτυχώς.',
        toastCopied: 'Το κείμενο αντιγράφηκε ως HTML.',
        toastCleared: 'Το περιεχόμενο εκκαθαρίστηκε.',
        ctxBold: 'Έντονο', ctxItalic: 'Πλάγιο', ctxStrike: 'Διαγράμμιση',
        ctxLink: 'Σύνδεσμος', ctxCopyHTML: 'Αντιγραφή ως HTML', ctxCut: 'Αποκοπή', ctxCopy: 'Αντιγραφή', ctxPaste: 'Επικόλληση'
    },
    en: {
        pageTitle: 'Minimalist Markdown Editor',
        editMode: 'Edit', previewMode: 'Preview', splitMode: 'Split View',
        liveMode: '👁️ Live', focusMode: '⦿ Focus', exportMD: 'MD', exportTXT: 'TXT',
        exportPDF: 'PDF', exportHTML: 'HTML', openFile: 'Open', cheatSheetTitle: 'Markdown Cheat Sheet',
        chars: 'characters', words: 'words', paragraphs: 'paragraphs', readingTime: 'reading time',
        cleanStats: 'MD Clean', autoClose: 'Auto-Close', basic: 'Basics', advanced: 'Advanced',
        closeTip: 'Close', shortcuts: 'Keyboard Shortcuts', exitMode: 'Exit Mode',
        fullGuide: 'Full Markdown Guide', commonmark: 'CommonMark Spec', mdDesc: 'Markdown is a lightweight markup language.',
        bold: 'Bold', italic: 'Italic', link: 'Link', list: 'List', strikethrough: 'Strikethrough',
        toastSaved: 'Auto-save completed.',
        toastExport: 'Export to {type} completed.',
        toastError: 'An error occurred.',
        toastLoaded: 'File loaded successfully.',
        toastCopied: 'Text copied as HTML.',
        toastCleared: 'Content cleared.',
        ctxBold: 'Bold', ctxItalic: 'Italic', ctxStrike: 'Strikethrough',
        ctxLink: 'Link', ctxCopyHTML: 'Copy as HTML', ctxCut: 'Cut', ctxCopy: 'Copy', ctxPaste: 'Paste'
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

// DOM Elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview-content');
const pageBody = document.body;
const pageTitle = document.getElementById('page-title');
const formatBar = document.getElementById('format-bar');
const tipBanner = document.getElementById('tip-banner');
const tipText = document.getElementById('tip-text');
const focusToast = document.getElementById('focus-toast');
const fileInput = document.getElementById('file-input');
const wordWrapBtn = document.getElementById('word-wrap-toggle');
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
const exportHtml = document.getElementById('export-html');
const openFileBtn = document.getElementById('open-file-btn');
const cheatsheetBtn = document.getElementById('cheatsheet-btn');
const closeCheatsheet = document.getElementById('close-cheatsheet');
const cheatsheetModal = document.getElementById('cheatsheet-modal');
const mdStatsToggle = document.getElementById('md-stats-toggle');
const autoCloseToggle = document.getElementById('auto-close-toggle');
const charCountEl = document.getElementById('char-count');
const wordCountEl = document.getElementById('word-count');
const paraCountEl = document.getElementById('para-count');
const readingTimeEl = document.getElementById('reading-time');
const cursorLineEl = document.getElementById('cursor-line');
const cursorColEl = document.getElementById('cursor-col');
const toastContainer = document.getElementById('toast-container');
const versionInfo = document.getElementById('version-info');

// =============================================
// TOAST NOTIFICATION SYSTEM
// =============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    
    let icon = '';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'warning') icon = '⚠️';
    else icon = 'ℹ️';
    
    toast.innerHTML = `${icon} ${message}`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =============================================
// INITIALIZATION
// =============================================
function init() {
    if (!editor || !pageTitle) { console.error("Critical elements not found."); return; }

    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) editor.value = savedContent;
    
    // Load settings
    wordWrapEnabled = localStorage.getItem('word-wrap') !== 'false';
    editor.style.whiteSpace = wordWrapEnabled ? 'pre-wrap' : 'pre';
    if(wordWrapBtn) wordWrapBtn.classList.toggle('active', wordWrapEnabled);

    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    
    if (currentStatsMode === 'md-clean' && mdStatsToggle) mdStatsToggle.checked = true;
    else if (mdStatsToggle) mdStatsToggle.checked = false;
    
    const savedAutoClose = localStorage.getItem(AUTO_CLOSE_KEY);
    autoCloseEnabled = (savedAutoClose === 'true');
    if (autoCloseToggle) autoCloseToggle.checked = autoCloseEnabled;
    
    showStickyTip();
    setViewMode('split');
    updatePreview();
    updateStats();
    updateCursorPosition();
    
    if (versionInfo) versionInfo.textContent = `V${APP_VERSION} | ${LAST_UPDATE_DATE}`;
    
    setupEventListeners();
    showToast(translations[currentLanguage].toastSaved, 'success');
}

// =============================================
// STICKY TIP
// =============================================
function showStickyTip() {
    if (!tipBanner || !tipText) return;
    if (localStorage.getItem('tip-closed') === 'true') { tipBanner.classList.add('hidden'); return; }
    
    const tipsForLang = tips[currentLanguage];
    const randomIndex = Math.floor(Math.random() * tipsForLang.length);
    tipText.textContent = tipsForLang[randomIndex];
    
    if (!document.querySelector('.close-tip-btn')) {
        const btn = document.createElement('span');
        btn.textContent = '✕';
        btn.className = 'close-tip-btn';
        btn.style.cssText = 'margin-left:15px; cursor:pointer; font-weight:bold; opacity:0.8; padding:2px 6px; border-radius:4px; font-size:0.9rem;';
        btn.onmouseover = () => { btn.style.opacity = '1'; btn.style.backgroundColor = 'rgba(255,255,255,0.2)'; };
        btn.onmouseout = () => { btn.style.opacity = '0.8'; btn.style.backgroundColor = 'transparent'; };
        btn.onclick = () => { tipBanner.classList.add('hidden'); localStorage.setItem('tip-closed', 'true'); };
        tipBanner.appendChild(btn);
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
    
    let newText, newCursorStart, newCursorEnd;
    
    if (format === '- ') {
        const lines = before.split('\n');
        const lastLine = lines[lines.length - 1];
        const hasListPrefix = /^\s*[-*]\s/.test(lastLine);
        if (hasListPrefix) {
            newText = before + '\n- ' + selected + after;
            newCursorStart = startPos + 3;
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
    } else if (format === '~~') {
        newText = before + format + selected + format + after;
        newCursorStart = startPos + 2;
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
    updateCursorPosition();
    localStorage.setItem(STORAGE_KEY, editor.value);
};

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    editor.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, editor.value);
        updatePreview();
        updateStats();
        updateCursorPosition();
    });
    
    editor.addEventListener('keyup', updateCursorPosition);
    editor.addEventListener('click', updateCursorPosition);

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
    
    if (autoCloseToggle) {
        autoCloseToggle.checked = autoCloseEnabled;
        autoCloseToggle.addEventListener('change', e => {
            autoCloseEnabled = e.target.checked;
            localStorage.setItem(AUTO_CLOSE_KEY, autoCloseEnabled);
        });
    }

    // Word Wrap Toggle
    if (wordWrapBtn) {
        wordWrapBtn.addEventListener('click', () => {
            wordWrapEnabled = !wordWrapEnabled;
            editor.style.whiteSpace = wordWrapEnabled ? 'pre-wrap' : 'pre';
            wordWrapBtn.classList.toggle('active', wordWrapEnabled);
            localStorage.setItem('word-wrap', wordWrapEnabled);
            showToast(wordWrapEnabled ? 'Word Wrap: ON' : 'Word Wrap: OFF', 'info');
        });
    }

    if (exportMd) exportMd.addEventListener('click', () => { downloadFile(editor.value, 'document.md', 'text/markdown'); showToast(translations[currentLanguage].toastExport.replace('{type}', 'MD'), 'success'); });
    if (exportTxt) exportTxt.addEventListener('click', () => { downloadFile(editor.value, 'document.txt', 'text/plain'); showToast(translations[currentLanguage].toastExport.replace('{type}', 'TXT'), 'success'); });
    if (exportPdf) exportPdf.addEventListener('click', () => { window.print(); showToast('PDF Print Dialog Opened', 'info'); });
    if (exportHtml) exportHtml.addEventListener('click', () => { exportAsHTML(); showToast(translations[currentLanguage].toastExport.replace('{type}', 'HTML'), 'success'); });

    if (openFileBtn) openFileBtn.addEventListener('click', () => { if (fileInput) fileInput.click(); });
    if (fileInput) fileInput.addEventListener('change', handleFileOpen);

    if (cheatsheetBtn) cheatsheetBtn.addEventListener('click', () => { populateCheatsheet(); cheatsheetModal?.classList.remove('hidden'); });
    if (closeCheatsheet) closeCheatsheet.addEventListener('click', () => cheatsheetModal?.classList.add('hidden'));
    if (cheatsheetModal) cheatsheetModal.addEventListener('click', e => { if (e.target === cheatsheetModal) cheatsheetModal.classList.add('hidden'); });

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

    const clearBtn = document.getElementById('clear-content-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Είστε σίγουροι ότι θέλετε να εκκαθαρίσετε όλο το περιεχόμενο;')) {
                editor.value = '';
                localStorage.setItem(STORAGE_KEY, '');
                updatePreview();
                updateStats();
                updateCursorPosition();
                editor.focus();
                showToast(translations[currentLanguage].toastCleared, 'warning');
            }
        });
    }

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
    // CUSTOM CONTEXT MENU
    // ============================================
    editor.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        const t = translations[currentLanguage];
        const menuHTML = `
            <div class="custom-context-menu" style="position:fixed; top:${e.clientY}px; left:${e.clientX}px; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.2); min-width:180px; z-index:9999; overflow:hidden;">
                <div class="ctx-item" onclick="insertFormat('**')"><span>🔶</span> ${t.ctxBold}</div>
                <div class="ctx-item" onclick="insertFormat('*')"><span>🔸</span> ${t.ctxItalic}</div>
                <div class="ctx-item" onclick="insertFormat('~~')"><span>❌</span> ${t.ctxStrike}</div>
                <div class="ctx-item" onclick="insertFormat('[link](url)')"><span>🔗</span> ${t.ctxLink}</div>
                <div class="ctx-divider"></div>
                <div class="ctx-item" onclick="copyAsHTML()"><span>📋</span> ${t.ctxCopyHTML}</div>
                <div class="ctx-divider"></div>
                <div class="ctx-item" onclick="execCmd('cut')"><span>✂️</span> ${t.ctxCut}</div>
                <div class="ctx-item" onclick="execCmd('copy')"><span>📋</span> ${t.ctxCopy}</div>
                <div class="ctx-item" onclick="execCmd('paste')"><span>粘贴</span> ${t.ctxPaste}</div>
            </div>
        `;
        
        // Remove existing context menus
        const existingMenu = document.querySelector('.custom-context-menu');
        if (existingMenu) existingMenu.remove();
        
        // Add new menu
        const menu = document.createElement('div');
        menu.innerHTML = menuHTML;
        document.body.appendChild(menu);
        
        // Close on click outside
        const closeMenu = () => {
            if (document.querySelector('.custom-context-menu')) {
                document.querySelector('.custom-context-menu').remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
    });

    // ============================================
    // AUTO-CLOSE BRACKETS (FIXED CURSOR POSITION)
    // ============================================
    if (editor) {
        editor.addEventListener('keydown', function(e) {
            if (!autoCloseEnabled) return;
            
            const isSpecialChar = ['_', '*'].includes(e.key);
            if (!isSpecialChar && (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey)) return;
            if (typeof e.key !== 'string' || e.key.length !== 1) return;
            
            const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
            
            if (e.key === '*') {
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(pos, editor.selectionEnd);
                editor.setRangeText('**' + sel + '**', pos, pos + sel.length, 'end');
                editor.selectionStart = editor.selectionEnd = pos + 1;
                editor.dispatchEvent(new Event('input'));
                return;
            }
            
            if (e.key === '_') {
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(pos, editor.selectionEnd);
                editor.setRangeText('__' + sel + '__', pos, pos + sel.length, 'end');
                editor.selectionStart = editor.selectionEnd = pos + 1;
                editor.dispatchEvent(new Event('input'));
                return;
            }
            
            if (pairs[e.key]) {
                e.preventDefault();
                const pos = editor.selectionStart;
                const sel = editor.value.substring(pos, editor.selectionEnd);
                editor.setRangeText(e.key + sel + pairs[e.key], pos, pos + sel.length, 'end');
                editor.selectionStart = editor.selectionEnd = pos + 1;
                editor.dispatchEvent(new Event('input'));
                return;
            }
        });
    }
}

// =============================================
// HELPER FUNCTIONS
// =============================================
function copyAsHTML() {
    const htmlContent = marked.parse(editor.value);
    navigator.clipboard.writeText(htmlContent).then(() => {
        showToast(translations[currentLanguage].toastCopied, 'success');
    }).catch(err => {
        showToast(translations[currentLanguage].toastError, 'error');
    });
}

function execCmd(cmd) {
    document.execCommand(cmd);
}

function exportAsHTML() {
    const markdown = editor.value;
    const htmlContent = marked.parse(markdown);
    const fullHTML = `<!DOCTYPE html>
<html lang="${currentLanguage}">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
        h1 { border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; }
        code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
        blockquote { border-left: 4px solid #2196F3; padding-left: 1rem; color: #666; }
        img { max-width: 100%; height: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
        th { background: #f4f4f4; }
        s, del { text-decoration: line-through; }
    </style>
</head>
<body>${htmlContent}</body></html>`;
    downloadFile(fullHTML, 'document.html', 'text/html');
}

function handleFileOpen(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        editor.value = event.target.result;
        localStorage.setItem(STORAGE_KEY, editor.value);
        updatePreview();
        updateStats();
        updateCursorPosition();
        fileInput.value = '';
        showToast(translations[currentLanguage].toastLoaded, 'success');
    };
    reader.onerror = () => showToast(translations[currentLanguage].toastError, 'error');
    reader.readAsText(file);
}

function updateCursorPosition() {
    if (!editor) return;
    const text = editor.value;
    const pos = editor.selectionStart;
    const textUpToCursor = text.substring(0, pos);
    const lines = textUpToCursor.split('\n');
    const currentLine = lines.length;
    const currentColumn = lines[lines.length - 1].length + 1;
    if (cursorLineEl) cursorLineEl.textContent = currentLine;
    if (cursorColEl) cursorColEl.textContent = currentColumn;
}

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
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =============================================
// CHEATSHEET POPULATION
// =============================================
function populateCheatsheet() {
    const container = document.getElementById('cheatsheet-body');
    if (!container) return;
    const data = cheatsheetData[currentLanguage];
    const t = translations[currentLanguage];
    
    let html = `<div class="cheatsheet-section"><h3>${t.basic}</h3>`;
    data.basic.forEach(item => {
        html += `<div class="cheatsheet-item"><h4>${item.title}</h4><p><small>${item.desc}</small></p><code>${item.example.replace(/\n/g, '<br>')}</code></div>`;
    });
    html += `</div>`;
    
    html += `<div class="cheatsheet-section" id="shortcuts-section"><h3>🔑 ${t.shortcuts}</h3><table class="shortcuts-table">`;
    html += `<tr><td><code>Ctrl+B</code></td><td><strong>${t.bold}</strong></td><td>**text**</td></tr>`;
    html += `<tr><td><code>Ctrl+I</code></td><td><strong>${t.italic}</strong></td><td>*text*</td></tr>`;
    html += `<tr><td><code>Ctrl+H</code></td><td><strong>Heading</strong></td><td># Heading</td></tr>`;
    html += `<tr><td><code>Ctrl+K</code></td><td><strong>${t.link}</strong></td><td>[text](url)</td></tr>`;
    html += `<tr><td><code>Ctrl+L</code></td><td><strong>${t.list}</strong></td><td>- item</td></tr>`;
    html += `<tr><td><code>ESC</code></td><td><strong>${t.exitMode}</strong></td><td>Focus / Preview</td></tr>`;
    html += `</table></div>`;
    
    html += `<div class="cheatsheet-section"><h3>${t.advanced}</h3>`;
    data.advanced.forEach(item => {
        html += `<div class="cheatsheet-item"><h4>${item.title}</h4><p><small>${item.desc}</small></p><code>${item.example.replace(/\n/g, '<br>')}</code></div>`;
    });
    html += `</div>`;
    
    html += `<div class="markdown-ref-section"><h3>ℹ️ ${currentLanguage === 'el' ? 'Γλώσσα Markdown' : 'Markdown Language'}</h3>`;
    html += `<p style="font-size:0.9rem; margin-bottom:0.5rem;">${t.mdDesc}</p>`;
    html += `<p><a href="https://www.markdownguide.org/" target="_blank" rel="noopener noreferrer">📖 ${t.fullGuide}</a> • <a href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer">⚙️ ${t.commonmark}</a></p></div>`;
    
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
            { title: 'Διαγράμμιση', example: '~~κείμενο~~', desc: 'Δύο περισπωμένες' },
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
            { title: 'Strikethrough', example: '~~text~~', desc: 'Double tildes' },
            { title: 'New Para', example: '\\n\\n', desc: 'Two empty lines' }
        ]
    }
};

// =============================================
// UPDATED STATS CALCULATION
// =============================================
function updateStats() {
    const text = editor.value;
    let c, w, p, readingMins;
    
    if (currentStatsMode === 'md-clean') {
        const clean = text
            .replace(/^(#{1,6}\s)/gm, '')
            .replace(/^\s*[-*+]\s+/gm, '')
            .replace(/^\s*\d+\.\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/^>\s+/gm, '');
        c = clean.length;
        w = clean.trim() === '' ? 0 : clean.trim().split(/\s+/).filter(x => x.length > 0).length;
        p = clean.split(/\n\s*\n/).filter(x => x.trim().length > 0).length;
    } else {
        c = text.length;
        w = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(x => x.length > 0).length;
        p = text.split(/\n\s*\n/).filter(x => x.trim().length > 0).length;
    }
    
    readingMins = w === 0 ? 0 : Math.ceil(w / WORDS_PER_MINUTE);
    
    if (charCountEl) charCountEl.textContent = c.toLocaleString();
    if (wordCountEl) wordCountEl.textContent = w.toLocaleString();
    if (paraCountEl) paraCountEl.textContent = p.toLocaleString();
    if (readingTimeEl) readingTimeEl.textContent = readingMins;
}

// =============================================
// START
// =============================================
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();