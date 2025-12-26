// Nestbound: First Flight - Enhanced Edition
(function() {
    'use strict';

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const WIDTH = 400;
    const HEIGHT = 300;
    canvas.width = 800;
    canvas.height = 600;
    ctx.imageSmoothingEnabled = false;

    const pxCanvas = document.createElement('canvas');
    pxCanvas.width = WIDTH;
    pxCanvas.height = HEIGHT;
    const px = pxCanvas.getContext('2d');
    px.imageSmoothingEnabled = false;

    const NEST_Y = 210;
    const NEST_LEFT = 140;
    const NEST_RIGHT = 260;

    const game = {
        playing: false,
        day: 1,
        time: 'dawn',
        wingStrength: 10,
        hunger: 100,
        energy: 100
    };

    const keys = { left: false, right: false, up: false, space: false, spaceJustPressed: false, enter: false, enterJustPressed: false };

    // Particles for visual polish
    const particles = [];
    function addParticle(x, y, type) {
        particles.push({ x, y, type, life: 60, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2 });
    }
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.life--;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }
    function drawParticles() {
        particles.forEach(p => {
            const alpha = p.life / 60;
            if (p.type === 'feather') {
                px.fillStyle = `rgba(200,180,160,${alpha})`;
                px.fillRect(p.x, p.y, 3, 2);
            } else if (p.type === 'leaf') {
                px.fillStyle = `rgba(100,150,80,${alpha})`;
                px.fillRect(p.x, p.y, 4, 3);
            } else if (p.type === 'sparkle') {
                px.fillStyle = `rgba(255,255,200,${alpha})`;
                px.fillRect(p.x, p.y, 2, 2);
            } else if (p.type === 'heart') {
                px.fillStyle = `rgba(255,150,150,${alpha})`;
                px.fillRect(p.x, p.y, 3, 3);
            }
        });
    }

    // ============ EXPANDED DIALOGUES ============
    const DIALOGUES = {
        'hatching_1': [
            ['narrator', '...'],
            ['narrator', 'Darkness surrounds you.'],
            ['narrator', 'But it is warm. Safe.'],
            ['narrator', 'You hear a heartbeat. Is it yours?'],
            ['narrator', 'Then... something changes.'],
            ['narrator', 'A crack of light.']
        ],
        'hatching_2': [
            ['narrator', 'You push against the walls of your world.'],
            ['narrator', 'They give way.'],
            ['narrator', 'Light floods in. Blinding. Beautiful.'],
            ['mama', 'Oh... oh my little one.'],
            ['mama', 'There you are.'],
            ['mama', 'Welcome to the world, Pip.'],
            ['mama', 'I have waited so long to meet you.']
        ],
        'mama_intro': [
            ['mama', 'This is our nest, little one.'],
            ['mama', 'High in the great oak tree.'],
            ['mama', 'You are safe here.'],
            ['mama', 'Can you try moving? Use the ARROW KEYS.'],
            ['mama', 'Just a little hop. You can do it.']
        ],
        'mama_good': [
            ['mama', 'Yes! Look at you!'],
            ['mama', 'Such a brave little bird already.'],
            ['narrator', 'Mama beams with pride.']
        ],
        'mama_siblings': [
            ['mama', 'Come, let me show you something.'],
            ['narrator', 'Two small shapes huddle nearby.'],
            ['mama', 'These are your siblings.'],
            ['mama', 'Wren, your sister. She hatched yesterday.'],
            ['mama', 'And Bramble, your brother. Always so energetic.'],
            ['mama', 'They are resting now. Growing takes energy.']
        ],
        'mama_rest': [
            ['mama', 'You should rest too, little Pip.'],
            ['mama', 'Close your eyes. Feel the warmth of the nest.'],
            ['mama', 'Papa will return soon with food.'],
            ['mama', 'He will be so happy to meet you.'],
            ['narrator', 'Time passes. You drift in and out of sleep.']
        ],
        'papa_arrives': [
            ['narrator', 'A rush of wings. A familiar scent.'],
            ['papa', "I'm home!"],
            ['narrator', 'A large bird lands on the branch.'],
            ['papa', 'Is that... did the egg...?'],
            ['mama', 'Come meet your child, dear.'],
            ['papa', 'Pip! You hatched!'],
            ['papa', 'Oh, look at those eyes. Just like your mother.'],
            ['narrator', "Papa's voice cracks with emotion."]
        ],
        'papa_food': [
            ['papa', 'You must be hungry, little one.'],
            ['papa', "I brought something special. Your first meal!"],
            ['narrator', 'Papa places food in the nest.'],
            ['papa', 'Hop over to it and press SPACE to eat.'],
            ['papa', 'Growing birds need their strength!']
        ],
        'papa_good': [
            ['papa', "That's my Pip!"],
            ['papa', 'You will grow big and strong.'],
            ['mama', 'Just like your father.'],
            ['narrator', 'Your parents share a warm look.']
        ],
        'papa_warning': [
            ['narrator', "Papa's expression changes."],
            ['papa', 'The forest was... quiet today.'],
            ['papa', 'Too quiet.'],
            ['mama', "...I'm sure it's nothing."],
            ['papa', 'Perhaps. But we should be careful.'],
            ['mama', 'Shh. Not in front of the children.'],
            ['narrator', 'They exchange a worried glance.']
        ],
        'siblings_wake': [
            ['narrator', 'A small yawn breaks the silence.'],
            ['bramble', '*yaaaawn* Wha... what happened?'],
            ['wren', 'Bramble! Look! The egg!'],
            ['bramble', 'Huh? OH!'],
            ['wren', 'Pip hatched! Pip hatched!'],
            ['bramble', "A new sibling! Finally, I'm not the youngest!"]
        ],
        'wren_intro': [
            ['wren', 'Hi Pip! I am Wren!'],
            ['wren', 'I am your big sister now.'],
            ['wren', 'I hatched a WHOLE day before you.'],
            ['wren', 'So I know everything about the nest.'],
            ['bramble', 'You do not!'],
            ['wren', 'I know more than YOU, Bramble.']
        ],
        'bramble_intro': [
            ['bramble', 'Ignore her. I am BRAMBLE!'],
            ['bramble', 'The fastest bird in this nest!'],
            ['wren', "You've never even left the nest..."],
            ['bramble', 'FASTEST IN THE NEST!'],
            ['bramble', 'Hey Pip! Wanna see how fast I am?'],
            ['bramble', 'Race me! First one to the right side wins!']
        ],
        'bramble_challenge': [
            ['bramble', 'Okay! On your marks...'],
            ['bramble', 'Get set...'],
            ['bramble', 'GO GO GO!']
        ],
        'race_win': [
            ['bramble', 'WHAT?! No way!'],
            ['bramble', 'You... you beat me?!'],
            ['wren', 'Ha! Not so fast now, are you?'],
            ['bramble', "I... I let Pip win! Because it's their first day!"],
            ['mama', "That's very kind of you, Bramble."],
            ['bramble', "...Yeah! That's it! I was being nice!"],
            ['narrator', 'Bramble pouts slightly.']
        ],
        'race_lose': [
            ['bramble', 'HA! I WIN!'],
            ['bramble', 'Told you I was the fastest!'],
            ['wren', 'Pip just hatched today, Bramble...'],
            ['bramble', 'A win is a win!'],
            ['mama', "You'll get faster, Pip. Don't worry."],
            ['narrator', 'Bramble does a little victory hop.']
        ],
        'night_falls': [
            ['narrator', 'The sky begins to change.'],
            ['narrator', 'Orange fades to purple.'],
            ['narrator', 'Purple surrenders to deep blue.'],
            ['narrator', 'Stars appear, one by one.'],
            ['wren', "It's so pretty..."],
            ['bramble', 'I like the really bright one.'],
            ['mama', "That's the North Star. It guides lost birds home."]
        ],
        'mama_lullaby': [
            ['mama', 'Come now, little ones. Time for sleep.'],
            ['bramble', "But I'm not tired!"],
            ['mama', 'Growing birds need rest.'],
            ['narrator', 'Mama gathers you all close.'],
            ['mama', '♪ Hush now, little feathers... ♪'],
            ['mama', '♪ Safe within our nest... ♪'],
            ['mama', '♪ Dream of open skies... ♪'],
            ['mama', '♪ Where you will fly your best... ♪'],
            ['narrator', "Your eyes grow heavy. Mama's voice fades..."]
        ],
        'papa_watches': [
            ['narrator', 'But Papa does not sleep.'],
            ['narrator', 'He stands at the edge of the nest.'],
            ['narrator', 'Watching. Waiting.'],
            ['narrator', 'Something is out there.'],
            ['narrator', 'Something that hunts in the dark.'],
            ['narrator', 'Day 1 ends...']
        ],

        // DAY 2
        'day2_wake': [
            ['narrator', 'Morning light touches your feathers.'],
            ['bramble', 'MORNING EVERYONE!'],
            ['wren', 'Ugh... five more minutes...'],
            ['bramble', 'No way! Today we train!'],
            ['mama', 'Bramble is right, for once.'],
            ['bramble', 'Hey!'],
            ['mama', 'Today we begin wing exercises.'],
            ['mama', "You're not ready to fly yet..."],
            ['mama', 'But strong wings will save your life someday.']
        ],
        'mama_stretch': [
            ['mama', 'Watch me first.'],
            ['narrator', 'Mama spreads her wings wide.'],
            ['mama', 'Feel the stretch. The power.'],
            ['mama', 'Now you try! Hold SPACE to stretch your wings.'],
            ['mama', 'Keep holding until your wings feel strong!']
        ],
        'stretch_done': [
            ['mama', 'Excellent! I can see you getting stronger!'],
            ['bramble', 'When do we actually FLY?!'],
            ['mama', 'Soon, Bramble. Patience.'],
            ['bramble', "But I want to fly NOW!"],
            ['wren', 'Flying looks scary...'],
            ['papa', "It is scary. But it's also freedom."],
            ['papa', 'One day, you will soar above the clouds.'],
            ['papa', 'And you will never want to come down.']
        ],
        'papa_food_2': [
            ['papa', 'But first - breakfast!'],
            ['papa', "I found some delicious bugs today."],
            ['bramble', 'BUGS!'],
            ['wren', 'I hope they are not too crunchy...'],
            ['papa', "Let's make it fun. Catch as many as you can!"],
            ['papa', 'Move to them and press SPACE!']
        ],
        'feeding_done': [
            ['papa', 'Well done, everyone!'],
            ['bramble', 'I caught the most!'],
            ['wren', 'Did not!'],
            ['papa', 'You all did wonderfully.'],
            ['wren', 'Papa... what is out there?'],
            ['wren', 'Beyond the nest?']
        ],
        'wren_edge': [
            ['papa', 'Would you like to see?'],
            ['papa', 'Hop to the right edge. Carefully now.'],
            ['mama', 'Stay in the nest! Just look.']
        ],
        'wren_someday': [
            ['narrator', 'You look out at the world.'],
            ['narrator', 'It stretches endlessly.'],
            ['narrator', 'Trees. Mountains. Rivers. Sky.'],
            ['narrator', 'So much sky.'],
            ['wren', 'It is... so big.'],
            ['wren', 'Will we really fly out there?'],
            ['mama', 'Someday. When you are ready.'],
            ['wren', 'What if we are never ready?'],
            ['mama', 'You will be. I promise.']
        ],
        'bramble_tomorrow': [
            ['bramble', "I'm ready NOW!"],
            ['bramble', 'Tomorrow! Tomorrow I will fly!'],
            ['papa', 'Bramble, no. You must wait.'],
            ['bramble', 'But—'],
            ['mama', 'Promise me. Promise you will wait.'],
            ['narrator', 'Bramble looks at the endless sky.'],
            ['bramble', '...Fine. I promise.'],
            ['narrator', 'But something in his eyes says otherwise.']
        ],
        'shadow_passes': [
            ['narrator', 'Suddenly—'],
            ['narrator', 'The light changes.'],
            ['narrator', 'A darkness sweeps across the nest.'],
            ['wren', 'W-what was that?!']
        ],
        'papa_shield': [
            ['papa', 'DOWN! Everyone down NOW!'],
            ['narrator', 'Papa spreads his wings over you.'],
            ['narrator', 'You peek through his feathers.'],
            ['narrator', 'Above, circling...'],
            ['narrator', 'A great hawk.'],
            ['narrator', 'Its eyes scan the forest below.'],
            ['narrator', 'Your heart pounds.']
        ],
        'shadow_gone': [
            ['narrator', 'The shadow passes.'],
            ['narrator', 'The hawk flies on.'],
            ['papa', '...Gone. For now.'],
            ['bramble', "What... what was that?"],
            ['mama', 'Nothing. Just a bird passing by.'],
            ['wren', "That didn't look like just a bird..."],
            ['papa', "Don't worry. I will protect you. Always."]
        ],
        'parents_look': [
            ['narrator', 'Your parents exchange a look.'],
            ['narrator', 'Fear? Worry? You cannot tell.'],
            ['mama', 'It is nothing, little ones.'],
            ['mama', 'Nothing at all.'],
            ['narrator', 'But you notice Mama trembling slightly.']
        ],
        'asher_arrives': [
            ['narrator', 'As dusk falls, a visitor arrives.'],
            ['narrator', 'An old crow, feathers weathered by time.'],
            ['narrator', 'He lands on a branch nearby.'],
            ['papa', 'Asher.'],
            ['asher', 'Robin.'],
            ['narrator', 'The crow nods slowly.'],
            ['asher', 'It has been long.']
        ],
        'papa_defensive': [
            ['papa', 'What brings you here?'],
            ['asher', 'I bring a warning.'],
            ['asher', 'One you will not want to hear.'],
            ['mama', 'Speak plainly, old crow.']
        ],
        'asher_speaks': [
            ['asher', 'I have watched the skies for sixty seasons.'],
            ['asher', 'I have seen many hawks come and go.'],
            ['asher', 'But this one...'],
            ['asher', 'This one is different.']
        ],
        'asher_cryptic': [
            ['asher', 'Talon has returned.'],
            ['narrator', 'The name hits like cold wind.'],
            ['mama', 'No... he left years ago...'],
            ['asher', 'He is back. And he is hunting.'],
            ['asher', 'Your nest is not safe.'],
            ['papa', 'We can protect our children!'],
            ['asher', 'Can you?'],
            ['narrator', 'Silence. Heavy. Suffocating.'],
            ['asher', 'Teach them to fly. Fast.'],
            ['asher', 'It is their only chance.'],
            ['narrator', 'The old crow spreads his wings.'],
            ['asher', 'I have delivered my warning. Heed it.'],
            ['narrator', 'And with that, he is gone.']
        ],
        'mama_dismiss': [
            ['bramble', "Who's Talon?"],
            ['mama', 'No one important.'],
            ['wren', "Mama, you're shaking..."],
            ['mama', 'I said it is NOTHING!'],
            ['narrator', '...'],
            ['mama', "I... I'm sorry. I did not mean to yell."],
            ['mama', 'Come. Let us rest.'],
            ['narrator', 'But no one feels like resting anymore.']
        ],
        'night2_falls': [
            ['narrator', 'Night falls on the second day.'],
            ['narrator', 'The stars return, but they seem dimmer.'],
            ['narrator', 'The wind feels colder.'],
            ['narrator', 'Something has changed.']
        ],
        'papa_awake': [
            ['narrator', 'Papa stands guard all night.'],
            ['narrator', 'His eyes never leave the sky.'],
            ['narrator', 'You pretend to sleep.'],
            ['narrator', 'But you heard everything.'],
            ['narrator', 'Talon.'],
            ['narrator', 'The name echoes in your mind.'],
            ['narrator', 'You must learn to fly.'],
            ['narrator', 'Soon.'],
            ['narrator', 'Before it is too late.']
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
            ['delay', 500],
            ['talk', 'mama_intro'],
            ['wait', 'move'],
            ['talk', 'mama_good'],
            ['delay', 800],
            ['spawn', 'wren', 'sleep'],
            ['spawn', 'bramble', 'sleep'],
            ['talk', 'mama_siblings'],
            ['talk', 'mama_rest'],
            ['delay', 1500],
            ['goto', 'day1_feeding']
        ],
        'day1_feeding': [
            ['time', 'day'],
            ['delay', 800],
            ['spawn', 'papa'],
            ['talk', 'papa_arrives'],
            ['delay', 500],
            ['food'],
            ['talk', 'papa_food'],
            ['wait', 'eat'],
            ['talk', 'papa_good'],
            ['delay', 500],
            ['talk', 'papa_warning'],
            ['delay', 1000],
            ['goto', 'day1_siblings']
        ],
        'day1_siblings': [
            ['time', 'day'],
            ['state', 'wren', 'idle'],
            ['state', 'bramble', 'idle'],
            ['delay', 500],
            ['talk', 'siblings_wake'],
            ['talk', 'wren_intro'],
            ['delay', 300],
            ['talk', 'bramble_intro'],
            ['talk', 'bramble_challenge'],
            ['game', 'race'],
            ['delay', 800],
            ['goto', 'day1_night']
        ],
        'day1_night': [
            ['time', 'dusk'],
            ['delay', 1500],
            ['time', 'night'],
            ['talk', 'night_falls'],
            ['state', 'wren', 'sleep'],
            ['state', 'bramble', 'sleep'],
            ['delay', 800],
            ['talk', 'mama_lullaby'],
            ['delay', 1000],
            ['talk', 'papa_watches'],
            ['delay', 1500],
            ['end', 1]
        ],
        'day2_morning': [
            ['time', 'dawn'],
            ['state', 'all', 'idle'],
            ['delay', 500],
            ['talk', 'day2_wake'],
            ['delay', 500],
            ['talk', 'mama_stretch'],
            ['game', 'stretch'],
            ['talk', 'stretch_done'],
            ['delay', 500],
            ['goto', 'day2_competition']
        ],
        'day2_competition': [
            ['time', 'day'],
            ['talk', 'papa_food_2'],
            ['game', 'bugs'],
            ['delay', 500],
            ['talk', 'feeding_done'],
            ['goto', 'day2_edge']
        ],
        'day2_edge': [
            ['talk', 'wren_edge'],
            ['wait', 'goRight'],
            ['delay', 500],
            ['talk', 'wren_someday'],
            ['delay', 500],
            ['talk', 'bramble_tomorrow'],
            ['delay', 1000],
            ['goto', 'day2_shadow']
        ],
        'day2_shadow': [
            ['delay', 800],
            ['shadow'],
            ['talk', 'shadow_passes'],
            ['talk', 'papa_shield'],
            ['delay', 2000],
            ['talk', 'shadow_gone'],
            ['delay', 500],
            ['talk', 'parents_look'],
            ['delay', 1000],
            ['goto', 'day2_asher']
        ],
        'day2_asher': [
            ['time', 'dusk'],
            ['delay', 1000],
            ['spawn', 'asher'],
            ['talk', 'asher_arrives'],
            ['talk', 'papa_defensive'],
            ['talk', 'asher_speaks'],
            ['talk', 'asher_cryptic'],
            ['remove', 'asher'],
            ['delay', 500],
            ['talk', 'mama_dismiss'],
            ['delay', 1000],
            ['goto', 'day2_night']
        ],
        'day2_night': [
            ['time', 'night'],
            ['state', 'all', 'sleep'],
            ['talk', 'night2_falls'],
            ['delay', 1500],
            ['talk', 'papa_awake'],
            ['delay', 2000],
            ['end', 2]
        ]
    };

    // ============ PLAYER ============
    const player = {
        x: 200, y: NEST_Y - 12,
        vx: 0, vy: 0,
        dir: 1, enabled: false, moved: false,
        stretching: false, stretchPower: 0,

        update() {
            if (!this.enabled) return;
            if (dlg.active) return; // Don't move during dialogue

            if (!this.stretching) {
                if (keys.left) { this.vx = -1.5; this.dir = -1; this.moved = true; }
                else if (keys.right) { this.vx = 1.5; this.dir = 1; this.moved = true; }
                else this.vx *= 0.8;

                if (keys.spaceJustPressed && this.y >= NEST_Y - 13) {
                    this.vy = -3.5;
                    this.moved = true;
                    addParticle(this.x, this.y + 4, 'feather');
                }
            }

            this.stretching = keys.space && this.y >= NEST_Y - 13 && scene.waitFor === 'stretch';
            if (this.stretching) {
                this.stretchPower = Math.min(this.stretchPower + 1, 100);
                if (Math.random() < 0.1) addParticle(this.x + (Math.random() - 0.5) * 10, this.y - 5, 'sparkle');
            }

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
            const wingY = this.stretching ? -8 - Math.sin(Date.now() * 0.02) * 2 : -2;
            const wingSpread = this.stretching ? 4 : 0;

            // Shadow
            px.fillStyle = '#00000033';
            px.fillRect(x - 5, NEST_Y - 5, 10, 3);

            // Body
            px.fillStyle = '#8888aa';
            px.fillRect(x - 5, y - 4, 10, 8);

            // Belly
            px.fillStyle = '#ccbbaa';
            px.fillRect(x - 3, y, 6, 4);

            // Wings
            px.fillStyle = '#666688';
            px.fillRect(x - 7 - wingSpread, y + wingY, 4 + wingSpread, 3);
            px.fillRect(x + 3, y + wingY, 4 + wingSpread, 3);

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

            // Stretch meter
            if (this.stretching) {
                px.fillStyle = '#333';
                px.fillRect(x - 15, y - 20, 30, 4);
                px.fillStyle = '#4CAF50';
                px.fillRect(x - 14, y - 19, (this.stretchPower / 100) * 28, 2);
            }
        }
    };

    // ============ NPCS ============
    const npcs = {};
    const NPC_DEFS = {
        mama: { x: 170, y: NEST_Y - 14, color: '#885533', belly: '#ddaa77', dir: 1, type: 'adult' },
        papa: { x: 230, y: NEST_Y - 14, color: '#664422', belly: '#cc9966', dir: -1, type: 'adult' },
        wren: { x: 180, y: NEST_Y - 10, color: '#aa8899', belly: '#ddcccc', dir: 1, type: 'chick' },
        bramble: { x: 220, y: NEST_Y - 10, color: '#887766', belly: '#bbaa99', dir: -1, type: 'chick' },
        asher: { x: 320, y: NEST_Y - 35, color: '#222222', dir: -1, type: 'crow' }
    };

    function spawnNPC(id, state) {
        npcs[id] = { ...NPC_DEFS[id], state: state || 'idle', phase: Math.random() * 6, bobTimer: 0 };
    }
    function setNPCState(id, state) {
        if (id === 'all') Object.values(npcs).forEach(n => n.state = state);
        else if (npcs[id]) npcs[id].state = state;
    }
    function removeNPC(id) { delete npcs[id]; }

    function drawNPCs() {
        Object.entries(npcs).forEach(([id, n]) => {
            n.bobTimer = (n.bobTimer || 0) + 0.1;
            const bob = n.state === 'idle' ? Math.sin(n.bobTimer) * 1 : 0;
            const x = Math.floor(n.x);
            const y = Math.floor(n.y + bob);
            n.phase = (n.phase || 0) + 0.1;

            if (n.state === 'sleep') {
                px.fillStyle = n.color;
                px.fillRect(x - 5, y + 2, 10, 6);
                // Zzz
                px.fillStyle = '#ffffff88';
                const zzY = y - 4 + Math.sin(n.phase) * 2;
                px.fillRect(x + 8, zzY, 2, 2);
                px.fillRect(x + 11, zzY - 3, 3, 3);
                return;
            }

            if (n.state === 'racing') {
                n.x = Math.min(n.x + 1.2 + Math.random() * 0.5, 255);
            }

            if (n.type === 'adult') {
                // Shadow
                px.fillStyle = '#00000022';
                px.fillRect(x - 7, NEST_Y - 3, 14, 3);
                // Body
                px.fillStyle = n.color;
                px.fillRect(x - 8, y - 5, 16, 12);
                px.fillStyle = n.belly;
                px.fillRect(x - 4, y + 1, 10, 5);
                px.fillStyle = n.color;
                px.fillRect(x + 6 * n.dir, y - 10, 8, 8);
                // Wing detail
                px.fillStyle = n.color === '#885533' ? '#774422' : '#553311';
                px.fillRect(x - 7, y - 2, 3, 6);
                px.fillRect(x + 4, y - 2, 3, 6);
                // Eye
                px.fillStyle = '#fff';
                px.fillRect(x + 9 * n.dir, y - 9, 3, 3);
                px.fillStyle = '#000';
                px.fillRect(x + 10 * n.dir, y - 8, 1, 1);
                // Beak
                px.fillStyle = '#ff8800';
                px.fillRect(x + 12 * n.dir, y - 7, 4, 2);
            } else if (n.type === 'chick') {
                // Shadow
                px.fillStyle = '#00000022';
                px.fillRect(x - 4, NEST_Y - 3, 8, 2);
                // Body
                px.fillStyle = n.color;
                px.fillRect(x - 4, y - 3, 8, 7);
                px.fillStyle = n.belly;
                px.fillRect(x - 2, y, 5, 3);
                px.fillStyle = n.color;
                px.fillRect(x + 2 * n.dir, y - 7, 5, 5);
                // Eye
                px.fillStyle = '#fff';
                px.fillRect(x + 4 * n.dir, y - 6, 2, 2);
                px.fillStyle = '#000';
                px.fillRect(x + 4 * n.dir + (n.dir > 0 ? 1 : 0), y - 6, 1, 1);
                // Beak
                px.fillStyle = '#ffcc00';
                px.fillRect(x + 6 * n.dir, y - 5, 3, 2);
            } else if (n.type === 'crow') {
                // Big old crow
                px.fillStyle = '#0a0a0a';
                px.fillRect(x - 12, y - 6, 24, 14);
                px.fillRect(x + 8 * n.dir, y - 12, 12, 10);
                // Weathered feathers
                px.fillStyle = '#1a1a1a';
                px.fillRect(x - 10, y - 3, 4, 8);
                px.fillRect(x + 6, y - 3, 4, 8);
                // Eye - wise, old
                px.fillStyle = '#666';
                px.fillRect(x + 12 * n.dir, y - 10, 3, 3);
                px.fillStyle = '#333';
                px.fillRect(x + 13 * n.dir, y - 9, 1, 1);
                // Beak
                px.fillStyle = '#222';
                px.fillRect(x + 18 * n.dir, y - 8, 6, 3);
            }
        });
    }

    // ============ DIALOGUE (Enter/Click to advance) ============
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

    function advanceDialogue() {
        if (!dlg.active) return;

        // If still typing, complete the line
        if (dlg.charIdx < dlg.full.length) {
            dlg.text = dlg.full;
            dlg.charIdx = dlg.full.length;
            document.getElementById('dialogue-text').textContent = dlg.text;
            dlg.waiting = true;
            document.getElementById('dialogue-continue').style.visibility = 'visible';
        }
        // If waiting, go to next line
        else if (dlg.waiting) {
            dlg.idx++;
            showCurrentLine();
        }
    }

    function updateDialogue(dt) {
        if (!dlg.active) return;

        dlg.timer += dt;

        // Typing effect
        if (dlg.charIdx < dlg.full.length) {
            if (dlg.timer > 35) {
                dlg.text += dlg.full[dlg.charIdx];
                dlg.charIdx++;
                dlg.timer = 0;
                document.getElementById('dialogue-text').textContent = dlg.text;
            }
        } else if (!dlg.waiting) {
            dlg.waiting = true;
            document.getElementById('dialogue-continue').style.visibility = 'visible';
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
    let scene = { id: null, step: 0, delay: 0, waitFor: null };
    let food = null;
    let bugs = [];
    let shadowX = -100;
    let shadowOn = false;
    let raceResult = null;

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
                food = { x: 200, y: NEST_Y - 8, bobTimer: 0 };
                scene.step++;
                nextStep();
                break;
            case 'game':
                startMini(s[1]);
                break;
            case 'shadow':
                shadowOn = true;
                shadowX = -80;
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
            move: '← → ARROW KEYS to hop around!',
            eat: 'Hop to food + SPACE to eat!',
            goRight: 'Hop to the RIGHT edge →',
            race: 'RACE! Mash → to beat Bramble!',
            stretch: 'HOLD SPACE to stretch wings!',
            bugs: 'Catch bugs! Move + SPACE!'
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
            npcs.bramble.x = 185;
            player.x = 175;
            setNPCState('bramble', 'racing');
            scene.waitFor = 'race';
            raceResult = null;
            showHint('RACE! Mash → to beat Bramble!');
        } else if (g === 'stretch') {
            player.stretchPower = 0;
            scene.waitFor = 'stretch';
            showHint('HOLD SPACE to stretch wings!');
        } else if (g === 'bugs') {
            bugs = [];
            for (let i = 0; i < 6; i++) {
                bugs.push({
                    x: 150 + Math.random() * 100,
                    y: NEST_Y - 8 - Math.random() * 8,
                    got: false,
                    vx: (Math.random() - 0.5) * 0.8,
                    type: Math.random() < 0.3 ? 'big' : 'small'
                });
            }
            scene.waitFor = 'bugs';
            showHint('Catch bugs! Move + SPACE!');
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
            if (scene.waitFor === 'eat' && food && keys.spaceJustPressed && Math.abs(player.x - food.x) < 25) {
                for (let i = 0; i < 5; i++) addParticle(food.x, food.y, 'heart');
                food = null;
                done = true;
            }
            if (scene.waitFor === 'goRight' && player.x > 250) {
                done = true;
            }
            if (scene.waitFor === 'race') {
                // Check race end
                if (player.x >= 250 || (npcs.bramble && npcs.bramble.x >= 255)) {
                    const playerWon = player.x >= npcs.bramble.x;
                    setNPCState('bramble', 'idle');
                    npcs.bramble.x = 220;
                    player.x = 190;
                    raceResult = playerWon;
                    hideHint();
                    scene.waitFor = null;
                    scene.step++;
                    // Show appropriate dialogue
                    startDialogue(playerWon ? 'race_win' : 'race_lose', function() {
                        nextStep();
                    });
                    return;
                }
            }
            if (scene.waitFor === 'stretch') {
                if (player.stretchPower >= 100) {
                    game.wingStrength = Math.min(game.wingStrength + 15, 100);
                    for (let i = 0; i < 10; i++) addParticle(player.x, player.y - 5, 'sparkle');
                    done = true;
                }
            }
            if (scene.waitFor === 'bugs') {
                let left = 0;
                bugs.forEach(b => {
                    if (!b.got) {
                        // Bugs move around
                        b.x += b.vx;
                        if (b.x < 150 || b.x > 250) b.vx *= -1;
                        b.y += Math.sin(Date.now() * 0.01 + b.x) * 0.3;
                        if (b.y < NEST_Y - 20) b.y = NEST_Y - 20;
                        if (b.y > NEST_Y - 5) b.y = NEST_Y - 5;

                        left++;
                        if (keys.spaceJustPressed && Math.abs(player.x - b.x) < 18 && Math.abs(player.y - b.y) < 15) {
                            b.got = true;
                            for (let i = 0; i < 3; i++) addParticle(b.x, b.y, 'sparkle');
                            game.hunger = Math.min(game.hunger + 10, 100);
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
            shadowX += 2;
            if (shadowX > WIDTH + 100) shadowOn = false;
        }

        // Update food bob
        if (food) {
            food.bobTimer = (food.bobTimer || 0) + 0.1;
        }
    }

    function endDay(d) {
        const msg = d === 1
            ? '<div class="end-day">Day 1 Complete</div><br>Pip grows stronger.<br><br>But something watches from above...'
            : '<div class="end-day">Day 2 Complete</div><br>Talon has returned.<br>The clock is ticking.<br><br><i>To be continued...</i>';
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

    let ambientTimer = 0;

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

        // Stars at night
        if (game.time === 'night' || game.time === 'dusk') {
            const starAlpha = game.time === 'night' ? 1 : 0.3;
            px.fillStyle = `rgba(255,255,255,${starAlpha})`;
            for (let i = 0; i < 30; i++) {
                const twinkle = Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5;
                if (twinkle > 0.3) {
                    px.fillRect((i * 47 + 13) % WIDTH, (i * 31 + 7) % 100, 1, 1);
                }
            }
        }

        // Sun/Moon
        if (game.time === 'day') {
            px.fillStyle = '#ffee55';
            px.fillRect(320, 25, 24, 24);
            px.fillStyle = '#ffff88';
            px.fillRect(322, 27, 20, 20);
        } else if (game.time === 'dawn') {
            px.fillStyle = '#ffaa44';
            px.fillRect(50, 80, 20, 20);
        } else if (game.time === 'dusk') {
            px.fillStyle = '#ff6644';
            px.fillRect(340, 70, 18, 18);
        } else if (game.time === 'night') {
            px.fillStyle = '#ddeeff';
            px.fillRect(320, 30, 18, 18);
            px.fillStyle = '#080810';
            px.fillRect(325, 28, 12, 12);
        }

        // Clouds (daytime)
        if (game.time === 'day' || game.time === 'dawn') {
            px.fillStyle = 'rgba(255,255,255,0.6)';
            const cloudX = (Date.now() * 0.01) % (WIDTH + 100) - 50;
            px.fillRect(cloudX, 50, 30, 10);
            px.fillRect(cloudX + 5, 45, 20, 8);
            px.fillRect(cloudX + 100, 70, 25, 8);
        }

        // Distant mountains
        px.fillStyle = game.time === 'night' ? '#151525' : '#667788';
        px.beginPath();
        px.moveTo(0, 240);
        for (let x = 0; x <= WIDTH; x += 20) {
            px.lineTo(x, 190 + Math.sin(x * 0.03) * 25 + Math.sin(x * 0.07) * 10);
        }
        px.lineTo(WIDTH, HEIGHT);
        px.lineTo(0, HEIGHT);
        px.fill();

        // Closer hills
        px.fillStyle = game.time === 'night' ? '#101820' : '#556655';
        px.beginPath();
        px.moveTo(0, 250);
        for (let x = 0; x <= WIDTH; x += 15) {
            px.lineTo(x, 220 + Math.sin(x * 0.05 + 1) * 15);
        }
        px.lineTo(WIDTH, HEIGHT);
        px.lineTo(0, HEIGHT);
        px.fill();

        // Forest
        px.fillStyle = game.time === 'night' ? '#0a150a' : '#334433';
        for (let x = 0; x < WIDTH; x += 12) {
            const h = 18 + Math.sin(x * 0.15) * 8 + Math.sin(x * 0.3) * 4;
            px.fillRect(x, 235 - h, 10, h + 15);
        }

        // Tree trunk
        px.fillStyle = '#3a2515';
        px.fillRect(35, 90, 30, 170);
        // Bark texture
        px.fillStyle = '#2a1a0a';
        px.fillRect(40, 100, 3, 20);
        px.fillRect(50, 130, 4, 15);
        px.fillRect(38, 170, 3, 25);

        // Branch
        px.fillStyle = '#4a3520';
        px.fillRect(55, 192, 320, 14);
        px.fillStyle = '#3a2510';
        px.fillRect(55, 200, 320, 6);

        // Leaves on branch
        px.fillStyle = game.time === 'night' ? '#1a2a1a' : '#4a6a3a';
        px.fillRect(50, 185, 15, 10);
        px.fillRect(280, 183, 20, 12);
        px.fillRect(350, 186, 18, 10);

        // Nest - more detailed
        px.fillStyle = '#5a4030';
        px.fillRect(142, NEST_Y + 2, 116, 28);
        px.fillStyle = '#6b5040';
        px.fillRect(147, NEST_Y - 3, 106, 18);
        px.fillStyle = '#7a6550';
        px.fillRect(152, NEST_Y - 7, 96, 12);
        // Nest texture
        px.fillStyle = '#4a3020';
        for (let i = 0; i < 8; i++) {
            px.fillRect(150 + i * 12, NEST_Y - 5 + (i % 3) * 2, 8, 2);
        }

        // Ambient leaves falling
        ambientTimer++;
        if (game.time === 'day' || game.time === 'dawn') {
            if (ambientTimer % 120 === 0) {
                addParticle(Math.random() * WIDTH, -10, 'leaf');
            }
        }

        // Food
        if (food) {
            const foodBob = Math.sin(food.bobTimer) * 2;
            px.fillStyle = '#ff6666';
            px.fillRect(food.x - 5, food.y + foodBob, 10, 5);
            px.fillStyle = '#ff4444';
            px.fillRect(food.x - 3, food.y + 2 + foodBob, 6, 3);
            // Glow
            px.fillStyle = '#ff666633';
            px.fillRect(food.x - 8, food.y - 3 + foodBob, 16, 11);
        }

        // Bugs
        bugs.forEach(b => {
            if (!b.got) {
                const size = b.type === 'big' ? 6 : 4;
                px.fillStyle = b.type === 'big' ? '#66dd66' : '#44bb44';
                px.fillRect(b.x - size/2, b.y - size/2, size, size);
                // Wings
                px.fillStyle = '#88ff8866';
                px.fillRect(b.x - size/2 - 2, b.y - 2, 2, 3);
                px.fillRect(b.x + size/2, b.y - 2, 2, 3);
            }
        });

        // Particles
        updateParticles();
        drawParticles();

        // NPCs
        drawNPCs();

        // Player
        player.draw();

        // Shadow (hawk)
        if (shadowOn) {
            px.fillStyle = '#00000066';
            // More menacing hawk shape
            px.beginPath();
            px.moveTo(shadowX, 140);
            px.lineTo(shadowX - 30, 160);
            px.lineTo(shadowX - 45, 180);
            px.lineTo(shadowX - 20, 165);
            px.lineTo(shadowX, 170);
            px.lineTo(shadowX + 20, 165);
            px.lineTo(shadowX + 45, 180);
            px.lineTo(shadowX + 30, 160);
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

        keys.spaceJustPressed = false;
        keys.enterJustPressed = false;
        requestAnimationFrame(loop);
    }

    // ============ INPUT ============
    document.addEventListener('keydown', function(e) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
        if (e.code === 'Space') {
            if (!keys.space) keys.spaceJustPressed = true;
            keys.space = true;
            e.preventDefault();
        }
        if (e.code === 'Enter') {
            if (!keys.enter) {
                keys.enterJustPressed = true;
                advanceDialogue();
            }
            keys.enter = true;
            e.preventDefault();
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
        if (e.code === 'Space') keys.space = false;
        if (e.code === 'Enter') keys.enter = false;
    });

    // Click to advance dialogue
    document.getElementById('dialogue-container').addEventListener('click', function() {
        advanceDialogue();
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
        }, 2500);
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('end-chapter-screen').classList.add('hidden');
        if (game.day === 1) {
            game.day = 2;
            document.getElementById('chapter-day').textContent = 'DAY 2';
            document.getElementById('chapter-title').textContent = 'GROWING WINGS';
            document.getElementById('chapter-screen').classList.remove('hidden');
            setTimeout(function() {
                document.getElementById('chapter-screen').classList.add('hidden');
                runScene('day2_morning');
            }, 2500);
        } else {
            // After Day 2, show "To be continued" and return to title
            document.getElementById('title-screen').classList.remove('hidden');
            game.playing = false;
            // Reset for replay
            game.day = 1;
            game.wingStrength = 10;
            player.x = 200;
            player.y = NEST_Y - 12;
            player.enabled = false;
            player.moved = false;
            Object.keys(npcs).forEach(k => delete npcs[k]);
        }
    });

    requestAnimationFrame(loop);
})();
