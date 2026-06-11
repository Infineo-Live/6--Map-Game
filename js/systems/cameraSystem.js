// Camera System - Handles centering Ravan in the landscape viewport and level transitions

export class CameraSystem {
    constructor(viewportElement, boardElement) {
        this.viewport = viewportElement;
        this.board = boardElement;
        this.currentX = 0;
        this.currentY = 0;
        this.zoomScale = 1.0; // Reset camera zoom to full width to prevent black borders
    }

    /**
     * Update camera translation to frame Ravan on his current node.
     * @param {Object} node - The current node Ravan occupies.
     * @param {number} level - Current active level (1 or 2).
     * @param {boolean} smooth - Whether to animate the camera movement.
     */
    update(node, level, smooth = true) {
        const viewportWidth = this.viewport.clientWidth;
        const viewportHeight = this.viewport.clientHeight;

        const level1 = document.getElementById('level-1');
        const level2 = document.getElementById('level-2');
        const ravan = document.getElementById('ravan-character');

        if (!level1 || !level2 || !ravan) return;

        const scale = this.zoomScale;

        // Get absolute pixel coordinates of the node relative to the game board
        const nodePos = this.getNodeBoardPosition(node, level, level1, level2);

        // Target coordinates to center Ravan in the viewport (taking scale into account)
        let targetX = viewportWidth / 2 - nodePos.x * scale;
        let targetY = viewportHeight / 2 - nodePos.y * scale;

        // Determine boundaries based on active level to prevent scrolling past borders
        const level1Height = level1.offsetHeight;
        const level2Height = level2.offsetHeight;
        const level2Top = level2.offsetTop;
        const totalBoardHeight = this.board.offsetHeight;

        const boardWidth = this.board.offsetWidth;
        // Disable horizontal panning if board fits within screen width
        if (boardWidth * scale <= viewportWidth) {
            targetX = (viewportWidth - boardWidth * scale) / 2; // Center horizontally
        } else {
            // Clamp X within board limits
            targetX = Math.max(viewportWidth - boardWidth * scale, Math.min(0, targetX));
        }

        // Clamp Y based on active level bounds
        if (level === 1) {
            if (level1Height * scale <= viewportHeight) {
                targetY = (viewportHeight - level1Height * scale) / 2;
            } else {
                const minY = -(level1Height * scale - viewportHeight);
                targetY = Math.max(minY, Math.min(0, targetY));
            }
        } else if (level === 2) {
            if (level2Height * scale <= viewportHeight) {
                targetY = -level2Top * scale + (viewportHeight - level2Height * scale) / 2;
            } else {
                const minY = -(totalBoardHeight * scale - viewportHeight);
                const maxY = -level2Top * scale;
                targetY = Math.max(minY, Math.min(maxY, targetY));
            }
        }

        this.applyTransform(targetX, targetY, smooth);
    }

    /**
     * Get Ravan's absolute coordinates relative to the entire stacked board
     */
    getNodeBoardPosition(node, level, level1, level2) {
        const boardWidth = this.board.offsetWidth;
        const x = (node.x / 100) * boardWidth;

        let y = 0;
        if (level === 1) {
            y = (node.y / 100) * level1.offsetHeight;
        } else {
            y = level2.offsetTop + (node.y / 100) * level2.offsetHeight;
        }

        return { x, y };
    }

    /**
     * Pan camera directly to a board position (used during transitional animations)
     */
    panTo(x, y, smooth = true) {
        this.applyTransform(x, y, smooth);
    }

    applyTransform(x, y, smooth) {
        this.currentX = x;
        this.currentY = y;
        this.board.style.transition = smooth ? 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        this.board.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${this.zoomScale})`;
    }

    /**
     * Run the multi-stage vertical and horizontal level transition
     * @param {Object} startNode - Level 2 starting node object.
     * @returns {Promise} Resolves when the transition finishes.
     */
    transitionToLevel2(startNode) {
        return new Promise((resolve) => {
            const level1 = document.getElementById('level-1');
            const level2 = document.getElementById('level-2');
            const viewportWidth = this.viewport.clientWidth;
            const viewportHeight = this.viewport.clientHeight;

            if (!level1 || !level2) {
                resolve();
                return;
            }

            const scale = this.zoomScale;
            const boardWidth = this.board.offsetWidth;

            // 1. First scroll camera downwards to top of Level 2
            const targetY = -level2.offsetTop * scale;
            let targetX = (viewportWidth - boardWidth * scale) / 2; // Center horizontally

            // Disable player actions while panning
            this.panTo(targetX, targetY, true);

            // Wait for vertical pan to complete (1.5s transition)
            setTimeout(() => {
                // 2. Spawn Ravan at Level 2 Start
                const ravan = document.getElementById('ravan-character');
                const nodePos = this.getNodeBoardPosition(startNode, 2, level1, level2);
                ravan.style.left = `${nodePos.x}px`;
                ravan.style.top = `${nodePos.y}px`;
                ravan.classList.remove('hidden');

                // 3. Pan horizontally a little to the right to frame Ravan's start position (at 75% X)
                let finalX = viewportWidth / 2 - nodePos.x * scale;
                if (boardWidth * scale > viewportWidth) {
                    finalX = Math.max(viewportWidth - boardWidth * scale, Math.min(0, finalX));
                } else {
                    finalX = (viewportWidth - boardWidth * scale) / 2;
                }

                // Smoothly adjust camera framing
                setTimeout(() => {
                    this.panTo(finalX, targetY, true);
                    // Wait for horizontal adjustments
                    setTimeout(resolve, 1500);
                }, 400);

            }, 1600);
        });
    }
}
