import express from 'express'

export const calculateProgress = (goal) => {
    if (!goal.target || goal.achievement == null) return 0;

    switch (goal.uom) {
        case "numeric":
        case "%":
            return goal.achievement / goal.target;
        case "max":
            return goal.target / goal.achievement;
        case "timeline":
            return goal.achievementDate <= goal.deadline ? 1 : 0;
        case "zero":
            return goal.achievement === 0 ? 1 : 0;
        default:
            return 0;
    }
};
