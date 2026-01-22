// Memoria App - Number to Word Mnemonic Converter

class MemoriaApp {
    constructor() {
        this.input = document.getElementById('numberInput');
        this.resultContainer = document.getElementById('resultContainer');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.counter = document.getElementById('counter');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        this.noResultsMsg = document.getElementById('noResults');
        this.saveModal = document.getElementById('saveModal');
        this.tagInput = document.getElementById('tagInput');
        this.confirmSaveBtn = document.getElementById('confirmSave');
        this.cancelSaveBtn = document.getElementById('cancelSave');

        this.currentSolutions = [];
        this.currentIndex = 0;
        this.currentNumbers = '';
        this.history = this.loadHistory();

        this.init();
    }

    init() {
        // Input handler with debounce
        let debounceTimer;
        this.input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.processInput(), 150);
        });

        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));

        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyResult());

        // Save button
        this.saveBtn.addEventListener('click', () => this.openSaveModal());

        // Modal buttons
        this.confirmSaveBtn.addEventListener('click', () => this.confirmSave());
        this.cancelSaveBtn.addEventListener('click', () => this.closeSaveModal());

        // Close modal on backdrop click
        this.saveModal.addEventListener('click', (e) => {
            if (e.target === this.saveModal) this.closeSaveModal();
        });

        // Enter key in tag input
        this.tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.confirmSave();
            if (e.key === 'Escape') this.closeSaveModal();
        });

        // Clear history
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.saveModal.classList.contains('visible')) return;
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });

        // Swipe navigation for mobile
        this.setupSwipeNavigation();

        // Render initial history
        this.renderHistory();

        // Focus input on load
        this.input.focus();
    }

    setupSwipeNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.resultsGrid.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.resultsGrid.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                this.navigate(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    processInput() {
        const rawInput = this.input.value;
        const numbers = rawInput.replace(/[^0-9]/g, '');

        if (numbers.length === 0) {
            this.hideResults();
            this.currentNumbers = '';
            return;
        }

        this.currentNumbers = numbers;
        this.currentSolutions = this.findAllOptimalSolutions(numbers);
        this.currentIndex = 0;

        if (this.currentSolutions.length === 0) {
            this.showNoResults();
            return;
        }

        this.showResults();
    }

    // Save modal methods
    openSaveModal() {
        if (!this.currentNumbers) return;
        this.tagInput.value = '';
        this.saveModal.classList.add('visible');
        this.tagInput.focus();
    }

    closeSaveModal() {
        this.saveModal.classList.remove('visible');
        this.input.focus();
    }

    confirmSave() {
        if (!this.currentNumbers) return;
        const tag = this.tagInput.value.trim();
        this.addToHistory(this.currentNumbers, tag);
        this.closeSaveModal();
    }

    // Dynamic Programming to find ALL optimal (minimum words) solutions
    findAllOptimalSolutions(numbers) {
        const n = numbers.length;
        if (n === 0) return [];

        // dp[i] = { minLen: number, solutions: array of arrays }
        const dp = new Array(n + 1);
        dp[0] = { minLen: 0, solutions: [[]] };

        for (let i = 1; i <= n; i++) {
            dp[i] = { minLen: Infinity, solutions: [] };

            for (let j = 0; j < i; j++) {
                const substring = numbers.substring(j, i);
                const words = WORD_DICT[substring];

                if (words && dp[j].minLen !== Infinity) {
                    const newLen = dp[j].minLen + 1;

                    if (newLen < dp[i].minLen) {
                        // Found better solution, reset
                        dp[i].minLen = newLen;
                        dp[i].solutions = [];
                        for (const prevSolution of dp[j].solutions) {
                            for (const word of words) {
                                dp[i].solutions.push([...prevSolution, { word, code: substring }]);
                            }
                        }
                    } else if (newLen === dp[i].minLen) {
                        // Found equal solution, add alternatives
                        for (const prevSolution of dp[j].solutions) {
                            for (const word of words) {
                                dp[i].solutions.push([...prevSolution, { word, code: substring }]);
                            }
                        }
                    }
                }
            }

            // Limit to prevent memory explosion (keep first 100 alternatives)
            if (dp[i].solutions.length > 100) {
                dp[i].solutions = dp[i].solutions.slice(0, 100);
            }
        }

        return dp[n].solutions;
    }

    showResults() {
        this.noResultsMsg.classList.add('hidden');
        this.resultContainer.classList.remove('hidden');
        this.renderCurrentSolution();
        this.updateNavigation();
    }

    hideResults() {
        this.resultContainer.classList.add('hidden');
        this.resultsGrid.innerHTML = '';
    }

    showNoResults() {
        this.resultContainer.classList.add('hidden');
        this.noResultsMsg.classList.remove('hidden');
    }

    renderCurrentSolution() {
        const solution = this.currentSolutions[this.currentIndex];
        this.resultsGrid.innerHTML = '';

        for (const item of solution) {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.innerHTML = `
                <span class="word">${item.word}</span>
                <span class="code">${item.code}</span>
            `;
            this.resultsGrid.appendChild(card);
        }
    }

    updateNavigation() {
        const total = this.currentSolutions.length;
        const current = this.currentIndex + 1;

        this.counter.textContent = `${current} / ${total}`;
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === total - 1;

        // Hide navigation if only one solution
        const navContainer = document.querySelector('.navigation');
        navContainer.style.visibility = total > 1 ? 'visible' : 'hidden';
    }

    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.currentSolutions.length) {
            this.currentIndex = newIndex;
            this.renderCurrentSolution();
            this.updateNavigation();
        }
    }

    copyResult() {
        if (this.currentSolutions.length === 0) return;

        const solution = this.currentSolutions[this.currentIndex];
        const text = solution.map(item => item.word).join(' - ');

        navigator.clipboard.writeText(text).then(() => {
            this.copyBtn.classList.add('copied');
            this.copyBtn.textContent = 'Copiado!';
            setTimeout(() => {
                this.copyBtn.classList.remove('copied');
                this.copyBtn.textContent = 'Copiar';
            }, 1500);
        });
    }

    // History management
    loadHistory() {
        try {
            const saved = localStorage.getItem('memoria_history');
            const parsed = saved ? JSON.parse(saved) : [];
            // Migrate old format (plain strings) to new format
            return parsed.map(item => {
                if (typeof item === 'string') {
                    return { number: item, tag: '' };
                }
                return item;
            });
        } catch {
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('memoria_history', JSON.stringify(this.history));
        } catch {
            // localStorage might be full or unavailable
        }
    }

    addToHistory(numbers, tag = '') {
        // Remove if same number already exists
        this.history = this.history.filter(item => item.number !== numbers);
        // Add to front
        this.history.unshift({ number: numbers, tag: tag });
        // Keep only last 50
        this.history = this.history.slice(0, 50);
        this.saveHistory();
        this.renderHistory();
    }

    deleteHistoryItem(index) {
        this.history.splice(index, 1);
        this.saveHistory();
        this.renderHistory();
    }

    clearHistory() {
        if (this.history.length === 0) return;
        if (confirm('Borrar todo el historial?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
    }

    renderHistory() {
        this.historyList.innerHTML = '';

        if (this.history.length === 0) {
            this.historyList.innerHTML = '<span class="history-empty">Sin historial</span>';
            return;
        }

        for (let i = 0; i < this.history.length; i++) {
            const item = this.history[i];
            const chip = document.createElement('div');
            chip.className = 'history-chip';

            const content = document.createElement('button');
            content.className = 'history-content';
            if (item.tag) {
                content.innerHTML = `<span class="history-tag">${item.tag}</span><span class="history-number">${item.number}</span>`;
            } else {
                content.innerHTML = `<span class="history-number">${item.number}</span>`;
            }
            content.addEventListener('click', () => {
                this.input.value = item.number;
                this.processInput();
                this.input.focus();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'history-delete';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Eliminar';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteHistoryItem(i);
            });

            chip.appendChild(content);
            chip.appendChild(deleteBtn);
            this.historyList.appendChild(chip);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MemoriaApp();
});
