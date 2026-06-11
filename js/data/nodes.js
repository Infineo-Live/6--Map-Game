export const LEVEL_1_NODES = {
    level_one_row_one_left: {
        identifier: 'level_one_row_one_left',
        horizontalPercentage: 25,
        verticalPercentage: 15,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Dense Brambles',
        connectedFromNodeIdentifiers: ['level_one_row_one_center'],
        connectedToNodeIdentifiers: ['level_one_row_one_center_middle']
    },

    level_one_row_one_center: {
        identifier: 'level_one_row_one_center',
        horizontalPercentage: 50,
        verticalPercentage: 15,
        nodeType: 'start',
        nodeLabel: 'Level 1 Start',
        connectedFromNodeIdentifiers: [],
        connectedToNodeIdentifiers: ['level_one_row_one_left', 'level_one_row_one_right']
    },

    level_one_row_one_center_middle: {
        identifier: 'level_one_row_one_center_middle',
        horizontalPercentage: 50,
        verticalPercentage: 24,
        nodeType: 'normal',
        nodeLabel: 'Forest Pathpost',
        connectedFromNodeIdentifiers: ['level_one_row_one_left'],
        connectedToNodeIdentifiers: ['level_one_row_two_left']
    },

    level_one_row_one_right: {
        identifier: 'level_one_row_one_right',
        horizontalPercentage: 75,
        verticalPercentage: 15,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Deep Chasm',
        connectedFromNodeIdentifiers: ['level_one_row_one_center'],
        connectedToNodeIdentifiers: []
    },

    level_one_row_two_left: {
        identifier: 'level_one_row_two_left',
        horizontalPercentage: 25,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'Mountain Trail',
        connectedFromNodeIdentifiers: ['level_one_row_two_center', 'level_one_row_one_center_middle'],
        connectedToNodeIdentifiers: ['level_one_row_three_left']
    },

    level_one_row_two_center: {
        identifier: 'level_one_row_two_center',
        horizontalPercentage: 50,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'Ancient Pass',
        connectedFromNodeIdentifiers: [],
        connectedToNodeIdentifiers: ['level_one_row_two_left', 'level_one_row_two_right']
    },

    level_one_row_two_right: {
        identifier: 'level_one_row_two_right',
        horizontalPercentage: 75,
        verticalPercentage: 33,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Boulder Blockade',
        connectedFromNodeIdentifiers: ['level_one_row_two_center'],
        connectedToNodeIdentifiers: []
    },

    level_one_row_three_left: {
        identifier: 'level_one_row_three_left',
        horizontalPercentage: 25,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Forest Edge',
        connectedFromNodeIdentifiers: ['level_one_row_two_left'],
        connectedToNodeIdentifiers: ['level_one_row_three_center']
    },

    level_one_row_three_center: {
        identifier: 'level_one_row_three_center',
        horizontalPercentage: 50,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Narrow Bridge',
        connectedFromNodeIdentifiers: ['level_one_row_three_left'],
        connectedToNodeIdentifiers: ['level_one_row_four_center']
    },

    level_one_row_four_center: {
        identifier: 'level_one_row_four_center',
        horizontalPercentage: 50,
        verticalPercentage: 72,
        nodeType: 'normal',
        nodeLabel: 'Stony Descent',
        connectedFromNodeIdentifiers: ['level_one_row_three_center'],
        connectedToNodeIdentifiers: ['level_one_row_four_right', 'level_one_row_four_center_middle']
    },

    level_one_row_four_center_middle: {
        identifier: 'level_one_row_four_center_middle',
        horizontalPercentage: 50,
        verticalPercentage: 79,
        nodeType: 'normal',
        nodeLabel: 'Lower Valley',
        connectedFromNodeIdentifiers: ['level_one_row_four_center'],
        connectedToNodeIdentifiers: ['level_one_finish']
    },

    level_one_row_four_right: {
        identifier: 'level_one_row_four_right',
        horizontalPercentage: 75,
        verticalPercentage: 72,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Steep Cliff',
        connectedFromNodeIdentifiers: ['level_one_row_four_center'],
        connectedToNodeIdentifiers: []
    },

    level_one_finish: {
        identifier: 'level_one_finish',
        horizontalPercentage: 50,
        verticalPercentage: 90,
        nodeType: 'finish',
        nodeLabel: 'Finish Level 1',
        connectedFromNodeIdentifiers: ['level_one_row_four_center_middle'],
        connectedToNodeIdentifiers: []
    }
};

export const LEVEL_2_NODES = {
    level_two_row_one_left: {
        identifier: 'level_two_row_one_left',
        horizontalPercentage: 25,
        verticalPercentage: 15,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Poisonous Thicket',
        connectedFromNodeIdentifiers: ['level_two_row_one_left_center'],
        connectedToNodeIdentifiers: []
    },

    level_two_row_one_left_center: {
        identifier: 'level_two_row_one_left_center',
        horizontalPercentage: 25,
        verticalPercentage: 20,
        nodeType: 'normal',
        nodeLabel: 'Misty Cliff',
        connectedFromNodeIdentifiers: ['level_two_row_two_left'],
        connectedToNodeIdentifiers: ['level_two_row_one_left']
    },

    level_two_row_one_right: {
        identifier: 'level_two_row_one_right',
        horizontalPercentage: 75,
        verticalPercentage: 15,
        nodeType: 'start',
        nodeLabel: 'Level 2 Start',
        connectedFromNodeIdentifiers: [],
        connectedToNodeIdentifiers: ['level_two_row_one_right_middle']
    },

    level_two_row_one_right_middle: {
        identifier: 'level_two_row_one_right_middle',
        horizontalPercentage: 75,
        verticalPercentage: 24,
        nodeType: 'normal',
        nodeLabel: 'Misty Pathpost',
        connectedFromNodeIdentifiers: ['level_two_row_one_right'],
        connectedToNodeIdentifiers: ['level_two_row_two_right']
    },

    level_two_row_two_left: {
        identifier: 'level_two_row_two_left',
        horizontalPercentage: 25,
        verticalPercentage: 33,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Dark Cavern',
        connectedFromNodeIdentifiers: ['level_two_row_two_center'],
        connectedToNodeIdentifiers: ['level_two_row_one_left_center']
    },

    level_two_row_two_center: {
        identifier: 'level_two_row_two_center',
        horizontalPercentage: 50,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'Rocky Valley',
        connectedFromNodeIdentifiers: ['level_two_row_two_right'],
        connectedToNodeIdentifiers: ['level_two_row_two_left', 'level_two_row_two_center_middle']
    },

    level_two_row_two_center_middle: {
        identifier: 'level_two_row_two_center_middle',
        horizontalPercentage: 50,
        verticalPercentage: 41,
        nodeType: 'normal',
        nodeLabel: 'Middle Passpost',
        connectedFromNodeIdentifiers: ['level_two_row_two_center'],
        connectedToNodeIdentifiers: ['level_two_row_three_center']
    },

    level_two_row_two_right: {
        identifier: 'level_two_row_two_right',
        horizontalPercentage: 75,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'High Pass',
        connectedFromNodeIdentifiers: ['level_two_row_one_right_middle'],
        connectedToNodeIdentifiers: ['level_two_row_two_center']
    },

    level_two_row_three_left: {
        identifier: 'level_two_row_three_left',
        horizontalPercentage: 25,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Ruined Bridge',
        connectedFromNodeIdentifiers: ['level_two_row_three_left_center'],
        connectedToNodeIdentifiers: ['level_two_row_four_left_center']
    },

    level_two_row_three_left_center: {
        identifier: 'level_two_row_three_left_center',
        horizontalPercentage: 36.5,
        verticalPercentage: 54.5,
        nodeType: 'normal',
        nodeLabel: 'Left Trailpost',
        connectedFromNodeIdentifiers: ['level_two_row_three_center'],
        connectedToNodeIdentifiers: ['level_two_row_three_left', 'level_two_row_four_center']
    },

    level_two_row_three_center: {
        identifier: 'level_two_row_three_center',
        horizontalPercentage: 50,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Misty Ridge',
        connectedFromNodeIdentifiers: ['level_two_row_two_center_middle'],
        connectedToNodeIdentifiers: ['level_two_row_three_left_center', 'level_two_row_three_right_center']
    },

    level_two_row_three_right_center: {
        identifier: 'level_two_row_three_right_center',
        horizontalPercentage: 61.5,
        verticalPercentage: 54.5,
        nodeType: 'normal',
        nodeLabel: 'Right Trailpost',
        connectedFromNodeIdentifiers: ['level_two_row_three_center'],
        connectedToNodeIdentifiers: ['level_two_row_three_right', 'level_two_row_four_center']
    },

    level_two_row_three_right: {
        identifier: 'level_two_row_three_right',
        horizontalPercentage: 81,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Steep Ledge',
        connectedFromNodeIdentifiers: ['level_two_row_three_right_center'],
        connectedToNodeIdentifiers: ['level_two_row_four_right']
    },

    level_two_row_four_left_center: {
        identifier: 'level_two_row_four_left_center',
        horizontalPercentage: 18,
        verticalPercentage: 62,
        nodeType: 'normal',
        nodeLabel: 'Cliff Pathway',
        connectedFromNodeIdentifiers: ['level_two_row_three_left'],
        connectedToNodeIdentifiers: ['level_two_row_four_left']
    },

    level_two_row_four_left: {
        identifier: 'level_two_row_four_left',
        horizontalPercentage: 15,
        verticalPercentage: 72,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Bottomless Pit',
        connectedFromNodeIdentifiers: ['level_two_row_four_left_center'],
        connectedToNodeIdentifiers: []
    },

    level_two_row_four_center: {
        identifier: 'level_two_row_four_center',
        horizontalPercentage: 48,
        verticalPercentage: 68,
        nodeType: 'normal',
        nodeLabel: 'Path of Trials',
        connectedFromNodeIdentifiers: ['level_two_row_three_right_center', 'level_two_row_three_left_center'],
        connectedToNodeIdentifiers: ['level_two_finish']
    },

    level_two_row_four_right: {
        identifier: 'level_two_row_four_right',
        horizontalPercentage: 86,
        verticalPercentage: 68,
        nodeType: 'normal',
        nodeLabel: 'Stony Steps',
        connectedFromNodeIdentifiers: ['level_two_row_three_right'],
        connectedToNodeIdentifiers: ['level_two_row_five_right']
    },

    level_two_row_five_right: {
        identifier: 'level_two_row_five_right',
        horizontalPercentage: 85,
        verticalPercentage: 85,
        nodeType: 'finish',
        nodeLabel: 'Hidden Cave',
        connectedFromNodeIdentifiers: ['level_two_row_four_right'],
        connectedToNodeIdentifiers: []
    },

    level_two_finish: {
        identifier: 'level_two_finish',
        horizontalPercentage: 47,
        verticalPercentage: 86,
        nodeType: 'finish',
        nodeLabel: 'Finish Level 2',
        connectedFromNodeIdentifiers: ['level_two_row_four_center'],
        connectedToNodeIdentifiers: []
    }
};

export function getNodeCoordinates(nodeIdentifier) {
    if (typeof document !== 'undefined') {
        const nodeElement = document.getElementById(nodeIdentifier);

        if (nodeElement) {
            const computedStyle = window.getComputedStyle(nodeElement);
            const horizontalPercentage = parseFloat(computedStyle.getPropertyValue('--horizontal-percentage'));
            const verticalPercentage = parseFloat(computedStyle.getPropertyValue('--vertical-percentage'));

            if (!isNaN(horizontalPercentage) && !isNaN(verticalPercentage)) {
                return { horizontalPercentage, verticalPercentage };
            }
        }
    }

    const nodeConfiguration = LEVEL_1_NODES[nodeIdentifier] || LEVEL_2_NODES[nodeIdentifier];

    if (nodeConfiguration) {
        return {
            horizontalPercentage: nodeConfiguration.horizontalPercentage,
            verticalPercentage: nodeConfiguration.verticalPercentage
        };
    }

    return { horizontalPercentage: 0, verticalPercentage: 0 };
}

export function getNodeConnections(nodeIdentifier) {
    if (typeof document !== 'undefined') {
        const nodeElement = document.getElementById(nodeIdentifier);

        if (nodeElement) {
            const computedStyle = window.getComputedStyle(nodeElement);
            const rawConnectedFrom = computedStyle.getPropertyValue('--connected-from');
            const rawConnectedTo = computedStyle.getPropertyValue('--connected-to');

            const parseConnections = (rawString) => {
                if (!rawString) {
                    return [];
                }

                const cleanedString = rawString.replace(/['"]/g, '').trim();

                if (!cleanedString) {
                    return [];
                }

                return cleanedString.split(/\s+/);
            };

            return {
                connectedFromNodeIdentifiers: parseConnections(rawConnectedFrom),
                connectedToNodeIdentifiers: parseConnections(rawConnectedTo)
            };
        }
    }

    const nodeConfiguration = LEVEL_1_NODES[nodeIdentifier] || LEVEL_2_NODES[nodeIdentifier];

    if (nodeConfiguration) {
        return {
            connectedFromNodeIdentifiers: nodeConfiguration.connectedFromNodeIdentifiers,
            connectedToNodeIdentifiers: nodeConfiguration.connectedToNodeIdentifiers
        };
    }

    return { connectedFromNodeIdentifiers: [], connectedToNodeIdentifiers: [] };
}

export function getNodeType(nodeIdentifier) {
    if (typeof document !== 'undefined') {
        const nodeElement = document.getElementById(nodeIdentifier);

        if (nodeElement) {
            const computedStyle = window.getComputedStyle(nodeElement);
            const rawNodeType = computedStyle.getPropertyValue('--node-type');

            if (rawNodeType) {
                const cleanedNodeType = rawNodeType.replace(/['"]/g, '').trim();

                if (cleanedNodeType) {
                    return cleanedNodeType;
                }
            }
        }
    }

    const nodeConfiguration = LEVEL_1_NODES[nodeIdentifier] || LEVEL_2_NODES[nodeIdentifier];

    if (nodeConfiguration) {
        return nodeConfiguration.nodeType;
    }

    return 'normal';
}

