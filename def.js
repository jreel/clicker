/**
 * Created by jreel on 6/26/2017.
 */

// definitions

var DEF = {};

DEF.Stats = {
    defense: {
        description: "Reduces the amount of physical damage taken from enemies.",
        abbreviation: "DEF",
        icon: "&#x1F6E1;"        // shield
    },
    offense: {
        description: "Deals physical damage to enemies; offset by enemy defense score.",
        abbreviation: "OFF",
        icon: "&#x1F5E1;"    // dagger
    },
    ranged: {
        description: "Damages enemies at a distance, before they can strike back.",
        abbreviation: "RNG",
        icon: "&#x1F3F9;"        // bow & arrow
    },
    protection: {
        description: "Reduces magical damage or effects from enemies.",
        abbreviation: "PRO",
        icon: "&#x2728;"    // sparkles
    },
    spellpower: {
        description: "Deals magical damage to enemies; offset by enemy protection score.",
        abbreviation: "SPP",
        icon: "&#x1F4A5;"    // collision
    },
    healing: {
        description: "Recovers damage taken over time.",
        abbreviation: "HEA",
        icon: "&#x1F496;"        // sparkling heart
    },
    stealth: {
        description: "Lowers chance of encountering enemies while questing.",
        abbreviation: "STE",
        icon: "&#x1F465;"       // busts in silhouette
        // icon ideas:
        // &#x1F987;    bat
        // &#x1F32B;    fog
        // &#x1F311;    new moon
        // &#x1F312;    waxing crescent moon
        // &#x1F465;    busts in silhouette
        // &#x1F463;    footprints
    },
    luck: {
        description: "Increases gold obtained during questing.",
        abbreviation: "LCK",
        icon: "&#x1F340;"    // four leaf clover
    },
    speed: {
        description: "Decreases time to finish quest.",
        abbreviation: "SPD",
        icon: "&#x1F3C3;"        // person running
    }
};


DEF.Adventurers = {
    fighter: {
        tier: 1,
        description: "Your basic brute-force killing machine.",
        cost: {gold: Math.pow(10, 1)},
        id: "Ftr",
        stats: {
            defense: 5,
            offense: 5
        }
    },
    rogue: {
        tier: 2,
        description: "Fights with stealth and finesse, obtains extra gold through questionable means.",
        cost: {gold: Math.pow(10, 2)},
        id: "Rog",
        stats: {
            offense: 5,
            stealth: 10,
            luck: 5,
            speed: 5
        }
    },
    hunter: {
        tier: 3,
        description: "A master of scouting and ranged attacks, able to quickly subdue large or multiple enemies.",
        cost: {gold: Math.pow(10, 3)},
        id: "Hnt",
        stats: {
            ranged: 10,
            stealth: 5,
            speed: 10,
            healing: 2,
            offense: 2
        }
    },
    witch: {
        tier: 4,
        description: "Uses potions and minor spells to incapacitate foes and aid allies.",
        cost: {gold: Math.pow(10, 4)},
        id: "Wch",
        stats: {
            spellpower: 5,
            healing: 5,
            protection: 5,
            stealth: 2
        }
    },
    wizard: {
        tier: 5,
        description: "Wields magical forces to bring down even the toughest enemies.",
        cost: {gold: Math.pow(10, 5)},
        id: "Wiz",
        stats: {
            spellpower: 10,
            protection: 2,
            luck: 5,
            speed: 2
        }
    },
    cleric: {
        tier: 6,
        description: "Calls upon the power of the gods to bless allies and smite foes.",
        cost: {gold: Math.pow(10, 6)},
        id: "Clr",
        stats: {
            healing: 10,
            spellpower: 2,
            protection: 8
        }
    },
    paladin: {
        tier: 7,
        description: "A divinely favored holy knight.",
        cost: {gold: Math.pow(10, 7)},
        id: "Pal",
        stats: {
            defense: 10,
            offense: 8,
            healing: 5
        }
    },
    archangel: {
        tier: 8,
        description: "An avatar of the gods themselves.",
        cost: {gold: Math.pow(10,8)},
        id: "Arc",
        stats: {
            defense: 10,
            offense: 10,
            spellpower: 10,
            protection: 10,
            healing: 10,
            speed: 10
        }
    }
};


DEF.Suppliers = {
    armorer: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 1)},
        id: "Armr",
        boosts: {
            defense: 1
        },
        icon: "&#x1F6E1;"        // shield
    },
    weaponsmith: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 2)},
        id: "Weap",
        boosts: {
            offense: 1
        },
        icon: "&#x1F5E1;"    // dagger
    },
    bowyer: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 3)},
        id: "Bowr",
        boosts: {
            ranged: 1
        },
        icon: "&#x1F3F9;"        // bow & arrow
    },
    trapper: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 4)},
        id: "Trap",
        boosts: {
            stealth: 1,
            speed: 1
        },
        icon: "&#x1F578;"        // spider web
    },
    herbalist: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 5)},
        id: "Herb",
        boosts: {
            healing: 1,
            speed: 2
        },
        icon: "&#x1F33F;"        // herb
    },
    alchemist: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 6)},
        id: "Alch",
        boosts: {
            healing: 3,
            stealth: 1,
            protection: 1
        },
        icon: "&#x2697;"        // alembic
    },
    occultist: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 7)},
        id: "Occl",
        boosts: {
            spellpower: 4,
            speed: 1
        },
        //icon: "&#x1F4DC;"        // scroll
        icon: "&#x1F52E;"    // crystal ball
    },
    shaman: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 8)},
        id: "Sham",
        boosts: {
            luck: 3,
            protection: 3
        },
        icon: "&#x1F43A;"        // wolf face
        // icon: "&#x1F5FF";           // moai
    },
    artificer: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 9)},
        id: "Arti",
        boosts: {
            spellpower: 6,
            protection: 2,
            stealth: 1
        },
        //icon: "&#x1F4FF;"        // prayer beads
        icon: "&#x1F387;"    // sparkler (firework)
    },
    bishop: {
        description: "",
        cost: {gold: 5 * Math.pow(10, 10)},
        id: "Bish",
        boosts: {
            healing: 6,
            protection: 6
        },
        //icon: "&#x270B;"        // raised hand
        // icon: "&#x1F590;"    // raised hand with fingers splayed
        icon: "&#x270C;"     // victory hand
    }
};

