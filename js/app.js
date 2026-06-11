// Main Game Controller - Coordinates screen state machine and gameplay interactions

import { LEVEL_1_NODES, LEVEL_2_NODES } from './data/nodes.js';
import { CameraSystem } from './systems/cameraSystem.js';
import { ExplorationSystem } from './systems/explorationSystem.js';
import { MovementSystem } from './systems/movementSystem.js';

class GameController {
    constructor() {
        this.currentScreen = 'start';
        this.activeLevel = 1;
        this.isInputBlocked = false;

        // Cache DOM elements
        this.viewport = document.querySelector('.game-viewport');
        this.board = document.querySelector('.game-board');
        this.ravanEl = document.getElementById('ravan-character');

        // Initialize systems
        this.cameraSystem = new CameraSystem(this.viewport, this.board);
        this.explorationSystem = new ExplorationSystem(this.board);
        this.movementSystem = new MovementSystem(this.ravanEl, this.board);

        // Bind events
        this.initEvents();
    }

    /**
     * Set up UI click listeners and resizing
     */
    initEvents() {
        // Start Game
        const startBtn = document.getElementById('start-button');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleStartClick());
        }

        // Map Pulse Scroll click
        const mapScroll = document.getElementById('map-scroll-item');
        if (mapScroll) {
            mapScroll.addEventListener('click', () => this.handleMapZoomClick());
        }

        // Continue to Gameplay
        const continueBtn = document.getElementById('continue-button');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.handleContinueClick());
        }

        // Node interactions
        this.board.addEventListener('click', (e) => this.handleNodeClick(e));

        // Responsive resize handling: recalculate paths, Ravan alignment, and camera center
        window.addEventListener('resize', () => {
            if (this.currentScreen === 'gameplay') {
                this.explorationSystem.drawPaths();
                const currentN = this.movementSystem.currentNode;
                if (currentN) {
                    this.movementSystem.alignRavanToNode(currentN, this.activeLevel);
                    this.cameraSystem.update(currentN, this.activeLevel, false);
                }
            }
        });
    }

    /**
     * Start button click: Start screen contents fade, revealing pulsing map scroll
     */
    handleStartClick() {
        if (this.isInputBlocked) return;
        this.isInputBlocked = true;
        this.triggerAudioHook('click');

        const startScreen = document.getElementById('start-screen');
        const startBg = startScreen.querySelector('.start-bg');
        const logo = startScreen.querySelector('.title-logo');
        const btn = startScreen.querySelector('#start-button');

        // Fade out Start elements
        logo.style.transition = 'opacity 0.5s ease';
        logo.style.opacity = '0';
        btn.style.transition = 'opacity 0.5s ease';
        btn.style.opacity = '0';

        setTimeout(() => {
            const journeyScreen = document.getElementById('journey-map-screen');
            journeyScreen.classList.remove('hidden');
            journeyScreen.offsetHeight; // force reflow
            journeyScreen.classList.add('active');

            // Map-bg starts with start-bg underlay, and has map-bg hidden on top
            const mapBgUnder = journeyScreen.querySelector('.journey-map-bg-under');
            const mapBg = journeyScreen.querySelector('.journey-map-bg');
            mapBgUnder.classList.add('active');
            mapBg.classList.remove('active');

            this.currentScreen = 'journey-map';

            setTimeout(() => {
                startScreen.classList.remove('active');
                startScreen.classList.add('hidden');
                this.isInputBlocked = false;
            }, 850);
        }, 550);
    }

    /**
     * Clicking the scroll map: trigger zoom animation and transition background
     */
    handleMapZoomClick() {
        if (this.isInputBlocked || this.currentScreen !== 'journey-map') return;
        this.isInputBlocked = true;
        this.triggerAudioHook('click');
        this.triggerAudioHook('zoom');

        const mapScroll = document.getElementById('map-scroll-item');
        mapScroll.classList.remove('pulsing');
        mapScroll.classList.add('zoomed');

        // Play transition background: map-bg (top) fades in over start-bg (under)
        const journeyScreen = document.getElementById('journey-map-screen');
        const mapBg = journeyScreen.querySelector('.journey-map-bg');
        const mapBgUnder = journeyScreen.querySelector('.journey-map-bg-under');
        
        mapBg.classList.add('active');

        // Wait for background fade and zoom animation (1.2s)
        setTimeout(() => {
            // Remove the under-bg reference after completion to nullify black flashes
            mapBgUnder.classList.remove('active');

            // Reveal continue button
            const continueBtn = document.getElementById('continue-button');
            continueBtn.classList.remove('hidden');
            continueBtn.classList.add('visible');
            
            this.isInputBlocked = false;
        }, 1200);
    }

    /**
     * Continue to gameplay: fade journey map and enter Level 1
     */
    handleContinueClick() {
        if (this.isInputBlocked) return;
        this.isInputBlocked = true;
        this.triggerAudioHook('click');

        const journeyScreen = document.getElementById('journey-map-screen');
        const gameplayScreen = document.getElementById('gameplay-screen');

        gameplayScreen.classList.remove('hidden');
        gameplayScreen.offsetHeight; // force reflow
        gameplayScreen.classList.add('active');

        this.currentScreen = 'gameplay';
        this.activeLevel = 1;

        // Initialize Level 1 gameplay
        this.startLevel1();

        setTimeout(() => {
            journeyScreen.classList.remove('active');
            journeyScreen.classList.add('hidden');
            this.isInputBlocked = false;
        }, 850);
    }

    /**
     * Setup Level 1
     */
    startLevel1() {
        this.activeLevel = 1;
        this.explorationSystem.initLevel(1);

        // Ravan starts at top-middle node (l1_r1_2)
        const startNode = LEVEL_1_NODES.l1_r1_2;
        this.movementSystem.setCurrentNode(startNode, 1);
        this.explorationSystem.revealNode(startNode.id, LEVEL_1_NODES);

        // Adjust SVG layout and camera
        setTimeout(() => {
            this.explorationSystem.drawPaths();
            this.cameraSystem.update(startNode, 1, false);
        }, 100);
    }

    /**
     * Handle Node clicking during gameplay
     */
    handleNodeClick(e) {
        if (this.isInputBlocked || this.currentScreen !== 'gameplay') return;

        // Find clicked node element
        const nodeEl = e.target.closest('.map-node');
        if (!nodeEl) return;

        const nodeId = nodeEl.id;
        const levelNodes = this.activeLevel === 1 ? LEVEL_1_NODES : LEVEL_2_NODES;
        const targetNode = levelNodes[nodeId];

        if (!targetNode) return;

        // Verify clicked node is revealed (adjacent/clickable)
        const isRevealed = this.explorationSystem.revealed.has(nodeId);
        const isVisited = this.explorationSystem.visited.has(nodeId);

        // Allow moving to a revealed node or backtracking to a visited one
        if (isRevealed || isVisited) {
            this.isInputBlocked = true;
            this.triggerAudioHook('move');

            this.movementSystem.moveTo(targetNode, this.activeLevel, levelNodes)
                .then((node) => {
                    // Reveal details upon landing
                    this.explorationSystem.revealNode(node.id, levelNodes);
                    
                    // Center camera following Ravan
                    this.cameraSystem.update(node, this.activeLevel, true);

                    // Play land/dead-end sound hooks
                    if (node.type === 'dead-end') {
                        this.triggerAudioHook('dead-end');
                    } else if (node.type === 'finish') {
                        this.triggerAudioHook('finish');
                    } else {
                        this.triggerAudioHook('land');
                    }

                    // Check level ending triggers
                    setTimeout(() => {
                        this.checkLevelCompletion(node);
                    }, 1100);
                })
                .catch(() => {
                    this.isInputBlocked = false;
                });
        }
    }

    /**
     * Verify node and coordinate level transitions
     */
    checkLevelCompletion(node) {
        if (node.type !== 'finish') {
            this.isInputBlocked = false;
            return;
        }

        // Disable input during transition animations
        this.isInputBlocked = true;

        if (this.activeLevel === 1) {
            this.transitionToLevel2();
        } else if (this.activeLevel === 2) {
            this.transitionToResultScreen();
        }
    }

    /**
     * Pan downwards to Level 2
     */
    transitionToLevel2() {
        this.activeLevel = 2;
        this.triggerAudioHook('transition');
        
        // Hide Level 1 nodes interactions
        document.getElementById('level-1-nodes').style.pointerEvents = 'none';

        // Pre-initialize Level 2 nodes & paths
        this.explorationSystem.initLevel(2);
        
        const startNode = LEVEL_2_NODES.l2_r1_3; // Level 2 Start (Top-Right)

        // Hide Ravan character temporarily during pan
        this.ravanEl.classList.add('hidden');

        // Draw path traces on new SVG size
        this.explorationSystem.drawPaths();

        // Run vertical/horizontal camera panning
        this.cameraSystem.transitionToLevel2(startNode)
            .then(() => {
                // Reveal Level 2 start
                this.movementSystem.setCurrentNode(startNode, 2);
                this.explorationSystem.revealNode(startNode.id, LEVEL_2_NODES);
                
                this.isInputBlocked = false;
            });
    }

    /**
     * Complete Level 2 and transition to final screen
     */
    transitionToResultScreen() {
        const gameplayScreen = document.getElementById('gameplay-screen');
        const resultScreen = document.getElementById('result-screen');
        const resultBg = resultScreen.querySelector('.result-bg');

        // Add result active screen
        resultScreen.classList.remove('hidden');
        resultScreen.classList.add('active');

        // Fade out gameplay screen, overlaying result background
        resultBg.classList.add('active');
        this.triggerAudioHook('result');

        setTimeout(() => {
            gameplayScreen.classList.remove('active');
            gameplayScreen.classList.add('hidden');
            this.currentScreen = 'result';
            
            // Clean instruction banner if remaining
            const banner = document.getElementById('instruction-banner');
            if (banner) banner.classList.remove('visible');
        }, 1000);
    }

    /**
     * Optional audio hook. Triggered when button clicks, node selections, transitions, or dead-ends occur.
     */
    triggerAudioHook(type) {
        console.log(`[Audio Hook]: Play sound for "${type}"`);
        // Example: if (this.sounds[type]) this.sounds[type].play();
    }
}

// Instantiate game on page load
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameController();
});
