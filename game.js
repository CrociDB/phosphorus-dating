// Data
var subjects = [
    { name: "Video Game" },       // 0
    { name: "Read" },             // 1
    { name: "Soccer" },           // 2
    { name: "Drink" },            // 3
    { name: "Computer" },         // 4
    { name: "Fitness" },          // 5
    { name: "Science" },          // 6
];

var traits = [
    // s: subject, d: direction, t: text
    { s: 0, d: 2, o: 1, t: "One of my main activities: play videogames." },
    { s: 1, d: 2, o: 1, t: "Comic Books." },
    { s: 1, d: 2, o: 1, t: "Books." },
    { s: 1, d: 2, o: 1, t: "Magazines." },
    { s: 1, d: 0, o: 1, t: "Books are the old media." },
    { s: 2, d: 2, o: 5, t: "Wanna join me in a soccer game?" },
    { s: 2, d: 0, o: 5, t: "Oh, don't talk to me if you watch soccer." },
    { s: 3, d: 2, o: 1, t: "Man, I love beer!" },
    { s: 3, d: 2, o: 5, t: "Maybe we can go out for a beer?" },
    { s: 3, d: 2, o: 0, t: "Love me some wine." },
    { s: 3, d: 0, o: 3, t: "If you're wondering, I don't drink." },
    { s: 3, d: 0, o: 3, t: "No alcohol for me." },
    { s: 4, d: 2, o: 0, t: "I write computer programs." },
    { s: 4, d: 2, o: 0, t: "I speak C++." },
    { s: 5, d: 2, o: 3, t: "Jogging." },
    { s: 5, d: 2, o: 3, t: "Play basketball." },
    { s: 5, d: 0, o: 5, t: "High five sedentary people!" },
    { s: 6, d: 2, o: 1, t: "Hail Carl Sagan!" },
    { s: 6, d: 0, o: 0, t: "God in first place." },
];

var female_names = ["Joanna", "Linda", "Lorenna", "Alyssa", "Anna", "Anne", "Eduarda", "Kat"];
var male_names = ["Bruno", "John", "Marcus", "Jay", "Rodrigo", "Anderson", "Val", "Germano", "George", "Mamoru"];
var last_names = ["Smith", "Silva", "Johnson", "Kim", "Groom", "Lee", "Yamada", "Kilmer", "Lopes", "Miyagawa"]

var sex_orient = [ 
    { w: .4, t: "Straight" },
    { w: .35, t: "Homosexual" },
    { w: .10, t: "Bisexual" },
    { w: .10, t: "Pansexual" },
    { w: .05, t: "Asexual" }
];

// Util

var gId = function(t) { return document.getElementById(t); };

Array.prototype.rand = function() {
    return this[Math.floor((Math.random() * this.length))];
}

var rangeRand = function (min, max) {
    return min + Math.floor((Math.random() * (max - min + 1)));
};

var weightRand = function(arr) {
    var i = Math.random();
    var t = 0;

    for (var j = 0; j < arr.length; j++)
    {
        t += arr[j].w;
        if (i < t) return arr[j].t;
    }
}

var getTraitsExcept = function(exception) {
    var ts = [];
    traits.forEach(function(t) {
        for(var i = 0; i < exception.length; i++) {
            if (t.s == exception[i].s) {
                return;
            }
        }
        ts.push(t);
    });

    return ts;
};

// Person
var Person = function () {
    // Gender
    this.gender = rangeRand(0, 1);

    // Sexual orientation
    this.orientation = weightRand(sex_orient);

    // Name
    if (this.gender == 0) this.name = female_names.rand() + " " + last_names.rand();
    else this.name = male_names.rand() + " " + last_names.rand();

    // Age
    var max = 30;
    if (rangeRand(0, 100) > 65) max = 52
    this.age = rangeRand(18, max);

    // Trais
    this.traits = [];
    this.bio = "";
    var amount = rangeRand(2, 4);
    for (var i = 0; i < amount; i++) {
        var t = getTraitsExcept(this.traits).rand();
        this.traits.push(t);
    }

    var that = this;
    this.traits.sort(function(a, b) { return a.o - b.o });
    this.traits.forEach(function(t) {
        that.bio += t.t + " ";
        if (rangeRand(1,100) > 90) {
            that.bio += "<br><br>";
        }
    });

    console.log(this.traits);
    console.log(this.bio);

    var bioModifier = rangeRand(0, 100);
    if (bioModifier > 92) {
        this.bio = this.bio.toLowerCase();
    } else if (bioModifier > 89) {
        this.bio = this.bio.toUpperCase();
    }
};

// Templates
function peopleListTemplate(l, id, name) {
    var t = gId("peopleListTemplate");
    return t.innerHTML.replace("$1", l).replace("$2", id).replace("$3", name);
}

function peopleDetail(person) {
    var t = gId("peopleDetail");

    var s = (person.gender == 0 ? "Female" : "Male") + " - " + person.orientation;
    
    return t.innerHTML.replace("$1", person.name + ", " + person.age)
                      .replace("$2", s).replace("$3", person.bio);
}

// Dialog System

var dialog = { 
    bg: gId("dialogDiv"), 
    dw: gId("dialogWindow"),
    title: gId("dialogTitle"),
    section: gId("dialogSection"),
    ok: gId("dialogOk"),
    cancel: gId("dialogCancel"),
    hide: function () { 
        this.bg.style = "visibility: hidden";
        this.dw.style = "visibility: hidden";
    },
    show: function () {
        this.bg.style = "visibility: visible";
        this.dw.style = "visibility: visible";
    },
    onOk: null,
    okCancel: null 
};

var showDialogOk = function(title, section, okCallback) {
    dialog.title.innerHTML = title;
    dialog.section.innerHTML = section;
    dialog.onOk = function () {
        dialog.hide();
        okCallback();
    };
    dialog.onCancel = function () {
        dialog.hide();
    };
    dialog.show();
};

// Game

var Game = function() {
    this.start = function () {
        this.people = [];
        for (var i = 0; i < 10; i++)
        {
            var p = new Person();
            this.people.push(p);
        }
        this.drawPeople();

        this.currentPeople = [this.people[0], this.people[0]];
        this.renderDetails();
    };

    this.drawPeople = function() {
        var p1 = gId("peopleList1");
        var p2 = gId("peopleList2");

        var id = 0;
        this.people.forEach(function(p) {
            p1.innerHTML += peopleListTemplate(0, id, p.name);
            p2.innerHTML += peopleListTemplate(1, id, p.name);
            id++; 
        });
    };

    this.clickPerson = function(l, id) {
        this.currentPeople[l] = this.people[id];
        this.renderDetails(l);
    };

    this.renderDetails = function() {
        var p1 = gId("personDescription1");
        var p2 = gId("personDescription2");

        p1.innerHTML = peopleDetail(this.currentPeople[0]);
        p2.innerHTML = peopleDetail(this.currentPeople[1]);
    };
}

var game = new Game();

(function() {
    game.start();
})();

