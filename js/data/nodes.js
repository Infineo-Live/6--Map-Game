export const LEVEL_1_NODES = {
    l1_r1_1: {
        identifier: 'l1_r1_1',
        horizontalPercentage: 25,
        verticalPercentage: 15,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Dense Brambles',
        connectedNodeIdentifiers: ['l1_r1_2']
    },
    l1_r1_2: {
        identifier: 'l1_r1_2',
        horizontalPercentage: 50,
        verticalPercentage: 15,
        nodeType: 'start',
        nodeLabel: 'Level 1 Start',
        connectedNodeIdentifiers: ['l1_r1_1', 'l1_r1_3', 'l1_r1_2_mid']
    },
    l1_r1_2_mid: {
        identifier: 'l1_r1_2_mid',
        horizontalPercentage: 50,
        verticalPercentage: 24,
        nodeType: 'normal',
        nodeLabel: 'Forest Pathpost',
        connectedNodeIdentifiers: ['l1_r1_2', 'l1_r2_2']
    },
    l1_r1_3: {
        identifier: 'l1_r1_3',
        horizontalPercentage: 75,
        verticalPercentage: 15,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Deep Chasm',
        connectedNodeIdentifiers: ['l1_r1_2']
    },
    l1_r2_1: {
        identifier: 'l1_r2_1',
        horizontalPercentage: 25,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'Mountain Trail',
        connectedNodeIdentifiers: ['l1_r2_2', 'l1_r3_1']
    },
    l1_r2_2: {
        identifier: 'l1_r2_2',
        horizontalPercentage: 50,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'Ancient Pass',
        connectedNodeIdentifiers: ['l1_r1_2_mid', 'l1_r2_1', 'l1_r2_3']
    },
    l1_r2_3: {
        identifier: 'l1_r2_3',
        horizontalPercentage: 75,
        verticalPercentage: 33,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Boulder Blockade',
        connectedNodeIdentifiers: ['l1_r2_2']
    },
    l1_r3_1: {
        identifier: 'l1_r3_1',
        horizontalPercentage: 25,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Forest Edge',
        connectedNodeIdentifiers: ['l1_r2_1', 'l1_r3_2', 'l1_r4_1']
    },
    l1_r3_2: {
        identifier: 'l1_r3_2',
        horizontalPercentage: 50,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Narrow Bridge',
        connectedNodeIdentifiers: ['l1_r3_1', 'l1_r3_3', 'l1_r4_2']
    },
    l1_r3_3: {
        identifier: 'l1_r3_3',
        horizontalPercentage: 75,
        verticalPercentage: 52,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Raging Waterfall',
        connectedNodeIdentifiers: ['l1_r3_2']
    },
    l1_r4_1: {
        identifier: 'l1_r4_1',
        horizontalPercentage: 25,
        verticalPercentage: 72,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Muddy Swamp',
        connectedNodeIdentifiers: ['l1_r3_1']
    },
    l1_r4_2: {
        identifier: 'l1_r4_2',
        horizontalPercentage: 50,
        verticalPercentage: 72,
        nodeType: 'normal',
        nodeLabel: 'Stony Descent',
        connectedNodeIdentifiers: ['l1_r3_2', 'l1_r4_3', 'l1_finish']
    },
    l1_r4_3: {
        identifier: 'l1_r4_3',
        horizontalPercentage: 75,
        verticalPercentage: 72,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Steep Cliff',
        connectedNodeIdentifiers: ['l1_r4_2']
    },
    l1_finish: {
        identifier: 'l1_finish',
        horizontalPercentage: 50,
        verticalPercentage: 90,
        nodeType: 'finish',
        nodeLabel: 'Finish Level 1',
        connectedNodeIdentifiers: ['l1_r4_2']
    }
};

export const LEVEL_2_NODES = {
    l2_r1_1: {
        identifier: 'l2_r1_1',
        horizontalPercentage: 25,
        verticalPercentage: 15,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Poisonous Thicket',
        connectedNodeIdentifiers: ['l2_r2_1']
    },
    l2_r1_3: {
        identifier: 'l2_r1_3',
        horizontalPercentage: 75,
        verticalPercentage: 15,
        nodeType: 'start',
        nodeLabel: 'Level 2 Start',
        connectedNodeIdentifiers: ['l2_r1_3_mid']
    },
    l2_r1_3_mid: {
        identifier: 'l2_r1_3_mid',
        horizontalPercentage: 75,
        verticalPercentage: 24,
        nodeType: 'normal',
        nodeLabel: 'Misty Pathpost',
        connectedNodeIdentifiers: ['l2_r1_3', 'l2_r2_3']
    },
    l2_r2_1: {
        identifier: 'l2_r2_1',
        horizontalPercentage: 25,
        verticalPercentage: 33,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Dark Cavern',
        connectedNodeIdentifiers: ['l2_r1_1', 'l2_r2_2']
    },
    l2_r2_2: {
        identifier: 'l2_r2_2',
        horizontalPercentage: 50,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'Rocky Valley',
        connectedNodeIdentifiers: ['l2_r2_1', 'l2_r2_3', 'l2_r3_2']
    },
    l2_r2_3: {
        identifier: 'l2_r2_3',
        horizontalPercentage: 75,
        verticalPercentage: 33,
        nodeType: 'normal',
        nodeLabel: 'High Pass',
        connectedNodeIdentifiers: ['l2_r1_3_mid', 'l2_r2_2']
    },
    l2_r3_1: {
        identifier: 'l2_r3_1',
        horizontalPercentage: 25,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Ruined Bridge',
        connectedNodeIdentifiers: ['l2_r3_2', 'l2_r4_1']
    },
    l2_r3_2: {
        identifier: 'l2_r3_2',
        horizontalPercentage: 50,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Misty Ridge',
        connectedNodeIdentifiers: ['l2_r2_2', 'l2_r3_1', 'l2_r3_3', 'l2_r4_2']
    },
    l2_r3_3: {
        identifier: 'l2_r3_3',
        horizontalPercentage: 75,
        verticalPercentage: 52,
        nodeType: 'normal',
        nodeLabel: 'Steep Ledge',
        connectedNodeIdentifiers: ['l2_r3_2', 'l2_r4_3']
    },
    l2_r4_1: {
        identifier: 'l2_r4_1',
        horizontalPercentage: 25,
        verticalPercentage: 72,
        nodeType: 'dead-end',
        nodeLabel: 'Dead End: Bottomless Pit',
        connectedNodeIdentifiers: ['l2_r3_1']
    },
    l2_r4_2: {
        identifier: 'l2_r4_2',
        horizontalPercentage: 50,
        verticalPercentage: 72,
        nodeType: 'normal',
        nodeLabel: 'Path of Trials',
        connectedNodeIdentifiers: ['l2_r3_2', 'l2_finish']
    },
    l2_r4_3: {
        identifier: 'l2_r4_3',
        horizontalPercentage: 75,
        verticalPercentage: 72,
        nodeType: 'normal',
        nodeLabel: 'Stony Steps',
        connectedNodeIdentifiers: ['l2_r3_3', 'l2_r5_3']
    },
    l2_r5_3: {
        identifier: 'l2_r5_3',
        horizontalPercentage: 75,
        verticalPercentage: 90,
        nodeType: 'normal',
        nodeLabel: 'Hidden Cave',
        connectedNodeIdentifiers: ['l2_r4_3', 'l2_finish']
    },
    l2_finish: {
        identifier: 'l2_finish',
        horizontalPercentage: 50,
        verticalPercentage: 90,
        nodeType: 'finish',
        nodeLabel: 'Finish Level 2',
        connectedNodeIdentifiers: ['l2_r4_2', 'l2_r5_3']
    }
};
