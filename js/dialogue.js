// Dialogue System - Handles conversations and text display
// =========================================================

export class DialogueSystem {
    constructor(dialogueData) {
        this.data = dialogueData;
        this.isActive = false;
        this.currentDialogue = null;
        this.currentLine = 0;
        this.displayedText = '';
        this.targetText = '';
        this.charIndex = 0;
        this.typeSpeed = 30; // ms per character
        this.typeTimer = 0;
        this.callback = null;
        this.waitingForInput = false;

        // DOM elements
        this.container = document.getElementById('dialogue-container');
        this.portrait = document.getElementById('dialogue-portrait');
        this.nameEl = document.getElementById('dialogue-name');
        this.textEl = document.getElementById('dialogue-text');
        this.continueEl = document.getElementById('dialogue-continue');

        // Character portraits (emoji placeholders for now)
        this.portraits = {
            'pip': '🐣',
            'mama': '🐦',
            'papa': '🐦',
            'wren': '🐥',
            'bramble': '🐥',
            'asher': '🦅',
            'narrator': '✨'
        };

        // Character colors for names
        this.nameColors = {
            'pip': '#a8e6cf',
            'mama': '#ffb6c1',
            'papa': '#87ceeb',
            'wren': '#dda0dd',
            'bramble': '#f0e68c',
            'asher': '#778899',
            'narrator': '#ffd93d'
        };
    }

    start(dialogueId, onComplete) {
        const dialogue = this.data[dialogueId];
        if (!dialogue) {
            console.warn(`Dialogue not found: ${dialogueId}`);
            if (onComplete) onComplete();
            return;
        }

        this.currentDialogue = dialogue;
        this.currentLine = 0;
        this.callback = onComplete;
        this.isActive = true;
        this.showLine();
    }

    showLine() {
        if (this.currentLine >= this.currentDialogue.lines.length) {
            this.end();
            return;
        }

        const line = this.currentDialogue.lines[this.currentLine];

        // Update portrait
        this.portrait.textContent = this.portraits[line.speaker] || '❓';

        // Update name
        this.nameEl.textContent = this.formatName(line.speaker);
        this.nameEl.style.color = this.nameColors[line.speaker] || '#fff';

        // Start typing effect
        this.targetText = line.text;
        this.displayedText = '';
        this.charIndex = 0;
        this.typeTimer = 0;
        this.waitingForInput = false;

        // Show container
        this.container.classList.remove('hidden');
        this.continueEl.style.visibility = 'hidden';
    }

    formatName(speaker) {
        const names = {
            'pip': 'Pip (You)',
            'mama': 'Mama',
            'papa': 'Papa',
            'wren': 'Wren',
            'bramble': 'Bramble',
            'asher': 'Asher',
            'narrator': ''
        };
        return names[speaker] || speaker;
    }

    update(keys) {
        if (!this.isActive) return;

        // Typing effect
        if (this.charIndex < this.targetText.length) {
            this.typeTimer += 16; // Approximate frame time
            while (this.typeTimer >= this.typeSpeed && this.charIndex < this.targetText.length) {
                this.displayedText += this.targetText[this.charIndex];
                this.charIndex++;
                this.typeTimer -= this.typeSpeed;
            }
            this.textEl.textContent = this.displayedText;

            // Skip to end on space
            if (keys.spacePressed) {
                this.displayedText = this.targetText;
                this.charIndex = this.targetText.length;
                this.textEl.textContent = this.displayedText;
            }
        } else if (!this.waitingForInput) {
            // Text complete, wait for input
            this.waitingForInput = true;
            this.continueEl.style.visibility = 'visible';
        } else if (keys.spacePressed) {
            // Advance to next line
            this.currentLine++;
            this.showLine();
        }
    }

    end() {
        this.isActive = false;
        this.currentDialogue = null;
        this.container.classList.add('hidden');

        if (this.callback) {
            this.callback();
            this.callback = null;
        }
    }

    skip() {
        if (this.charIndex < this.targetText.length) {
            this.displayedText = this.targetText;
            this.charIndex = this.targetText.length;
            this.textEl.textContent = this.displayedText;
        } else {
            this.currentLine++;
            this.showLine();
        }
    }
}
