// Player (Pip) - The baby bird you control
// =========================================

import { NEST_Y, NEST_LEFT, NEST_RIGHT, gameState } from './game.js';

export class Player {
    constructor() {
        this.x = 400;
        this.y = NEST_Y - 25;
        this.vx = 0;
        this.vy = 0;
        this.width = 24;
        this.height = 20;

        // State
        this.enabled = false;
        this.hasMoved = false;
        this.isHopping = false;
        this.hopPhase = 0;
        this.direction = 1; // 1 = right, -1 = left
        this.isStretching = false;
        this.stretchPhase = 0;
        this.isInteracting = false;
        this.canEat = false;

        // Animation
        this.animTimer = 0;
        this.blinkTimer = 0;
        this.isBlinking = false;
        this.breathePhase = 0;
        this.wingPhase = 0;

        // Physics
        this.hopPower = -4;
        this.moveSpeed = 2;
        this.gravity = 0.3;
        this.groundY = NEST_Y - 25;
    }

    update(deltaTime, keys, gameState) {
        if (!this.enabled) return;

        this.animTimer += deltaTime;
        this.breathePhase += deltaTime * 0.003;
        this.blinkTimer += deltaTime;

        // Random blinking
        if (this.blinkTimer > 3000 + Math.random() * 2000) {
            this.isBlinking = true;
            setTimeout(() => this.isBlinking = false, 150);
            this.blinkTimer = 0;
        }

        // Movement
        if (!this.isStretching) {
            if (keys.left) {
                this.vx = -this.moveSpeed;
                this.direction = -1;
                this.hasMoved = true;
            } else if (keys.right) {
                this.vx = this.moveSpeed;
                this.direction = 1;
                this.hasMoved = true;
            } else {
                this.vx *= 0.8;
            }

            // Hopping
            if ((keys.up || keys.spacePressed) && !this.isHopping && this.y >= this.groundY - 1) {
                this.vy = this.hopPower;
                this.isHopping = true;
                this.hasMoved = true;
            }
        }

        // Stretching wings
        if (keys.space && !this.isHopping) {
            this.isStretching = true;
            this.stretchPhase += deltaTime * 0.005;
            this.wingPhase = Math.sin(this.stretchPhase) * 0.5 + 0.5;
        } else {
            this.isStretching = false;
            this.wingPhase *= 0.9;
        }

        // Interaction
        this.isInteracting = keys.spacePressed;

        // Check eating
        if (this.canEat && this.isInteracting) {
            // Will be checked by scene manager
        }

        // Apply gravity
        this.vy += this.gravity;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Ground collision
        if (this.y > this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.isHopping = false;
        }

        // Nest boundaries
        if (this.x < NEST_LEFT + 30) this.x = NEST_LEFT + 30;
        if (this.x > NEST_RIGHT - 30) this.x = NEST_RIGHT - 30;

        // Update hop animation
        if (this.isHopping) {
            this.hopPhase += deltaTime * 0.02;
        } else {
            this.hopPhase = 0;
        }
    }

    render(ctx) {
        if (!this.enabled) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Flip based on direction
        ctx.scale(this.direction, 1);

        // Body bob from breathing
        const breatheOffset = Math.sin(this.breathePhase) * 1;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 12, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw baby bird (Pip)
        this.drawBabyBird(ctx, breatheOffset);

        ctx.restore();
    }

    drawBabyBird(ctx, breatheOffset) {
        // Pip is a baby robin - fluffy, big head, tiny wings

        // Body (fluffy oval)
        ctx.fillStyle = '#a0a0a0'; // Gray downy feathers
        ctx.beginPath();
        ctx.ellipse(0, breatheOffset, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fluffy texture
        ctx.fillStyle = '#b8b8b8';
        ctx.beginPath();
        ctx.ellipse(-3, breatheOffset - 2, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = '#d4c4b0';
        ctx.beginPath();
        ctx.ellipse(2, breatheOffset + 3, 7, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings (tiny, growing)
        const wingExtend = this.wingPhase * 15;
        ctx.fillStyle = '#888888';

        // Left wing (behind)
        ctx.save();
        ctx.translate(-5, breatheOffset - 2);
        ctx.rotate(-0.3 - this.wingPhase * 0.5);
        ctx.beginPath();
        ctx.ellipse(0, 0, 6 + wingExtend * 0.3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Right wing (in front when stretching)
        ctx.save();
        ctx.translate(5, breatheOffset - 2);
        ctx.rotate(0.3 + this.wingPhase * 0.5);
        ctx.beginPath();
        ctx.ellipse(0, 0, 6 + wingExtend * 0.3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Head (proportionally big for baby)
        ctx.fillStyle = '#a0a0a0';
        ctx.beginPath();
        ctx.arc(8, breatheOffset - 8, 9, 0, Math.PI * 2);
        ctx.fill();

        // Face patch
        ctx.fillStyle = '#b8b8b8';
        ctx.beginPath();
        ctx.arc(10, breatheOffset - 7, 5, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        if (!this.isBlinking) {
            // Eye white
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.ellipse(11, breatheOffset - 9, 4, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Pupil
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(12, breatheOffset - 9, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Eye shine
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(13, breatheOffset - 10, 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Closed eye
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(11, breatheOffset - 9, 3, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }

        // Beak (baby beak - wider, more open-looking)
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.moveTo(15, breatheOffset - 7);
        ctx.lineTo(22, breatheOffset - 5);
        ctx.lineTo(15, breatheOffset - 3);
        ctx.closePath();
        ctx.fill();

        // Beak line
        ctx.strokeStyle = '#cc9900';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(15, breatheOffset - 5);
        ctx.lineTo(20, breatheOffset - 5);
        ctx.stroke();

        // Tiny tail fluff
        ctx.fillStyle = '#888888';
        ctx.beginPath();
        ctx.ellipse(-10, breatheOffset + 2, 5, 3, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Feet (tiny)
        ctx.fillStyle = '#cc9900';
        ctx.fillRect(-4, 8, 2, 4);
        ctx.fillRect(2, 8, 2, 4);
    }
}
