// NPC Manager - Family and other characters
// ==========================================

import { NEST_Y } from './game.js';

export class NPCManager {
    constructor() {
        this.npcs = {};
        this.animTimer = 0;
    }

    spawn(npcId, state = 'idle') {
        const npcDefs = {
            mama: {
                x: 320,
                y: NEST_Y - 35,
                type: 'adult',
                color: '#8B4513',
                bellyColor: '#F4A460',
                direction: 1,
                name: 'Mama'
            },
            papa: {
                x: 480,
                y: NEST_Y - 35,
                type: 'adult',
                color: '#654321',
                bellyColor: '#DEB887',
                direction: -1,
                name: 'Papa'
            },
            wren: {
                x: 360,
                y: NEST_Y - 22,
                type: 'chick',
                color: '#a08070',
                bellyColor: '#d4c4b0',
                direction: 1,
                name: 'Wren'
            },
            bramble: {
                x: 440,
                y: NEST_Y - 22,
                type: 'chick',
                color: '#907060',
                bellyColor: '#c4b4a0',
                direction: -1,
                name: 'Bramble'
            },
            asher: {
                x: 600,
                y: NEST_Y - 80,
                type: 'crow',
                color: '#1a1a1a',
                direction: -1,
                name: 'Asher'
            }
        };

        if (npcDefs[npcId]) {
            this.npcs[npcId] = {
                ...npcDefs[npcId],
                id: npcId,
                state: state,
                animPhase: Math.random() * Math.PI * 2,
                blinkTimer: Math.random() * 3000,
                isBlinking: false
            };
        }
    }

    setState(npcId, state) {
        if (npcId === 'all') {
            Object.values(this.npcs).forEach(npc => npc.state = state);
        } else if (this.npcs[npcId]) {
            this.npcs[npcId].state = state;
        }
    }

    remove(npcId) {
        delete this.npcs[npcId];
    }

    update(deltaTime, gameState) {
        this.animTimer += deltaTime;

        Object.values(this.npcs).forEach(npc => {
            npc.animPhase += deltaTime * 0.002;
            npc.blinkTimer += deltaTime;

            // Random blinking
            if (npc.blinkTimer > 2500 + Math.random() * 2000) {
                npc.isBlinking = true;
                setTimeout(() => npc.isBlinking = false, 150);
                npc.blinkTimer = 0;
            }

            // State-based animation
            if (npc.state === 'racing') {
                npc.x += 1.5;
                if (npc.x > 550) npc.x = 550;
            }

            if (npc.state === 'arriving') {
                // Fly in animation
                npc.y += 0.5;
                if (npc.y >= NEST_Y - 35) {
                    npc.y = NEST_Y - 35;
                    npc.state = 'idle';
                }
            }
        });
    }

    render(ctx) {
        // Sort by y for proper layering
        const sorted = Object.values(this.npcs).sort((a, b) => a.y - b.y);

        sorted.forEach(npc => {
            ctx.save();
            ctx.translate(npc.x, npc.y);
            ctx.scale(npc.direction, 1);

            if (npc.state === 'sleeping') {
                this.drawSleepingBird(ctx, npc);
            } else if (npc.type === 'adult') {
                this.drawAdultBird(ctx, npc);
            } else if (npc.type === 'chick') {
                this.drawChickBird(ctx, npc);
            } else if (npc.type === 'crow') {
                this.drawCrow(ctx, npc);
            }

            ctx.restore();
        });
    }

    drawAdultBird(ctx, npc) {
        const breathe = Math.sin(npc.animPhase) * 1;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 18, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.ellipse(0, breathe, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wing
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.ellipse(-5, breathe, 14, 8, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = npc.bellyColor;
        ctx.beginPath();
        ctx.ellipse(3, breathe + 5, 10, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.arc(14, breathe - 10, 11, 0, Math.PI * 2);
        ctx.fill();

        // Eye area
        ctx.fillStyle = npc.bellyColor;
        ctx.beginPath();
        ctx.arc(18, breathe - 10, 6, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        if (!npc.isBlinking) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(19, breathe - 11, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(20, breathe - 11, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(21, breathe - 12, 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(19, breathe - 11, 3, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }

        // Beak
        ctx.fillStyle = '#FFa500';
        ctx.beginPath();
        ctx.moveTo(23, breathe - 8);
        ctx.lineTo(32, breathe - 7);
        ctx.lineTo(23, breathe - 5);
        ctx.closePath();
        ctx.fill();

        // Tail
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.moveTo(-18, breathe);
        ctx.lineTo(-30, breathe - 5);
        ctx.lineTo(-28, breathe);
        ctx.lineTo(-30, breathe + 5);
        ctx.closePath();
        ctx.fill();
    }

    drawChickBird(ctx, npc) {
        const breathe = Math.sin(npc.animPhase) * 0.8;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(0, 10, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.ellipse(0, breathe, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fluff
        ctx.fillStyle = npc.bellyColor;
        ctx.beginPath();
        ctx.ellipse(2, breathe + 2, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.arc(7, breathe - 6, 7, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        if (!npc.isBlinking) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(10, breathe - 7, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(11, breathe - 7, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(12, breathe - 8, 0.8, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(10, breathe - 7, 2, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }

        // Beak
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.moveTo(12, breathe - 5);
        ctx.lineTo(18, breathe - 4);
        ctx.lineTo(12, breathe - 2);
        ctx.closePath();
        ctx.fill();

        // Tiny wings
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.ellipse(-4, breathe - 1, 5, 3, -0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSleepingBird(ctx, npc) {
        const breathe = Math.sin(npc.animPhase * 0.5) * 1;

        // Curled up body
        ctx.fillStyle = npc.color || '#a08070';
        ctx.beginPath();
        ctx.ellipse(0, breathe + 2, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head tucked
        ctx.beginPath();
        ctx.arc(5, breathe - 2, 8, 0, Math.PI * 2);
        ctx.fill();

        // Closed eyes
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(9, breathe - 3, 2, 0.3, Math.PI - 0.3);
        ctx.stroke();

        // Zzz
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px sans-serif';
        const zzOffset = Math.sin(npc.animPhase * 2) * 3;
        ctx.fillText('z', 15, breathe - 10 + zzOffset);
        ctx.fillText('z', 20, breathe - 15 + zzOffset);
    }

    drawCrow(ctx, npc) {
        const breathe = Math.sin(npc.animPhase) * 1;

        // Asher is an old, ragged crow

        // Body
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(0, breathe, 20, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ragged wing
        ctx.fillStyle = '#0d0d0d';
        ctx.beginPath();
        ctx.moveTo(-10, breathe - 5);
        ctx.lineTo(-25, breathe);
        ctx.lineTo(-22, breathe + 3);
        ctx.lineTo(-28, breathe + 6);
        ctx.lineTo(-20, breathe + 8);
        ctx.lineTo(-5, breathe + 5);
        ctx.closePath();
        ctx.fill();

        // Head
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(15, breathe - 8, 12, 0, Math.PI * 2);
        ctx.fill();

        // Eye (knowing, tired)
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(20, breathe - 9, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(21, breathe - 10, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(22, breathe - 10, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Beak (large, weathered)
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(25, breathe - 6);
        ctx.lineTo(40, breathe - 4);
        ctx.lineTo(38, breathe - 2);
        ctx.lineTo(25, breathe - 2);
        ctx.closePath();
        ctx.fill();

        // Scar or worn feathers
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, breathe - 12);
        ctx.lineTo(14, breathe - 8);
        ctx.stroke();

        // Tail
        ctx.fillStyle = '#0d0d0d';
        ctx.beginPath();
        ctx.moveTo(-20, breathe);
        ctx.lineTo(-35, breathe - 3);
        ctx.lineTo(-33, breathe + 2);
        ctx.lineTo(-38, breathe + 5);
        ctx.lineTo(-30, breathe + 5);
        ctx.closePath();
        ctx.fill();
    }
}
