// import express from 'express'

// export const calculateProgress = (goal) => {
//     if (!goal.target || goal.achievement == null) return 0;

//     switch (goal.uom) {
//         case "numeric":
//         case "%":
//             return goal.achievement / goal.target;
//         case "max":
//             return goal.target / goal.achievement;
//         case "timeline":
//             return goal.achievementDate <= goal.deadline ? 1 : 0;
//         case "zero":
//             return goal.achievement === 0 ? 1 : 0;
//         default:
//             return 0;
//     }
// };


// utils/progressCalculator.js
export const calculateProgress = (goal) => {
    const { uom, target, achievement } = goal;

    if (achievement === null || achievement === undefined) return 0;
    if (!target && uom !== "zero") return 0;

    switch (uom) {
        case "numeric":
        case "%":
            // Min type: higher is better
            return Math.min((Number(achievement) / Number(target)) * 100, 100);

        case "timeline": {
            // achievement and target are date strings
            const achievedDate = new Date(achievement);
            const targetDate = new Date(target);
            return achievedDate <= targetDate ? 100 : 0;
        }

        case "zero":
            return Number(achievement) === 0 ? 100 : 0;

        default:
            return 0;
    }
};