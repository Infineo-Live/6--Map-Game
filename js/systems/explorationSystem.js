import { LEVEL_1_NODES, LEVEL_2_NODES, getNodeCoordinates, getNodeConnections, getNodeType } from '../data/nodes.js';

export class ExplorationSystem {
    constructor(gameBoardElement) {
        this.board = gameBoardElement;
        this.visitedNodeIdentifiers = new Set();
        this.revealedNodeIdentifiers = new Set();
        this.vectorGraphicsOverlayElement = document.querySelector('.path-overlay');
        this.pathConnectionsData = [];
    }

    initLevel(levelNumber) {
        const nodesConfiguration = levelNumber === 1 ? LEVEL_1_NODES : LEVEL_2_NODES;
        const levelNodesContainerElement = document.getElementById(`level-${levelNumber}-nodes`);

        if (!levelNodesContainerElement) {
            return;
        }

        levelNodesContainerElement.innerHTML = '';

        if (levelNumber === 1) {
            this.visitedNodeIdentifiers.clear();
            this.revealedNodeIdentifiers.clear();
            this.pathConnectionsData = [];
        }

        Object.values(nodesConfiguration).forEach(nodeConfiguration => {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'map-node';
            nodeElement.id = nodeConfiguration.identifier;

            const stoneDiscElement = document.createElement('div');
            stoneDiscElement.className = 'node-stone';
            nodeElement.appendChild(stoneDiscElement);

            const cloudsDeckElement = document.createElement('div');
            cloudsDeckElement.className = 'cloud-deck';

            const cloudLayerOneElement = document.createElement('img');
            cloudLayerOneElement.src = 'assets/images/clouds/cloud-1.webp';
            cloudLayerOneElement.className = 'cloud-layer cloud-layer-one';

            const cloudLayerTwoElement = document.createElement('img');
            cloudLayerTwoElement.src = 'assets/images/clouds/cloud-2.webp';
            cloudLayerTwoElement.className = 'cloud-layer cloud-layer-two';

            const cloudLayerThreeElement = document.createElement('img');
            cloudLayerThreeElement.src = 'assets/images/clouds/cloud-1.webp';
            cloudLayerThreeElement.className = 'cloud-layer cloud-layer-three';

            cloudsDeckElement.appendChild(cloudLayerOneElement);
            cloudsDeckElement.appendChild(cloudLayerTwoElement);
            cloudsDeckElement.appendChild(cloudLayerThreeElement);
            nodeElement.appendChild(cloudsDeckElement);

            levelNodesContainerElement.appendChild(nodeElement);
        });

        this.rebuildPathsData(levelNumber, nodesConfiguration);
    }

    rebuildPathsData(levelNumber, nodesConfiguration) {
        this.pathConnectionsData = this.pathConnectionsData.filter(pathConnection => pathConnection.levelNumber !== levelNumber);

        Object.values(nodesConfiguration).forEach(nodeConfiguration => {
            const nodeConnections = getNodeConnections(nodeConfiguration.identifier);

            nodeConnections.connectedToNodeIdentifiers.forEach(connectionNodeIdentifier => {
                const pairIdentifier = `${nodeConfiguration.identifier}-${connectionNodeIdentifier}`;

                this.pathConnectionsData.push({
                    identifier: pairIdentifier,
                    sourceNodeIdentifier: nodeConfiguration.identifier,
                    destinationNodeIdentifier: connectionNodeIdentifier,
                    levelNumber: levelNumber
                });
            });
        });
    }

    drawPaths() {
        if (!this.vectorGraphicsOverlayElement) {
            return;
        }

        this.vectorGraphicsOverlayElement.innerHTML = '';

        const levelOneElement = document.getElementById('level-1');
        const levelTwoElement = document.getElementById('level-2');
        const boardWidthPixels = this.board.offsetWidth;
        const boardHeightPixels = this.board.offsetHeight;

        if (!levelOneElement || !levelTwoElement) {
            return;
        }

        this.vectorGraphicsOverlayElement.setAttribute('width', boardWidthPixels);
        this.vectorGraphicsOverlayElement.setAttribute('height', boardHeightPixels);

        const levelOneHeightPixels = levelOneElement.offsetHeight;
        const levelTwoHeightPixels = levelTwoElement.offsetHeight;
        const levelTwoTopOffsetPixels = levelTwoElement.offsetTop;

        this.pathConnectionsData.forEach(pathConnection => {
            const sourceNodeConfiguration = this.getNodeData(pathConnection.sourceNodeIdentifier);
            const destinationNodeConfiguration = this.getNodeData(pathConnection.destinationNodeIdentifier);

            if (!sourceNodeConfiguration || !destinationNodeConfiguration) {
                return;
            }

            const startPointBoardPixels = this.getNodePixelPosition(sourceNodeConfiguration, pathConnection.levelNumber, boardWidthPixels, levelOneHeightPixels, levelTwoHeightPixels, levelTwoTopOffsetPixels);
            const endPointBoardPixels = this.getNodePixelPosition(destinationNodeConfiguration, pathConnection.levelNumber, boardWidthPixels, levelOneHeightPixels, levelTwoHeightPixels, levelTwoTopOffsetPixels);

            const pathLineElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathLineElement.setAttribute('d', `M ${startPointBoardPixels.horizontalCoordinatePixels} ${startPointBoardPixels.verticalCoordinatePixels} L ${endPointBoardPixels.horizontalCoordinatePixels} ${endPointBoardPixels.verticalCoordinatePixels}`);

            let pathClassName = 'map-path hidden';

            const sourceNodeVisited = this.visitedNodeIdentifiers.has(pathConnection.sourceNodeIdentifier);
            const destinationNodeVisited = this.visitedNodeIdentifiers.has(pathConnection.destinationNodeIdentifier);
            const sourceNodeRevealed = this.revealedNodeIdentifiers.has(pathConnection.sourceNodeIdentifier);
            const destinationNodeRevealed = this.revealedNodeIdentifiers.has(pathConnection.destinationNodeIdentifier);

            if (sourceNodeVisited && destinationNodeVisited) {
                pathClassName = 'map-path solid-traversed';
            } else if ((sourceNodeVisited && destinationNodeRevealed) || (destinationNodeVisited && sourceNodeRevealed)) {
                pathClassName = 'map-path dotted-active';
            } else if (sourceNodeRevealed || destinationNodeRevealed) {
                pathClassName = 'map-path faint-preview';
            }

            pathLineElement.setAttribute('class', pathClassName);
            pathLineElement.setAttribute('id', `path-${pathConnection.identifier}`);
            this.vectorGraphicsOverlayElement.appendChild(pathLineElement);
        });
    }

    getNodePixelPosition(nodeConfiguration, levelNumber, boardWidthPixels, levelOneHeightPixels, levelTwoHeightPixels, levelTwoTopOffsetPixels) {
        const nodeCoordinates = getNodeCoordinates(nodeConfiguration.identifier);
        const horizontalCoordinatePixels = (nodeCoordinates.horizontalPercentage / 100) * boardWidthPixels;
        const levelHeightPixels = levelNumber === 1 ? levelOneHeightPixels : levelTwoHeightPixels;
        const verticalOffsetPixels = levelNumber === 1 ? 0 : levelTwoTopOffsetPixels;
        const verticalCoordinatePixels = verticalOffsetPixels + (nodeCoordinates.verticalPercentage / 100) * levelHeightPixels;

        return { horizontalCoordinatePixels, verticalCoordinatePixels };
    }

    getNodeData(nodeIdentifier) {
        return LEVEL_1_NODES[nodeIdentifier] || LEVEL_2_NODES[nodeIdentifier] || null;
    }

    revealNode(nodeIdentifier, levelNodesConfiguration) {
        this.visitedNodeIdentifiers.add(nodeIdentifier);
        this.updateExplorationState(levelNodesConfiguration);
        this.drawPaths();
    }

    updateExplorationState(levelNodesConfiguration) {
        this.revealedNodeIdentifiers.clear();

        this.visitedNodeIdentifiers.forEach(visitedNodeIdentifier => {
            this.revealedNodeIdentifiers.add(visitedNodeIdentifier);

            const nodeConnections = getNodeConnections(visitedNodeIdentifier);
            const adjacentNodeIdentifiers = [
                ...nodeConnections.connectedFromNodeIdentifiers,
                ...nodeConnections.connectedToNodeIdentifiers
            ];

            adjacentNodeIdentifiers.forEach(connectionNodeIdentifier => {
                if (levelNodesConfiguration[connectionNodeIdentifier]) {
                    this.revealedNodeIdentifiers.add(connectionNodeIdentifier);
                }
            });
        });

        Object.values(levelNodesConfiguration).forEach(currentNodeConfiguration => {
            const nodeElement = document.getElementById(currentNodeConfiguration.identifier);

            if (!nodeElement) {
                return;
            }

            nodeElement.classList.remove('visited', 'revealed', 'shining', 'dead-end', 'finish');

            if (this.visitedNodeIdentifiers.has(currentNodeConfiguration.identifier)) {
                nodeElement.classList.add('visited', 'revealed');
            } else if (this.revealedNodeIdentifiers.has(currentNodeConfiguration.identifier)) {
                nodeElement.classList.add('shining');
            }

            if (this.visitedNodeIdentifiers.has(currentNodeConfiguration.identifier)) {
                const nodeType = getNodeType(currentNodeConfiguration.identifier);

                if (nodeType === 'dead-end') {
                    nodeElement.classList.add('dead-end');
                } else if (nodeType === 'finish') {
                    nodeElement.classList.add('finish');
                }
            }
        });
    }
}
