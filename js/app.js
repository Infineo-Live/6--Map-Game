import { LEVEL_1_NODES, LEVEL_2_NODES } from './data/nodes.js';
import { CameraSystem } from './systems/cameraSystem.js';
import { ExplorationSystem } from './systems/explorationSystem.js';
import { MovementSystem } from './systems/movementSystem.js';

class GameController {
    constructor() {
        this.currentScreenName = 'start';
        this.activeLevelNumber = 1;
        this.isPlayerInputBlocked = false;

        this.viewportElement = document.querySelector('.game-viewport');
        this.gameBoardElement = document.querySelector('.game-board');
        this.ravanCharacterElement = document.getElementById('ravan-character');

        this.cameraSystem = new CameraSystem(this.viewportElement, this.gameBoardElement);
        this.explorationSystem = new ExplorationSystem(this.gameBoardElement);
        this.movementSystem = new MovementSystem(this.ravanCharacterElement, this.gameBoardElement);

        this.initEvents();
    }

    initEvents() {
        const startButtonElement = document.getElementById('start-button');
        if (startButtonElement) {
            startButtonElement.addEventListener('click', () => this.handleStartClick());
        }

        const mapScrollElement = document.getElementById('map-scroll-item');
        if (mapScrollElement) {
            mapScrollElement.addEventListener('click', () => this.handleMapZoomClick());
        }

        const continueButtonElement = document.getElementById('continue-button');
        if (continueButtonElement) {
            continueButtonElement.addEventListener('click', () => this.handleContinueClick());
        }

        this.gameBoardElement.addEventListener('click', (clickEvent) => this.handleNodeClick(clickEvent));

        window.addEventListener('resize', () => {
            if (this.currentScreenName === 'gameplay') {
                this.explorationSystem.drawPaths();

                const currentNodeConfiguration = this.movementSystem.currentNodeConfiguration;
                if (currentNodeConfiguration) {
                    this.movementSystem.alignRavanToNode(currentNodeConfiguration, this.activeLevelNumber);
                    this.cameraSystem.update(currentNodeConfiguration, this.activeLevelNumber, false);
                }
            }
        });
    }

    handleStartClick() {
        if (this.isPlayerInputBlocked) {
            return;
        }

        this.isPlayerInputBlocked = true;
        this.triggerAudioHook('click');

        const startScreenElement = document.getElementById('start-screen');
        const titleLogoElement = startScreenElement.querySelector('.title-logo');
        const startButtonElement = startScreenElement.querySelector('#start-button');

        titleLogoElement.style.transition = 'opacity 0.5s ease';
        titleLogoElement.style.opacity = '0';
        startButtonElement.style.transition = 'opacity 0.5s ease';
        startButtonElement.style.opacity = '0';

        setTimeout(() => {
            const journeyScreenElement = document.getElementById('journey-map-screen');
            journeyScreenElement.classList.remove('hidden');
            journeyScreenElement.offsetHeight;
            journeyScreenElement.classList.add('active');

            const journeyMapBackgroundUnderlay = journeyScreenElement.querySelector('.journey-map-background-underlay');
            const journeyMapBackgroundOverlay = journeyScreenElement.querySelector('.journey-map-background-overlay');
            journeyMapBackgroundUnderlay.classList.add('active');
            journeyMapBackgroundOverlay.classList.remove('active');

            this.currentScreenName = 'journey-map';

            setTimeout(() => {
                startScreenElement.classList.remove('active');
                startScreenElement.classList.add('hidden');
                this.isPlayerInputBlocked = false;
            }, 850);
        }, 550);
    }

    handleMapZoomClick() {
        if (this.isPlayerInputBlocked || this.currentScreenName !== 'journey-map') {
            return;
        }

        this.isPlayerInputBlocked = true;
        this.triggerAudioHook('click');
        this.triggerAudioHook('zoom');

        const mapScrollElement = document.getElementById('map-scroll-item');
        mapScrollElement.classList.remove('pulsing');
        mapScrollElement.classList.add('zoomed');

        const journeyScreenElement = document.getElementById('journey-map-screen');
        const journeyMapBackgroundOverlay = journeyScreenElement.querySelector('.journey-map-background-overlay');
        const journeyMapBackgroundUnderlay = journeyScreenElement.querySelector('.journey-map-background-underlay');

        journeyMapBackgroundOverlay.classList.add('active');

        setTimeout(() => {
            journeyMapBackgroundUnderlay.classList.remove('active');

            const continueButtonElement = document.getElementById('continue-button');
            continueButtonElement.classList.remove('hidden');
            continueButtonElement.classList.add('visible');

            this.isPlayerInputBlocked = false;
        }, 1200);
    }

    handleContinueClick() {
        if (this.isPlayerInputBlocked) {
            return;
        }

        this.isPlayerInputBlocked = true;
        this.triggerAudioHook('click');

        const journeyScreenElement = document.getElementById('journey-map-screen');
        const gameplayScreenElement = document.getElementById('gameplay-screen');

        gameplayScreenElement.classList.remove('hidden');
        gameplayScreenElement.offsetHeight;
        gameplayScreenElement.classList.add('active');

        this.currentScreenName = 'gameplay';
        this.activeLevelNumber = 1;

        this.startLevel1();

        setTimeout(() => {
            journeyScreenElement.classList.remove('active');
            journeyScreenElement.classList.add('hidden');
            this.isPlayerInputBlocked = false;
        }, 850);
    }

    startLevel1() {
        this.activeLevelNumber = 1;
        this.explorationSystem.initLevel(1);

        const startNodeConfiguration = LEVEL_1_NODES.l1_r1_2;
        this.movementSystem.setCurrentNode(startNodeConfiguration, 1);
        this.explorationSystem.revealNode(startNodeConfiguration.identifier, LEVEL_1_NODES);

        setTimeout(() => {
            this.explorationSystem.drawPaths();
            this.cameraSystem.update(startNodeConfiguration, 1, false);
        }, 100);
    }

    handleNodeClick(clickEvent) {
        if (this.isPlayerInputBlocked || this.currentScreenName !== 'gameplay') {
            return;
        }

        const nodeElement = clickEvent.target.closest('.map-node');
        if (!nodeElement) {
            return;
        }

        const nodeIdentifier = nodeElement.id;
        const levelNodesConfiguration = this.activeLevelNumber === 1 ? LEVEL_1_NODES : LEVEL_2_NODES;
        const targetNodeConfiguration = levelNodesConfiguration[nodeIdentifier];

        if (!targetNodeConfiguration) {
            return;
        }

        const isDestinationNodeRevealed = this.explorationSystem.revealedNodeIdentifiers.has(nodeIdentifier);
        const isDestinationNodeVisited = this.explorationSystem.visitedNodeIdentifiers.has(nodeIdentifier);

        if (isDestinationNodeRevealed || isDestinationNodeVisited) {
            this.isPlayerInputBlocked = true;
            this.triggerAudioHook('move');

            this.movementSystem.moveTo(targetNodeConfiguration, this.activeLevelNumber, levelNodesConfiguration)
                .then((nodeConfiguration) => {
                    this.explorationSystem.revealNode(nodeConfiguration.identifier, levelNodesConfiguration);
                    this.cameraSystem.update(nodeConfiguration, this.activeLevelNumber, true);

                    if (nodeConfiguration.nodeType === 'dead-end') {
                        this.triggerAudioHook('dead-end');
                    } else if (nodeConfiguration.nodeType === 'finish') {
                        this.triggerAudioHook('finish');
                    } else {
                        this.triggerAudioHook('land');
                    }

                    setTimeout(() => {
                        this.checkLevelCompletion(nodeConfiguration);
                    }, 1100);
                })
                .catch(() => {
                    this.isPlayerInputBlocked = false;
                });
        }
    }

    checkLevelCompletion(nodeConfiguration) {
        if (nodeConfiguration.nodeType !== 'finish') {
            this.isPlayerInputBlocked = false;
            return;
        }

        this.isPlayerInputBlocked = true;

        if (this.activeLevelNumber === 1) {
            this.transitionToLevel2();
        } else if (this.activeLevelNumber === 2) {
            this.transitionToResultScreen();
        }
    }

    transitionToLevel2() {
        this.activeLevelNumber = 2;
        this.triggerAudioHook('transition');

        document.getElementById('level-1-nodes').style.pointerEvents = 'none';

        this.explorationSystem.initLevel(2);

        const startNodeConfiguration = LEVEL_2_NODES.l2_r1_3;

        this.ravanCharacterElement.classList.add('hidden');

        this.explorationSystem.drawPaths();

        this.cameraSystem.transitionToLevel2(startNodeConfiguration)
            .then(() => {
                this.movementSystem.setCurrentNode(startNodeConfiguration, 2);
                this.explorationSystem.revealNode(startNodeConfiguration.identifier, LEVEL_2_NODES);
                this.isPlayerInputBlocked = false;
            });
    }

    transitionToResultScreen() {
        const gameplayScreenElement = document.getElementById('gameplay-screen');
        const resultScreenElement = document.getElementById('result-screen');
        const resultBackgroundElement = resultScreenElement.querySelector('.result-background');

        resultScreenElement.classList.remove('hidden');
        resultScreenElement.classList.add('active');

        resultBackgroundElement.classList.add('active');
        this.triggerAudioHook('result');

        setTimeout(() => {
            gameplayScreenElement.classList.remove('active');
            gameplayScreenElement.classList.add('hidden');
            this.currentScreenName = 'result';

            const instructionBannerElement = document.getElementById('instruction-banner');
            if (instructionBannerElement) {
                instructionBannerElement.classList.remove('visible');
            }
        }, 1000);
    }

    triggerAudioHook(audioHookType) {
        console.log(`[Audio Hook]: Play sound for "${audioHookType}"`);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameController();
});
