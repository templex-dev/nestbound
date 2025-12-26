// Nestbound - A 2D Bird Flying Survival Game
// ===========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game constants
const GRAVITY = 0.35;
const FLAP_POWER = -8;
const MAX_VELOCITY = 12;
const HORIZONTAL_SPEED = 4;
const DIVE_SPEED = 6;
const AIR_RESISTANCE = 0.99;
const GROUND_LEVEL = canvas.height - 60;

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let distance = 0;
let foodCollected = 0;
let deathReason = '';

// Growth stages
const GROWTH_STAGES = {
    hatchling: { size: 0.6, maxStamina: 60, flapPower: -6, speed: 3, foodNeeded: 0 },
    fledgling: { size: 0.8, maxStamina: 80, flapPower: -7, speed: 4, foodNeeded: 5 },
    juvenile: { size: 1.0, maxStamina: 100, flapPower: -8, speed: 5, foodNeeded: 15 },
    adult: { size: 1.2, maxStamina: 120, flapPower: -9, speed: 6, foodNeeded: 30 }
};

// Tutorial messages
const TUTORIALS = [
    { trigger: 'start', message: 'Press SPACE or W to flap your wings!', shown: false },
    { trigger: 'firstFlap', message: 'Great! Keep flapping to stay airborne!', shown: false },
    { trigger: 'food', message: 'Collect seeds and worms to grow stronger!', shown: false },
    { trigger: 'stamina', message: 'Watch your stamina - rest on branches to recover!', shown: false },
    { trigger: 'predator', message: 'Watch out for predators! Avoid hawks and cats!', shown: false }
];

// Bird (Player)
const bird = {
    x: 150,
    y: 300,
    vx: 0,
    vy: 0,
    width: 32,
    height: 24,
    rotation: 0,
    wingPhase: 0,
    isFlapping: false,
    stamina: 100,
    maxStamina: 100,
    stage: 'hatchling',
    scale: 0.6,
    flapCooldown: 0,
    onBranch: false,
    invincible: 0,

    reset() {
        this.x = 150;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.wingPhase = 0;
        this.stamina = GROWTH_STAGES.hatchling.maxStamina;
        this.maxStamina = GROWTH_STAGES.hatchling.maxStamina;
        this.stage = 'hatchling';
        this.scale = GROWTH_STAGES.hatchling.size;
        this.flapCooldown = 0;
        this.onBranch = false;
        this.invincible = 0;
    },

    flap() {
        if (this.stamina > 5 && this.flapCooldown <= 0) {
            const stageData = GROWTH_STAGES[this.stage];
            this.vy = stageData.flapPower;
            this.stamina -= 5;
            this.isFlapping = true;
            this.wingPhase = 0;
            this.flapCooldown = 8;
            this.onBranch = false;

            // Show tutorial after first flap
            showTutorial('firstFlap');
        }
    },

    update() {
        // Apply gravity
        if (!this.onBranch) {
            this.vy += GRAVITY;
        }

        // Limit velocity
        this.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, this.vy));
        this.vx *= AIR_RESISTANCE;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary checks
        if (this.y < 20) {
            this.y = 20;
            this.vy = 0;
        }

        if (this.y > GROUND_LEVEL - this.height * this.scale) {
            this.y = GROUND_LEVEL - this.height * this.scale;
            this.vy = 0;
            this.onBranch = true; // Resting on ground
        }

        if (this.x < 50) this.x = 50;
        if (this.x > canvas.width - 100) this.x = canvas.width - 100;

        // Update rotation based on velocity
        this.rotation = Math.atan2(this.vy, 10) * 0.5;

        // Wing animation
        if (this.isFlapping) {
            this.wingPhase += 0.5;
            if (this.wingPhase > Math.PI) {
                this.isFlapping = false;
                this.wingPhase = 0;
            }
        }

        // Flap cooldown
        if (this.flapCooldown > 0) this.flapCooldown--;

        // Stamina recovery when resting
        if (this.onBranch && this.stamina < this.maxStamina) {
            this.stamina += 0.5;
        }

        // Invincibility timer
        if (this.invincible > 0) this.invincible--;

        // Update growth
        this.updateGrowth();
    },

    updateGrowth() {
        let newStage = 'hatchling';
        if (foodCollected >= GROWTH_STAGES.adult.foodNeeded) {
            newStage = 'adult';
        } else if (foodCollected >= GROWTH_STAGES.juvenile.foodNeeded) {
            newStage = 'juvenile';
        } else if (foodCollected >= GROWTH_STAGES.fledgling.foodNeeded) {
            newStage = 'fledgling';
        }

        if (newStage !== this.stage) {
            this.stage = newStage;
            const stageData = GROWTH_STAGES[newStage];
            this.scale = stageData.size;
            this.maxStamina = stageData.maxStamina;
            this.stamina = this.maxStamina; // Full stamina on level up
        }
    },

    draw() {
        ctx.save();
        ctx.translate(this.x + (this.width * this.scale) / 2, this.y + (this.height * this.scale) / 2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        // Flash when invincible
        if (this.invincible > 0 && Math.floor(this.invincible / 4) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(2, 4, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wing
        const wingOffset = this.isFlapping ? Math.sin(this.wingPhase) * 8 : 0;
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(-2, -2 - wingOffset, 12, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(12, -4, 8, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(15, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(16, -6, 1, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(18, -3);
        ctx.lineTo(24, -2);
        ctx.lineTo(18, 1);
        ctx.closePath();
        ctx.fill();

        // Tail feathers
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(-26, -4);
        ctx.lineTo(-24, 0);
        ctx.lineTo(-26, 4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width * this.scale,
            height: this.height * this.scale
        };
    }
};

// World scrolling
let worldOffset = 0;
const SCROLL_SPEED = 2;

// Food items
const foods = [];
const FOOD_TYPES = {
    seed: { value: 1, color: '#DAA520', size: 6 },
    worm: { value: 2, color: '#FF69B4', size: 10 },
    berry: { value: 3, color: '#DC143C', size: 8 },
    insect: { value: 2, color: '#32CD32', size: 7 }
};

function spawnFood() {
    if (foods.length < 8 && Math.random() < 0.02) {
        const types = Object.keys(FOOD_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        foods.push({
            x: canvas.width + 50,
            y: 100 + Math.random() * (GROUND_LEVEL - 200),
            type: type,
            ...FOOD_TYPES[type],
            bobPhase: Math.random() * Math.PI * 2
        });
    }
}

function updateFoods() {
    for (let i = foods.length - 1; i >= 0; i--) {
        const food = foods[i];
        food.x -= SCROLL_SPEED;
        food.bobPhase += 0.1;

        // Remove off-screen food
        if (food.x < -20) {
            foods.splice(i, 1);
            continue;
        }

        // Check collision with bird
        const birdBounds = bird.getBounds();
        const dist = Math.hypot(
            food.x - (birdBounds.x + birdBounds.width / 2),
            food.y - (birdBounds.y + birdBounds.height / 2)
        );

        if (dist < 25) {
            foodCollected += food.value;
            score += food.value * 10;
            foods.splice(i, 1);
            showTutorial('food');
        }
    }
}

function drawFoods() {
    foods.forEach(food => {
        const bobY = Math.sin(food.bobPhase) * 3;
        ctx.fillStyle = food.color;

        if (food.type === 'worm') {
            // Draw worm
            ctx.beginPath();
            ctx.moveTo(food.x - 5, food.y + bobY);
            for (let i = 0; i < 4; i++) {
                ctx.quadraticCurveTo(
                    food.x - 3 + i * 3, food.y + bobY + (i % 2 ? 4 : -4),
                    food.x - 1 + i * 3, food.y + bobY
                );
            }
            ctx.lineWidth = 3;
            ctx.strokeStyle = food.color;
            ctx.stroke();
        } else if (food.type === 'insect') {
            // Draw insect
            ctx.beginPath();
            ctx.ellipse(food.x, food.y + bobY, 5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#228B22';
            ctx.fillRect(food.x - 6, food.y + bobY - 1, 2, 2);
            ctx.fillRect(food.x + 4, food.y + bobY - 1, 2, 2);
        } else {
            // Draw seed or berry
            ctx.beginPath();
            ctx.arc(food.x, food.y + bobY, food.size, 0, Math.PI * 2);
            ctx.fill();

            if (food.type === 'berry') {
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.arc(food.x - 2, food.y + bobY - 2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

// Obstacles (predators)
const obstacles = [];
const OBSTACLE_TYPES = {
    hawk: { width: 60, height: 30, speed: 3, damage: 50, color: '#4a4a4a' },
    cat: { width: 50, height: 40, speed: 0, damage: 100, color: '#666666', ground: true },
    storm: { width: 80, height: 200, speed: 1, damage: 20, color: 'rgba(100, 100, 150, 0.5)' }
};

function spawnObstacle() {
    if (obstacles.length < 3 && Math.random() < 0.008 && distance > 50) {
        const types = ['hawk', 'cat', 'storm'];
        const weights = [0.4, 0.35, 0.25];
        const rand = Math.random();
        let type = 'hawk';
        let cumWeight = 0;
        for (let i = 0; i < types.length; i++) {
            cumWeight += weights[i];
            if (rand < cumWeight) {
                type = types[i];
                break;
            }
        }

        const obstacleData = OBSTACLE_TYPES[type];
        let y = obstacleData.ground ? GROUND_LEVEL - obstacleData.height : 50 + Math.random() * 200;

        obstacles.push({
            x: canvas.width + 50,
            y: y,
            type: type,
            ...obstacleData,
            phase: 0
        });

        showTutorial('predator');
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= SCROLL_SPEED + obs.speed;
        obs.phase += 0.1;

        // Hawk movement pattern
        if (obs.type === 'hawk') {
            obs.y += Math.sin(obs.phase) * 0.5;
        }

        // Remove off-screen obstacles
        if (obs.x < -obs.width) {
            obstacles.splice(i, 1);
            score += 20; // Points for dodging
            continue;
        }

        // Check collision with bird
        if (bird.invincible <= 0) {
            const birdBounds = bird.getBounds();
            if (checkCollision(birdBounds, obs)) {
                bird.stamina -= obs.damage;
                bird.invincible = 60;
                bird.vy = -5;

                if (bird.stamina <= 0) {
                    if (obs.type === 'hawk') deathReason = 'Caught by a hawk!';
                    else if (obs.type === 'cat') deathReason = 'Pounced on by a cat!';
                    else deathReason = 'Lost in the storm!';
                    gameOver();
                }

                showTutorial('stamina');
            }
        }
    }
}

function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.save();

        if (obs.type === 'hawk') {
            // Draw hawk
            ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);

            // Body
            ctx.fillStyle = '#4a4a4a';
            ctx.beginPath();
            ctx.ellipse(0, 0, 25, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wings
            const wingFlap = Math.sin(obs.phase * 2) * 10;
            ctx.fillStyle = '#3a3a3a';
            ctx.beginPath();
            ctx.ellipse(-5, -8 - wingFlap, 20, 8, -0.2, 0, Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-5, 8 + wingFlap, 20, 8, 0.2, Math.PI, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.fillStyle = '#4a4a4a';
            ctx.beginPath();
            ctx.arc(20, 0, 10, 0, Math.PI * 2);
            ctx.fill();

            // Beak
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(28, 0);
            ctx.lineTo(35, 2);
            ctx.lineTo(28, 4);
            ctx.closePath();
            ctx.fill();

            // Eye
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(23, -2, 3, 0, Math.PI * 2);
            ctx.fill();

        } else if (obs.type === 'cat') {
            // Draw cat
            ctx.translate(obs.x, obs.y);

            // Body
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.ellipse(25, 25, 25, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.beginPath();
            ctx.arc(45, 15, 12, 0, Math.PI * 2);
            ctx.fill();

            // Ears
            ctx.beginPath();
            ctx.moveTo(38, 5);
            ctx.lineTo(42, -5);
            ctx.lineTo(46, 5);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(48, 5);
            ctx.lineTo(52, -5);
            ctx.lineTo(56, 5);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#7FFF00';
            ctx.beginPath();
            ctx.ellipse(42, 14, 3, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(50, 14, 3, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Pupils
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(42, 14, 1, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(50, 14, 1, 3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tail
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 20);
            ctx.quadraticCurveTo(-15, 10 + Math.sin(obs.phase) * 5, -20, 20);
            ctx.stroke();

        } else if (obs.type === 'storm') {
            // Draw storm cloud
            ctx.fillStyle = 'rgba(80, 80, 100, 0.7)';
            ctx.beginPath();
            ctx.arc(obs.x + 20, obs.y + 20, 25, 0, Math.PI * 2);
            ctx.arc(obs.x + 50, obs.y + 15, 30, 0, Math.PI * 2);
            ctx.arc(obs.x + 70, obs.y + 25, 20, 0, Math.PI * 2);
            ctx.fill();

            // Rain
            ctx.strokeStyle = 'rgba(150, 180, 255, 0.6)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 15; i++) {
                const rx = obs.x + 10 + Math.random() * 60;
                const ry = obs.y + 40 + ((obs.phase * 20 + i * 15) % 160);
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 3, ry + 10);
                ctx.stroke();
            }

            // Lightning flash occasionally
            if (Math.random() < 0.02) {
                ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            }
        }

        ctx.restore();
    });
}

// Branches (rest points)
const branches = [];

function spawnBranch() {
    if (branches.length < 4 && Math.random() < 0.01) {
        branches.push({
            x: canvas.width + 50,
            y: 200 + Math.random() * 250,
            width: 80 + Math.random() * 60,
            height: 12
        });
    }
}

function updateBranches() {
    for (let i = branches.length - 1; i >= 0; i--) {
        branches[i].x -= SCROLL_SPEED;
        if (branches[i].x < -100) {
            branches.splice(i, 1);
        }
    }

    // Check if bird can rest on branch
    const birdBounds = bird.getBounds();
    bird.onBranch = false;

    for (const branch of branches) {
        if (bird.vy >= 0 &&
            birdBounds.x + birdBounds.width > branch.x &&
            birdBounds.x < branch.x + branch.width &&
            birdBounds.y + birdBounds.height >= branch.y &&
            birdBounds.y + birdBounds.height <= branch.y + 20) {
            bird.y = branch.y - birdBounds.height;
            bird.vy = 0;
            bird.onBranch = true;
            break;
        }
    }
}

function drawBranches() {
    branches.forEach(branch => {
        // Branch
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(branch.x, branch.y, branch.width, branch.height);

        // Wood texture
        ctx.fillStyle = '#4E342E';
        for (let i = 0; i < branch.width; i += 15) {
            ctx.fillRect(branch.x + i, branch.y + 2, 2, branch.height - 4);
        }

        // Leaves
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 3; i++) {
            const lx = branch.x + branch.width - 20 + i * 10;
            const ly = branch.y - 5;
            ctx.beginPath();
            ctx.ellipse(lx, ly, 8, 5, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Background elements
const clouds = [];
const trees = [];

function initBackground() {
    // Generate initial clouds
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 30 + Math.random() * 100,
            size: 30 + Math.random() * 40,
            speed: 0.2 + Math.random() * 0.3
        });
    }

    // Generate initial trees
    for (let i = 0; i < 6; i++) {
        trees.push({
            x: i * 150 + Math.random() * 50,
            height: 100 + Math.random() * 80
        });
    }
}

function updateBackground() {
    // Update clouds
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -100) {
            cloud.x = canvas.width + 50;
            cloud.y = 30 + Math.random() * 100;
        }
    });

    // Update trees
    trees.forEach(tree => {
        tree.x -= SCROLL_SPEED * 0.5;
        if (tree.x < -50) {
            tree.x = canvas.width + 50;
            tree.height = 100 + Math.random() * 80;
        }
    });
}

function drawBackground() {
    // Sky gradient (changes slightly with distance)
    const timeOfDay = (distance % 1000) / 1000;
    let skyTop, skyBottom;

    if (timeOfDay < 0.5) {
        // Day
        skyTop = '#87CEEB';
        skyBottom = '#E0F6FF';
    } else {
        // Transition to evening
        const t = (timeOfDay - 0.5) * 2;
        skyTop = lerpColor('#87CEEB', '#FF6B6B', t * 0.5);
        skyBottom = lerpColor('#E0F6FF', '#FFD93D', t * 0.3);
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, skyTop);
    gradient.addColorStop(1, skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun/Moon
    const sunY = 60 + Math.sin(timeOfDay * Math.PI) * 20;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(650, sunY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.4, cloud.y - 5, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.7, cloud.y, cloud.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Distant mountains
    ctx.fillStyle = '#9CB4C5';
    ctx.beginPath();
    ctx.moveTo(0, GROUND_LEVEL);
    for (let i = 0; i <= canvas.width; i += 100) {
        ctx.lineTo(i, GROUND_LEVEL - 80 - Math.sin(i * 0.01 + worldOffset * 0.001) * 40);
    }
    ctx.lineTo(canvas.width, GROUND_LEVEL);
    ctx.closePath();
    ctx.fill();

    // Trees (background)
    trees.forEach(tree => {
        // Trunk
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(tree.x - 8, GROUND_LEVEL - tree.height, 16, tree.height);

        // Foliage
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.moveTo(tree.x, GROUND_LEVEL - tree.height - 60);
        ctx.lineTo(tree.x - 35, GROUND_LEVEL - tree.height + 20);
        ctx.lineTo(tree.x + 35, GROUND_LEVEL - tree.height + 20);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(tree.x, GROUND_LEVEL - tree.height - 30);
        ctx.lineTo(tree.x - 30, GROUND_LEVEL - tree.height + 40);
        ctx.lineTo(tree.x + 30, GROUND_LEVEL - tree.height + 40);
        ctx.closePath();
        ctx.fill();
    });

    // Ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, GROUND_LEVEL, canvas.width, canvas.height - GROUND_LEVEL);

    // Grass
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, GROUND_LEVEL - 10, canvas.width, 15);

    // Grass blades
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 8) {
        const offset = Math.sin(i * 0.1 + worldOffset * 0.02) * 3;
        ctx.beginPath();
        ctx.moveTo(i, GROUND_LEVEL);
        ctx.lineTo(i + offset, GROUND_LEVEL - 12 - Math.random() * 5);
        ctx.stroke();
    }
}

// Utility functions
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function lerpColor(color1, color2, t) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Tutorial system
let currentTutorial = null;
let tutorialTimer = 0;

function showTutorial(trigger) {
    const tutorial = TUTORIALS.find(t => t.trigger === trigger && !t.shown);
    if (tutorial) {
        tutorial.shown = true;
        currentTutorial = tutorial.message;
        tutorialTimer = 180; // 3 seconds

        const tutorialEl = document.getElementById('tutorial-overlay');
        const tutorialText = document.getElementById('tutorial-text');
        tutorialText.textContent = currentTutorial;
        tutorialEl.classList.remove('hidden');
    }
}

function updateTutorial() {
    if (tutorialTimer > 0) {
        tutorialTimer--;
        if (tutorialTimer <= 0) {
            document.getElementById('tutorial-overlay').classList.add('hidden');
            currentTutorial = null;
        }
    }
}

// UI Updates
function updateUI() {
    document.getElementById('food-count').textContent = `🌾 ${foodCollected}`;
    document.getElementById('distance').textContent = `📏 ${Math.floor(distance)}m`;
    document.getElementById('stamina-fill').style.width = `${(bird.stamina / bird.maxStamina) * 100}%`;

    // Update stamina bar color based on level
    const staminaFill = document.getElementById('stamina-fill');
    if (bird.stamina < 20) {
        staminaFill.style.background = 'linear-gradient(to right, #f44336, #ff5722)';
    } else if (bird.stamina < 50) {
        staminaFill.style.background = 'linear-gradient(to right, #ff9800, #ffc107)';
    } else {
        staminaFill.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)';
    }

    // Growth indicator
    const stageNames = {
        hatchling: '🥚 Hatchling',
        fledgling: '🐣 Fledgling',
        juvenile: '🐥 Juvenile',
        adult: '🐦 Adult'
    };
    const nextStage = {
        hatchling: GROWTH_STAGES.fledgling.foodNeeded,
        fledgling: GROWTH_STAGES.juvenile.foodNeeded,
        juvenile: GROWTH_STAGES.adult.foodNeeded,
        adult: null
    };

    let growthText = stageNames[bird.stage];
    if (nextStage[bird.stage] !== null) {
        growthText += ` (${foodCollected}/${nextStage[bird.stage]} to evolve)`;
    }
    document.getElementById('growth-indicator').textContent = growthText;
}

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    if (gameState === 'playing') {
        if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
            bird.flap();
            e.preventDefault();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Handle continuous key presses for movement
function handleInput() {
    if (gameState !== 'playing') return;

    const stageData = GROWTH_STAGES[bird.stage];

    if (keys['KeyA'] || keys['ArrowLeft']) {
        bird.vx = -stageData.speed;
    } else if (keys['KeyD'] || keys['ArrowRight']) {
        bird.vx = stageData.speed;
    }

    if (keys['KeyS'] || keys['ArrowDown']) {
        bird.vy += 0.5; // Dive
    }
}

// Game state functions
function startGame() {
    gameState = 'playing';
    score = 0;
    distance = 0;
    foodCollected = 0;
    worldOffset = 0;

    bird.reset();
    foods.length = 0;
    obstacles.length = 0;
    branches.length = 0;

    // Reset tutorials
    TUTORIALS.forEach(t => t.shown = false);

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    showTutorial('start');
}

function gameOver() {
    gameState = 'gameover';

    const finalScore = Math.floor(score + distance);
    document.getElementById('final-score').textContent = `Score: ${finalScore} | Distance: ${Math.floor(distance)}m | Food: ${foodCollected}`;
    document.getElementById('death-reason').textContent = deathReason || 'You ran out of energy!';
    document.getElementById('game-over-screen').classList.remove('hidden');
}

// Main game loop
function update() {
    if (gameState !== 'playing') return;

    handleInput();
    bird.update();

    worldOffset += SCROLL_SPEED;
    distance += SCROLL_SPEED * 0.1;

    updateBackground();
    spawnFood();
    updateFoods();
    spawnBranch();
    updateBranches();
    spawnObstacle();
    updateObstacles();
    updateTutorial();
    updateUI();

    // Check if bird ran out of stamina on ground
    if (bird.stamina <= 0 && bird.onBranch) {
        deathReason = 'Too exhausted to continue...';
        gameOver();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawBranches();
    drawFoods();
    drawObstacles();
    bird.draw();
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Event listeners for buttons
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// Initialize and start
initBackground();
gameLoop();
