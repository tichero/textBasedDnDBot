const { runInThisContext } = require("vm");

class character {
    constructor(user_id, name, origin, hp, strength, xp, lvl) {
        this.user_id = user_id;
        this.name = name;
        this.origin = origin;
        this.current_location = "start location";
        this.xp = 0;
        this.lvl = 1;
    }
}

module.exports = character