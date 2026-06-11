// Exploration System - Tracks visited/revealed nodes and rendering of nodes, clouds, and paths

import { LEVEL_1_NODES, LEVEL_2_NODES } from '../data/nodes.js';

export class ExplorationSystem {
    constructor(gameBoard) {
        this.board = gameBoard;
        this.visited = new Set();  // Set of node IDs Ravan has landed on
        this.revealed = new Set(); // Set of node IDs currently discovered (shining or visited)
        this.svg = document.querySelector('.path-overlay');
        this.paths = []; // List of path elements drawn in SVG
    }

    /**
     * Initialize Level nodes and paths
     */
    initLevel(level) {
        const nodesData = level === 1 ? LEVEL_1_NODES : LEVEL_2_NODES;
        const container = document.getElementById(`level-${level}-nodes`);
        if (!container) return;

        container.innerHTML = '';
        
        // Reset state only on starting a fresh game (Level 1 initialization)
        if (level === 1) {
            this.visited.clear();
            this.revealed.clear();
            this.paths = [];
        }

        // 1. Create Node DOM Elements
        Object.values(nodesData).forEach(node => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'map-node';
            nodeEl.id = node.id;
            nodeEl.style.left = `${node.x}%`;
            nodeEl.style.top = `${node.y}%`;

            // Create isometric stone disc
            const stone = document.createElement('div');
            stone.className = 'node-stone';
            nodeEl.appendChild(stone);

            // Create multi-layered cloud deck (3 layers)
            const clouds = document.createElement('div');
            clouds.className = 'cloud-deck';
            
            const cloud1 = document.createElement('img');
            cloud1.src = 'assets/images/clouds/cloud-1.png';
            cloud1.className = 'cloud-layer c-1';
            
            const cloud2 = document.createElement('img');
            cloud2.src = 'assets/images/clouds/cloud-2.png';
            cloud2.className = 'cloud-layer c-2';
            
            const cloud3 = document.createElement('img');
            cloud3.src = 'assets/images/clouds/cloud-1.png';
            cloud3.className = 'cloud-layer c-3';

            clouds.appendChild(cloud1);
            clouds.appendChild(cloud2);
            clouds.appendChild(cloud3);
            nodeEl.appendChild(clouds);

            container.appendChild(nodeEl);
        });

        // 2. Build Paths references
        this.rebuildPathsData(level, nodesData);
    }

    /**
     * Compile path connections to avoid duplicates (A->B and B->A)
     * Preserves paths of other levels to ensure visual persistency.
     */
    rebuildPathsData(level, nodesData) {
        // Keep paths from other levels
        this.paths = this.paths.filter(p => p.level !== level);
        const seen = new Set();

        Object.values(nodesData).forEach(node => {
            node.connections.forEach(connId => {
                const pairId = [node.id, connId].sort().join('-');
                if (!seen.has(pairId)) {
                    seen.add(pairId);
                    this.paths.push({
                        id: pairId,
                        from: node.id,
                        to: connId,
                        level: level
                    });
                }
            });
        });
    }

    /**
     * Redraw the SVG paths connecting nodes based on the current layout
     */
    drawPaths() {
        if (!this.svg) return;
        this.svg.innerHTML = '';

        const level1 = document.getElementById('level-1');
        const level2 = document.getElementById('level-2');
        const boardWidth = this.board.offsetWidth;
        const boardHeight = this.board.offsetHeight;

        if (!level1 || !level2) return;

        // Set explicit pixel dimensions on SVG to ensure 1-to-1 coordinate mapping
        this.svg.setAttribute('width', boardWidth);
        this.svg.setAttribute('height', boardHeight);

        const level1Height = level1.offsetHeight;
        const level2Height = level2.offsetHeight;
        const level2Top = level2.offsetTop;

        this.paths.forEach(path => {
            const fromNode = this.getNodeData(path.from);
            const toNode = this.getNodeData(path.to);

            if (!fromNode || !toNode) return;

            // Calculate pixel coords of endpoints relative to the game board
            const p1 = this.getNodePixelPos(fromNode, path.level, boardWidth, level1Height, level2Height, level2Top);
            const p2 = this.getNodePixelPos(toNode, path.level, boardWidth, level1Height, level2Height, level2Top);

            // Create SVG Line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            line.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
            
            // Determine styling class based on exploration state
            let pathClass = 'map-path hidden';

            const fromVisited = this.visited.has(path.from);
            const toVisited = this.visited.has(path.to);
            const fromRevealed = this.revealed.has(path.from);
            const toRevealed = this.revealed.has(path.to);

            if (fromVisited && toVisited) {
                // Traversed path: solid gold
                pathClass = 'map-path solid-traversed';
            } else if ((fromVisited && toRevealed) || (toVisited && fromRevealed)) {
                // Connection between visited and revealed adjacent node: bright dotted active
                pathClass = 'map-path dotted-active';
            } else if (fromRevealed || toRevealed) {
                // Connection to adjacent nodes: faint preview line
                pathClass = 'map-path faint-preview';
            }

            line.setAttribute('class', pathClass);
            line.setAttribute('id', `path-${path.id}`);
            this.svg.appendChild(line);
        });
    }

    /**
     * Resolve node position to absolute board pixels
     */
    getNodePixelPos(node, level, boardWidth, l1Height, l2Height, l2Top) {
        const x = (node.x / 100) * boardWidth;
        const levelHeight = level === 1 ? l1Height : l2Height;
        const offsetTop = level === 1 ? 0 : l2Top;
        const y = offsetTop + (node.y / 100) * levelHeight;
        return { x, y };
    }

    /**
     * Get Node specifications by ID
     */
    getNodeData(nodeId) {
        return LEVEL_1_NODES[nodeId] || LEVEL_2_NODES[nodeId] || null;
    }

    /**
     * Handle Ravan landing on a node: update states, clouds, and glows
     * @param {string} nodeId - Node Ravan landed on.
     * @param {Object} levelNodes - Config nodes for active level.
     */
    revealNode(nodeId, levelNodes) {
        // Mark current node as visited
        this.visited.add(nodeId);
        this.revealed.add(nodeId);

        const node = levelNodes[nodeId];
        if (!node) return;

        // Make all connected nodes revealed/adjacent (shining through clouds)
        node.connections.forEach(connId => {
            if (levelNodes[connId]) {
                this.revealed.add(connId);
            }
        });

        // Update DOM classes for nodes
        Object.values(levelNodes).forEach(n => {
            const el = document.getElementById(n.id);
            if (!el) return;

            // Remove previous statuses
            el.classList.remove('visited', 'revealed', 'shining');

            if (this.visited.has(n.id)) {
                el.classList.add('visited', 'revealed');
            } else if (this.revealed.has(n.id)) {
                el.classList.add('shining');
            }
            
            // Specifically add revealed class for dead-end or finish if visited
            if (this.visited.has(n.id)) {
                if (n.type === 'dead-end') {
                    el.classList.add('dead-end');
                } else if (n.type === 'finish') {
                    el.classList.add('finish');
                }
            }
        });

        // Redraw SVG path classes
        this.drawPaths();
    }
}
