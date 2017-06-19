/**
 * Created by jreel on 6/15/2017.
 */

// definitions

var DEF = {};

DEF.Adventurers = {
    mercenary: {
        description: "A soldier-for-hire, provides their own equipment.",
        unlock: {gold: Math.pow(10, 10)},
        divID: "Mrc"
    },
    fighter: {
        description: "Your basic brute-force killing machine.",
        unlock: {gold: Math.pow(10, 1)},
        divID: "Ftr"
    },
    rogue: {
        description: "Fights with stealth and finesse, obtains extra gold through questionable means.",
        unlock: {gold: Math.pow(10, 2)},
        divID: "Rog"
    },
    hunter: {
        description: "A master of traps and ranged attacks, able to quickly subdue large or multiple enemies.",
        unlock: {gold: Math.pow(10, 3)},
        divID: "Hnt"
    },
    witch: {
        description: "Uses potions and minor spells to incapacitate foes.",
        unlock: {gold: Math.pow(10, 4)},
        divID: "Wch"
    },
    wizard: {
        description: "Wields terrifying magical forces to bring down even the toughest enemies.",
        unlock: {gold: Math.pow(10, 5)},
        divID: "Wiz"
    },
    cleric: {
        description: "Calls upon the power of the gods to smite foes and aid allies.",
        unlock: {gold: Math.pow(10, 6)},
        divID: "Clr"
    },
    paladin: {
        description: "A divinely favored holy knight, the avatar of the gods themselves.",
        unlock: {gold: Math.pow(10, 7)},
        divID: "Pal"
    }
};

DEF.Resources = {
    gold: {},
    armor: {},
    weapons: {},
    projectiles: {},
    traps: {},
    herbs: {},
    potions: {},
    arcana: {},
    totems: {},
    wands: {},
    relics: {},
    blessings: {}
};

DEF.Suppliers = {
    armorer: {
        description: "",
        product: DEF.Resources.armor,
        unlock: {gold: 5 * Math.pow(10, 1)},
        divID: "Armr"
    },
    weaponsmith: {
        description: "",
        product: DEF.Resources.weapons,
        unlock: {gold: 5 * Math.pow(10, 2)},
        divID: "Weap"
    },
    bowyer: {
        description: "",
        product: DEF.Resources.projectiles,
        unlock: {gold: 5 * Math.pow(10, 3)},
        divID: "Bowr"
    },
    trapper: {
        description: "",
        product: DEF.Resources.traps,
        unlock: {gold: 5 * Math.pow(10, 4)},
        divID: "Trap"
    },
    herbalist: {
        description: "",
        product: DEF.Resources.herbs,
        unlock: {gold: 5 * Math.pow(10, 5)},
        divID: "Herb"
    },
    alchemist: {
        description: "",
        product: DEF.Resources.potions,
        unlock: {gold: 5 * Math.pow(10, 6)},
        divID: "Alch"
    },
    occultist: {
        description: "",
        product: DEF.Resources.arcana,
        unlock: {gold: 5 * Math.pow(10, 7)},
        divID: "Occl"
    },
    shaman: {
        description: "",
        product: DEF.Resources.totems,
        unlock: {gold: 5 * Math.pow(10, 8)},
        divID: "Sham"
    },
    artificer: {
        description: "",
        product: DEF.Resources.wands,
        unlock: {gold: 5 * Math.pow(10, 9)},
        divID: "Arti"
    },
    priest: {
        description: "",
        product: DEF.Resources.relics,
        unlock: {gold: 5 * Math.pow(10, 10)},
        divID: "Prst"
    },
    bishop: {
        description: "",
        product: DEF.Resources.blessings,
        unlock: {gold: 5 * Math.pow(10, 11)},
        divID: "Bish"
    }
};


/* global game stuffs */

var party = [];
var suppliers = [];
var resources = {gold: 0};

// initialize list of locked unlockables at start of game
var locked = [];
for(var adv in DEF.Adventurers) {
    locked.push(adv);
}
for(var sup in DEF.Suppliers) {
    locked.push(sup);
}

function updateDisplay() {
    // enable/disable purchase buttons (loop thru party & suppliers)
    // concat party array and suppliers array first
    var both = party.concat(suppliers);
    for(b = 0; b < both.length; b++) {
        var hero = both[b];
        var btn = elid("btn" + hero.id);    // TODO: upgrade different stats (so more btns)

        // loop thru requirements in hero's cost list
        // all must be true to be enabled
        var alltrue = false;
        for(var req in hero.cost) {
            // if game resources >= required resources,
            if(resources[req] >= hero.cost[req]) {
                alltrue = true;
            }
            else {
                alltrue = false;
            }
        }
        // once all requirements have been checked, evaluate
        if (alltrue) {
            // enable button
            btn.disabled = false;
        }
        else {
            btn.disabled = true;
        }
    }

    // check for unlocks
    // loop thru array of still-locked items
    for(i = 0; i < locked.length; i++) {
        var key = locked[i];
        var adv = DEF.Adventurers[key];
        if (typeof adv == "undefined") {
            adv = DEF.Suppliers[key];
        }
        // loop thru requirements in each adventurer's unlock list
        // all must be true to be unlocked
        var alltrue = false;
        for(var req in adv.unlock) {
            // if game resources >= required resources,
            if(resources[req] >= adv.unlock[req]) {
                alltrue = true;
            }
            else {
                alltrue = false;
            }
        }
        // once all requirements have been checked, evaluate
        if (alltrue) {
            // unhide hire button (and parent div as well)
            var el = elid("hire" + adv.divID);
            unhide(el.parentNode);
            unhide(el);
            // removed from locked list
            locked.splice(i,1);
        }
    }
}

function gameUpdate() {     // called from setInterval, once per second
    // update gold amount
    var addgold = 0;

    // loop through party array (these will usually be +gold)
    for (j = 0; j < party.length; j++) {
        var adv = party[j];
        addgold += adv.gps;
    }

    // loop thru suppliers array (these will often be -gold)
    for (k = 0; k < suppliers.length; k++) {
        var sup = suppliers[k];
        addgold += sup.gps;
    }
    updateGold(addgold);


    updateDisplay();
}

function updateGold(amount) {
    resources.gold += amount;
    retext(elid("goldAmt"), resources.gold);
}
function updateResource(which, amount) {
    resources[which] += amount;
    retext(elid(which + "Amt"), resources[which]);
}



/* save the game using HTML5 localStorage */
function save() {
    /* game object */
    var saveData = {
        resources: resources,
        party: party,
        suppliers: suppliers,
        locked: locked,
    }

    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("clickerQuest", JSON.stringify(saveData));
    }
    else {
        alert("Sorry, your browser doesn't seem to support local storage. :(")
    }
}

function load() {
    var saveData = JSON.parse(localStorage.getItem("clickerQuest"));

    if (typeof saveData.resources !== "undefined") {
        resources = saveData.resources;
    }
}

function deleteSaveData() {
    if (confirm("Do you really want to remove all of the save data for this game?")) {
        localStorage.removeItem("clickerQuest");
    }
}



// game loop
window.setInterval(function() {

    // currently, gold/sec equals level -- TODO: change this
    //updateGold(party.fighter.level);
    gameUpdate();
}, 1000);





function hire(advKey) {
    var def = DEF.Adventurers[advKey];
    var adv = new Adventurer(advKey, def);
    adv.Hire();
    // attach onclick function to Upgrade button -- TODO: upgrade different stats
    var b = elid("btn" + adv.id);
    b.onclick = function(){ adv.Upgrade(); };
}
/* class constructors */
function Adventurer(title, properties) {
    this.title = title;
    // better to do this explicitly than use a for loop
    this.description = properties.description || "";
    this.unlock = properties.unlock || {};
    this.id = properties.divID || "xxx";

    this.cost = this.unlock;
    this.level = 0;
    this.countdown = 0;
    this.gps = 0;

}
Adventurer.prototype.Hire = function() {
    // only called for the very first time purchasing a hero;
    // creates the hero div

    // verify cost
    var alltrue = false;
    for(var req in this.cost) {
        if(resources[req] >= this.cost[req]) {
            alltrue = true;
        }
        else {
            alltrue = false;
        }
    }
    if (alltrue) {
        // create div
        this.div = advDiv(this.id, this.title);
        elid("party").appendChild(this.div);

        // set level 1
        this.level = 1;
        retext(elid("lvl" + this.id), this.level);

        // currently, gold/sec equals level -- TODO: change this
        this.gps = this.level;
        retext(elid("gps" + this.id), this.gps);

        // add to party array
        party.push(this);

        // unhide div
        unhide(elid("div" + this.id));

        // consume cost
        for(var req in this.cost) {
            updateResource(req, 0 - this.cost[req]);
        }
        elid("hire" + this.id).disabled = true;

        // calculate next cost
        var factor = 1.1;           // TODO: move this elsewhere (DEF maybe?)
        for(var req in this.cost) {
            this.cost[req] = Math.floor(this.cost[req] * Math.pow(factor, this.level));
        }
        retext(elid("req" + this.id), this.cost.gold + " <span class='gold'> </span>");       //   TODO -- fix this
    }
}

Adventurer.prototype.Upgrade = function() {
    // called to level up the hero
    // TODO - upgrade different stats

    // check requirements
    var alltrue = false;
    for(var req in this.cost) {
        if(resources[req] >= this.cost[req]) {
            alltrue = true;
        }
        else {
            alltrue = false;
        }
    }
    if (alltrue) {
        // increment level
        this.level++;
        retext(elid("lvl" + this.id), this.level);

        // currently, gold/sec equals level -- TODO: change this
        this.gps = this.level;
        retext(elid("gps" + this.id), this.gps);

        // consume cost
        for(var req in this.cost) {
            updateResource(req, 0 - this.cost[req]);
        }

        // calculate next cost; disable upgrade button if needed
        var btn = elid("btn" + this.id);
        var enable = false;
        var factor = 1.1;           // TODO: move this elsewhere (DEF maybe?)
        for(var req in this.cost) {
            this.cost[req] = Math.floor(this.cost[req] * Math.pow(factor, this.level));
            if(resources[req] >= this.cost[req]) {
                enable = true;
            }
            else {
                enable = false;
            }
        }
        if (enable) {
            // enable button
            btn.disabled = false;
        }
        else {
            btn.disabled = true;
        }
        retext(elid("req" + this.id), this.cost.gold + " <span class='gold'> </span>");       //   TODO -- fix this

    }
}

/* div constructors */

// adventurer div
function advDiv(id, label) {
    // "card" (container) div
    var adiv = newEl("DIV", {id: "div" + id, class: "boxed hide"});

    // first subdiv
    var d1 = newEl("DIV", {class: "flexspread"});
    d1.appendChild(newEl("SPAN", {class: "label", text: titleCase(label) + ": "}));
    d1.appendChild(newBar(id));
    d1.appendChild(newEl("SPAN", {id: "cd" + id, class: "countdown", text: "000 sec"}));
    adiv.appendChild(d1);

    // second subdiv
    var d2 = newEl("DIV", {class: "flexspread"});

    var d21 = newEl("SPAN", {class: "stats", text: "Level: "});
        d21.appendChild(newEl("SPAN", {id: "lvl" + id, class: "number", text: "1"}));
    d2.appendChild(d21);

    var d22 = newEl("SPAN", {class: "stats right", text: "Gold/sec: "});
        d22.appendChild(newEl("SPAN", {id: "gps" + id, class: "number", text: "1"}));
    d2.appendChild(d22);

    adiv.appendChild(d2);

    // upgrade buttons -- TODO: upgrade different stats
    var d3 = newEl("DIV", {});
    d3.appendChild(newEl("BUTTON", {id: "btn" + id, text: "Upgrade"}));
    d3.appendChild(newEl("SPAN", {id: "req" + id, class: "info"}));
    adiv.appendChild(d3);

    return adiv;       // div object
}



/* helper functions */
function elid(id) {
    return document.getElementById(id);
}
function unhide(el) {
    el.style.visibility = "visible";
}
function hide(el) {
    el.style.visibility = "hidden";
}
function retext(el, innerHTML) {
    el.innerHTML = innerHTML;
}
function restyle(el, styleList) {
    for(var styleProp in styleList) {
        el.style[styleProp] = styleList[styleProp];
    }
}
function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function newEl(elType, properties) {
    var el = document.createElement(elType);

    if (properties.id) {
        el.id = properties.id;
    }
    if (properties.text) {
        var txt = document.createTextNode(properties.text);
        el.appendChild(txt);
    }
    if (properties.class) {
        el.className = properties.class;
    }

    return el;
}
function newBar(id) {   // creates progress bar (set of nested SPAN elements)
    var foo = newEl("SPAN", {class: "foo"});
    var bar = newEl("SPAN", {id: "bar" + id, class: "bar"});

    foo.appendChild(bar);
    return foo;
}

function progress(bar, time) {
    var width = 0;
    var freq = time / 100;  // how often the bar updates with each 1%
    var fill = setInterval(update, freq);
    function update() {
        if (width >= 100) {
            clearInterval(fill);
        }
        else {
            width++;
            bar.style.width = width + '%';
        }
    }
}



