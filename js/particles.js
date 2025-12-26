// Particle System - Visual effects
// ==================================

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(type, x, y, count = 1) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(type, x, y));
        }
    }

    createParticle(type, x, y) {
        const base = {
            x: x,
            y: y,
            life: 1,
            type: type
        };

        switch (type) {
            case 'feather':
                return {
                    ...base,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 2 - 1,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1,
                    size: 4 + Math.random() * 4,
                    decay: 0.008,
                    gravity: 0.02,
                    color: Math.random() > 0.5 ? '#a0a0a0' : '#d4c4b0'
                };

            case 'dust':
                return {
                    ...base,
                    vx: (Math.random() - 0.5) * 1,
                    vy: -Math.random() * 0.5,
                    size: 2 + Math.random() * 3,
                    decay: 0.02,
                    color: '#8b7355'
                };

            case 'sparkle':
                return {
                    ...base,
                    vx: (Math.random() - 0.5) * 3,
                    vy: -Math.random() * 3 - 1,
                    size: 3 + Math.random() * 3,
                    decay: 0.03,
                    color: '#ffd93d',
                    twinkle: Math.random() * Math.PI * 2
                };

            case 'leaf':
                return {
                    ...base,
                    vx: -1 - Math.random() * 2,
                    vy: Math.random() * 0.5,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.05,
                    size: 6 + Math.random() * 4,
                    decay: 0.003,
                    gravity: 0.01,
                    sway: Math.random() * Math.PI * 2,
                    color: Math.random() > 0.5 ? '#2d5a3d' : '#4a7a4d'
                };

            case 'star':
                return {
                    ...base,
                    vx: 0,
                    vy: 0,
                    size: 2 + Math.random() * 2,
                    decay: 0.01,
                    twinkle: Math.random() * Math.PI * 2,
                    color: '#fff'
                };

            default:
                return {
                    ...base,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 2,
                    size: 3,
                    decay: 0.02,
                    color: '#fff'
                };
        }
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Apply gravity if exists
            if (p.gravity) {
                p.vy += p.gravity;
            }

            // Apply rotation
            if (p.rotation !== undefined) {
                p.rotation += p.rotationSpeed || 0;
            }

            // Sway for leaves
            if (p.sway !== undefined) {
                p.sway += 0.05;
                p.vy += Math.sin(p.sway) * 0.02;
            }

            // Twinkle
            if (p.twinkle !== undefined) {
                p.twinkle += 0.1;
            }

            // Decay life
            p.life -= p.decay;

            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;

            switch (p.type) {
                case 'feather':
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Feather line
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(-p.size, 0);
                    ctx.lineTo(p.size, 0);
                    ctx.stroke();
                    break;

                case 'dust':
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case 'sparkle':
                    const sparkleAlpha = 0.5 + Math.sin(p.twinkle) * 0.5;
                    ctx.globalAlpha = p.life * sparkleAlpha;
                    ctx.fillStyle = p.color;

                    // Star shape
                    ctx.translate(p.x, p.y);
                    for (let i = 0; i < 4; i++) {
                        ctx.rotate(Math.PI / 4);
                        ctx.fillRect(-0.5, -p.size, 1, p.size * 2);
                    }
                    break;

                case 'leaf':
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Leaf vein
                    ctx.strokeStyle = '#1a3a1d';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(-p.size * 0.8, 0);
                    ctx.lineTo(p.size * 0.8, 0);
                    ctx.stroke();
                    break;

                case 'star':
                    const starAlpha = 0.3 + Math.sin(p.twinkle) * 0.7;
                    ctx.globalAlpha = p.life * starAlpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                default:
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
            }

            ctx.restore();
        });
    }

    // Emit ambient particles based on time of day
    emitAmbient(timeOfDay, deltaTime) {
        // Occasionally emit leaves during day
        if (timeOfDay === 'day' && Math.random() < 0.01) {
            this.emit('leaf', 850, 100 + Math.random() * 300);
        }

        // Dust particles near nest sometimes
        if (Math.random() < 0.005) {
            this.emit('dust', 350 + Math.random() * 100, 400);
        }
    }

    clear() {
        this.particles = [];
    }
}
