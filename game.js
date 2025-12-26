// Nestbound: First Flight
// ========================

(function() {
    'use strict';

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // PIXEL ART: Render at half size, scale up 2x
    const WIDTH = 400;
    const HEIGHT = 300;
    canvas.width = 800;
    canvas.height = 600;
    ctx.imageSmoothingEnabled = false;

    // Offscreen canvas for pixel rendering
    const pxCanvas = document.createElement('canvas');
    pxCanvas.width = WIDTH;
    pxCanvas.height = HEIGHT;
    const px = pxCanvas.getContext('2d');
    px.imageSmoothingEnabled = false;

    const NEST_Y = 210;
    const NEST_LEFT = 140;
    const NEST_RIGHT = 260;

    // Game state
    const game = {
        playing: false,
        day: 1,
        time: 'dawn',
        wingStrength: 10
    };

    const keys = { left: false, right: false, up: false, space: false, justPressed: false };

    // ============ DIALOGUE DATA ============
    const DIALOGUES = {
        'hatching_1': [
            ['narrator', '...'],
            ['narrator', 'Darkness. Warmth. A heartbeat.'],
            ['narrator', 'Then... a crack.']
        ],
        'hatching_2': [
            ['narrator', 'You push. The shell breaks.'],
            ['mama', 'There you are, little one.'],
            ['mama', 'Welcome to the world, Pip.']
        ],
        'mama_intro': [
            ['mama', 'This is our nest.'],
            ['mama', 'Try hopping! Use ARROW KEYS.']
        ],
        'mama_good': [
            ['mama', 'Good job!']
        ],
        'mama_siblings': [
            ['mama', 'Your siblings, Wren and Bramble.'],
            ['mama', 'They are still resting.']
        ],
        'mama_rest': [
            ['mama', 'Rest now. Grow strong.'],
            ['mama', 'Papa will bring food soon.']
        ],
        'papa_arrives': [
            ['papa', "I'm back!"],
            ['papa', 'Pip! You hatched!']
        ],
        'papa_food': [
            ['papa', 'Hungry? Go eat!'],
            ['papa', 'Move to food, press SPACE.']
        ],
        'papa_good': [
            ['papa', 'Good!']
        ],
        'papa_warning': [
            ['papa', 'The forest was too quiet...'],
            ['mama', 'Shh. Not now.']
        ],
        'siblings_wake': [
            ['bramble', '*yawn* Huh?'],
            ['wren', 'Pip hatched!']
        ],
        'wren_intro': [
            ['wren', "I'm Wren! Your sister!"]
        ],
        'bramble_intro': [
            ['bramble', "I'm BRAMBLE!"],
            ['bramble', 'Race me!']
        ],
        'bramble_challenge': [
            ['bramble', 'To the right! GO!']
        ],
        'race_result': [
            ['bramble', 'Fast!'],
            ['mama', 'Time for bed.']
        ],
        'night_falls': [
            ['narrator', 'Night falls.'],
            ['narrator', 'Stars appear.']
        ],
        'mama_lullaby': [
            ['mama', 'Sleep now...'],
            ['mama', '♪ Safe in our nest... ♪']
        ],
        'papa_watches': [
            ['narrator', 'Papa watches the sky.'],
            ['narrator', 'Something is out there.']
        ],
        'day2_wake': [
            ['bramble', 'Morning!'],
            ['mama', 'Wing training today!']
        ],
        'mama_stretch': [
            ['mama', 'Hold SPACE to stretch!']
        ],
        'stretch_done': [
            ['mama', 'Stronger!'],
            ['bramble', 'When do we fly?!'],
            ['mama', 'Soon.']
        ],
        'papa_food_2': [
            ['papa', 'Catch the bugs!']
        ],
        'feeding_done': [
            ['wren', 'Can we see outside?']
        ],
        'wren_edge': [
            ['wren', 'Hop to the right!']
        ],
        'wren_someday': [
            ['narrator', 'The world is endless.'],
            ['wren', 'Someday...']
        ],
        'bramble_tomorrow': [
            ['bramble', 'Tomorrow I fly!'],
            ['mama', 'Promise you will wait.'],
            ['bramble', 'Fine.']
        ],
        'shadow_passes': [
            ['narrator', 'A shadow passes.']
        ],
        'papa_shield': [
            ['papa', 'DOWN!'],
            ['narrator', 'A great hawk circles.']
        ],
        'shadow_gone': [
            ['papa', 'Gone. For now.']
        ],
        'parents_look': [
            ['mama', 'It is nothing.']
        ],
        'asher_arrives': [
            ['narrator', 'An old crow lands.'],
            ['papa', 'Asher.']
        ],
        'papa_defensive': [
            ['asher', 'I bring a warning.']
        ],
        'asher_speaks': [
            ['asher', 'This one is different.']
        ],
        'asher_cryptic': [
            ['asher', 'Talon has returned.'],
            ['asher', 'Teach them fast.']
        ],
        'mama_dismiss': [
            ['mama', 'He worries too much.']
        ],
        'night2_falls': [
            ['narrator', 'Night falls again.']
        ],
        'papa_awake': [
            ['narrator', 'You must learn to fly.'],
            ['narrator', 'Soon.']
        ]
    };

    // ============ SCENES ============
    const SCENES = {
        'day1_awakening': [
            ['time', 'dawn'],
            ['spawn', 'mama'],
            ['talk', 'hatching_1'],
            ['talk', 'hatching_2'],
            ['player', true],
            ['talk', 'mama_intro'],
            ['wait', 'move'],
            ['talk', 'mama_good'],
            ['spawn', 'wren', 'sleep'],
            ['spawn', 'bramble', 'sleep'],
            ['talk', 'mama_siblings'],
            ['talk', 'mama_rest'],
            ['goto', 'day1_feeding']
        ],
        'day1_feeding': [
            ['time', 'day'],
            ['delay', 500],
            ['spawn', 'papa'],
            ['talk', 'papa_arrives'],
            ['food'],
            ['talk', 'papa_food'],
            ['wait', 'eat'],
            ['talk', 'papa_good'],
            ['talk', 'papa_warning'],
            ['goto', 'day1_siblings']
        ],
        'day1_siblings': [
            ['state', 'wren', 'idle'],
            ['state', 'bramble', 'idle'],
            ['talk', 'siblings_wake'],
            ['talk', 'wren_intro'],
            ['talk', 'bramble_intro'],
            ['talk', 'bramble_challenge'],
            ['game', 'race'],
            ['talk', 'race_result'],
            ['goto', 'day1_night']
        ],
        'day1_night': [
            ['time', 'dusk'],
            ['delay', 1000],
            ['time', 'night'],
            ['state', 'all', 'sleep'],
            ['talk', 'night_falls'],
            ['talk', 'mama_lullaby'],
            ['talk', 'papa_watches'],
            ['delay', 1000],
            ['end', 1]
        ],
        'day2_morning': [
            ['time', 'dawn'],
            ['state', 'all', 'idle'],
            ['talk', 'day2_wake'],
            ['talk', 'mama_stretch'],
            ['game', 'stretch'],
            ['talk', 'stretch_done'],
            ['goto', 'day2_competition']
        ],
        'day2_competition': [
            ['time', 'day'],
            ['talk', 'papa_food_2'],
            ['game', 'bugs'],
            ['talk', 'feeding_done'],
            ['goto', 'day2_edge']
        ],
        'day2_edge': [
            ['talk', 'wren_edge'],
            ['wait', 'goRight'],
            ['talk', 'wren_someday'],
            ['talk', 'bramble_tomorrow'],
            ['goto', 'day2_shadow']
        ],
        'day2_shadow': [
            ['delay', 500],
            ['shadow'],
            ['talk', 'shadow_passes'],
            ['talk', 'papa_shield'],
            ['talk', 'shadow_gone'],
            ['talk', 'parents_look'],
            ['goto', 'day2_asher']
        ],
        'day2_asher': [
            ['time', 'dusk'],
            ['spawn', 'asher'],
            ['talk', 'asher_arrives'],
            ['talk', 'papa_defensive'],
            ['talk', 'asher_speaks'],
            ['talk', 'asher_cryptic'],
            ['remove', 'asher'],
            ['talk', 'mama_dismiss'],
            ['goto', 'day2_night']
        ],
        'day2_night': [
            ['time', 'night'],
            ['state', 'all', 'sleep'],
            ['talk', 'night2_falls'],
            ['talk', 'papa_awake'],
            ['delay', 1000],
            ['end', 2]
        ]
    };

    // ============ PLAYER ============
    const player = {
        x: 200, y: NEST_Y - 12,
        vx: 0, vy: 0,
        dir: 1, enabled: false, moved: false,
        stretching: false,

        update() {
            if (!this.enabled) return;

            if (!this.stretching) {
                if (keys.left) { this.vx = -1.5; this.dir = -1; this.moved = true; }
                else if (keys.right) { this.vx = 1.5; this.dir = 1; this.moved = true; }
                else this.vx *= 0.8;

                if (keys.justPressed && this.y >= NEST_Y - 13) {
                    this.vy = -3;
                    this.moved = true;
                }
            }

            this.stretching = keys.space && this.y >= NEST_Y - 13;
            this.vy += 0.2;
            this.x += this.vx;
            this.y += this.vy;

            if (this.y > NEST_Y - 12) { this.y = NEST_Y - 12; this.vy = 0; }
            if (this.x < NEST_LEFT) this.x = NEST_LEFT;
            if (this.x > NEST_RIGHT) this.x = NEST_RIGHT;
        },

        draw() {
            if (!this.enabled) return;
            const x = Math.floor(this.x);
            const y = Math.floor(this.y);
            const wingY = this.stretching ? -6 : -2;

            // Shadow
            px.fillStyle = '#00000033';
            px.fillRect(x - 5, y + 5, 10, 3);

            // Body
            px.fillStyle = '#8888aa';
            px.fillRect(x - 5, y - 4, 10, 8);

            // Belly
            px.fillStyle = '#ccbbaa';
            px.fillRect(x - 3, y, 6, 4);

            // Wings
            px.fillStyle = '#666688';
            px.fillRect(x - 7, y + wingY, 4, 3);
            px.fillRect(x + 3, y + wingY, 4, 3);

            // Head
            px.fillStyle = '#8888aa';
            px.fillRect(x + 2 * this.dir, y - 8, 6, 6);

            // Eye
            px.fillStyle = '#fff';
            px.fillRect(x + 4 * this.dir, y - 7, 2, 2);
            px.fillStyle = '#000';
            px.fillRect(x + 5 * this.dir, y - 7, 1, 1);

            // Beak
            px.fillStyle = '#ffcc00';
            px.fillRect(x + 7 * this.dir, y - 6, 3, 2);
        }
    };

    // ============ NPCS ============
    const npcs = {};
    const NPC_DEFS = {
        mama: { x: 170, y: NEST_Y - 14, color: '#885533', belly: '#ddaa77', dir: 1, type: 'adult' },
        papa: { x: 230, y: NEST_Y - 14, color: '#664422', belly: '#cc9966', dir: -1, type: 'adult' },
        wren: { x: 185, y: NEST_Y - 10, color: '#998877', belly: '#ccbbaa', dir: 1, type: 'chick' },
        bramble: { x: 215, y: NEST_Y - 10, color: '#887766', belly: '#bbaa99', dir: -1, type: 'chick' },
        asher: { x: 320, y: NEST_Y - 35, color: '#222222', dir: -1, type: 'crow' }
    };

    function spawnNPC(id, state) {
        npcs[id] = { ...NPC_DEFS[id], state: state || 'idle', phase: Math.random() * 6 };
    }
    function setNPCState(id, state) {
        if (id === 'all') Object.values(npcs).forEach(n => n.state = state);
        else if (npcs[id]) npcs[id].state = state;
    }
    function removeNPC(id) { delete npcs[id]; }

    function drawNPCs() {
        Object.values(npcs).forEach(n => {
            const x = Math.floor(n.x);
            const y = Math.floor(n.y);
            n.phase = (n.phase || 0) + 0.1;

            if (n.state === 'sleep') {
                px.fillStyle = n.color;
                px.fillRect(x - 5, y, 10, 6);
                px.fillStyle = '#ffffff66';
                const zzY = y - 6 + Math.sin(n.phase) * 2;
                px.fillRect(x + 8, zzY, 2, 2);
                return;
            }

            if (n.state === 'racing') {
                n.x = Math.min(n.x + 0.8, 250);
            }

            if (n.type === 'adult') {
                px.fillStyle = n.color;
                px.fillRect(x - 8, y - 5, 16, 12);
                px.fillStyle = n.belly;
                px.fillRect(x - 4, y + 1, 10, 5);
                px.fillStyle = n.color;
                px.fillRect(x + 6 * n.dir, y - 10, 8, 8);
                px.fillStyle = '#fff';
                px.fillRect(x + 9 * n.dir, y - 9, 2, 2);
                px.fillStyle = '#000';
                px.fillRect(x + 10 * n.dir, y - 9, 1, 1);
                px.fillStyle = '#ff8800';
                px.fillRect(x + 12 * n.dir, y - 7, 4, 2);
            } else if (n.type === 'chick') {
                px.fillStyle = n.color;
                px.fillRect(x - 4, y - 3, 8, 7);
                px.fillStyle = n.belly;
                px.fillRect(x - 2, y, 5, 3);
                px.fillStyle = n.color;
                px.fillRect(x + 2 * n.dir, y - 7, 5, 5);
                px.fillStyle = '#fff';
                px.fillRect(x + 4 * n.dir, y - 6, 2, 2);
                px.fillStyle = '#ffcc00';
                px.fillRect(x + 6 * n.dir, y - 5, 3, 2);
            } else if (n.type === 'crow') {
                px.fillStyle = '#111';
                px.fillRect(x - 10, y - 5, 20, 12);
                px.fillRect(x + 6 * n.dir, y - 10, 10, 8);
                px.fillStyle = '#444';
                px.fillRect(x + 10 * n.dir, y - 8, 2, 2);
                px.fillStyle = '#333';
                px.fillRect(x + 14 * n.dir, y - 6, 5, 2);
            }
        });
    }

    // ============ DIALOGUE ============
    let dlg = {
        active: false,
        lines: [],
        idx: 0,
        text: '',
        full: '',
        charIdx: 0,
        waiting: false,
        callback: null,
        timer: 0
    };

    const PORTRAITS = { pip: '🐣', mama: '🐦', papa: '🐦', wren: '🐥', bramble: '🐥', asher: '🦅', narrator: '✨' };
    const COLORS = { pip: '#a8e6cf', mama: '#ffb6c1', papa: '#87ceeb', wren: '#dda0dd', bramble: '#f0e68c', asher: '#778899', narrator: '#ffd93d' };

    function startDialogue(id, callback) {
        const data = DIALOGUES[id];
        if (!data || data.length === 0) {
            if (callback) callback();
            return;
        }
        dlg.active = true;
        dlg.lines = data;
        dlg.idx = 0;
        dlg.callback = callback;
        showCurrentLine();
    }

    function showCurrentLine() {
        if (dlg.idx >= dlg.lines.length) {
            endDialogue();
            return;
        }
        const [speaker, text] = dlg.lines[dlg.idx];
        document.getElementById('dialogue-portrait').textContent = PORTRAITS[speaker] || '?';
        const nameEl = document.getElementById('dialogue-name');
        nameEl.textContent = speaker === 'narrator' ? '' : speaker.charAt(0).toUpperCase() + speaker.slice(1);
        nameEl.style.color = COLORS[speaker] || '#fff';
        dlg.full = text;
        dlg.text = '';
        dlg.charIdx = 0;
        dlg.waiting = false;
        dlg.timer = 0;
        document.getElementById('dialogue-container').classList.remove('hidden');
        document.getElementById('dialogue-continue').style.visibility = 'hidden';
        document.getElementById('dialogue-text').textContent = '';
    }

    function updateDialogue(dt) {
        if (!dlg.active) return;

        dlg.timer += dt;

        // Typing effect
        if (dlg.charIdx < dlg.full.length) {
            if (dlg.timer > 40) {
                dlg.text += dlg.full[dlg.charIdx];
                dlg.charIdx++;
                dlg.timer = 0;
                document.getElementById('dialogue-text').textContent = dlg.text;
            }
            // Skip on space
            if (keys.justPressed) {
                dlg.text = dlg.full;
                dlg.charIdx = dlg.full.length;
                document.getElementById('dialogue-text').textContent = dlg.text;
            }
        } else if (!dlg.waiting) {
            dlg.waiting = true;
            document.getElementById('dialogue-continue').style.visibility = 'visible';
        } else if (keys.justPressed) {
            dlg.idx++;
            showCurrentLine();
        }
    }

    function endDialogue() {
        dlg.active = false;
        document.getElementById('dialogue-container').classList.add('hidden');
        const cb = dlg.callback;
        dlg.callback = null;
        if (cb) cb();
    }

    // ============ SCENE RUNNER ============
    let scene = {
        id: null,
        step: 0,
        delay: 0,
        waitFor: null
    };
    let food = null;
    let bugs = [];
    let shadowX = -100;
    let shadowOn = false;

    function runScene(id) {
        scene.id = id;
        scene.step = 0;
        scene.delay = 0;
        scene.waitFor = null;
        nextStep();
    }

    function nextStep() {
        const sc = SCENES[scene.id];
        if (!sc || scene.step >= sc.length) return;

        const s = sc[scene.step];
        const cmd = s[0];

        switch (cmd) {
            case 'time':
                game.time = s[1];
                scene.step++;
                nextStep();
                break;
            case 'spawn':
                spawnNPC(s[1], s[2]);
                scene.step++;
                nextStep();
                break;
            case 'state':
                setNPCState(s[1], s[2]);
                scene.step++;
                nextStep();
                break;
            case 'remove':
                removeNPC(s[1]);
                scene.step++;
                nextStep();
                break;
            case 'player':
                player.enabled = s[1];
                scene.step++;
                nextStep();
                break;
            case 'talk':
                startDialogue(s[1], function() {
                    scene.step++;
                    nextStep();
                });
                break;
            case 'wait':
                scene.waitFor = s[1];
                showHint(getHint(s[1]));
                break;
            case 'delay':
                scene.delay = s[1];
                break;
            case 'food':
                food = { x: 200, y: NEST_Y - 8 };
                scene.step++;
                nextStep();
                break;
            case 'game':
                startMini(s[1]);
                break;
            case 'shadow':
                shadowOn = true;
                shadowX = -50;
                scene.step++;
                nextStep();
                break;
            case 'goto':
                runScene(s[1]);
                break;
            case 'end':
                endDay(s[1]);
                break;
        }
    }

    function getHint(a) {
        const hints = {
            move: 'ARROW KEYS to hop',
            eat: 'Go to food + SPACE',
            goRight: 'Hop RIGHT',
            race: 'Race RIGHT!',
            stretch: 'Hold SPACE!',
            bugs: 'Catch bugs + SPACE'
        };
        return hints[a] || '';
    }

    function showHint(t) {
        const h = document.getElementById('action-hint');
        h.textContent = t;
        h.classList.remove('hidden');
    }
    function hideHint() {
        document.getElementById('action-hint').classList.add('hidden');
    }

    function startMini(g) {
        if (g === 'race') {
            setNPCState('bramble', 'racing');
            scene.waitFor = 'race';
            showHint('Race RIGHT!');
        } else if (g === 'stretch') {
            scene.waitFor = 'stretch';
            showHint('Hold SPACE!');
        } else if (g === 'bugs') {
            bugs = [];
            for (let i = 0; i < 3; i++) {
                bugs.push({ x: 150 + Math.random() * 100, y: NEST_Y - 10, got: false });
            }
            scene.waitFor = 'bugs';
            showHint('SPACE to catch!');
        }
    }

    function updateScene(dt) {
        // Handle delays
        if (scene.delay > 0) {
            scene.delay -= dt;
            if (scene.delay <= 0) {
                scene.step++;
                nextStep();
            }
            return;
        }

        // Handle wait conditions
        if (scene.waitFor) {
            let done = false;

            if (scene.waitFor === 'move' && player.moved) {
                done = true;
            }
            if (scene.waitFor === 'eat' && food && keys.justPressed && Math.abs(player.x - food.x) < 25) {
                food = null;
                done = true;
            }
            if (scene.waitFor === 'goRight' && player.x > 245) {
                done = true;
            }
            if (scene.waitFor === 'race' && player.x > 245) {
                setNPCState('bramble', 'idle');
                done = true;
            }
            if (scene.waitFor === 'stretch' && player.stretching) {
                game.wingStrength += 0.5;
                if (game.wingStrength >= 30) done = true;
            }
            if (scene.waitFor === 'bugs') {
                let left = 0;
                bugs.forEach(b => {
                    if (!b.got) {
                        left++;
                        if (keys.justPressed && Math.abs(player.x - b.x) < 20) {
                            b.got = true;
                        }
                    }
                });
                if (left === 0) {
                    bugs = [];
                    done = true;
                }
            }

            if (done) {
                hideHint();
                scene.waitFor = null;
                scene.step++;
                nextStep();
            }
        }

        // Shadow animation
        if (shadowOn) {
            shadowX += 3;
            if (shadowX > WIDTH + 50) shadowOn = false;
        }
    }

    function endDay(d) {
        const msg = d === 1
            ? 'Day 1 Complete<br><br>Pip grows stronger.<br>Something watches...'
            : 'Day 2 Complete<br><br>The shadow returns.<br><br><i>To be continued...</i>';
        document.getElementById('end-message').innerHTML = msg;
        document.getElementById('end-chapter-screen').classList.remove('hidden');
    }

    // ============ RENDER ============
    const SKY = {
        dawn: ['#4a3066', '#ff9a56'],
        day: ['#5588bb', '#99ccee'],
        dusk: ['#2d1b4e', '#ff6b6b'],
        night: ['#080810', '#101020']
    };

    function render() {
        px.fillStyle = '#000';
        px.fillRect(0, 0, WIDTH, HEIGHT);

        // Sky
        const [c1, c2] = SKY[game.time];
        const grad = px.createLinearGradient(0, 0, 0, HEIGHT);
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);
        px.fillStyle = grad;
        px.fillRect(0, 0, WIDTH, HEIGHT);

        // Stars
        if (game.time === 'night') {
            px.fillStyle = '#fff';
            for (let i = 0; i < 20; i++) {
                px.fillRect((i * 47 + 13) % WIDTH, (i * 31 + 7) % 80, 1, 1);
            }
        }

        // Sun/Moon
        if (game.time === 'day' || game.time === 'dawn') {
            px.fillStyle = '#ffdd44';
            px.fillRect(320, 30, 20, 20);
        } else if (game.time === 'night') {
            px.fillStyle = '#ddd';
            px.fillRect(320, 30, 16, 16);
        }

        // Mountains
        px.fillStyle = game.time === 'night' ? '#151525' : '#667788';
        px.beginPath();
        px.moveTo(0, 240);
        for (let x = 0; x <= WIDTH; x += 30) {
            px.lineTo(x, 200 + Math.sin(x * 0.05) * 20);
        }
        px.lineTo(WIDTH, HEIGHT);
        px.lineTo(0, HEIGHT);
        px.fill();

        // Forest
        px.fillStyle = game.time === 'night' ? '#0a150a' : '#334433';
        for (let x = 0; x < WIDTH; x += 20) {
            const h = 15 + Math.sin(x * 0.2) * 8;
            px.fillRect(x, 230 - h, 15, h + 10);
        }

        // Tree trunk
        px.fillStyle = '#3a2515';
        px.fillRect(40, 100, 25, 150);

        // Branch
        px.fillStyle = '#4a3520';
        px.fillRect(55, 195, 320, 10);

        // Nest
        px.fillStyle = '#5a4030';
        px.fillRect(145, NEST_Y, 110, 25);
        px.fillStyle = '#6b5040';
        px.fillRect(150, NEST_Y - 5, 100, 15);
        px.fillStyle = '#7a6550';
        px.fillRect(155, NEST_Y - 8, 90, 10);

        // Food
        if (food) {
            px.fillStyle = '#ff6666';
            px.fillRect(food.x - 4, food.y, 8, 4);
        }

        // Bugs
        bugs.forEach(b => {
            if (!b.got) {
                px.fillStyle = '#44dd44';
                px.fillRect(b.x - 2, b.y - 2, 5, 5);
            }
        });

        // NPCs
        drawNPCs();

        // Player
        player.draw();

        // Shadow
        if (shadowOn) {
            px.fillStyle = '#00000055';
            px.beginPath();
            px.moveTo(shadowX, 140);
            px.lineTo(shadowX - 25, 165);
            px.lineTo(shadowX - 35, 185);
            px.lineTo(shadowX, 165);
            px.lineTo(shadowX + 35, 185);
            px.lineTo(shadowX + 25, 165);
            px.closePath();
            px.fill();
        }

        // Scale to main canvas
        ctx.drawImage(pxCanvas, 0, 0, WIDTH, HEIGHT, 0, 0, 800, 600);
    }

    // ============ UI ============
    function updateUI() {
        document.getElementById('day-indicator').textContent = 'DAY ' + game.day;
        document.getElementById('wing-fill').style.width = game.wingStrength + '%';
    }

    // ============ GAME LOOP ============
    let lastTime = 0;
    function loop(time) {
        const dt = Math.min(time - lastTime, 50);
        lastTime = time;

        if (game.playing) {
            updateScene(dt);
            player.update();
            updateDialogue(dt);
            render();
            updateUI();
        }

        keys.justPressed = false;
        requestAnimationFrame(loop);
    }

    // ============ INPUT ============
    document.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
        if (e.code === 'Space') {
            if (!keys.space) keys.justPressed = true;
            keys.space = true;
            e.preventDefault();
        }
    });
    document.addEventListener('keyup', e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
        if (e.code === 'Space') keys.space = false;
    });

    // ============ START ============
    document.getElementById('start-btn').addEventListener('click', function() {
        document.getElementById('title-screen').classList.add('hidden');
        game.playing = true;
        game.day = 1;

        document.getElementById('chapter-day').textContent = 'DAY 1';
        document.getElementById('chapter-title').textContent = 'AWAKENING';
        document.getElementById('chapter-screen').classList.remove('hidden');

        setTimeout(function() {
            document.getElementById('chapter-screen').classList.add('hidden');
            runScene('day1_awakening');
        }, 2000);
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('end-chapter-screen').classList.add('hidden');
        if (game.day === 1) {
            game.day = 2;
            document.getElementById('chapter-day').textContent = 'DAY 2';
            document.getElementById('chapter-title').textContent = 'GROWING';
            document.getElementById('chapter-screen').classList.remove('hidden');
            setTimeout(function() {
                document.getElementById('chapter-screen').classList.add('hidden');
                runScene('day2_morning');
            }, 2000);
        }
    });

    requestAnimationFrame(loop);
})();
