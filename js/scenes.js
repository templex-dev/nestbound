// Scene Manager - Handles game scenes, backgrounds, and story progression
// ======================================================================

import { GAME_WIDTH, GAME_HEIGHT, NEST_Y, showEndChapter } from './game.js';

export class SceneManager {
    constructor(gameState, dialogueSystem, player, npcManager, particleSystem) {
        this.gameState = gameState;
        this.dialogue = dialogueSystem;
        this.player = player;
        this.npcs = npcManager;
        this.particles = particleSystem;

        this.currentScene = null;
        this.sceneStep = 0;
        this.sceneTimer = 0;
        this.waitingForDialogue = false;
        this.waitingForAction = null;

        // Background layers
        this.skyColors = {
            dawn: { top: '#4a3066', bottom: '#ff9a56' },
            day: { top: '#87CEEB', bottom: '#c9e9f6' },
            dusk: { top: '#2d1b4e', bottom: '#ff6b6b' },
            night: { top: '#0a0a1a', bottom: '#1a1a3a' }
        };

        // Stars for night
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * 200,
                size: Math.random() * 2 + 1,
                twinkle: Math.random() * Math.PI * 2
            });
        }

        // Scene definitions
        this.scenes = {
            // DAY 1
            'day1_awakening': [
                { type: 'setTime', time: 'dawn' },
                { type: 'dialogue', id: 'hatching_1' },
                { type: 'dialogue', id: 'hatching_2' },
                { type: 'enablePlayer' },
                { type: 'dialogue', id: 'mama_intro' },
                { type: 'waitForAction', action: 'move', hint: 'Use arrow keys to hop around the nest' },
                { type: 'dialogue', id: 'mama_good' },
                { type: 'spawnNPC', npc: 'wren', state: 'sleeping' },
                { type: 'spawnNPC', npc: 'bramble', state: 'sleeping' },
                { type: 'dialogue', id: 'mama_siblings' },
                { type: 'dialogue', id: 'mama_rest' },
                { type: 'transition', to: 'day1_feeding' }
            ],

            'day1_feeding': [
                { type: 'setTime', time: 'day' },
                { type: 'delay', duration: 1000 },
                { type: 'spawnNPC', npc: 'papa', state: 'arriving' },
                { type: 'dialogue', id: 'papa_arrives' },
                { type: 'spawnFood' },
                { type: 'dialogue', id: 'papa_food' },
                { type: 'waitForAction', action: 'eat', hint: 'Move to the food and press SPACE to eat' },
                { type: 'dialogue', id: 'papa_good' },
                { type: 'dialogue', id: 'papa_warning' },
                { type: 'transition', to: 'day1_siblings' }
            ],

            'day1_siblings': [
                { type: 'setNPCState', npc: 'wren', state: 'awake' },
                { type: 'setNPCState', npc: 'bramble', state: 'awake' },
                { type: 'delay', duration: 500 },
                { type: 'dialogue', id: 'siblings_wake' },
                { type: 'dialogue', id: 'wren_intro' },
                { type: 'dialogue', id: 'bramble_intro' },
                { type: 'dialogue', id: 'bramble_challenge' },
                { type: 'startMinigame', game: 'hoppingRace' },
                { type: 'dialogue', id: 'race_result' },
                { type: 'transition', to: 'day1_night' }
            ],

            'day1_night': [
                { type: 'setTime', time: 'dusk' },
                { type: 'delay', duration: 1500 },
                { type: 'setTime', time: 'night' },
                { type: 'setNPCState', npc: 'all', state: 'huddled' },
                { type: 'dialogue', id: 'night_falls' },
                { type: 'dialogue', id: 'mama_lullaby' },
                { type: 'dialogue', id: 'papa_watches' },
                { type: 'delay', duration: 2000 },
                { type: 'endDay', day: 1 }
            ],

            // DAY 2
            'day2_morning': [
                { type: 'setTime', time: 'dawn' },
                { type: 'setNPCState', npc: 'all', state: 'awake' },
                { type: 'dialogue', id: 'day2_wake' },
                { type: 'dialogue', id: 'mama_stretch' },
                { type: 'startMinigame', game: 'wingStretch' },
                { type: 'dialogue', id: 'stretch_done' },
                { type: 'transition', to: 'day2_competition' }
            ],

            'day2_competition': [
                { type: 'setTime', time: 'day' },
                { type: 'spawnNPC', npc: 'papa', state: 'arriving' },
                { type: 'dialogue', id: 'papa_food_2' },
                { type: 'startMinigame', game: 'bugCatch' },
                { type: 'dialogue', id: 'feeding_done' },
                { type: 'transition', to: 'day2_edge' }
            ],

            'day2_edge': [
                { type: 'dialogue', id: 'wren_edge' },
                { type: 'waitForAction', action: 'goToEdge', hint: 'Hop to the edge of the nest' },
                { type: 'showForestView' },
                { type: 'dialogue', id: 'wren_someday' },
                { type: 'dialogue', id: 'bramble_tomorrow' },
                { type: 'dialogue', id: 'mama_patience' },
                { type: 'transition', to: 'day2_shadow' }
            ],

            'day2_shadow': [
                { type: 'delay', duration: 1000 },
                { type: 'showShadow' },
                { type: 'dialogue', id: 'shadow_passes' },
                { type: 'dialogue', id: 'papa_shield' },
                { type: 'dialogue', id: 'shadow_gone' },
                { type: 'dialogue', id: 'parents_look' },
                { type: 'transition', to: 'day2_asher' }
            ],

            'day2_asher': [
                { type: 'setTime', time: 'dusk' },
                { type: 'spawnNPC', npc: 'asher', state: 'perched' },
                { type: 'dialogue', id: 'asher_arrives' },
                { type: 'dialogue', id: 'papa_defensive' },
                { type: 'dialogue', id: 'mama_calm' },
                { type: 'dialogue', id: 'asher_speaks' },
                { type: 'dialogue', id: 'asher_cryptic' },
                { type: 'removeNPC', npc: 'asher' },
                { type: 'dialogue', id: 'mama_dismiss' },
                { type: 'transition', to: 'day2_night' }
            ],

            'day2_night': [
                { type: 'setTime', time: 'night' },
                { type: 'setNPCState', npc: 'all', state: 'sleeping' },
                { type: 'dialogue', id: 'night2_falls' },
                { type: 'dialogue', id: 'papa_awake' },
                { type: 'delay', duration: 2000 },
                { type: 'endDay', day: 2 }
            ]
        };
    }

    startScene(sceneId) {
        this.currentScene = sceneId;
        this.sceneStep = 0;
        this.sceneTimer = 0;
        this.waitingForDialogue = false;
        this.waitingForAction = null;
        this.processSceneStep();
    }

    processSceneStep() {
        const scene = this.scenes[this.currentScene];
        if (!scene || this.sceneStep >= scene.length) return;

        const step = scene[this.sceneStep];

        switch (step.type) {
            case 'setTime':
                this.gameState.timeOfDay = step.time;
                this.advanceStep();
                break;

            case 'dialogue':
                this.waitingForDialogue = true;
                this.dialogue.start(step.id, () => {
                    this.waitingForDialogue = false;
                    this.advanceStep();
                });
                break;

            case 'enablePlayer':
                this.player.enabled = true;
                this.advanceStep();
                break;

            case 'spawnNPC':
                this.npcs.spawn(step.npc, step.state);
                this.advanceStep();
                break;

            case 'setNPCState':
                this.npcs.setState(step.npc, step.state);
                this.advanceStep();
                break;

            case 'removeNPC':
                this.npcs.remove(step.npc);
                this.advanceStep();
                break;

            case 'spawnFood':
                this.player.canEat = true;
                this.spawnFoodItem();
                this.advanceStep();
                break;

            case 'waitForAction':
                this.waitingForAction = step.action;
                this.showHint(step.hint);
                break;

            case 'delay':
                this.sceneTimer = step.duration;
                break;

            case 'startMinigame':
                this.startMinigame(step.game);
                break;

            case 'showForestView':
                this.showForestView();
                this.advanceStep();
                break;

            case 'showShadow':
                this.showHawkShadow();
                this.advanceStep();
                break;

            case 'transition':
                this.currentScene = step.to;
                this.sceneStep = 0;
                this.processSceneStep();
                break;

            case 'endDay':
                this.endDay(step.day);
                break;
        }
    }

    advanceStep() {
        this.sceneStep++;
        this.processSceneStep();
    }

    update(deltaTime, keys) {
        // Handle delay timers
        if (this.sceneTimer > 0) {
            this.sceneTimer -= deltaTime;
            if (this.sceneTimer <= 0) {
                this.advanceStep();
            }
        }

        // Check for action completion
        if (this.waitingForAction) {
            if (this.checkAction(this.waitingForAction)) {
                this.hideHint();
                this.waitingForAction = null;
                this.advanceStep();
            }
        }

        // Update stars twinkle
        this.stars.forEach(star => {
            star.twinkle += deltaTime * 0.003;
        });
    }

    checkAction(action) {
        switch (action) {
            case 'move':
                return this.player.hasMoved;
            case 'eat':
                return this.gameState.flags.hasEaten;
            case 'goToEdge':
                return this.player.x > 520;
            default:
                return false;
        }
    }

    showHint(text) {
        // Create hint element if needed
        let hint = document.getElementById('action-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'action-hint';
            hint.style.cssText = `
                position: absolute;
                bottom: 180px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: #ffd93d;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 90;
                animation: pulse 1.5s infinite;
            `;
            document.getElementById('game-container').appendChild(hint);
        }
        hint.textContent = text;
        hint.style.display = 'block';
    }

    hideHint() {
        const hint = document.getElementById('action-hint');
        if (hint) hint.style.display = 'none';
    }

    spawnFoodItem() {
        this.foodItem = { x: 400, y: NEST_Y - 20, collected: false };
    }

    startMinigame(game) {
        // Simplified mini-games for now
        switch (game) {
            case 'hoppingRace':
                this.runHoppingRace();
                break;
            case 'wingStretch':
                this.runWingStretch();
                break;
            case 'bugCatch':
                this.runBugCatch();
                break;
        }
    }

    runHoppingRace() {
        // Simple race - player just needs to reach right side
        this.showHint('Race Bramble! Hop to the right side of the nest!');
        this.waitingForAction = 'race';
        this.npcs.setState('bramble', 'racing');

        // Check race completion
        const checkRace = setInterval(() => {
            if (this.player.x > 500) {
                clearInterval(checkRace);
                this.gameState.flags.wonRace = true;
                this.hideHint();
                this.waitingForAction = null;
                this.npcs.setState('bramble', 'idle');
                this.advanceStep();
            }
        }, 100);
    }

    runWingStretch() {
        this.showHint('Hold SPACE to stretch your wings!');
        let stretchProgress = 0;
        const targetStretch = 100;

        const checkStretch = setInterval(() => {
            if (this.player.isStretching) {
                stretchProgress += 2;
                this.gameState.wingStrength = Math.min(30, 10 + stretchProgress / 5);

                // Add feather particles
                if (Math.random() < 0.1) {
                    this.particles.emit('feather', this.player.x, this.player.y - 20);
                }

                if (stretchProgress >= targetStretch) {
                    clearInterval(checkStretch);
                    this.hideHint();
                    this.gameState.flags.hasStretched = true;
                    this.advanceStep();
                }
            }
        }, 50);
    }

    runBugCatch() {
        this.showHint('Catch the bugs! Move to them and press SPACE');
        let bugsNeeded = 3;
        this.bugs = [];

        // Spawn bugs
        for (let i = 0; i < 5; i++) {
            this.bugs.push({
                x: 250 + Math.random() * 300,
                y: NEST_Y - 30 - Math.random() * 20,
                caught: false
            });
        }

        const checkBugs = setInterval(() => {
            // Check for catch
            this.bugs.forEach(bug => {
                if (!bug.caught && Math.abs(bug.x - this.player.x) < 30 && this.player.isInteracting) {
                    bug.caught = true;
                    bugsNeeded--;
                    this.particles.emit('sparkle', bug.x, bug.y);
                }
            });

            if (bugsNeeded <= 0) {
                clearInterval(checkBugs);
                this.bugs = [];
                this.hideHint();
                this.advanceStep();
            }
        }, 50);
    }

    showForestView() {
        this.forestViewActive = true;
        // Trigger parallax zoom effect
        setTimeout(() => {
            this.forestViewActive = false;
        }, 3000);
    }

    showHawkShadow() {
        this.shadowActive = true;
        this.shadowX = -200;

        const animateShadow = setInterval(() => {
            this.shadowX += 8;
            if (this.shadowX > GAME_WIDTH + 200) {
                clearInterval(animateShadow);
                this.shadowActive = false;
            }
        }, 30);
    }

    endDay(day) {
        let message = '';
        if (day === 1) {
            message = 'Day 1 Complete<br><br>Pip is growing stronger.<br>But something watches from above...';
        } else if (day === 2) {
            message = 'Day 2 Complete<br><br>Pip\'s wings grow stronger.<br>The shadow will return.';
        }
        showEndChapter(message);
    }

    renderBackground(ctx, gameState) {
        const colors = this.skyColors[gameState.timeOfDay];

        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
        gradient.addColorStop(0, colors.top);
        gradient.addColorStop(1, colors.bottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Stars at night
        if (gameState.timeOfDay === 'night') {
            ctx.fillStyle = '#fff';
            this.stars.forEach(star => {
                const alpha = 0.5 + Math.sin(star.twinkle) * 0.5;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }

        // Sun/Moon
        if (gameState.timeOfDay === 'day' || gameState.timeOfDay === 'dawn') {
            ctx.fillStyle = '#FFD93D';
            ctx.beginPath();
            ctx.arc(650, 80, 35, 0, Math.PI * 2);
            ctx.fill();

            // Sun glow
            ctx.fillStyle = 'rgba(255, 217, 61, 0.2)';
            ctx.beginPath();
            ctx.arc(650, 80, 50, 0, Math.PI * 2);
            ctx.fill();
        } else if (gameState.timeOfDay === 'night') {
            ctx.fillStyle = '#E8E8E8';
            ctx.beginPath();
            ctx.arc(650, 80, 30, 0, Math.PI * 2);
            ctx.fill();
        }

        // Distant forest silhouette
        this.renderDistantForest(ctx, gameState);

        // Tree (our home)
        this.renderTree(ctx);

        // Nest
        this.renderNest(ctx);

        // Food item
        if (this.foodItem && !this.foodItem.collected) {
            this.renderFood(ctx, this.foodItem);
        }

        // Bugs for mini-game
        if (this.bugs) {
            this.bugs.forEach(bug => {
                if (!bug.caught) {
                    this.renderBug(ctx, bug);
                }
            });
        }

        // Hawk shadow
        if (this.shadowActive) {
            this.renderHawkShadow(ctx);
        }
    }

    renderDistantForest(ctx, gameState) {
        // Layer 1 - far mountains
        ctx.fillStyle = gameState.timeOfDay === 'night' ? '#1a1a2e' : '#7a9eb8';
        ctx.beginPath();
        ctx.moveTo(0, 450);
        for (let x = 0; x <= GAME_WIDTH; x += 50) {
            ctx.lineTo(x, 400 + Math.sin(x * 0.02) * 30);
        }
        ctx.lineTo(GAME_WIDTH, 600);
        ctx.lineTo(0, 600);
        ctx.closePath();
        ctx.fill();

        // Layer 2 - forest
        ctx.fillStyle = gameState.timeOfDay === 'night' ? '#0d1a0d' : '#2d5a3d';
        ctx.beginPath();
        ctx.moveTo(0, 480);
        for (let x = 0; x <= GAME_WIDTH; x += 30) {
            const treeHeight = 20 + Math.sin(x * 0.1) * 15 + Math.random() * 5;
            ctx.lineTo(x, 460 - treeHeight);
            ctx.lineTo(x + 15, 460);
        }
        ctx.lineTo(GAME_WIDTH, 600);
        ctx.lineTo(0, 600);
        ctx.closePath();
        ctx.fill();
    }

    renderTree(ctx) {
        // Main trunk
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(80, 200, 60, 400);

        // Bark texture
        ctx.fillStyle = '#2a1a0f';
        for (let y = 200; y < 580; y += 40) {
            ctx.fillRect(85, y, 50, 3);
            ctx.fillRect(95, y + 20, 35, 2);
        }

        // Branch our nest is on
        ctx.fillStyle = '#4a3520';
        ctx.beginPath();
        ctx.moveTo(120, 380);
        ctx.lineTo(650, 400);
        ctx.lineTo(650, 420);
        ctx.lineTo(120, 400);
        ctx.closePath();
        ctx.fill();

        // Branch texture
        ctx.fillStyle = '#3a2515';
        for (let x = 140; x < 630; x += 60) {
            ctx.fillRect(x, 405, 30, 4);
        }

        // Some leaves around
        ctx.fillStyle = '#2d5a3d';
        const leafPositions = [[100, 200], [60, 250], [130, 180], [600, 380], [620, 400]];
        leafPositions.forEach(([lx, ly]) => {
            ctx.beginPath();
            ctx.ellipse(lx, ly, 25, 15, 0.3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    renderNest(ctx) {
        // Nest shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y + 30, 100, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nest base (twigs)
        ctx.fillStyle = '#5a4030';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y, 110, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nest rim
        ctx.fillStyle = '#6b5040';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y - 10, 100, 35, 0, 0, Math.PI);
        ctx.fill();

        // Twig details
        ctx.strokeStyle = '#4a3525';
        ctx.lineWidth = 2;
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI;
            const x1 = 400 + Math.cos(angle) * 90;
            const y1 = NEST_Y - 5 + Math.sin(angle) * 25;
            const x2 = 400 + Math.cos(angle) * 110;
            const y2 = NEST_Y + Math.sin(angle) * 35;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Inner nest (softer material)
        ctx.fillStyle = '#7a6550';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y - 5, 80, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Feather lining
        ctx.fillStyle = '#a09080';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y - 8, 70, 22, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    renderFood(ctx, food) {
        // Worm
        ctx.strokeStyle = '#e87070';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(food.x - 8, food.y);
        ctx.quadraticCurveTo(food.x - 4, food.y - 5, food.x, food.y);
        ctx.quadraticCurveTo(food.x + 4, food.y + 5, food.x + 8, food.y);
        ctx.stroke();

        // Glow
        ctx.fillStyle = 'rgba(255, 200, 100, 0.3)';
        ctx.beginPath();
        ctx.arc(food.x, food.y, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    renderBug(ctx, bug) {
        // Bug body
        ctx.fillStyle = '#50c878';
        ctx.beginPath();
        ctx.ellipse(bug.x, bug.y, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = 'rgba(150, 255, 150, 0.5)';
        ctx.beginPath();
        ctx.ellipse(bug.x - 3, bug.y - 3, 4, 2, -0.5, 0, Math.PI * 2);
        ctx.ellipse(bug.x + 3, bug.y - 3, 4, 2, 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    renderHawkShadow(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';

        // Shadow shape
        ctx.beginPath();
        ctx.moveTo(this.shadowX, 300);
        ctx.lineTo(this.shadowX - 60, 350);
        ctx.lineTo(this.shadowX - 30, 340);
        ctx.lineTo(this.shadowX - 80, 380);
        ctx.lineTo(this.shadowX, 350);
        ctx.lineTo(this.shadowX + 80, 380);
        ctx.lineTo(this.shadowX + 30, 340);
        ctx.lineTo(this.shadowX + 60, 350);
        ctx.closePath();
        ctx.fill();
    }

    renderForeground(ctx, gameState) {
        // Leaves in front occasionally
        if (gameState.timeOfDay !== 'night') {
            ctx.fillStyle = 'rgba(45, 90, 61, 0.3)';
            ctx.beginPath();
            ctx.ellipse(750, 500, 40, 25, 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
