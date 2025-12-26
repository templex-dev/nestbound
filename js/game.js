// Nestbound: First Flight - Main Game Engine
// ============================================

import { SceneManager } from './scenes.js';
import { DialogueSystem } from './dialogue.js';
import { Player } from './player.js';
import { NPCManager } from './npcs.js';
import { ParticleSystem } from './particles.js';
import { DIALOGUE_DATA } from '../data/dialogue.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Game constants
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const NEST_Y = 420;
export const NEST_LEFT = 200;
export const NEST_RIGHT = 600;

// Game state
export const gameState = {
    currentDay: 1,
    currentScene: 'title',
    wingStrength: 10,
    maxWingStrength: 100,
    isPlaying: false,
    isPaused: false,
    timeOfDay: 'dawn', // dawn, day, dusk, night
    sceneProgress: 0,
    flags: {
        hasEaten: false,
        hasStretched: false,
        metSiblings: false,
        sawShadow: false,
        metAsher: false
    }
};

// Input state
export const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    spacePressed: false
};

// Game systems
let sceneManager;
let dialogueSystem;
let player;
let npcManager;
let particleSystem;

// DOM elements
const titleScreen = document.getElementById('title-screen');
const chapterScreen = document.getElementById('chapter-screen');
const endChapterScreen = document.getElementById('end-chapter-screen');
const startBtn = document.getElementById('start-btn');
const continueBtn = document.getElementById('continue-btn');
const dayIndicator = document.getElementById('day-indicator');
const wingFill = document.getElementById('wing-fill');

// Initialize game
function init() {
    // Create systems
    particleSystem = new ParticleSystem();
    dialogueSystem = new DialogueSystem(DIALOGUE_DATA);
    player = new Player();
    npcManager = new NPCManager();
    sceneManager = new SceneManager(gameState, dialogueSystem, player, npcManager, particleSystem);

    // Bind events
    startBtn.addEventListener('click', startGame);
    continueBtn.addEventListener('click', continueGame);

    // Input handlers
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Start render loop
    requestAnimationFrame(gameLoop);
}

function handleKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
    if (e.code === 'Space') {
        if (!keys.space) keys.spacePressed = true;
        keys.space = true;
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
    if (e.code === 'Space') keys.space = false;
}

function startGame() {
    titleScreen.classList.add('hidden');
    gameState.isPlaying = true;
    gameState.currentDay = 1;
    gameState.currentScene = 'day1_awakening';

    // Show chapter screen
    showChapterScreen(1, 'Awakening');
}

function showChapterScreen(day, title) {
    document.getElementById('chapter-day').textContent = `Day ${day}`;
    document.getElementById('chapter-title').textContent = title;
    chapterScreen.classList.remove('hidden');

    setTimeout(() => {
        chapterScreen.classList.add('hidden');
        sceneManager.startScene(gameState.currentScene);
    }, 2500);
}

export function showEndChapter(message) {
    document.getElementById('end-message').innerHTML = message;
    endChapterScreen.classList.remove('hidden');
}

function continueGame() {
    endChapterScreen.classList.add('hidden');

    if (gameState.currentDay === 1) {
        gameState.currentDay = 2;
        gameState.currentScene = 'day2_morning';
        showChapterScreen(2, 'Growing');
    } else {
        // Day 2 complete - show coming soon
        showEndChapter('Day 3-4 coming soon...<br><br>Thanks for playing the demo!');
    }
}

function updateUI() {
    // Day indicator
    dayIndicator.textContent = `Day ${gameState.currentDay}`;

    // Wing strength
    const wingPercent = (gameState.wingStrength / gameState.maxWingStrength) * 100;
    wingFill.style.width = `${wingPercent}%`;
}

// Main game loop
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (gameState.isPlaying && !gameState.isPaused) {
        // Update
        sceneManager.update(deltaTime, keys);
        player.update(deltaTime, keys, gameState);
        npcManager.update(deltaTime, gameState);
        particleSystem.update(deltaTime);
        dialogueSystem.update(keys);

        // Render
        sceneManager.renderBackground(ctx, gameState);
        npcManager.render(ctx);
        player.render(ctx);
        particleSystem.render(ctx);
        sceneManager.renderForeground(ctx, gameState);

        // Update UI
        updateUI();
    }

    // Reset single-frame inputs
    keys.spacePressed = false;

    requestAnimationFrame(gameLoop);
}

// Expose for other modules
export { ctx, canvas, dialogueSystem, player, npcManager, particleSystem, sceneManager };

// Start
init();
