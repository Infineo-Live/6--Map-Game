// Movement System - Coordinates validation, animations, and path traversal for Ravan

export class MovementSystem {
    constructor(ravanElement, gameBoard) {
        this.ravan = ravanElement;
        this.board = gameBoard;
        this.currentNode = null;
        this.isMoving = false;
    }

    /**
     * Set Ravan's current node immediately without animation
     */
    setCurrentNode(node, level) {
        this.currentNode = node;
        this.isMoving = false;
        this.alignRavanToNode(node, level);
    }

    /**
     * Position Ravan sprite directly over a node
     */
    alignRavanToNode(node, level) {
        const level1 = document.getElementById('level-1');
        const level2 = document.getElementById('level-2');
        if (!level1 || !level2) return;

        const boardWidth = this.board.offsetWidth;
        const x = (node.x / 100) * boardWidth;

        let y = 0;
        if (level === 1) {
            y = (node.y / 100) * level1.offsetHeight;
        } else {
            y = level2.offsetTop + (node.y / 100) * level2.offsetHeight;
        }

        // Apply style positioning
        this.ravan.style.left = `${x}px`;
        this.ravan.style.top = `${y}px`;
    }

    /**
     * Move Ravan to a target node with path verification and walk animation
     */
    moveTo(targetNode, level, levelNodes) {
        return new Promise((resolve, reject) => {
            if (this.isMoving) {
                reject('Ravan is already moving');
                return;
            }

            // Verify adjacency
            if (!this.currentNode.connections.includes(targetNode.id)) {
                reject('Target node is not adjacent');
                return;
            }

            this.isMoving = true;
            this.ravan.classList.add('walking');

            // Align Ravan to new coordinates (triggers CSS transition)
            this.alignRavanToNode(targetNode, level);

            // Wait for movement transition to finish (1000ms duration matching CSS)
            setTimeout(() => {
                this.ravan.classList.remove('walking');
                this.currentNode = targetNode;
                this.isMoving = false;
                
                // Show Dead End instruction banner if reached
                this.updateInstructionBanner(targetNode);

                resolve(targetNode);
            }, 1050);
        });
    }

    /**
     * Manage the instruction banner display for dead ends and finish nodes
     */
    updateInstructionBanner(node) {
        const banner = document.getElementById('instruction-banner');
        const bannerText = banner ? banner.querySelector('.banner-text') : null;

        if (!banner || !bannerText) return;

        if (node.type === 'dead-end') {
            bannerText.textContent = `${node.label}. Backtrack to another path.`;
            banner.classList.add('visible');
        } else if (node.type === 'finish') {
            bannerText.textContent = 'Destination Reached!';
            banner.classList.add('visible');
            setTimeout(() => banner.classList.remove('visible'), 3000);
        } else {
            // Hide for normal nodes
            banner.classList.remove('visible');
        }
    }
}
