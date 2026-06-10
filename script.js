// =============================================
// CONFIGURATION & STATE
// =============================================
const STORAGE_KEY = 'lumo-markdown-editor-content';
const THEME_KEY = 'lumo-editor-theme';
const LANGUAGE_KEY = 'lumo-editor-language';

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'el';
let currentTheme = localStorage.getItem(THEME_KEY) || 'light';

// Translations
const translations = {
    el: {
        pageTitle: 'Επεξεργαστής Markdown',
        editMode: 'Επεξεργασία',
        previewMode: 'Προεπισκόπηση',
        splitMode: 'Διπλό Panel',
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
        table: 'Πίνακας'
		chars: 'χαρακτήρες',
        words: 'λέξεις',
        paragraphs: 'παράγραφοι'
    },
    en: {
        pageTitle: 'Markdown Editor',
        editMode: 'Edit',
        previewMode: 'Preview',
        splitMode: 'Split View',
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
        table: 'Table'
		chars: 'characters',
        words: 'words',
        paragraphs: 'paragraphs'
    }
};

// Tips (Random on each visit)
const tips = [
    el: [
        '💡 Χρησιμοποίησε `#` για τίτλους (# H1, ## H2, ### H3)',
        '💡 Έντονο κείμενο με `**κείμενο**`',
        '💡 Πλάγιο κείμενο με `*κείμενο*`',
        '💡 Συνδέσμους με `[κείμενο](url)`',
        '💡 Λίστες ξεκινούν με `-` ή `*`',
        '💡 Κώδικας inline: `code`',
        '💡 Blockquote: `> κείμενο`',
        '💡 Η τοπική αποθήκευση διατηρεί τα κείμενά σου'
    ],
    en: [
        '💡 Use `#` for headings (# H1, ## H2, ### H3)',
        '💡 Bold text with `**text**`',
        '💡 Italic text with `*text*`',
        '💡 Links with `[text](url)`',
        '💡 Lists start with `-` or `*`',
        '💡 Inline code: `code`',
        '💡 Blockquote: `> text`',
        '💡 Local storage keeps your texts safe'
    ]
};

// =============================================
// DOM ELEMENTS
// =============================================
const editor = document.getElementById('editor');
const preview = document.getElementById('preview-content');
const pageBody = document.body;
const pageTitle = document.getElementById('page-title');

// Buttons
const langToggle = document.getElementById('lang-toggle');
const themeToggle = document.getElementById('theme-toggle');
const modeEdit = document.getElementById('mode-edit');
const modePreview = document.getElementById('mode-preview');
const modeSplit = document.getElementById('mode-split');
const exportMd = document.getElementById('export-md');
const exportTxt = document.getElementById('export-txt');
const exportPdf = document.getElementById('export-pdf');
const cheatsheetBtn = document.getElementById('cheatsheet-btn');
const closeCheatsheet = document.getElementById('close-cheatsheet');
const cheatsheetModal = document.getElementById('cheatsheet-modal');
const tipBanner = document.getElementById('tip-banner');
const tipText = document.getElementById('tip-text');

// =============================================
// INITIALIZATION
// =============================================
function init() {
    // Load saved content
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
        editor.value = savedContent;
    }
    
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Apply saved language
    applyLanguage(currentLanguage);
    
    // Set random tip
    showRandomTip();
    
    // Setup listeners
    setupEventListeners();
    
    // Initial render
    updatePreview();
}

// =============================================
// LOCAL STORAGE HANDLERS
// =============================================
editor.addEventListener('input', () => {
    localStorage.setItem(STORAGE_KEY, editor.value);
    updatePreview();
});

// =============================================
// THEME HANDLER
// =============================================
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
}

themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});

// =============================================
// LANGUAGE HANDLER
// =============================================
function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem(LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    // Update title
    pageTitle.textContent = translations[lang].pageTitle;
    
    // Update button labels
    const buttons = document.querySelectorAll('[data-lang-key]');
    buttons.forEach(btn => {
        const key = btn.getAttribute('data-lang-key');
        if (translations[lang][key]) {
            btn.textContent = translations[lang][key];
        }
    });
    
    // Update cheatsheet
    populateCheatsheet();
}

langToggle.addEventListener('click', () => {
    const newLang = currentLanguage === 'el' ? 'en' : 'el';
    applyLanguage(newLang);
});

// =============================================
// VIEW MODE HANDLER
// =============================================
function setViewMode(mode) {
    // Remove all mode classes
    pageBody.classList.remove('edit-only', 'preview-only', 'split-mode');
    
    // Reset all buttons
    modeEdit.classList.remove('active');
    modePreview.classList.remove('active');
    modeSplit.classList.remove('active');
    
    // Apply selected mode
    switch (mode) {
        case 'edit':
            pageBody.classList.add('edit-only');
            modeEdit.classList.add('active');
            break;
        case 'preview':
            pageBody.classList.add('preview-only');
            modePreview.classList.add('active');
            break;
        case 'split':
            pageBody.classList.add('split-mode');
            modeSplit.classList.add('active');
            break;
    }
}

modeEdit.addEventListener('click', () => setViewMode('edit'));
modePreview.addEventListener('click', () => setViewMode('preview'));
modeSplit.addEventListener('click', () => setViewMode('split'));

// Initialize default view mode
setViewMode('split');

// =============================================
// MARKDOWN RENDERING
// =============================================
function updatePreview() {
    const markdown = editor.value;
    preview.innerHTML = marked.parse(markdown);
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

exportMd.addEventListener('click', () => {
    const content = editor.value;
    downloadFile(content, 'document.md', 'text/markdown');
});

exportTxt.addEventListener('click', () => {
    const content = editor.value;
    downloadFile(content, 'document.txt', 'text/plain');
});

exportPdf.addEventListener('click', () => {
    window.print();
});

// =============================================
// RANDOM TIP
// =============================================
function showRandomTip() {
    const tipsForLang = tips[currentLanguage];
    const randomIndex = Math.floor(Math.random() * tipsForLang.length);
    tipText.textContent = tipsForLang[randomIndex];
    tipBanner.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        tipBanner.classList.add('hidden');
    }, 5000);
}

// =============================================
// CHEATSHEET
// =============================================
const cheatsheetData = {
    el: [
        { title: translations.el.heading1, example: '# Κεφαλίδα 1' },
        { title: translations.el.heading2, example: '## Κεφαλίδα 2' },
        { title: translations.el.heading3, example: '### Κεφαλίδα 3' },
        { title: translations.el.bold, example: '**έντονο κείμενο**' },
        { title: translations.el.italic, example: '*πλάγιο κείμενο*' },
        { title: translations.el.link, example: '[Google](https://google.com)' },
        { title: translations.el.image, example: '![alt](image.jpg)' },
        { title: translations.el.list, example: '- Στοιχείο 1\n- Στοιχείο 2' },
        { title: translations.el.orderedList, example: '1. Πρώτο\n2. Δεύτερο' },
        { title: translations.el.codeBlock, example: '```\ncode here\n```' },
        { title: translations.el.quote, example: '> Παράθεση' },
        { title: translations.el.table, example: '| Col1 | Col2 |\n|------|------|\n| A    | B    |' }
    ],
    en: [
        { title: translations.en.heading1, example: '# Heading 1' },
        { title: translations.en.heading2, example: '## Heading 2' },
        { title: translations.en.heading3, example: '### Heading 3' },
        { title: translations.en.bold, example: '**bold text**' },
        { title: translations.en.italic, example: '*italic text*' },
        { title: translations.en.link, example: '[Google](https://google.com)' },
        { title: translations.en.image, example: '![alt](image.jpg)' },
        { title: translations.en.list, example: '- Item 1\n- Item 2' },
        { title: translations.en.orderedList, example: '1. First\n2. Second' },
        { title: translations.en.codeBlock, example: '```\ncode here\n```' },
        { title: translations.en.quote, example: '> Quote' },
        { title: translations.en.table, example: '| Col1 | Col2 |\n|------|------|\n| A    | B    |' }
    ]
};

function populateCheatsheet() {
    const container = document.getElementById('cheatsheet-body');
    const items = cheatsheetData[currentLanguage];
    
    container.innerHTML = items.map(item => `
        <div class="cheatsheet-item">
            <h3>${item.title}</h3>
            <p>${item.example.replace(/\n/g, '<br>')}</p>
            <code>${item.example}</code>
        </div>
    `).join('');
}

cheatsheetBtn.addEventListener('click', () => {
    populateCheatsheet();
    cheatsheetModal.classList.remove('hidden');
});

closeCheatsheet.addEventListener('click', () => {
    cheatsheetModal.classList.add('hidden');
});

cheatsheetModal.addEventListener('click', (e) => {
    if (e.target === cheatsheetModal) {
        cheatsheetModal.classList.add('hidden');
    }
});

// =============================================
// EVENT LISTENERS SETUP
// =============================================
function setupEventListeners() {
    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cheatsheetModal.classList.add('hidden');
        }
    });
}

// =============================================
// STATISTICS CALCULATION
// =============================================
function updateStats() {
    const text = editor.value;
    
    // 1. Characters (including spaces)
    const charCount = text.length;
    
    // 2. Words (split by whitespace and filter empty strings)
    // Χρησιμοποιούμε regex για να πετύχουμε καλύτερη αποσύνθεση λέξεων σε ελληνικά/αγγλικά
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = text.trim() === '' ? 0 : words.length;
    
    // 3. Paragraphs (count non-empty blocks separated by newlines)
    // Ένας εύκολος τρόπος για markdown είναι να μετρήσουμε τις μη άδειες γραμμές που δεν είναι inline elements,
    // αλλά για απλότητα και ακρίβεια εδώ: μετράμε τμημάτων που χωρίζονται από διπλή αλλαγή γραμμής (\n\n) 
    // ή μοναδική αλλαγή γραμμής που ξεκινάει από κενό (block level).
    // Για γενική χρήση: Μετράμε τις ομάδες κειμένου ανάμεσα σε double line breaks.
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Update DOM
    document.getElementById('char-count').textContent = charCount.toLocaleString();
    document.getElementById('word-count').textContent = wordCount.toLocaleString();
    document.getElementById('para-count').textContent = paragraphs.toLocaleString();
}

// Ενίσχυση του existing event listener
editor.addEventListener('input', () => {
    localStorage.setItem(STORAGE_KEY, editor.value);
    updatePreview();
    updateStats(); // <-- Καλούμε εδώ την νέα συνάρτηση
});

// Υπολογισμός κατά την αρχική φόρτωση (για ανασυντεθέντα κείμενα)
window.addEventListener('load', updateStats);

// =============================================
// START
// =============================================
init();