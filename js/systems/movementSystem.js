import { getNodeCoordinates, getNodeConnections, getNodeType } from '../data/nodes.js';

export class MovementSystem {
    constructor(ravanCharacterElement, gameBoardElement) {
        this.ravan = ravanCharacterElement;
        this.board = gameBoardElement;
        this.currentNodeConfiguration = null;
        this.isRavanMoving = false;
    }

    setCurrentNode(nodeConfiguration, levelNumber) {
        this.currentNodeConfiguration = nodeConfiguration;
        this.isRavanMoving = false;

        this.alignRavanToNode(nodeConfiguration, levelNumber);
    }

    alignRavanToNode(nodeConfiguration, levelNumber) {
        const levelOneElement = document.getElementById('level-1');
        const levelTwoElement = document.getElementById('level-2');

        if (!levelOneElement || !levelTwoElement) {
            return;
        }

        const boardWidthPixels = this.board.offsetWidth;
        const nodeCoordinates = getNodeCoordinates(nodeConfiguration.identifier);
        const horizontalCoordinatePixels = (nodeCoordinates.horizontalPercentage / 100) * boardWidthPixels;

        let verticalCoordinatePixels = 0;
        if (levelNumber === 1) {
            verticalCoordinatePixels = (nodeCoordinates.verticalPercentage / 100) * levelOneElement.offsetHeight;
        } else {
            verticalCoordinatePixels = levelTwoElement.offsetTop + (nodeCoordinates.verticalPercentage / 100) * levelTwoElement.offsetHeight;
        }

        this.ravan.style.left = `${horizontalCoordinatePixels}px`;
        this.ravan.style.top = `${verticalCoordinatePixels}px`;
    }

    moveTo(targetNodeConfiguration, levelNumber, levelNodesConfiguration) {
        return new Promise((resolve, reject) => {
            if (this.isRavanMoving) {
                reject('Ravan is already moving');
                return;
            }

            const currentConnections = getNodeConnections(this.currentNodeConfiguration.identifier);
            const isAdjacent = currentConnections.connectedFromNodeIdentifiers.includes(targetNodeConfiguration.identifier) ||
                               currentConnections.connectedToNodeIdentifiers.includes(targetNodeConfiguration.identifier);

            if (!isAdjacent) {
                reject('Target node is not adjacent');
                return;
            }

            this.isRavanMoving = true;
            this.ravan.classList.add('walking');

            this.alignRavanToNode(targetNodeConfiguration, levelNumber);

            setTimeout(() => {
                this.ravan.classList.remove('walking');
                this.currentNodeConfiguration = targetNodeConfiguration;
                this.isRavanMoving = false;

                this.updateInstructionBanner(targetNodeConfiguration);

                resolve(targetNodeConfiguration);
            }, 1050);
        });
    }

    updateInstructionBanner(nodeConfiguration) {
        const instructionBannerElement = document.getElementById('instruction-banner');
        const instructionBannerTextElement = instructionBannerElement ? instructionBannerElement.querySelector('.banner-text') : null;

        if (!instructionBannerElement || !instructionBannerTextElement) {
            return;
        }

        const nodeType = getNodeType(nodeConfiguration.identifier);

        if (nodeType === 'dead-end') {
            instructionBannerTextElement.textContent = `${nodeConfiguration.nodeLabel}. Backtrack to another path.`;
            instructionBannerElement.classList.add('visible');
        } else if (nodeType === 'finish') {
            instructionBannerTextElement.textContent = 'Destination Reached!';
            instructionBannerElement.classList.add('visible');

            setTimeout(() => {
                instructionBannerElement.classList.remove('visible');
            }, 3000);
        } else {
            instructionBannerElement.classList.remove('visible');
        }
    }
}
