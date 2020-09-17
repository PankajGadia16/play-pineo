import Joi from 'joi'
import constants from '../../utils/constants';

export const validateCreate = function (entry) {
    const schema = {
        name: Joi.string().required()
    };
    return Joi.validate(entry, schema);
}


export const validateJoin = function (entry) {
    const schema = {
        name: Joi.string().required(),
        gameId: Joi.string().length(constants.GAME_ID_LENGTH).required()
    };
    return Joi.validate(entry, schema);
}

export const validateStart = function (entry) {
    const schema = {
        gameId: Joi.string().length(constants.GAME_ID_LENGTH).required()
    };
    return Joi.validate(entry, schema);
}

export const validateDraw = function (game) {
    if (!game) {
        return "Invalid Game!"
    }
    if (game.centerHeap.length != 0) {
        return "There are some cards in center for game to continue!"
    }
}