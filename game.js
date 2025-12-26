// Nestbound: First Flight - Complete Game
// =========================================

(function() {
    'use strict';

    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Game constants
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const NEST_Y = 420;
    const NEST_LEFT = 280;
    const NEST_RIGHT = 520;

    // ==========================================
    // DIALOGUE DATA
    // ==========================================
    const DIALOGUE_DATA = {
        'hatching_1': {
            lines: [
                { speaker: 'narrator', text: '...' },
                { speaker: 'narrator', text: 'Darkness. Warmth. A steady heartbeat.' },
                { speaker: 'narrator', text: 'Then... a crack. Light seeps in.' }
            ]
        },
        'hatching_2': {
            lines: [
                { speaker: 'narrator', text: 'You push. The shell gives way.' },
                { speaker: 'narrator', text: 'The world is bright. Overwhelming. Beautiful.' },
                { speaker: 'mama', text: 'There you are, little one.' },
                { speaker: 'mama', text: 'I\'ve been waiting for you.' },
                { speaker: 'narrator', text: 'A warm face looks down at you. Your mother.' },
                { speaker: 'mama', text: 'Welcome to the world, Pip.' }
            ]
        },
        'mama_intro': {
            lines: [
                { speaker: 'mama', text: 'This is our nest. Our home, high in the old oak tree.' },
                { speaker: 'mama', text: 'Try moving around. Use the ARROW KEYS to hop.' },
                { speaker: 'mama', text: 'Don\'t worry - you\'re safe here with me.' }
            ]
        },
        'mama_good': {
            lines: [
                { speaker: 'mama', text: 'That\'s it! You\'re doing wonderfully.' },
                { speaker: 'mama', text: 'You\'ll be hopping all over the nest in no time.' }
            ]
        },
        'mama_siblings': {
            lines: [
                { speaker: 'mama', text: 'See those little ones beside you?' },
                { speaker: 'mama', text: 'That\'s Wren, your older sister. And Bramble, your brother.' },
                { speaker: 'mama', text: 'They hatched just before you. Let them rest for now.' }
            ]
        },
        'mama_rest': {
            lines: [
                { speaker: 'mama', text: 'The world outside is vast, Pip. Full of wonders... and dangers.' },
                { speaker: 'mama', text: 'But you\'re not ready for that yet. None of you are.' },
                { speaker: 'mama', text: 'For now, rest. Grow strong.' },
                { speaker: 'mama', text: 'Your father will return soon with food.' }
            ]
        },
        'papa_arrives': {
            lines: [
                { speaker: 'narrator', text: 'A shadow passes over the nest. But this one is familiar.' },
                { speaker: 'papa', text: 'I\'m back! And look what I found.' },
                { speaker: 'mama', text: 'The little one hatched while you were gone.' },
                { speaker: 'papa', text: 'Pip! Let me look at you.' },
                { speaker: 'papa', text: '...You have your mother\'s eyes.' }
            ]
        },
        'papa_food': {
            lines: [
                { speaker: 'papa', text: 'You must be hungry. Here - your first meal.' },
                { speaker: 'papa', text: 'Move close to it and press SPACE to eat.' }
            ]
        },
        'papa_good': {
            lines: [
                { speaker: 'papa', text: 'That\'s my Pip! You\'ll grow strong in no time.' },
                { speaker: 'pip', text: '(You feel a little stronger already.)' }
            ]
        },
        'papa_warning': {
            lines: [
                { speaker: 'papa', text: '...The forest was quiet today. Too quiet.' },
                { speaker: 'mama', text: 'Not now. Not in front of the children.' },
                { speaker: 'papa', text: 'You\'re right. I\'m sorry.' },
                { speaker: 'papa', text: 'Rest now, little ones. Tomorrow we begin your lessons.' }
            ]
        },
        'siblings_wake': {
            lines: [
                { speaker: 'narrator', text: 'Movement in the nest. Your siblings are stirring.' },
                { speaker: 'bramble', text: '*yaaawn* Is it morning already?' },
                { speaker: 'wren', text: 'Shh, Bramble. Look - Pip hatched!' }
            ]
        },
        'wren_intro': {
            lines: [
                { speaker: 'wren', text: 'Hey there, little one. I\'m Wren, your big sister.' },
                { speaker: 'wren', text: 'Well... bigger by a few hours anyway.' },
                { speaker: 'wren', text: 'Don\'t worry. I\'ll show you everything I know!' }
            ]
        },
        'bramble_intro': {
            lines: [
                { speaker: 'bramble', text: 'I\'m BRAMBLE! And I\'m gonna be the BEST flyer ever!' },
                { speaker: 'wren', text: 'You can\'t even fly yet, Bramble.' },
                { speaker: 'bramble', text: 'Details! Hey Pip - wanna race?!' }
            ]
        },
        'bramble_challenge': {
            lines: [
                { speaker: 'bramble', text: 'First one to the right side of the nest wins!' },
                { speaker: 'bramble', text: 'Ready... set... GO!' }
            ]
        },
        'race_result': {
            lines: [
                { speaker: 'bramble', text: 'Whoa! You\'re fast for a newborn!' },
                { speaker: 'wren', text: 'I told you Pip was special.' },
                { speaker: 'mama', text: 'Alright little ones, settle down. Night is coming.' }
            ]
        },
        'night_falls': {
            lines: [
                { speaker: 'narrator', text: 'The sky turns orange, then purple, then deep blue.' },
                { speaker: 'narrator', text: 'Stars appear, one by one, like tiny distant suns.' },
                { speaker: 'narrator', text: 'Your family gathers close together for warmth.' }
            ]
        },
        'mama_lullaby': {
            lines: [
                { speaker: 'mama', text: 'Sleep now, little ones. Dream of open skies.' },
                { speaker: 'mama', text: '♪ High above the forest deep... ♪' },
                { speaker: 'mama', text: '♪ Safe within our nest we sleep... ♪' },
                { speaker: 'mama', text: '♪ When the morning sun does rise... ♪' },
                { speaker: 'mama', text: '♪ We\'ll spread our wings and touch the skies... ♪' }
            ]
        },
        'papa_watches': {
            lines: [
                { speaker: 'narrator', text: 'Your eyes grow heavy...' },
                { speaker: 'narrator', text: 'But as you drift off, you notice Papa isn\'t sleeping.' },
                { speaker: 'narrator', text: 'He watches the dark sky. Something circles out there.' }
            ]
        },
        'day2_wake': {
            lines: [
                { speaker: 'narrator', text: 'Light filters through the leaves. A new day.' },
                { speaker: 'bramble', text: 'Wake up wake up wake up!' },
                { speaker: 'mama', text: 'Good morning, little ones. Today is an important day.' }
            ]
        },
        'mama_stretch': {
            lines: [
                { speaker: 'mama', text: 'Today, we start training those wings.' },
                { speaker: 'mama', text: 'You can\'t fly yet - but we can make them strong!' },
                { speaker: 'mama', text: 'Hold SPACE to stretch your wings.' }
            ]
        },
        'stretch_done': {
            lines: [
                { speaker: 'mama', text: 'Wonderful! I can see them getting stronger.' },
                { speaker: 'bramble', text: 'When can we actually FLY though?!' },
                { speaker: 'mama', text: 'Patience, Bramble. A few more days.' }
            ]
        },
        'papa_food_2': {
            lines: [
                { speaker: 'papa', text: 'Breakfast time! I found some bugs near the meadow.' },
                { speaker: 'papa', text: 'See how many you can catch!' }
            ]
        },
        'feeding_done': {
            lines: [
                { speaker: 'papa', text: 'Well done! Getting faster every day.' },
                { speaker: 'wren', text: 'Papa, can we see the edge of the nest today?' },
                { speaker: 'papa', text: '...Just the edge. Stay close.' }
            ]
        },
        'wren_edge': {
            lines: [
                { speaker: 'wren', text: 'Come on, Pip! Come see!' },
                { speaker: 'wren', text: 'Hop to the right side of the nest!' }
            ]
        },
        'wren_someday': {
            lines: [
                { speaker: 'narrator', text: 'You look out from the edge of the nest.' },
                { speaker: 'narrator', text: 'The world stretches out before you. Endless.' },
                { speaker: 'wren', text: 'Someday... we\'ll fly through those trees.' },
                { speaker: 'wren', text: 'We\'ll see what\'s beyond the mountains.' }
            ]
        },
        'bramble_tomorrow': {
            lines: [
                { speaker: 'bramble', text: 'I\'m gonna fly TOMORROW! You\'ll see!' },
                { speaker: 'wren', text: 'Bramble, no. We\'re not ready.' }
            ]
        },
        'mama_patience': {
            lines: [
                { speaker: 'mama', text: 'Bramble. Come away from the edge.' },
                { speaker: 'mama', text: 'Flying takes more than strong wings.' },
                { speaker: 'mama', text: 'Promise me you\'ll wait.' },
                { speaker: 'bramble', text: '...Fine. I promise.' }
            ]
        },
        'shadow_passes': {
            lines: [
                { speaker: 'narrator', text: 'A shadow passes over the nest.' },
                { speaker: 'narrator', text: 'Large. Silent. Circling.' }
            ]
        },
        'papa_shield': {
            lines: [
                { speaker: 'papa', text: 'DOWN! Everyone down! Under my wing!' },
                { speaker: 'narrator', text: 'Papa spreads his wings over you all.' },
                { speaker: 'narrator', text: 'Through the feathers, you glimpse it.' },
                { speaker: 'narrator', text: 'A great bird. Red tail. Sharp talons.' }
            ]
        },
        'shadow_gone': {
            lines: [
                { speaker: 'narrator', text: 'Seconds stretch into eternity.' },
                { speaker: 'narrator', text: 'Then... the shadow passes.' },
                { speaker: 'papa', text: '...It\'s gone. For now.' },
                { speaker: 'bramble', text: 'What... what was that?' }
            ]
        },
        'parents_look': {
            lines: [
                { speaker: 'narrator', text: 'Your parents exchange a look. Heavy with memory.' },
                { speaker: 'mama', text: 'Nothing to worry about, little ones.' },
                { speaker: 'mama', text: 'Just a passing bird.' }
            ]
        },
        'asher_arrives': {
            lines: [
                { speaker: 'narrator', text: 'As evening comes, a dark shape lands on a nearby branch.' },
                { speaker: 'narrator', text: 'A crow. Old. Ragged. Eyes that see too much.' },
                { speaker: 'papa', text: 'Asher.' }
            ]
        },
        'papa_defensive': {
            lines: [
                { speaker: 'papa', text: 'What do you want, crow?' },
                { speaker: 'asher', text: 'Such hostility. I came to give a warning.' }
            ]
        },
        'mama_calm': {
            lines: [
                { speaker: 'mama', text: 'Let him speak.' },
                { speaker: 'asher', text: 'The mother has wisdom.' }
            ]
        },
        'asher_speaks': {
            lines: [
                { speaker: 'asher', text: 'The little ones grow fast, I see.' },
                { speaker: 'narrator', text: 'His eye fixes on you.' },
                { speaker: 'asher', text: 'Something different about this one.' }
            ]
        },
        'asher_cryptic': {
            lines: [
                { speaker: 'asher', text: 'Talon has returned to the valley.' },
                { speaker: 'papa', text: '...We know.' },
                { speaker: 'asher', text: 'He remembers this tree. What he took.' },
                { speaker: 'asher', text: 'And he will come for what remains.' },
                { speaker: 'asher', text: 'Teach them fast. Time is not your friend.' },
                { speaker: 'narrator', text: 'The old crow spreads his tattered wings and disappears.' }
            ]
        },
        'mama_dismiss': {
            lines: [
                { speaker: 'wren', text: 'Mama... what did he mean? What did Talon take?' },
                { speaker: 'mama', text: 'Old Asher sees danger everywhere.' },
                { speaker: 'mama', text: 'Don\'t let his words frighten you.' },
                { speaker: 'papa', text: 'Let\'s get some rest.' }
            ]
        },
        'night2_falls': {
            lines: [
                { speaker: 'narrator', text: 'Night falls once more.' },
                { speaker: 'narrator', text: 'The nest feels smaller tonight. The darkness, deeper.' }
            ]
        },
        'papa_awake': {
            lines: [
                { speaker: 'narrator', text: 'As sleep takes you, one last image remains.' },
                { speaker: 'narrator', text: 'Papa, standing guard against the stars.' },
                { speaker: 'narrator', text: 'One thing is certain now.' },
                { speaker: 'narrator', text: 'You need to learn to fly. And soon.' }
            ]
        }
    };

    // ==========================================
    // GAME STATE
    // ==========================================
    const gameState = {
        currentDay: 1,
        currentScene: 'title',
        wingStrength: 10,
        maxWingStrength: 100,
        isPlaying: false,
        timeOfDay: 'dawn',
        flags: {
            hasEaten: false,
            hasStretched: false
        }
    };

    const keys = {
        left: false,
        right: false,
        up: false,
        space: false,
        spacePressed: false
    };

    // ==========================================
    // PARTICLE SYSTEM
    // ==========================================
    const particles = [];

    function emitParticle(type, x, y) {
        const p = {
            x, y,
            type,
            life: 1,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2,
            size: 3 + Math.random() * 3,
            decay: 0.02,
            rotation: Math.random() * Math.PI * 2
        };

        if (type === 'feather') {
            p.vy = -Math.random() - 0.5;
            p.decay = 0.008;
            p.color = Math.random() > 0.5 ? '#a0a0a0' : '#d4c4b0';
        } else if (type === 'sparkle') {
            p.color = '#ffd93d';
            p.decay = 0.03;
        }

        particles.push(p);
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.rotation += 0.05;
            p.life -= p.decay;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }

    function renderParticles() {
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color || '#fff';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    // ==========================================
    // PLAYER (PIP)
    // ==========================================
    const player = {
        x: 400,
        y: NEST_Y - 25,
        vx: 0,
        vy: 0,
        enabled: false,
        hasMoved: false,
        direction: 1,
        isStretching: false,
        breathePhase: 0,
        blinkTimer: 0,
        isBlinking: false,

        update(dt) {
            if (!this.enabled) return;

            this.breathePhase += dt * 0.003;
            this.blinkTimer += dt;

            if (this.blinkTimer > 3000) {
                this.isBlinking = true;
                setTimeout(() => this.isBlinking = false, 150);
                this.blinkTimer = 0;
            }

            // Movement
            if (!this.isStretching) {
                if (keys.left) {
                    this.vx = -2.5;
                    this.direction = -1;
                    this.hasMoved = true;
                } else if (keys.right) {
                    this.vx = 2.5;
                    this.direction = 1;
                    this.hasMoved = true;
                } else {
                    this.vx *= 0.8;
                }

                if (keys.spacePressed && this.y >= NEST_Y - 26) {
                    this.vy = -5;
                    this.hasMoved = true;
                }
            }

            // Stretching
            this.isStretching = keys.space && this.y >= NEST_Y - 26;

            // Physics
            this.vy += 0.3;
            this.x += this.vx;
            this.y += this.vy;

            // Ground
            if (this.y > NEST_Y - 25) {
                this.y = NEST_Y - 25;
                this.vy = 0;
            }

            // Boundaries
            if (this.x < NEST_LEFT) this.x = NEST_LEFT;
            if (this.x > NEST_RIGHT) this.x = NEST_RIGHT;
        },

        render() {
            if (!this.enabled) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.direction, 1);

            const breathe = Math.sin(this.breathePhase) * 1;
            const wingExtend = this.isStretching ? 15 : 0;

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(0, 12, 12, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Body
            ctx.fillStyle = '#a0a0a0';
            ctx.beginPath();
            ctx.ellipse(0, breathe, 12, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            // Belly
            ctx.fillStyle = '#d4c4b0';
            ctx.beginPath();
            ctx.ellipse(2, breathe + 3, 7, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wings
            ctx.fillStyle = '#888';
            ctx.save();
            ctx.translate(-5, breathe - 2);
            ctx.rotate(-0.3 - (wingExtend * 0.03));
            ctx.beginPath();
            ctx.ellipse(0, 0, 6 + wingExtend * 0.4, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.translate(5, breathe - 2);
            ctx.rotate(0.3 + (wingExtend * 0.03));
            ctx.beginPath();
            ctx.ellipse(0, 0, 6 + wingExtend * 0.4, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Head
            ctx.fillStyle = '#a0a0a0';
            ctx.beginPath();
            ctx.arc(8, breathe - 8, 9, 0, Math.PI * 2);
            ctx.fill();

            // Eye
            if (!this.isBlinking) {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(11, breathe - 9, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.arc(12, breathe - 9, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(13, breathe - 10, 1, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(11, breathe - 9, 3, 0.2, Math.PI - 0.2);
                ctx.stroke();
            }

            // Beak
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.moveTo(15, breathe - 7);
            ctx.lineTo(22, breathe - 5);
            ctx.lineTo(15, breathe - 3);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    };

    // ==========================================
    // NPC SYSTEM
    // ==========================================
    const npcs = {};

    const npcDefs = {
        mama: { x: 340, y: NEST_Y - 35, type: 'adult', color: '#8B4513', belly: '#F4A460', dir: 1 },
        papa: { x: 460, y: NEST_Y - 35, type: 'adult', color: '#654321', belly: '#DEB887', dir: -1 },
        wren: { x: 370, y: NEST_Y - 22, type: 'chick', color: '#a08070', belly: '#d4c4b0', dir: 1 },
        bramble: { x: 430, y: NEST_Y - 22, type: 'chick', color: '#907060', belly: '#c4b4a0', dir: -1 },
        asher: { x: 600, y: NEST_Y - 80, type: 'crow', color: '#1a1a1a', dir: -1 }
    };

    function spawnNPC(id, state) {
        if (npcDefs[id]) {
            npcs[id] = { ...npcDefs[id], id, state: state || 'idle', phase: Math.random() * Math.PI * 2 };
        }
    }

    function setNPCState(id, state) {
        if (id === 'all') {
            Object.values(npcs).forEach(n => n.state = state);
        } else if (npcs[id]) {
            npcs[id].state = state;
        }
    }

    function removeNPC(id) {
        delete npcs[id];
    }

    function updateNPCs(dt) {
        Object.values(npcs).forEach(npc => {
            npc.phase += dt * 0.002;
            if (npc.state === 'racing') {
                npc.x += 1.5;
                if (npc.x > 500) npc.x = 500;
            }
        });
    }

    function renderNPCs() {
        Object.values(npcs).forEach(npc => {
            ctx.save();
            ctx.translate(npc.x, npc.y);
            ctx.scale(npc.dir, 1);

            const b = Math.sin(npc.phase) * 1;

            if (npc.state === 'sleeping') {
                // Sleeping
                ctx.fillStyle = npc.color;
                ctx.beginPath();
                ctx.ellipse(0, b + 2, 12, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(5, b - 2, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(9, b - 3, 2, 0.3, Math.PI - 0.3);
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.font = '10px sans-serif';
                ctx.fillText('z', 15, b - 10);
            } else if (npc.type === 'adult') {
                // Adult bird
                ctx.fillStyle = npc.color;
                ctx.beginPath();
                ctx.ellipse(0, b, 18, 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = npc.belly;
                ctx.beginPath();
                ctx.ellipse(3, b + 5, 10, 9, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = npc.color;
                ctx.beginPath();
                ctx.arc(14, b - 10, 11, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(19, b - 11, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.arc(20, b - 11, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFA500';
                ctx.beginPath();
                ctx.moveTo(23, b - 8);
                ctx.lineTo(32, b - 7);
                ctx.lineTo(23, b - 5);
                ctx.closePath();
                ctx.fill();
            } else if (npc.type === 'chick') {
                // Chick
                ctx.fillStyle = npc.color;
                ctx.beginPath();
                ctx.ellipse(0, b, 10, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = npc.belly;
                ctx.beginPath();
                ctx.ellipse(2, b + 2, 6, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = npc.color;
                ctx.beginPath();
                ctx.arc(7, b - 6, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(10, b - 7, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.arc(11, b - 7, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffcc00';
                ctx.beginPath();
                ctx.moveTo(12, b - 5);
                ctx.lineTo(18, b - 4);
                ctx.lineTo(12, b - 2);
                ctx.closePath();
                ctx.fill();
            } else if (npc.type === 'crow') {
                // Crow (Asher)
                ctx.fillStyle = '#1a1a1a';
                ctx.beginPath();
                ctx.ellipse(0, b, 20, 15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(15, b - 8, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#666';
                ctx.beginPath();
                ctx.arc(21, b - 10, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.moveTo(25, b - 6);
                ctx.lineTo(40, b - 4);
                ctx.lineTo(25, b - 2);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        });
    }

    // ==========================================
    // SCENE MANAGER
    // ==========================================
    let currentSceneId = null;
    let sceneStep = 0;
    let sceneTimer = 0;
    let waitingForDialogue = false;
    let waitingForAction = null;
    let foodItem = null;
    let bugs = [];
    let shadowX = -200;
    let shadowActive = false;

    const scenes = {
        'day1_awakening': [
            { type: 'setTime', time: 'dawn' },
            { type: 'spawnNPC', npc: 'mama' },
            { type: 'dialogue', id: 'hatching_1' },
            { type: 'dialogue', id: 'hatching_2' },
            { type: 'enablePlayer' },
            { type: 'dialogue', id: 'mama_intro' },
            { type: 'waitFor', action: 'move', hint: 'Use ARROW KEYS to hop around' },
            { type: 'dialogue', id: 'mama_good' },
            { type: 'spawnNPC', npc: 'wren', state: 'sleeping' },
            { type: 'spawnNPC', npc: 'bramble', state: 'sleeping' },
            { type: 'dialogue', id: 'mama_siblings' },
            { type: 'dialogue', id: 'mama_rest' },
            { type: 'next', scene: 'day1_feeding' }
        ],
        'day1_feeding': [
            { type: 'setTime', time: 'day' },
            { type: 'delay', ms: 500 },
            { type: 'spawnNPC', npc: 'papa' },
            { type: 'dialogue', id: 'papa_arrives' },
            { type: 'spawnFood' },
            { type: 'dialogue', id: 'papa_food' },
            { type: 'waitFor', action: 'eat', hint: 'Move to the food and press SPACE' },
            { type: 'dialogue', id: 'papa_good' },
            { type: 'dialogue', id: 'papa_warning' },
            { type: 'next', scene: 'day1_siblings' }
        ],
        'day1_siblings': [
            { type: 'setNPC', npc: 'wren', state: 'idle' },
            { type: 'setNPC', npc: 'bramble', state: 'idle' },
            { type: 'delay', ms: 300 },
            { type: 'dialogue', id: 'siblings_wake' },
            { type: 'dialogue', id: 'wren_intro' },
            { type: 'dialogue', id: 'bramble_intro' },
            { type: 'dialogue', id: 'bramble_challenge' },
            { type: 'minigame', game: 'race' },
            { type: 'dialogue', id: 'race_result' },
            { type: 'next', scene: 'day1_night' }
        ],
        'day1_night': [
            { type: 'setTime', time: 'dusk' },
            { type: 'delay', ms: 1500 },
            { type: 'setTime', time: 'night' },
            { type: 'setNPC', npc: 'all', state: 'sleeping' },
            { type: 'dialogue', id: 'night_falls' },
            { type: 'dialogue', id: 'mama_lullaby' },
            { type: 'dialogue', id: 'papa_watches' },
            { type: 'delay', ms: 1500 },
            { type: 'endDay', day: 1 }
        ],
        'day2_morning': [
            { type: 'setTime', time: 'dawn' },
            { type: 'setNPC', npc: 'all', state: 'idle' },
            { type: 'dialogue', id: 'day2_wake' },
            { type: 'dialogue', id: 'mama_stretch' },
            { type: 'minigame', game: 'stretch' },
            { type: 'dialogue', id: 'stretch_done' },
            { type: 'next', scene: 'day2_competition' }
        ],
        'day2_competition': [
            { type: 'setTime', time: 'day' },
            { type: 'dialogue', id: 'papa_food_2' },
            { type: 'minigame', game: 'bugs' },
            { type: 'dialogue', id: 'feeding_done' },
            { type: 'next', scene: 'day2_edge' }
        ],
        'day2_edge': [
            { type: 'dialogue', id: 'wren_edge' },
            { type: 'waitFor', action: 'goRight', hint: 'Hop to the RIGHT side of the nest' },
            { type: 'dialogue', id: 'wren_someday' },
            { type: 'dialogue', id: 'bramble_tomorrow' },
            { type: 'dialogue', id: 'mama_patience' },
            { type: 'next', scene: 'day2_shadow' }
        ],
        'day2_shadow': [
            { type: 'delay', ms: 800 },
            { type: 'showShadow' },
            { type: 'dialogue', id: 'shadow_passes' },
            { type: 'dialogue', id: 'papa_shield' },
            { type: 'dialogue', id: 'shadow_gone' },
            { type: 'dialogue', id: 'parents_look' },
            { type: 'next', scene: 'day2_asher' }
        ],
        'day2_asher': [
            { type: 'setTime', time: 'dusk' },
            { type: 'spawnNPC', npc: 'asher' },
            { type: 'dialogue', id: 'asher_arrives' },
            { type: 'dialogue', id: 'papa_defensive' },
            { type: 'dialogue', id: 'mama_calm' },
            { type: 'dialogue', id: 'asher_speaks' },
            { type: 'dialogue', id: 'asher_cryptic' },
            { type: 'removeNPC', npc: 'asher' },
            { type: 'dialogue', id: 'mama_dismiss' },
            { type: 'next', scene: 'day2_night' }
        ],
        'day2_night': [
            { type: 'setTime', time: 'night' },
            { type: 'setNPC', npc: 'all', state: 'sleeping' },
            { type: 'dialogue', id: 'night2_falls' },
            { type: 'dialogue', id: 'papa_awake' },
            { type: 'delay', ms: 1500 },
            { type: 'endDay', day: 2 }
        ]
    };

    function startScene(sceneId) {
        currentSceneId = sceneId;
        sceneStep = 0;
        sceneTimer = 0;
        waitingForDialogue = false;
        waitingForAction = null;
        processStep();
    }

    function processStep() {
        const scene = scenes[currentSceneId];
        if (!scene || sceneStep >= scene.length) return;

        const step = scene[sceneStep];

        switch (step.type) {
            case 'setTime':
                gameState.timeOfDay = step.time;
                advanceStep();
                break;
            case 'dialogue':
                waitingForDialogue = true;
                startDialogue(step.id, () => {
                    waitingForDialogue = false;
                    advanceStep();
                });
                break;
            case 'enablePlayer':
                player.enabled = true;
                advanceStep();
                break;
            case 'spawnNPC':
                spawnNPC(step.npc, step.state);
                advanceStep();
                break;
            case 'setNPC':
                setNPCState(step.npc, step.state);
                advanceStep();
                break;
            case 'removeNPC':
                removeNPC(step.npc);
                advanceStep();
                break;
            case 'spawnFood':
                foodItem = { x: 400, y: NEST_Y - 18 };
                advanceStep();
                break;
            case 'waitFor':
                waitingForAction = step.action;
                showHint(step.hint);
                break;
            case 'delay':
                sceneTimer = step.ms;
                break;
            case 'minigame':
                runMinigame(step.game);
                break;
            case 'showShadow':
                shadowActive = true;
                shadowX = -200;
                advanceStep();
                break;
            case 'next':
                startScene(step.scene);
                break;
            case 'endDay':
                endDay(step.day);
                break;
        }
    }

    function advanceStep() {
        sceneStep++;
        processStep();
    }

    function runMinigame(game) {
        if (game === 'race') {
            showHint('Race to the RIGHT side of the nest!');
            setNPCState('bramble', 'racing');
            waitingForAction = 'raceWin';
        } else if (game === 'stretch') {
            showHint('Hold SPACE to stretch your wings!');
            waitingForAction = 'stretch';
        } else if (game === 'bugs') {
            showHint('Catch the bugs! Move to them and press SPACE');
            bugs = [];
            for (let i = 0; i < 4; i++) {
                bugs.push({ x: 300 + Math.random() * 200, y: NEST_Y - 25, caught: false });
            }
            waitingForAction = 'catchBugs';
        }
    }

    function showHint(text) {
        const hint = document.getElementById('action-hint');
        hint.textContent = text;
        hint.classList.remove('hidden');
    }

    function hideHint() {
        document.getElementById('action-hint').classList.add('hidden');
    }

    function endDay(day) {
        let msg = '';
        if (day === 1) {
            msg = 'Day 1 Complete<br><br>Pip is growing stronger.<br>But something watches from above...';
        } else {
            msg = 'Day 2 Complete<br><br>Pip\'s wings grow stronger.<br>The shadow will return.<br><br><i>To be continued...</i>';
        }
        document.getElementById('end-message').innerHTML = msg;
        document.getElementById('end-chapter-screen').classList.remove('hidden');
    }

    function updateScene(dt) {
        if (sceneTimer > 0) {
            sceneTimer -= dt;
            if (sceneTimer <= 0) advanceStep();
        }

        if (waitingForAction) {
            let done = false;
            if (waitingForAction === 'move' && player.hasMoved) done = true;
            if (waitingForAction === 'eat' && foodItem && keys.spacePressed && Math.abs(player.x - foodItem.x) < 30) {
                foodItem = null;
                gameState.flags.hasEaten = true;
                for (let i = 0; i < 5; i++) emitParticle('sparkle', player.x, player.y - 10);
                done = true;
            }
            if (waitingForAction === 'goRight' && player.x > 490) done = true;
            if (waitingForAction === 'raceWin' && player.x > 490) {
                setNPCState('bramble', 'idle');
                done = true;
            }
            if (waitingForAction === 'stretch') {
                if (player.isStretching) {
                    gameState.wingStrength += 0.5;
                    if (Math.random() < 0.1) emitParticle('feather', player.x, player.y - 15);
                    if (gameState.wingStrength >= 30) {
                        gameState.flags.hasStretched = true;
                        done = true;
                    }
                }
            }
            if (waitingForAction === 'catchBugs') {
                let remaining = 0;
                bugs.forEach(bug => {
                    if (!bug.caught) {
                        remaining++;
                        if (keys.spacePressed && Math.abs(player.x - bug.x) < 25) {
                            bug.caught = true;
                            for (let i = 0; i < 3; i++) emitParticle('sparkle', bug.x, bug.y);
                        }
                    }
                });
                if (remaining === 0) {
                    bugs = [];
                    done = true;
                }
            }

            if (done) {
                hideHint();
                waitingForAction = null;
                advanceStep();
            }
        }

        // Shadow animation
        if (shadowActive) {
            shadowX += 6;
            if (shadowX > GAME_WIDTH + 200) shadowActive = false;
        }
    }

    // ==========================================
    // DIALOGUE SYSTEM
    // ==========================================
    let dialogueActive = false;
    let dialogueLines = [];
    let dialogueLine = 0;
    let dialogueText = '';
    let dialogueTarget = '';
    let dialogueCharIdx = 0;
    let dialogueCallback = null;
    let dialogueWaiting = false;

    const portraits = {
        pip: '🐣', mama: '🐦', papa: '🐦', wren: '🐥', bramble: '🐥', asher: '🦅', narrator: '✨'
    };
    const nameColors = {
        pip: '#a8e6cf', mama: '#ffb6c1', papa: '#87ceeb', wren: '#dda0dd', bramble: '#f0e68c', asher: '#778899', narrator: '#ffd93d'
    };

    function startDialogue(id, callback) {
        const data = DIALOGUE_DATA[id];
        if (!data) { if (callback) callback(); return; }

        dialogueActive = true;
        dialogueLines = data.lines;
        dialogueLine = 0;
        dialogueCallback = callback;
        showDialogueLine();
    }

    function showDialogueLine() {
        if (dialogueLine >= dialogueLines.length) {
            endDialogue();
            return;
        }

        const line = dialogueLines[dialogueLine];
        document.getElementById('dialogue-portrait').textContent = portraits[line.speaker] || '❓';
        document.getElementById('dialogue-name').textContent = line.speaker === 'narrator' ? '' : line.speaker.charAt(0).toUpperCase() + line.speaker.slice(1);
        document.getElementById('dialogue-name').style.color = nameColors[line.speaker] || '#fff';

        dialogueTarget = line.text;
        dialogueText = '';
        dialogueCharIdx = 0;
        dialogueWaiting = false;

        document.getElementById('dialogue-container').classList.remove('hidden');
        document.getElementById('dialogue-continue').style.visibility = 'hidden';
    }

    function updateDialogue() {
        if (!dialogueActive) return;

        if (dialogueCharIdx < dialogueTarget.length) {
            dialogueText += dialogueTarget[dialogueCharIdx];
            dialogueCharIdx++;
            document.getElementById('dialogue-text').textContent = dialogueText;

            if (keys.spacePressed) {
                dialogueText = dialogueTarget;
                dialogueCharIdx = dialogueTarget.length;
                document.getElementById('dialogue-text').textContent = dialogueText;
            }
        } else if (!dialogueWaiting) {
            dialogueWaiting = true;
            document.getElementById('dialogue-continue').style.visibility = 'visible';
        } else if (keys.spacePressed) {
            dialogueLine++;
            showDialogueLine();
        }
    }

    function endDialogue() {
        dialogueActive = false;
        document.getElementById('dialogue-container').classList.add('hidden');
        if (dialogueCallback) {
            dialogueCallback();
            dialogueCallback = null;
        }
    }

    // ==========================================
    // RENDERING
    // ==========================================
    const skyColors = {
        dawn: { top: '#4a3066', bottom: '#ff9a56' },
        day: { top: '#87CEEB', bottom: '#c9e9f6' },
        dusk: { top: '#2d1b4e', bottom: '#ff6b6b' },
        night: { top: '#0a0a1a', bottom: '#1a1a3a' }
    };

    const stars = [];
    for (let i = 0; i < 50; i++) {
        stars.push({ x: Math.random() * GAME_WIDTH, y: Math.random() * 200, size: Math.random() * 2 + 1, phase: Math.random() * Math.PI * 2 });
    }

    function renderBackground() {
        const colors = skyColors[gameState.timeOfDay];

        // Sky
        const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
        grad.addColorStop(0, colors.top);
        grad.addColorStop(1, colors.bottom);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Stars
        if (gameState.timeOfDay === 'night') {
            stars.forEach(s => {
                s.phase += 0.02;
                ctx.globalAlpha = 0.5 + Math.sin(s.phase) * 0.5;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
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
        } else if (gameState.timeOfDay === 'night') {
            ctx.fillStyle = '#E8E8E8';
            ctx.beginPath();
            ctx.arc(650, 80, 30, 0, Math.PI * 2);
            ctx.fill();
        }

        // Distant forest
        ctx.fillStyle = gameState.timeOfDay === 'night' ? '#1a1a2e' : '#7a9eb8';
        ctx.beginPath();
        ctx.moveTo(0, 450);
        for (let x = 0; x <= GAME_WIDTH; x += 50) {
            ctx.lineTo(x, 400 + Math.sin(x * 0.02) * 30);
        }
        ctx.lineTo(GAME_WIDTH, 600);
        ctx.lineTo(0, 600);
        ctx.fill();

        ctx.fillStyle = gameState.timeOfDay === 'night' ? '#0d1a0d' : '#2d5a3d';
        ctx.beginPath();
        ctx.moveTo(0, 480);
        for (let x = 0; x <= GAME_WIDTH; x += 30) {
            ctx.lineTo(x, 460 - 20 - Math.sin(x * 0.1) * 15);
            ctx.lineTo(x + 15, 460);
        }
        ctx.lineTo(GAME_WIDTH, 600);
        ctx.lineTo(0, 600);
        ctx.fill();

        // Tree trunk
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(80, 200, 60, 400);

        // Branch
        ctx.fillStyle = '#4a3520';
        ctx.beginPath();
        ctx.moveTo(120, 380);
        ctx.lineTo(650, 400);
        ctx.lineTo(650, 420);
        ctx.lineTo(120, 400);
        ctx.fill();

        // Nest
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y + 30, 100, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5a4030';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y, 110, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6b5040';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y - 10, 100, 35, 0, 0, Math.PI);
        ctx.fill();

        ctx.fillStyle = '#7a6550';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y - 5, 80, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#a09080';
        ctx.beginPath();
        ctx.ellipse(400, NEST_Y - 8, 70, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Food
        if (foodItem) {
            ctx.fillStyle = 'rgba(255,200,100,0.3)';
            ctx.beginPath();
            ctx.arc(foodItem.x, foodItem.y, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#e87070';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(foodItem.x - 8, foodItem.y);
            ctx.quadraticCurveTo(foodItem.x, foodItem.y - 5, foodItem.x + 8, foodItem.y);
            ctx.stroke();
        }

        // Bugs
        bugs.forEach(bug => {
            if (!bug.caught) {
                ctx.fillStyle = '#50c878';
                ctx.beginPath();
                ctx.ellipse(bug.x, bug.y, 6, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Hawk shadow
        if (shadowActive) {
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.moveTo(shadowX, 300);
            ctx.lineTo(shadowX - 60, 350);
            ctx.lineTo(shadowX - 30, 340);
            ctx.lineTo(shadowX - 80, 380);
            ctx.lineTo(shadowX, 350);
            ctx.lineTo(shadowX + 80, 380);
            ctx.lineTo(shadowX + 30, 340);
            ctx.lineTo(shadowX + 60, 350);
            ctx.closePath();
            ctx.fill();
        }
    }

    function updateUI() {
        document.getElementById('day-indicator').textContent = 'Day ' + gameState.currentDay;
        document.getElementById('wing-fill').style.width = (gameState.wingStrength / gameState.maxWingStrength * 100) + '%';
    }

    // ==========================================
    // GAME LOOP
    // ==========================================
    let lastTime = 0;

    function gameLoop(timestamp) {
        const dt = Math.min(timestamp - lastTime, 50);
        lastTime = timestamp;

        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (gameState.isPlaying) {
            updateScene(dt);
            player.update(dt);
            updateNPCs(dt);
            updateParticles();
            updateDialogue();

            renderBackground();
            renderNPCs();
            player.render();
            renderParticles();

            updateUI();
        }

        keys.spacePressed = false;
        requestAnimationFrame(gameLoop);
    }

    // ==========================================
    // INPUT
    // ==========================================
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

    // ==========================================
    // START
    // ==========================================
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('title-screen').classList.add('hidden');
        gameState.isPlaying = true;
        gameState.currentDay = 1;

        document.getElementById('chapter-day').textContent = 'Day 1';
        document.getElementById('chapter-title').textContent = 'Awakening';
        document.getElementById('chapter-screen').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('chapter-screen').classList.add('hidden');
            startScene('day1_awakening');
        }, 2500);
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        document.getElementById('end-chapter-screen').classList.add('hidden');

        if (gameState.currentDay === 1) {
            gameState.currentDay = 2;
            document.getElementById('chapter-day').textContent = 'Day 2';
            document.getElementById('chapter-title').textContent = 'Growing';
            document.getElementById('chapter-screen').classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('chapter-screen').classList.add('hidden');
                startScene('day2_morning');
            }, 2500);
        }
    });

    requestAnimationFrame(gameLoop);
})();
