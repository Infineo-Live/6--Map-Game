import { LEVEL_1_NODES, LEVEL_2_NODES, getNodeCoordinates, getNodeConnections, getNodeType } from '../data/nodes.js';

export class ExplorationSystem {
    constructor(gameBoardElement) {
        this.board = gameBoardElement;
        this.visitedNodeIdentifiers = new Set();
        this.revealedNodeIdentifiers = new Set();
        this.vectorGraphicsOverlayElement = document.querySelector('.path-overlay');
        this.pathConnectionsData = [];
        this.cloudsOverlayContainer = document.querySelector('.clouds-overlay-container');
        this.spawnedCloudsList = [];
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
            this.spawnGlobalClouds();
        } else {
            this.resetClouds();
        }

        Object.values(nodesConfiguration).forEach(nodeConfiguration => {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'map-node';
            nodeElement.id = nodeConfiguration.identifier;

            const stoneDiscElement = document.createElement('div');
            stoneDiscElement.className = 'node-stone';
            nodeElement.appendChild(stoneDiscElement);

            levelNodesContainerElement.appendChild(nodeElement);
        });

        this.rebuildPathsData(levelNumber, nodesConfiguration);
    }

    spawnGlobalClouds() {
        if (!this.cloudsOverlayContainer) {
            return;
        }

        this.cloudsOverlayContainer.innerHTML = '';
        this.spawnedCloudsList = [];

        const columnsCount = 9;
        const rowsCount = 40;

        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            const horizontalOffset = -2 + Math.random() * 4;
            const horizontalPercentage = columnIndex * 12 + horizontalOffset;

            for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
                const verticalOffset = -1 + Math.random() * 2;
                const verticalPercentage = rowIndex * 2.5 + verticalOffset;

                const cloudElement = document.createElement('img');
                cloudElement.src = 'assets/images/clouds/cloud-2.webp';
                cloudElement.className = 'cloud-item';

                const cloudRotationDegrees = 0;
                const cloudScaleMultiplier = 0.95 + Math.random() * 0.4;

                const opacityChoices = [0.30, 0.45, 0.85];
                const cloudOpacity = opacityChoices[Math.floor(Math.random() * opacityChoices.length)];

                const randomAngleRadians = Math.random() * 2 * Math.PI;
                const shiftDistancePixels = 150 + Math.random() * 100;
                const shiftHorizontalPixels = Math.cos(randomAngleRadians) * shiftDistancePixels;
                const shiftVerticalPixels = Math.sin(randomAngleRadians) * shiftDistancePixels;
                const shiftRotationDegrees = 0;

                cloudElement.style.setProperty('--cloud-scale', cloudScaleMultiplier);
                cloudElement.style.setProperty('--cloud-rotation', `${cloudRotationDegrees}deg`);
                cloudElement.style.setProperty('--shift-x', `${shiftHorizontalPixels}px`);
                cloudElement.style.setProperty('--shift-y', `${shiftVerticalPixels}px`);
                cloudElement.style.setProperty('--shift-rotation', `${shiftRotationDegrees}deg`);
                cloudElement.style.setProperty('--initial-opacity', cloudOpacity);

                cloudElement.style.left = `${horizontalPercentage}%`;
                cloudElement.style.top = `${verticalPercentage}%`;

                this.cloudsOverlayContainer.appendChild(cloudElement);

                this.spawnedCloudsList.push({
                    element: cloudElement,
                    horizontalPercentage: horizontalPercentage,
                    verticalPercentage: verticalPercentage,
                    baseOpacity: cloudOpacity
                });
            }
        }
    }

    resetClouds() {
        this.spawnedCloudsList.forEach(cloud => {
            cloud.element.classList.remove('cleared');
            cloud.element.style.transitionDelay = '0s';
            cloud.element.style.visibility = 'visible';
            cloud.element.style.setProperty('--initial-opacity', cloud.baseOpacity);
        });
    }

    updateCloudsProjection() {
        if (!this.cloudsOverlayContainer || this.spawnedCloudsList.length === 0) {
            return;
        }

        const containerWidth = this.cloudsOverlayContainer.offsetWidth;
        const containerHeight = this.cloudsOverlayContainer.offsetHeight;

        if (containerWidth === 0 || containerHeight === 0) {
            return;
        }

        const levelOneElement = document.getElementById('level-1');
        const levelTwoElement = document.getElementById('level-2');

        if (!levelOneElement || !levelTwoElement) {
            return;
        }

        const levelOneHeight = levelOneElement.offsetHeight;
        const levelTwoHeight = levelTwoElement.offsetHeight;
        const levelTwoTop = levelTwoElement.offsetTop;

        const viewportHeight = this.board.parentElement.offsetHeight || window.innerHeight;
        const boardTransform = window.getComputedStyle(this.board).transform;
        let translateY = 0;

        if (boardTransform && boardTransform !== 'none') {
            const matrixValues = boardTransform.split('(')[1].split(')')[0].split(',');
            if (matrixValues.length === 6) {
                translateY = parseFloat(matrixValues[5]);
            } else if (matrixValues.length === 16) {
                translateY = parseFloat(matrixValues[13]);
            }
        }

        const ravanElement = document.getElementById('ravan-character');
        let ravanX = 0;
        let ravanY = 0;

        if (ravanElement) {
            const computedStyle = window.getComputedStyle(ravanElement);
            ravanX = parseFloat(computedStyle.left) || 0;
            ravanY = parseFloat(computedStyle.top) || 0;
        }

        const revealSources = [];

        revealSources.push({
            horizontalCoordinatePixels: ravanX,
            verticalCoordinatePixels: ravanY
        });

        this.visitedNodeIdentifiers.forEach(nodeIdentifier => {
            const nodeConfig = this.getNodeData(nodeIdentifier);

            if (nodeConfig) {
                const level = nodeIdentifier.startsWith('level_two') ? 2 : 1;
                const position = this.getNodePixelPosition(nodeConfig, level, containerWidth, levelOneHeight, levelTwoHeight, levelTwoTop);

                revealSources.push(position);
            }
        });

        const adjacentNodePositions = [];

        this.revealedNodeIdentifiers.forEach(nodeIdentifier => {
            if (!this.visitedNodeIdentifiers.has(nodeIdentifier)) {
                const nodeConfig = this.getNodeData(nodeIdentifier);
                if (nodeConfig) {
                    const level = nodeIdentifier.startsWith('level_two') ? 2 : 1;
                    const position = this.getNodePixelPosition(nodeConfig, level, containerWidth, levelOneHeight, levelTwoHeight, levelTwoTop);
                    adjacentNodePositions.push(position);
                }
            }
        });

        const clearingRadius = 220;
        const cloudSize = 400;

        const adjacentCloudsToKeep = new Set();
        const adjacentCloudsToClear = new Set();

        adjacentNodePositions.forEach(position => {
            const candidates = [];

            this.spawnedCloudsList.forEach(cloud => {
                const cloudX = (cloud.horizontalPercentage / 100) * containerWidth;
                const cloudY = (cloud.verticalPercentage / 100) * containerHeight;

                const differenceX = cloudX - position.horizontalCoordinatePixels;
                const differenceY = cloudY - position.verticalCoordinatePixels;
                const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY);

                if (distance < 180) {
                    candidates.push({ cloud, distance });
                }
            });

            candidates.sort((first, second) => first.distance - second.distance);

            const countToKeep = Math.min(3, candidates.length);

            for (let index = 0; index < countToKeep; index++) {
                adjacentCloudsToKeep.add(candidates[index].cloud);
            }

            for (let index = countToKeep; index < candidates.length; index++) {
                adjacentCloudsToClear.add(candidates[index].cloud);
            }
        });

        adjacentCloudsToKeep.forEach(cloud => {
            adjacentCloudsToClear.delete(cloud);
        });

        this.spawnedCloudsList.forEach(cloud => {
            const cloudX = (cloud.horizontalPercentage / 100) * containerWidth;
            const cloudY = (cloud.verticalPercentage / 100) * containerHeight;

            const cloudTopInViewport = (cloudY - cloudSize / 2) + translateY;
            const cloudBottomInViewport = (cloudY + cloudSize / 2) + translateY;

            const isVisibleInViewport = (cloudBottomInViewport >= -100) && (cloudTopInViewport <= viewportHeight + 100);

            if (!isVisibleInViewport) {
                cloud.element.style.visibility = 'hidden';
                return;
            }

            cloud.element.style.visibility = 'visible';

            let minDistanceToRevealSource = Infinity;

            revealSources.forEach(source => {
                const differenceX = cloudX - source.horizontalCoordinatePixels;
                const differenceY = cloudY - source.verticalCoordinatePixels;
                const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY);

                if (distance < minDistanceToRevealSource) {
                    minDistanceToRevealSource = distance;
                }
            });

            if (minDistanceToRevealSource < clearingRadius) {
                cloud.element.classList.add('cleared');
            } else if (adjacentCloudsToKeep.has(cloud)) {
                cloud.element.style.setProperty('--initial-opacity', 0.05);
                cloud.element.classList.remove('cleared');
            } else if (adjacentCloudsToClear.has(cloud)) {
                cloud.element.classList.add('cleared');
            } else {
                cloud.element.style.setProperty('--initial-opacity', cloud.baseOpacity);
                cloud.element.classList.remove('cleared');
            }
        });
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
