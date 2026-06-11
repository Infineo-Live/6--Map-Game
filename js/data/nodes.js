// Coordinates and connection details for Level 1 and Level 2 nodes.
// Positions (x, y) are percentage coordinates relative to their respective level container.

export const LEVEL_1_NODES = {
    l1_r1_1: {
        id: 'l1_r1_1',
        x: 25,
        y: 15,
        type: 'dead-end',
        label: 'Dead End: Dense Brambles',
        connections: ['l1_r1_2']
    },
    l1_r1_2: {
        id: 'l1_r1_2',
        x: 50,
        y: 15,
        type: 'start',
        label: 'Level 1 Start',
        connections: ['l1_r1_1', 'l1_r1_3', 'l1_r1_2_mid']
    },
    l1_r1_2_mid: {
        id: 'l1_r1_2_mid',
        x: 50,
        y: 24,
        type: 'normal',
        label: 'Forest Pathpost',
        connections: ['l1_r1_2', 'l1_r2_2']
    },
    l1_r1_3: {
        id: 'l1_r1_3',
        x: 75,
        y: 15,
        type: 'dead-end',
        label: 'Dead End: Deep Chasm',
        connections: ['l1_r1_2']
    },
    l1_r2_1: {
        id: 'l1_r2_1',
        x: 25,
        y: 33,
        type: 'normal',
        label: 'Mountain Trail',
        connections: ['l1_r2_2', 'l1_r3_1']
    },
    l1_r2_2: {
        id: 'l1_r2_2',
        x: 50,
        y: 33,
        type: 'normal',
        label: 'Ancient Pass',
        connections: ['l1_r1_2_mid', 'l1_r2_1', 'l1_r2_3']
    },
    l1_r2_3: {
        id: 'l1_r2_3',
        x: 75,
        y: 33,
        type: 'dead-end',
        label: 'Dead End: Boulder Blockade',
        connections: ['l1_r2_2']
    },
    l1_r3_1: {
        id: 'l1_r3_1',
        x: 25,
        y: 52,
        type: 'normal',
        label: 'Forest Edge',
        connections: ['l1_r2_1', 'l1_r3_2', 'l1_r4_1']
    },
    l1_r3_2: {
        id: 'l1_r3_2',
        x: 50,
        y: 52,
        type: 'normal',
        label: 'Narrow Bridge',
        connections: ['l1_r3_1', 'l1_r3_3', 'l1_r4_2']
    },
    l1_r3_3: {
        id: 'l1_r3_3',
        x: 75,
        y: 52,
        type: 'dead-end',
        label: 'Dead End: Raging Waterfall',
        connections: ['l1_r3_2']
    },
    l1_r4_1: {
        id: 'l1_r4_1',
        x: 25,
        y: 72,
        type: 'dead-end',
        label: 'Dead End: Muddy Swamp',
        connections: ['l1_r3_1']
    },
    l1_r4_2: {
        id: 'l1_r4_2',
        x: 50,
        y: 72,
        type: 'normal',
        label: 'Stony Descent',
        connections: ['l1_r3_2', 'l1_r4_3', 'l1_finish']
    },
    l1_r4_3: {
        id: 'l1_r4_3',
        x: 75,
        y: 72,
        type: 'dead-end',
        label: 'Dead End: Steep Cliff',
        connections: ['l1_r4_2']
    },
    l1_finish: {
        id: 'l1_finish',
        x: 50,
        y: 90,
        type: 'finish',
        label: 'Finish Level 1',
        connections: ['l1_r4_2']
    }
};

export const LEVEL_2_NODES = {
    l2_r1_1: {
        id: 'l2_r1_1',
        x: 25,
        y: 15,
        type: 'dead-end',
        label: 'Dead End: Poisonous Thicket',
        connections: ['l2_r2_1']
    },
    l2_r1_3: {
        id: 'l2_r1_3',
        x: 75,
        y: 15,
        type: 'start',
        label: 'Level 2 Start',
        connections: ['l2_r1_3_mid']
    },
    l2_r1_3_mid: {
        id: 'l2_r1_3_mid',
        x: 75,
        y: 24,
        type: 'normal',
        label: 'Misty Pathpost',
        connections: ['l2_r1_3', 'l2_r2_3']
    },
    l2_r2_1: {
        id: 'l2_r2_1',
        x: 25,
        y: 33,
        type: 'dead-end',
        label: 'Dead End: Dark Cavern',
        connections: ['l2_r1_1', 'l2_r2_2']
    },
    l2_r2_2: {
        id: 'l2_r2_2',
        x: 50,
        y: 33,
        type: 'normal',
        label: 'Rocky Valley',
        connections: ['l2_r2_1', 'l2_r2_3', 'l2_r3_2']
    },
    l2_r2_3: {
        id: 'l2_r2_3',
        x: 75,
        y: 33,
        type: 'normal',
        label: 'High Pass',
        connections: ['l2_r1_3_mid', 'l2_r2_2']
    },
    l2_r3_1: {
        id: 'l2_r3_1',
        x: 25,
        y: 52,
        type: 'normal',
        label: 'Ruined Bridge',
        connections: ['l2_r3_2', 'l2_r4_1']
    },
    l2_r3_2: {
        id: 'l2_r3_2',
        x: 50,
        y: 52,
        type: 'normal',
        label: 'Misty Ridge',
        connections: ['l2_r2_2', 'l2_r3_1', 'l2_r3_3', 'l2_r4_2']
    },
    l2_r3_3: {
        id: 'l2_r3_3',
        x: 75,
        y: 52,
        type: 'normal',
        label: 'Steep Ledge',
        connections: ['l2_r3_2', 'l2_r4_3']
    },
    l2_r4_1: {
        id: 'l2_r4_1',
        x: 25,
        y: 72,
        type: 'dead-end',
        label: 'Dead End: Bottomless Pit',
        connections: ['l2_r3_1']
    },
    l2_r4_2: {
        id: 'l2_r4_2',
        x: 50,
        y: 72,
        type: 'normal',
        label: 'Path of Trials',
        connections: ['l2_r3_2', 'l2_finish']
    },
    l2_r4_3: {
        id: 'l2_r4_3',
        x: 75,
        y: 72,
        type: 'normal',
        label: 'Stony Steps',
        connections: ['l2_r3_3', 'l2_r5_3']
    },
    l2_r5_3: {
        id: 'l2_r5_3',
        x: 75,
        y: 90,
        type: 'normal',
        label: 'Hidden Cave',
        connections: ['l2_r4_3', 'l2_finish']
    },
    l2_finish: {
        id: 'l2_finish',
        x: 50,
        y: 90,
        type: 'finish',
        label: 'Finish Level 2',
        connections: ['l2_r4_2', 'l2_r5_3']
    }
};
