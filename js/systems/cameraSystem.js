import { getNodeCoordinates } from '../data/nodes.js';

export class CameraSystem {
    constructor(viewportElement, boardElement) {
        this.viewport = viewportElement;
        this.board = boardElement;
        this.currentHorizontalOffset = 0;
        this.currentVerticalOffset = 0;
        this.zoomScaleFactor = 1.0;
    }

    update(nodeConfiguration, levelNumber, isSmoothTransition = true) {
        const viewportWidthPixels = this.viewport.clientWidth;
        const viewportHeightPixels = this.viewport.clientHeight;

        const levelOneElement = document.getElementById('level-1');
        const levelTwoElement = document.getElementById('level-2');
        const ravanCharacterElement = document.getElementById('ravan-character');

        if (!levelOneElement || !levelTwoElement || !ravanCharacterElement) {
            return;
        }

        const scaleFactor = this.zoomScaleFactor;
        const nodeBoardPosition = this.getNodeBoardPosition(nodeConfiguration, levelNumber, levelOneElement, levelTwoElement);

        let targetHorizontalOffsetPixels = viewportWidthPixels / 2 - nodeBoardPosition.horizontalOffsetPixels * scaleFactor;
        let targetVerticalOffsetPixels = viewportHeightPixels / 2 - nodeBoardPosition.verticalOffsetPixels * scaleFactor;

        const levelOneHeightPixels = levelOneElement.offsetHeight;
        const levelTwoHeightPixels = levelTwoElement.offsetHeight;
        const levelTwoTopOffsetPixels = levelTwoElement.offsetTop;
        const totalBoardHeightPixels = this.board.offsetHeight;
        const boardWidthPixels = this.board.offsetWidth;

        if (boardWidthPixels * scaleFactor <= viewportWidthPixels) {
            targetHorizontalOffsetPixels = (viewportWidthPixels - boardWidthPixels * scaleFactor) / 2;
        } else {
            targetHorizontalOffsetPixels = Math.max(viewportWidthPixels - boardWidthPixels * scaleFactor, Math.min(0, targetHorizontalOffsetPixels));
        }

        if (levelNumber === 1) {
            if (levelOneHeightPixels * scaleFactor <= viewportHeightPixels) {
                targetVerticalOffsetPixels = (viewportHeightPixels - levelOneHeightPixels * scaleFactor) / 2;
            } else {
                const minimumVerticalOffsetPixels = -(levelOneHeightPixels * scaleFactor - viewportHeightPixels);
                targetVerticalOffsetPixels = Math.max(minimumVerticalOffsetPixels, Math.min(0, targetVerticalOffsetPixels));
            }
        } else if (levelNumber === 2) {
            if (levelTwoHeightPixels * scaleFactor <= viewportHeightPixels) {
                targetVerticalOffsetPixels = -levelTwoTopOffsetPixels * scaleFactor + (viewportHeightPixels - levelTwoHeightPixels * scaleFactor) / 2;
            } else {
                const minimumVerticalOffsetPixels = -(totalBoardHeightPixels * scaleFactor - viewportHeightPixels);
                const maximumVerticalOffsetPixels = -levelTwoTopOffsetPixels * scaleFactor;
                targetVerticalOffsetPixels = Math.max(minimumVerticalOffsetPixels, Math.min(maximumVerticalOffsetPixels, targetVerticalOffsetPixels));
            }
        }

        this.applyTransform(targetHorizontalOffsetPixels, targetVerticalOffsetPixels, isSmoothTransition);
    }

    getNodeBoardPosition(nodeConfiguration, levelNumber, levelOneElement, levelTwoElement) {
        const boardWidthPixels = this.board.offsetWidth;
        const nodeCoordinates = getNodeCoordinates(nodeConfiguration.identifier);
        const horizontalOffsetPixels = (nodeCoordinates.horizontalPercentage / 100) * boardWidthPixels;

        let verticalOffsetPixels = 0;
        if (levelNumber === 1) {
            verticalOffsetPixels = (nodeCoordinates.verticalPercentage / 100) * levelOneElement.offsetHeight;
        } else {
            verticalOffsetPixels = levelTwoElement.offsetTop + (nodeCoordinates.verticalPercentage / 100) * levelTwoElement.offsetHeight;
        }

        return { horizontalOffsetPixels, verticalOffsetPixels };
    }

    panTo(horizontalOffsetPixels, verticalOffsetPixels, isSmoothTransition = true) {
        this.applyTransform(horizontalOffsetPixels, verticalOffsetPixels, isSmoothTransition);
    }

    applyTransform(horizontalOffsetPixels, verticalOffsetPixels, isSmoothTransition) {
        this.currentHorizontalOffset = horizontalOffsetPixels;
        this.currentVerticalOffset = verticalOffsetPixels;
        this.board.style.transition = isSmoothTransition ? 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        this.board.style.transform = `translate3d(${horizontalOffsetPixels}px, ${verticalOffsetPixels}px, 0px) scale(${this.zoomScaleFactor})`;
    }

    transitionToLevel2(startNodeConfiguration) {
        return new Promise((resolve) => {
            const levelOneElement = document.getElementById('level-1');
            const levelTwoElement = document.getElementById('level-2');
            const viewportWidthPixels = this.viewport.clientWidth;
            const viewportHeightPixels = this.viewport.clientHeight;

            if (!levelOneElement || !levelTwoElement) {
                resolve();
                return;
            }

            const scaleFactor = this.zoomScaleFactor;
            const boardWidthPixels = this.board.offsetWidth;

            const targetVerticalOffsetPixels = -levelTwoElement.offsetTop * scaleFactor;
            let targetHorizontalOffsetPixels = (viewportWidthPixels - boardWidthPixels * scaleFactor) / 2;

            this.panTo(targetHorizontalOffsetPixels, targetVerticalOffsetPixels, true);

            setTimeout(() => {
                const ravanCharacterElement = document.getElementById('ravan-character');
                const nodeBoardPosition = this.getNodeBoardPosition(startNodeConfiguration, 2, levelOneElement, levelTwoElement);
                ravanCharacterElement.style.left = `${nodeBoardPosition.horizontalOffsetPixels}px`;
                ravanCharacterElement.style.top = `${nodeBoardPosition.verticalOffsetPixels}px`;
                ravanCharacterElement.classList.remove('hidden');

                let finalHorizontalOffsetPixels = viewportWidthPixels / 2 - nodeBoardPosition.horizontalOffsetPixels * scaleFactor;
                if (boardWidthPixels * scaleFactor > viewportWidthPixels) {
                    finalHorizontalOffsetPixels = Math.max(viewportWidthPixels - boardWidthPixels * scaleFactor, Math.min(0, finalHorizontalOffsetPixels));
                } else {
                    finalHorizontalOffsetPixels = (viewportWidthPixels - boardWidthPixels * scaleFactor) / 2;
                }

                setTimeout(() => {
                    this.panTo(finalHorizontalOffsetPixels, targetVerticalOffsetPixels, true);
                    setTimeout(resolve, 1500);
                }, 400);

            }, 1600);
        });
    }
}
