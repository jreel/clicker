/**
 * Created by jreel on 6/15/2017.
 */

// definitions moved to def.js

/* global game stuffs */
var cqGame = {};

cqGame.party = {};
cqGame.suppliers = {};
cqGame.resources = {gold: 0};
cqGame.quest = {
    level: 1,
    time: 1,        // in seconds
    reward: 1       // gold amount
};
cqGame.questing = false;    // false = recovering
cqGame.battle = false;

cqGame.updateTimer = 100;    // how often to update, in millisec
cqGame.known = [];      // contains previewed & unlocked items

function playerClick() {
    // player clicking the button
    // initially, this button will say "Quest"
    // clicking it will progress the quest bar 0->100
    // and yield some amount of gold
    //
    // once the first hero is recruited,
    // questing becomes automatic
    // so the button will change to say "Boost"
    // clicking it will progress the current state
    // (either battle, questing, or recovery)

    var qbar = elid("questBar");

    if (cqGame.questing) {
        // boost the current quest

        // advance progress bar by one "step"
    }
    else {
        if (Object.keys(cqGame.party).length < 1) {
            // no heroes recruited yet

            // set up level 1 quest
            setupQuest(1);

            // updateGold(1);
        }
    }



}

function checkReqs(forWhat) {
    var alltrue = false;
    for(var req in forWhat.cost) {
        // if game resources >= required resources,
        if(cqGame.resources[req] >= forWhat.cost[req]) {
            alltrue = true;
        }
        else {
            alltrue = false;
        }
    }
    return alltrue;
}
function percentReqs(forWhat) {
    // returns what % of unlock/purchase requirements are met
    var pct = 0;

    // to make it easy, just calculate an average % met
    var count = 0;
    for(var req in forWhat.cost) {
        // calculate what percent of required we have
        // add to a running total, then average
        count++;
        pct += Math.min(1, cqGame.resources[req] / forWhat.cost[req]);
    }
    pct /= count;
    return pct;
}

function updateDisplay() {
    // hide/show/change UI elements based on game status (such as gold)

    // if at least one hero recruited, retext the quest btn
    var pty = cqGame.party;
    if (Object.keys(pty).length > 0) {
        retext(elid("questBtn"), "Boost");
    }

    // loop through party cards to check for enable/disable
    var cards = elid("party").getElementsByClassName("card");

    for (var c = 0; c < cards.length; c++) {
        var card = cards[c];
        var title = card.getElementsByClassName("title")[0].textContent;
        var key = title.toLowerCase();
        var hero = DEF.Adventurers[key];

        // check requirements
        var card = elid("card" + hero.id);
        var btn = elid("btn" + hero.id);

        // if card hasn't been "discovered" yet:
        if (cqGame.known.indexOf(key) == -1) {
            if (checkReqs(hero)) {
                unhide(card);
                unfade(card);
                btn.disabled = false;
                cqGame.known.push(key);
            }
            else if (percentReqs(hero) >= 0.5) {
                // "preview" unlock -- show faded card but leave disabled
                unhide(card);
                fade(card);
                btn.disabled = true;
                cqGame.known.push(key);
            }
            else {
                hide(card);
                btn.disabled = true;
            }
        }
        else {
            // if it *has* been discovered, don't hide card if reqs not met
            // just enable/disable button
            if (checkReqs(hero)) {
                unhide(card);
                unfade(card);
                btn.disabled = false;
            }
            else {
                btn.disabled = true;
            }
        }
    }

    // now do the same for supplier cards
    cards = elid("suppliers").getElementsByClassName("card");
    for (var c = 0; c < cards.length; c++) {
        var card = cards[c];
        var title = card.getElementsByClassName("title")[0].textContent;
        var key = title.toLowerCase();
        var sup = DEF.Suppliers[key];
        var card = elid("card" + sup.id);
        var btn = elid("btn" + sup.id);

        if (cqGame.known.indexOf(key) == -1) {
            if (checkReqs(sup)) {
                unhide(card);
                unfade(card);
                btn.disabled = false;
                cqGame.known.push(key);
            }
            else if (percentReqs(sup) >= 0.5) {
                // "preview" unlock -- show faded card but leave disabled
                unhide(card);
                fade(card);
                btn.disabled = true;
                cqGame.known.push(key);
            }
            else {
                hide(card);
                btn.disabled = true;
            }
        }
        else {
            // if it *has* been discovered, don't hide card if reqs not met,
            // just enable/disable button
            if (checkReqs(sup)) {
                unhide(card);
                unfade(card);
                btn.disabled = false;
            }
            else {
                btn.disabled = true;
            }
        }

    }
}

function gameUpdate() {     // called from window.setInterval
    // TODO
    // on each update:
    //  - if questing:
    //      - advance quest progress bar
    //      - check whether battle is encountered
    //      - add gold per second
    //  - if in battle:
    //      - deal & take damage/healing
    //  - if recovering:
    //      - apply healing, advance progress bar

    // progress bars:
    //  bar.max = maximum value
    //      - quest level, based on party aggregate level
    //  bar.value = current value (NOT a % of max)
    //      - pauses while in battle
    //      - advances by:
    //          - time / party speed? (base of 1% per second maybe)
    //          - completing a battle (large jump)
    //          - player click on button (large jump)
    if (cqGame.questing) {
        // advance quest progress bar
        var bar = elid("questBar");
        var step = cqGame.updateTimer / 1000;           // fraction-of-seconds per step

        bar.value = Math.min(bar.value + step, bar.max);
        retext(elid("questCD"), cleanDecimal(bar.max - bar.value,2) + " sec");

        // collect gold-per-second
        var addgold = 0;

        // loop through party
        var pty = cqGame.party;
        for (var adv in pty) {
            addgold += (pty[adv].gps * step);
        }
        // loop thru suppliers
        // TODO: do suppliers also give gps?
        /*
        var spl = cqGame.suppliers;
        for (var sup in spl) {
            addgold += (spl[sup].gps * step);
        }
        */

        // if bar maxed out, end quest
        // and add in gold bonus
        if(bar.value >= bar.max) {
            addgold += cqGame.quest.reward;
            cqGame.questing = false;
        }
        updateGold(addgold);


        if (cqGame.battle) {

        }
        else {  // not battle

        }
    }
    else {  // not questing
        // should we be questing?
        // TODO: possibly implement "recovery" phase
        if (Object.keys(cqGame.party).length > 0) {
            cqGame.questing = true;
        }
    }

    updateDisplay();
}

function updateGold(amount) {
    cqGame.resources.gold += cleanDecimal(amount, 2);
    retext(elid("goldAmt"), formatLarge(cqGame.resources.gold));
}
function updateResource(which, amount) {
    cqGame.resources[which] += cleanDecimal(amount, 2);
    retext(elid(which + "Amt"), formatLarge(cqGame.resources[which]));
}

/* save the game using HTML5 localStorage */
function save() {
    /* game object */
    var saveData = cqGame;

    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("clickerQuest", JSON.stringify(saveData));
    }
    else {
        alert("Sorry, your browser doesn't seem to support local storage. :(")
    }
}

function load() {
    var saveData = JSON.parse(localStorage.getItem("clickerQuest"));
    cqGame = saveData;
}

function deleteSaveData() {
    if (confirm("Do you really want to remove all of the save data for this game?")) {
        localStorage.removeItem("clickerQuest");
    }
}



// game loop
window.setInterval(function() {

    gameUpdate();
}, cqGame.updateTimer);


/* quest setup */
function setupQuest(level) {
    var q = cqGame.quest;

    // set the current quest to the given level
    q.level = level;

    // set quest time based on level
    // TODO: tweak this
    q.time = q.level; // in seconds

    var qbar = elid("questBar");
    qbar.max = q.time;
    qbar.value = 0;

    // random number of enemy encounters (within a range)
    // TODO

    // random gold reward (within a range)
    // TODO: tweak this
    q.reward = q.level;

    cqGame.questing = true;
}

/* create divs and arrays */
function setupHeroes() {
    // loop through def
    var defs = DEF.Adventurers;
    for(var adv in defs) {
        // create card -- some divs hidden by default
        // all cards are hidden at first, revealed by unlock checks
        var card = advDiv(adv + "");
        elid("party").appendChild(card);
        var btn = elid("btn" + defs[adv].id);
        btn.onclick = (function(){
            var a = adv + "";
            return function(){
                recruit(a);
            }
        })();
        btn.disabled = true;        // enabled when unlock check is met
    }
}
function setupSuppliers() {
    // loop through def
    var defs = DEF.Suppliers;
    for(var sup in defs) {
        // create card -- some divs hidden by default
        // all cards are hidden at first, revealed by unlock checks
        var card = supDiv(sup + "");
        elid("suppliers").appendChild(card);
        var btn = elid("btn" + defs[sup].id);
        btn.onclick = (function(){
            var s = sup + "";
            return function() {
                hire(s);
            }
        })();
        btn.disabled = true;        // enabled when unlock check is met
    }
}


function recruit(key) {
    var adv = new Adventurer(key);
    adv.Recruit();
    // attach onclick function to Upgrade button
    var b = elid("btn" + adv.id);
    retext(b, "Upgrade: ");
    b.onclick = (function(){
        var me = adv;
        return function(){
            me.Upgrade();
        }
    })();
}
/* Adventurer constructor */
function Adventurer(key) {
    this.key = key;
    this.title = key + "";
    var def = DEF.Adventurers[key];
    this.description = def.description || "";
    this.cost = def.cost || {};
    this.id = def.id || "xxx";
    this.tier = def.tier || 1;

    // base income should increase by 5x each tier
    // formula 5 ^ (tier - 1) give correct progression
    // this.baseGps = Math.pow(5, this.tier - 1);
    this.baseGps = 10 * Math.pow(5, this.tier - 1);

    this.factor = 1.07;      // multiplicative cost factor. TODO -- tweak this?

    this.level = 0;
    this.countdown = 0;
    this.gps = 0;
}
Adventurer.prototype.CanBuy = function() {
    return checkReqs(this);
}
Adventurer.prototype.NextCost = function() {
    // calculate next cost; disable upgrade button if needed
    var btn = elid("btn" + this.id);
    var enable = false;
    for(var req in this.cost) {
        // next cost = current cost * (1.07)^(current level)
        this.cost[req] = Math.ceil(this.cost[req] * Math.pow(this.factor, this.level));

        // easier to just do the checks now rather than calling checkReq() to loop thru all again
        if(cqGame.resources[req] >= this.cost[req]) {
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
    retext(elid("cost" + this.id), formatLarge(this.cost.gold));
}
Adventurer.prototype.Recruit = function() {
    // only called for the very first time purchasing a hero;
    // updates the hero div

    if (this.CanBuy()) {

        // set level 1
        this.level = 1;
        retext(elid("lvl" + this.id), this.level);

        this.gps = this.baseGps;
        retext(elid("gps" + this.id), this.gps);

        // add to party table
        cqGame.party[this.key] = this;

        // unhide & unfade div
        var card = elid("card" + this.id);
        unhide(card);
        unhide(elid("ldiv" + this.id));
        unfade(card);

        // consume cost
        for(var req in this.cost) {
            updateResource(req, 0 - this.cost[req]);
        }

        // calculate next cost
        this.NextCost();
    }
}
Adventurer.prototype.Upgrade = function() {
    // called to level up the hero

    if (this.CanBuy()) {
        // increment level
        this.level++;
        retext(elid("lvl" + this.id), this.level);

        // gold/sec increases linearly with levels
        this.gps = this.baseGps * this.level;
        retext(elid("gps" + this.id), this.gps);

        // consume cost
        for(var req in this.cost) {
            updateResource(req, 0 - this.cost[req]);
        }

        // calculate next cost; disable upgrade button if needed
        this.NextCost();
    }
}


function hire(key) {
    var sup = new Supplier(key);
    sup.HireFirst();
    // attach onclick function to Hire button
    var b = elid("btn" + sup.id);
    b.onclick = (function(){
        var me = sup;
        return function(){
            me.HireNext();
        }
    })();
}
/* Supplier constructor */
function Supplier(key) {
    this.key = key;
    this.title = key + "";
    var def = DEF.Suppliers[key];
    this.description = def.description || "";
    this.cost = def.cost || {};
    this.id = def.id || "xxx";

    this.factor = 1.07;      // multiplicative cost factor. TODO -- tweak this?

    this.amount = 0;
    this.countdown = 0;
    //this.gps = 0;         // TODO: do suppliers also give gps?
}
Supplier.prototype.CanBuy = function() {
    return checkReqs(this);
}
Supplier.prototype.NextCost = function() {
    // calculate next cost; disable upgrade button if needed
    var btn = elid("btn" + this.id);
    var enable = false;
    for(var req in this.cost) {
        // next cost = current cost * (1.07)^(current amount)
        this.cost[req] = Math.floor(this.cost[req] * Math.pow(this.factor, this.amount));

        // easier to just do the checks now rather than calling checkReq() to loop thru all again
        if(cqGame.resources[req] >= this.cost[req]) {
            enable = true;
        }
        else {
            enable = false;
        }
    }
    if (enable) {
        btn.disabled = false;
    }
    else {
        btn.disabled = true;
    }
    retext(elid("cost" + this.id), formatLarge(this.cost.gold));
}
Supplier.prototype.HireFirst = function() {
    // only called for the very first time purchasing;
    // updates the card div

    if (this.CanBuy()) {

        // set amount
        this.amount = 1;
        retext(elid("amt" + this.id), this.amount);

        // TODO: do suppliers also give gps?
        //this.gps = this.amount;
        //retext(elid("gps" + this.id), this.gps);

        // add to array
        cqGame.suppliers[this.key] = this;

        // unhide & unfade div
        var card = elid("card" + this.id);
        unhide(card);
        unfade(card);

        // consume cost
        for(var req in this.cost) {
            updateResource(req, 0 - this.cost[req]);
        }

        // calculate next cost
        this.NextCost();
    }
}
Supplier.prototype.HireNext = function() {
    // called to level up the hero

    if (this.CanBuy()) {
        // increment
        this.amount++;
        retext(elid("amt" + this.id), this.amount);

        // TODO: do suppliers give gps?
        //this.gps = this.amount;
        //retext(elid("gps" + this.id), this.gps);

        // consume cost
        for(var req in this.cost) {
            updateResource(req, 0 - this.cost[req]);
        }

        // calculate next cost; disable upgrade button if needed
        this.NextCost();
    }
}


/* div constructors */

// adventurer div
function advDiv(key) {
    var adv = DEF.Adventurers[key];
    var title = titleCase(key + "");
    var id = adv.id;                // string
    var stats = adv.stats;          // object-hashtable
    var cost = adv.cost.gold;       // number

    // "card" (container) div
    var adiv = newEl("DIV", {id: "card" + id, class: "card hide"});

    // class name
    adiv.appendChild(newEl("SPAN", {class: "title", text: title}));

    // level - hidden if hero hasn't been recruited yet
    var d1 = newEl("DIV", {id: "ldiv" + id, class: "level hide"});
    d1.appendChild(newEl("SPAN", {class: "info", text: "Level"}));
    d1.appendChild(newEl("SPAN", {id: "lvl" + id, class: "lvlnum", text: " "}));
    adiv.appendChild(d1);

    // main section - TODO: collapsed if hero hasn't been recruited yet
    var d2 = newEl("DIV", {id: "mdiv" + id, class: ""});
        // TODO: portrait & name
        d2.appendChild(newEl("DIV", {class: "portrait"}));
        d2.appendChild(newEl("SPAN", {class: "heroName", text: "Placeholder"}));

        // gold per second
        var s2 = newEl("SPAN", {class: "info center", text: "Gold/sec: "});
        s2.appendChild(newEl("SPAN", {id: "gps" + id, class: "number", text: " "}));
        d2.appendChild(s2);

        // stats table
        var table = newEl("TABLE", {id: "tbl" + id, class: "stats"});
        for (var stat in stats) {
            var tr = newEl("TR", {});
            tr.appendChild(newEl("TD", {class: "label", text: stat + ": "}));
            tr.appendChild(newEl("TD", {class: "number", text: "+" + stats[stat]}));
            table.appendChild(tr)
        }
        d2.appendChild(table);

    adiv.appendChild(d2);

    // recruit/level-up button
    var d3 = newEl("DIV",{class: "bottom-align"});
        var b1 = newEl("BUTTON", {id: "btn" + id, class: "levelup", text: "Recruit: "});
        b1.appendChild(newEl("SPAN", {id: "cost" + id, class: "number", text: formatLarge(cost)}));
        b1.appendChild(newEl("SPAN", {class: "gold"}));
        d3.appendChild(b1);
    adiv.appendChild(d3);

    return adiv;       // div object
}
// supplier divs
function supDiv(key) {
    var sup = DEF.Suppliers[key];
    var title = titleCase(key + "");
    var id = sup.id;
    var boosts = sup.boosts;
    var cost = sup.cost.gold;
    var icon = sup.icon;

    // "card" (container) div
    var adiv = newEl("DIV", {id: "card" + id, class: "card hide"});

    // supplier name
    adiv.appendChild(newEl("SPAN", {class: "title", text: title}));

    // main section - TODO: collapsed if hasn't been hired yet
    var d1 = newEl("DIV", {id: "mdiv" + id, class: ""});
        // number hired

        var s1 = newEl("SPAN", {id: "amt" + id, class: "number hired", text: "&nbsp;"});
            s1.appendChild(newEl("SPAN", {class: "l emoji", text: icon}));
            s1.appendChild(newEl("SPAN", {class: "r emoji", text: icon}));
        d1.appendChild(s1);

        // boosts table
        var table = newEl("TABLE", {id: "tbl" + id, class: "boosts"});
        for (var boost in boosts) {
            var tr = newEl("TR", {});
            tr.appendChild(newEl("TD", {class: "label", text: boost + ": "}));
            tr.appendChild(newEl("TD", {class: "number", text: "+" + boosts[boost]}));
            table.appendChild(tr)
        }
        d1.appendChild(table);

    adiv.appendChild(d1);

    // hire button
    var d2 = newEl("DIV",{class: "bottom-align"});
        var b1 = newEl("BUTTON", {id: "btn" + id, class: "hire", text: "Hire: "});
        b1.appendChild(newEl("SPAN", {id: "cost" + id, class: "number", text: formatLarge(cost)}));
        b1.appendChild(newEl("SPAN", {class: "gold"}));
        d2.appendChild(b1);
    adiv.appendChild(d2);

    return adiv;       // div object
}


/* helper functions */
function elid(id) {
    return document.getElementById(id);
}
function hide(el) {
    //el.style.visibility = "hidden";
    el.classList.add("hide");
}
function unhide(el) {
    //el.style.visibility = "visible";
    el.classList.remove("hide");
}
function fade(el) {
    //el.style.opacity = "0.5";
    el.classList.add("faded");
}
function unfade(el) {
    el.classList.remove("faded");
}
function collapse(el) {
    el.classList.add("collapse");
}
function expand(el) {
    el.classList.remove("collapse");
}
function retext(el, newText) {
    // changes the text of the first text node within [el]
    var children = el.childNodes;
    for(var n = 0; n < children.length; n++) {
        var child = children[n];
        if(child.nodeType == 3) {   // text node
            child.nodeValue = newText;
            break;
        }
    }
}
function restyle(el, styleList) {
    for(var styleProp in styleList) {
        el.style[styleProp] = styleList[styleProp];
    }
}
function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function cleanDecimal(num, places) {
    // will keep up to [places] decimal places on [num]
    // but does NOT pad out decimal places with extra zeroes
    if (!places) {
        return Math.round(num);
    }
    return Math.round(num * Math.pow(10, places))/Math.pow(10, places);
}
function formatLarge(num) {
    // https://stackoverflow.com/a/17633552/7933110
    var dividers = [
        { div: 1e39 , suffix: 'D' },    // duodecillion
        { div: 1e36 , suffix: 'u' },    // undecillion
        { div: 1e33 , suffix: 'd' },    // decillion
        { div: 1e30 , suffix: 'n' },    // nonillion
        { div: 1e27 , suffix: 'o' },    // octillion
        { div: 1e24 , suffix: 'p' },    // septillion
        { div: 1e21 , suffix: 'x' },    // sextillion
        { div: 1e18 , suffix: 'Q' },    // quintillion
        { div: 1e15 , suffix: 'q' },    // quadrillion
        { div: 1e12 , suffix: 'T' },    // trillion
        { div: 1e9 , suffix: 'B' },     // billion
        { div: 1e6 , suffix: 'M' },     // million
        { div: 1e3 , suffix: 'k' }      // thousand
    ];

    for (var i = 0; i < dividers.length; i++) {
        if (Math.abs(num) >= dividers[i].div) {
            return cleanDecimal(num / dividers[i].div, 2).toString() + dividers[i].suffix;
        }
    }
    // "fall-thru" case, num < 1e3.
    return cleanDecimal(num, 0).toString();
}
function newEl(elType, properties) {
    var el = document.createElement(elType);

    if (properties.id) {
        el.id = properties.id;
    }
    if (properties.text) {
        var txt = document.createTextNode(properties.text);
        el.appendChild(txt);
        el.innerHTML = properties.text;
    }
    if (properties.class) {
        el.className = properties.class;
    }

    return el;
}
function equalWidths(className) {
    var els = document.getElementsByClassName(className);
    var elWids = Array.prototype.map.call(els, el => el.clientWidth);
    var maxWid = Math.max(...elWids)
    Array.prototype.forEach.call(els, el => el.style.width = `${maxWid}px`);
}


function progressBar(barID, newValue, instant) {
    var bar = elid(barID);
    if (instant) {
        bar.value = newValue;
    }
    else {
        var timer = cqGame.updateTimer;         // how often to update, in ms  (100 = 1/10 of a sec)
        var step = bar.max / timer;   // how much to progress every update
        var fill = setInterval(update, timer);

        function update() {
            if (newValue >= bar.max) {
                clearInterval(fill);
            }
            else {
                bar.value += step;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    setupHeroes();
    setupSuppliers();
    equalWidths("card");
});

