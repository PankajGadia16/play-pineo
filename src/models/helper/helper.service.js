import facade from './helper.facade'

export default {

    find: async function (options) {
        return await facade.find(options);
    }
}
