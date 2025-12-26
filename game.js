// Nestbound: First Flight
// ========================

(function() {
    'use strict';

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // PIXEL ART: Render at half size, scale up 2x
    const SCALE = 2;
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

    const keys = { left: false, right: false, up: false, space: false, spacePressed: false };

    // ============ DIALOGUE DATA ============
    const DIALOGUES = {
        'hatching_1': [
            ['narrator', '...'],
            ['narrator', 'Darkness. Warmth. A steady heartbeat.'],
            ['narrator', 'Then... a crack. Light seeps in.']
        ],
        'hatching_2': [
            ['narrator', 'You push. The shell gives way.'],
            ['narrator', 'The world is bright. Beautiful.'],
            ['mama', 'There you are, little one.'],
            ['mama', "I've been waiting for you."],
            ['mama', 'Welcome to the world, Pip.']
        ],
        'mama_intro': [
            ['mama', 'This is our nest, high in the oak tree.'],
            ['mama', 'Try hopping around. Use ARROW KEYS.']
        ],
        'mama_good': [
            ['mama', "That's it! You're doing great!"]
        ],
        'mama_siblings': [
            ['mama', 'See those little ones? Your siblings.'],
            ['mama', "Wren and Bramble. They're still resting."]
        ],
        'mama_rest': [
            ['mama', 'The world outside is vast...'],
            ['mama', 'But for now, rest. Grow strong.'],
            ['mama', 'Your father will return with food.']
        ],
        'papa_arrives': [
            ['narrator', 'A shadow passes. But this one is familiar.'],
            ['papa', "I'm back! Look what I found."],
            ['papa', 'Pip! You have your mothers eyes.']
        ],
        'papa_food': [
            ['papa', 'You must be hungry.'],
            ['papa', 'Move to the food and press SPACE.']
        ],
        'papa_good': [
            ['papa', "That's my Pip!"],
            ['pip', '(You feel stronger.)']
        ],
        'papa_warning': [
            ['papa', 'The forest was quiet today...'],
            ['mama', 'Not now. Not in front of them.'],
            ['papa', 'Rest now. Tomorrow, we train.']
        ],
        'siblings_wake': [
            ['bramble', '*yawn* Morning already?'],
            ['wren', 'Look - Pip hatched!']
        ],
        'wren_intro': [
            ['wren', "Hey! I'm Wren, your big sister."],
            ['wren', "I'll show you everything!"]
        ],
        'bramble_intro': [
            ['bramble', "I'm BRAMBLE! Best flyer ever!"],
            ['bramble', 'Wanna race?!']
        ],
        'bramble_challenge': [
            ['bramble', 'First to the right side wins!'],
            ['bramble', 'GO!']
        ],
        'race_result': [
            ['bramble', "Whoa! You're fast!"],
            ['mama', 'Settle down. Night is coming.']
        ],
        'night_falls': [
            ['narrator', 'The sky turns purple, then deep blue.'],
            ['narrator', 'Stars appear, one by one.']
        ],
        'mama_lullaby': [
            ['mama', 'Sleep now, little ones.'],
            ['mama', '♪ High above the forest deep... ♪'],
            ['mama', '♪ Safe within our nest we sleep... ♪']
        ],
        'papa_watches': [
            ['narrator', 'As you drift off...'],
            ['narrator', "Papa doesn't sleep. He watches the sky."],
            ['narrator', 'Something circles out there.']
        ],
        'day2_wake': [
            ['bramble', 'Wake up wake up!'],
            ['mama', 'Today we train your wings.']
        ],
        'mama_stretch': [
            ['mama', 'Hold SPACE to stretch your wings!']
        ],
        'stretch_done': [
            ['mama', 'Wonderful! Getting stronger.'],
            ['bramble', 'When can we FLY?!'],
            ['mama', 'Patience. A few more days.']
        ],
        'papa_food_2': [
            ['papa', 'Breakfast! Catch the bugs!']
        ],
        'feeding_done': [
            ['papa', 'Well done!'],
            ['wren', 'Can we see the edge today?']
        ],
        'wren_edge': [
            ['wren', 'Come see! Hop to the right!']
        ],
        'wren_someday': [
            ['narrator', 'The world stretches before you. Endless.'],
            ['wren', "Someday we'll fly out there..."]
        ],
        'bramble_tomorrow': [
            ['bramble', "I'm flying TOMORROW!"],
            ['mama', 'Bramble. Promise me you will wait.'],
            ['bramble', '...Fine.']
        ],
        'shadow_passes': [
            ['narrator', 'A shadow passes. Large. Silent.']
        ],
        'papa_shield': [
            ['papa', 'DOWN! Under my wing!'],
            ['narrator', 'Through feathers, you see it.'],
            ['narrator', 'A great bird. Red tail. Sharp talons.']
        ],
        'shadow_gone': [
            ['narrator', 'The shadow passes.'],
            ['papa', "It's gone. For now."],
            ['bramble', 'What was that?!']
        ],
        'parents_look': [
            ['narrator', 'Your parents exchange a look.'],
            ['mama', 'Nothing to worry about.']
        ],
        'asher_arrives': [
            ['narrator', 'A dark shape lands nearby.'],
            ['narrator', 'A crow. Old. Ragged.'],
            ['papa', 'Asher.']
        ],
        'papa_defensive': [
            ['papa', 'What do you want, crow?'],
            ['asher', 'I came to warn you.']
        ],
        'asher_speaks': [
            ['asher', 'The little ones grow fast.'],
            ['asher', 'This one is... different.']
        ],
        'asher_cryptic': [
            ['asher', 'Talon has returned.'],
            ['asher', 'He remembers this tree.'],
            ['asher', 'Teach them fast. Time runs short.'],
            ['narrator', 'The crow disappears into the dusk.']
        ],
        'mama_dismiss': [
            ['wren', 'What did he mean?'],
            ['mama', "Old Asher sees danger everywhere."],
            ['papa', "Let's rest."]
        ],
        'night2_falls': [
            ['narrator', 'Night falls. The darkness feels deeper.']
        ],
        'papa_awake': [
            ['narrator', 'Papa stands guard against the stars.'],
            ['narrator', 'You need to learn to fly.'],
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
        stretching: false, phase: 0,

        update(dt) {
            if (!this.enabled) return;
            this.phase += dt * 0.005;

            if (!this.stretching) {
                if (keys.left) { this.vx = -1.5; this.dir = -1; this.moved = true; }
                else if (keys.right) { this.vx = 1.5; this.dir = 1; this.moved = true; }
                else this.vx *= 0.8;

                if (keys.spacePressed && this.y >= NEST_Y - 13) {
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
            px.fillStyle = '#00000044';
            drawPixelCircle(x, y + 6, 5, 2);

            // Body
            px.fillStyle = '#888899';
            drawPixelCircle(x, y, 6, 5);

            // Belly
            px.fillStyle = '#ccbbaa';
            drawPixelCircle(x + 1, y + 2, 4, 3);

            // Wings
            px.fillStyle = '#777788';
            drawPixelCircle(x - 3, y + wingY, 4, 2);
            drawPixelCircle(x + 3, y + wingY, 4, 2);

            // Head
            px.fillStyle = '#888899';
            drawPixelCircle(x + 4 * this.dir, y - 4, 5, 4);

            // Eye
            px.fillStyle = '#ffffff';
            px.fillRect(x + 5 * this.dir, y - 5, 2, 2);
            px.fillStyle = '#000000';
            px.fillRect(x + 6 * this.dir, y - 5, 1, 1);

            // Beak
            px.fillStyle = '#ffcc00';
            px.fillRect(x + 8 * this.dir, y - 4, 3 * this.dir, 2);
        }
    };

    // ============ NPCS ============
    const npcs = {};
    const NPC_DEFS = {
        mama: { x: 170, y: NEST_Y - 16, color: '#885533', belly: '#ddaa77', dir: 1, type: 'adult' },
        papa: { x: 230, y: NEST_Y - 16, color: '#664422', belly: '#cc9966', dir: -1, type: 'adult' },
        wren: { x: 185, y: NEST_Y - 10, color: '#998877', belly: '#ccbbaa', dir: 1, type: 'chick' },
        bramble: { x: 215, y: NEST_Y - 10, color: '#887766', belly: '#bbaa99', dir: -1, type: 'chick' },
        asher: { x: 300, y: NEST_Y - 40, color: '#222222', dir: -1, type: 'crow' }
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
            n.phase += 0.05;

            if (n.state === 'sleep') {
                px.fillStyle = n.color;
                drawPixelCircle(x, y + 2, 6, 4);
                px.fillStyle = '#ffffff55';
                px.fillRect(x + 8, y - 4 + Math.sin(n.phase) * 2, 3, 3);
                return;
            }

            if (n.state === 'racing') {
                n.x += 1;
                if (n.x > 250) n.x = 250;
            }

            if (n.type === 'adult') {
                px.fillStyle = n.color;
                drawPixelCircle(x, y, 9, 7);
                px.fillStyle = n.belly;
                drawPixelCircle(x + 2 * n.dir, y + 2, 5, 4);
                px.fillStyle = n.color;
                drawPixelCircle(x + 7 * n.dir, y - 5, 6, 5);
                px.fillStyle = '#ffffff';
                px.fillRect(x + 9 * n.dir, y - 6, 2, 2);
                px.fillStyle = '#000000';
                px.fillRect(x + 10 * n.dir, y - 6, 1, 1);
                px.fillStyle = '#ff8800';
                px.fillRect(x + 12 * n.dir, y - 4, 4 * n.dir, 2);
            } else if (n.type === 'chick') {
                px.fillStyle = n.color;
                drawPixelCircle(x, y, 5, 4);
                px.fillStyle = n.belly;
                drawPixelCircle(x + 1 * n.dir, y + 1, 3, 2);
                px.fillStyle = n.color;
                drawPixelCircle(x + 4 * n.dir, y - 3, 4, 3);
                px.fillStyle = '#ffffff';
                px.fillRect(x + 5 * n.dir, y - 4, 2, 2);
                px.fillStyle = '#ffcc00';
                px.fillRect(x + 7 * n.dir, y - 3, 2 * n.dir, 2);
            } else if (n.type === 'crow') {
                px.fillStyle = '#111111';
                drawPixelCircle(x, y, 10, 7);
                drawPixelCircle(x + 8 * n.dir, y - 4, 6, 5);
                px.fillStyle = '#444444';
                px.fillRect(x + 10 * n.dir, y - 5, 2, 2);
                px.fillStyle = '#333333';
                px.fillRect(x + 13 * n.dir, y - 3, 5 * n.dir, 2);
            }
        });
    }

    // ============ DIALOGUE ============
    let dlgActive = false;
    let dlgLines = [];
    let dlgIdx = 0;
    let dlgText = '';
    let dlgTarget = '';
    let dlgChar = 0;
    let dlgWait = false;
    let dlgCb = null;
    let dlgTimer = 0;

    const PORTRAITS = { pip: '🐣', mama: '🐦', papa: '🐦', wren: '🐥', bramble: '🐥', asher: '🦅', narrator: '✨' };
    const COLORS = { pip: '#a8e6cf', mama: '#ffb6c1', papa: '#87ceeb', wren: '#dda0dd', bramble: '#f0e68c', asher: '#778899', narrator: '#ffd93d' };

    function startDialogue(id, cb) {
        const d = DIALOGUES[id];
        if (!d) { if (cb) cb(); return; }
        dlgActive = true;
        dlgLines = d;
        dlgIdx = 0;
        dlgCb = cb;
        showLine();
    }

    function showLine() {
        if (dlgIdx >= dlgLines.length) { endDialogue(); return; }
        const [speaker, text] = dlgLines[dlgIdx];
        document.getElementById('dialogue-portrait').textContent = PORTRAITS[speaker] || '?';
        document.getElementById('dialogue-name').textContent = speaker === 'narrator' ? '' : speaker.charAt(0).toUpperCase() + speaker.slice(1);
        document.getElementById('dialogue-name').style.color = COLORS[speaker] || '#fff';
        dlgTarget = text;
        dlgText = '';
        dlgChar = 0;
        dlgWait = false;
        dlgTimer = 0;
        document.getElementById('dialogue-container').classList.remove('hidden');
        document.getElementById('dialogue-continue').style.visibility = 'hidden';
    }

    function updateDialogue(dt) {
        if (!dlgActive) return;
        dlgTimer += dt;

        if (dlgChar < dlgTarget.length) {
            if (dlgTimer > 30 || keys.spacePressed) {
                dlgText += dlgTarget[dlgChar];
                dlgChar++;
                dlgTimer = 0;
                document.getElementById('dialogue-text').textContent = dlgText;
                if (keys.spacePressed) {
                    dlgText = dlgTarget;
                    dlgChar = dlgTarget.length;
                    document.getElementById('dialogue-text').textContent = dlgText;
                }
            }
        } else if (!dlgWait) {
            dlgWait = true;
            document.getElementById('dialogue-continue').style.visibility = 'visible';
        } else if (keys.spacePressed) {
            dlgIdx++;
            showLine();
        }
    }

    function endDialogue() {
        dlgActive = false;
        document.getElementById('dialogue-container').classList.add('hidden');
        if (dlgCb) { dlgCb(); dlgCb = null; }
    }

    // ============ SCENE RUNNER ============
    let sceneId = null;
    let sceneStep = 0;
    let sceneDelay = 0;
    let waitAction = null;
    let food = null;
    let bugs = [];
    let shadowX = -100;
    let shadowOn = false;

    function runScene(id) {
        sceneId = id;
        sceneStep = 0;
        sceneDelay = 0;
        waitAction = null;
        nextStep();
    }

    function nextStep() {
        const scene = SCENES[sceneId];
        if (!scene || sceneStep >= scene.length) return;
        const s = scene[sceneStep];
        const cmd = s[0];

        if (cmd === 'time') { game.time = s[1]; sceneStep++; nextStep(); }
        else if (cmd === 'spawn') { spawnNPC(s[1], s[2]); sceneStep++; nextStep(); }
        else if (cmd === 'state') { setNPCState(s[1], s[2]); sceneStep++; nextStep(); }
        else if (cmd === 'remove') { removeNPC(s[1]); sceneStep++; nextStep(); }
        else if (cmd === 'player') { player.enabled = s[1]; sceneStep++; nextStep(); }
        else if (cmd === 'talk') { startDialogue(s[1], () => { sceneStep++; nextStep(); }); }
        else if (cmd === 'wait') { waitAction = s[1]; showHint(getHint(s[1])); }
        else if (cmd === 'delay') { sceneDelay = s[1]; }
        else if (cmd === 'food') { food = { x: 200, y: NEST_Y - 8 }; sceneStep++; nextStep(); }
        else if (cmd === 'game') { startMini(s[1]); }
        else if (cmd === 'shadow') { shadowOn = true; shadowX = -50; sceneStep++; nextStep(); }
        else if (cmd === 'goto') { runScene(s[1]); }
        else if (cmd === 'end') { endDay(s[1]); }
    }

    function getHint(a) {
        if (a === 'move') return 'Use ARROW KEYS to hop';
        if (a === 'eat') return 'Go to food, press SPACE';
        if (a === 'goRight') return 'Hop to the RIGHT';
        if (a === 'race') return 'Race to the RIGHT!';
        if (a === 'stretch') return 'Hold SPACE to stretch!';
        if (a === 'bugs') return 'Catch bugs with SPACE!';
        return '';
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
        if (g === 'race') { setNPCState('bramble', 'racing'); waitAction = 'race'; showHint('Race to the RIGHT!'); }
        else if (g === 'stretch') { waitAction = 'stretch'; showHint('Hold SPACE!'); }
        else if (g === 'bugs') {
            bugs = [];
            for (let i = 0; i < 3; i++) bugs.push({ x: 150 + Math.random() * 100, y: NEST_Y - 10, got: false });
            waitAction = 'bugs';
            showHint('Catch bugs with SPACE!');
        }
    }

    function updateScene(dt) {
        if (sceneDelay > 0) {
            sceneDelay -= dt;
            if (sceneDelay <= 0) { sceneStep++; nextStep(); }
        }

        if (waitAction) {
            let done = false;
            if (waitAction === 'move' && player.moved) done = true;
            if (waitAction === 'eat' && food && keys.spacePressed && Math.abs(player.x - food.x) < 20) {
                food = null; done = true;
            }
            if (waitAction === 'goRight' && player.x > 245) done = true;
            if (waitAction === 'race' && player.x > 245) { setNPCState('bramble', 'idle'); done = true; }
            if (waitAction === 'stretch' && player.stretching) {
                game.wingStrength += 0.3;
                if (game.wingStrength >= 25) done = true;
            }
            if (waitAction === 'bugs') {
                let left = 0;
                bugs.forEach(b => {
                    if (!b.got) {
                        left++;
                        if (keys.spacePressed && Math.abs(player.x - b.x) < 15) b.got = true;
                    }
                });
                if (left === 0) { bugs = []; done = true; }
            }
            if (done) { hideHint(); waitAction = null; sceneStep++; nextStep(); }
        }

        if (shadowOn) {
            shadowX += 4;
            if (shadowX > WIDTH + 50) shadowOn = false;
        }
    }

    function endDay(d) {
        let msg = d === 1
            ? 'Day 1 Complete<br><br>Pip grows stronger.<br>But something watches...'
            : 'Day 2 Complete<br><br>The shadow will return.<br><br><i>To be continued...</i>';
        document.getElementById('end-message').innerHTML = msg;
        document.getElementById('end-chapter-screen').classList.remove('hidden');
    }

    // ============ DRAWING HELPERS ============
    function drawPixelCircle(cx, cy, rx, ry) {
        px.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
            const x = cx + Math.cos(a) * rx;
            const y = cy + Math.sin(a) * ry;
            if (a === 0) px.moveTo(Math.floor(x), Math.floor(y));
            else px.lineTo(Math.floor(x), Math.floor(y));
        }
        px.closePath();
        px.fill();
    }

    // ============ RENDER ============
    const SKY = {
        dawn: ['#4a3066', '#ff9a56'],
        day: ['#6699cc', '#aaddee'],
        dusk: ['#2d1b4e', '#ff6b6b'],
        night: ['#0a0a1a', '#1a1a3a']
    };

    function render() {
        // Clear
        px.fillStyle = '#000';
        px.fillRect(0, 0, WIDTH, HEIGHT);

        // Sky
        const [c1, c2] = SKY[game.time];
        const grad = px.createLinearGradient(0, 0, 0, HEIGHT);
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);
        px.fillStyle = grad;
        px.fillRect(0, 0, WIDTH, HEIGHT);

        // Stars at night
        if (game.time === 'night') {
            px.fillStyle = '#ffffff';
            for (let i = 0; i < 30; i++) {
                px.fillRect((i * 37) % WIDTH, (i * 23) % 100, 1, 1);
            }
        }

        // Sun/Moon
        if (game.time === 'day' || game.time === 'dawn') {
            px.fillStyle = '#ffdd44';
            drawPixelCircle(330, 40, 15, 15);
        } else if (game.time === 'night') {
            px.fillStyle = '#dddddd';
            drawPixelCircle(330, 40, 12, 12);
        }

        // Far mountains
        px.fillStyle = game.time === 'night' ? '#1a1a2e' : '#7799aa';
        px.beginPath();
        px.moveTo(0, 230);
        for (let x = 0; x <= WIDTH; x += 20) px.lineTo(x, 200 + Math.sin(x * 0.05) * 15);
        px.lineTo(WIDTH, HEIGHT);
        px.lineTo(0, HEIGHT);
        px.fill();

        // Forest
        px.fillStyle = game.time === 'night' ? '#0d1a0d' : '#335544';
        px.beginPath();
        px.moveTo(0, 240);
        for (let x = 0; x <= WIDTH; x += 15) {
            px.lineTo(x, 230 - 10 - Math.sin(x * 0.1) * 8);
            px.lineTo(x + 7, 230);
        }
        px.lineTo(WIDTH, HEIGHT);
        px.lineTo(0, HEIGHT);
        px.fill();

        // Tree trunk
        px.fillStyle = '#3d2817';
        px.fillRect(40, 100, 30, 200);

        // Branch
        px.fillStyle = '#4a3520';
        px.fillRect(60, 195, 300, 12);

        // Nest
        px.fillStyle = '#5a4030';
        drawPixelCircle(200, NEST_Y + 5, 55, 20);
        px.fillStyle = '#6b5040';
        drawPixelCircle(200, NEST_Y, 50, 15);
        px.fillStyle = '#7a6550';
        drawPixelCircle(200, NEST_Y - 3, 40, 12);

        // Food
        if (food) {
            px.fillStyle = '#ff8888';
            px.fillRect(food.x - 4, food.y, 8, 3);
        }

        // Bugs
        bugs.forEach(b => {
            if (!b.got) {
                px.fillStyle = '#44cc44';
                px.fillRect(b.x - 2, b.y - 2, 4, 4);
            }
        });

        // NPCs
        drawNPCs();

        // Player
        player.draw();

        // Shadow
        if (shadowOn) {
            px.fillStyle = '#00000066';
            px.beginPath();
            px.moveTo(shadowX, 150);
            px.lineTo(shadowX - 30, 175);
            px.lineTo(shadowX - 15, 170);
            px.lineTo(shadowX - 40, 190);
            px.lineTo(shadowX, 175);
            px.lineTo(shadowX + 40, 190);
            px.lineTo(shadowX + 15, 170);
            px.lineTo(shadowX + 30, 175);
            px.closePath();
            px.fill();
        }

        // Scale up to main canvas
        ctx.drawImage(pxCanvas, 0, 0, WIDTH, HEIGHT, 0, 0, 800, 600);
    }

    // ============ UI ============
    function updateUI() {
        document.getElementById('day-indicator').textContent = 'Day ' + game.day;
        document.getElementById('wing-fill').style.width = (game.wingStrength) + '%';
    }

    // ============ GAME LOOP ============
    let last = 0;
    function loop(t) {
        const dt = Math.min(t - last, 50);
        last = t;

        if (game.playing) {
            updateScene(dt);
            player.update(dt);
            updateDialogue(dt);
            render();
            updateUI();
        }

        keys.spacePressed = false;
        requestAnimationFrame(loop);
    }

    // ============ INPUT ============
    document.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
        if (e.code === 'Space') {
            if (!keys.space) keys.spacePressed = true;
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
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('title-screen').classList.add('hidden');
        game.playing = true;
        game.day = 1;

        document.getElementById('chapter-day').textContent = 'Day 1';
        document.getElementById('chapter-title').textContent = 'Awakening';
        document.getElementById('chapter-screen').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('chapter-screen').classList.add('hidden');
            runScene('day1_awakening');
        }, 2000);
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        document.getElementById('end-chapter-screen').classList.add('hidden');
        if (game.day === 1) {
            game.day = 2;
            document.getElementById('chapter-day').textContent = 'Day 2';
            document.getElementById('chapter-title').textContent = 'Growing';
            document.getElementById('chapter-screen').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('chapter-screen').classList.add('hidden');
                runScene('day2_morning');
            }, 2000);
        }
    });

    requestAnimationFrame(loop);
})();
