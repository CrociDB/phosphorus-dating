// Data
var subjects = [
    { name: "Video Game" },       // 0
    { name: "Read" },             // 1
    { name: "Soccer" },           // 2
    { name: "Drink" },            // 3
    { name: "Technology" },       // 4
    { name: "Fitness" },          // 5
    { name: "Science" },          // 6
    { name: "Politics" },         // 7
    { name: "Pets" },             // 8
];

var traits = [
    // s: subject, d: direction, t: text
    { s: 0, d: 2, o: 1, t: "One of my main activities: play videogames." },
    { s: 1, d: 2, o: 1, t: "Like Books, comic books and graphic novels." },
    { s: 1, d: 2, o: 1, t: "Books." },
    { s: 1, d: 2, o: 1, t: "Love reading." },
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
    { s: 4, d: 2, o: 0, t: "This Internet thing is promising." },
    { s: 5, d: 2, o: 3, t: "Jogging." },
    { s: 5, d: 2, o: 3, t: "Play basketball." },
    { s: 5, d: 0, o: 5, t: "High five sedentary people!" },
    { s: 6, d: 2, o: 1, t: "Hail Carl Sagan!" },
    { s: 6, d: 0, o: 0, t: "God in first place." },
    { s: 7, d: 0, o: 0, t: "Ultra-conservative." },
    { s: 7, d: 0, o: 0, t: "I'm a conservative." },
    { s: 7, d: 2, o: 5, t: "Have you read some Karl Marx?" },
    { s: 7, d: 2, o: 2, t: "Communism, socialism, and anarchism." },
    { s: 8, d: 2, o: 3, t: "Totally a cat person." },
    { s: 8, d: 0, o: 3, t: "Dog person here." },
];

var female_names = ["Joanna", "Linda", "Lorenna", "Alyssa", "Anna", "Anne", "Eduarda", "Kat", "Giuliana", "Lais", "Adrianne", "Gal", "Olivia"];
var male_names = ["Bruno", "John", "Marcus", "Jay", "Rodrigo", "Anderson", "Val", "Germano", "George", "Mamoru", "Ed", "Felipe", "Klev"];
var last_names = ["Smith", "Silva", "Johnson", "Kim", "Cruz", "Lee", "Yamada", "Kilmer", "Lopes", "Miya", "Drake", "Lira", "Love", "Lake"]

var sex_orient = [ 
    { w: .55, t: "Straight" },       // 0
    { w: .30, t: "Homosexual" },     // 1
    { w: .15, t: "Bisexual" },       // 2
];

var texts = {
    date_conf: "<p>Do you want to match <b>$1</b> and <b>$2</b>?</p><p>After that they will go to a date and then you will get a date report.</p>"
};

// Util

var gId = function(t) { return document.getElementById(t); };

Array.prototype.rand = function() {
    return this[Math.floor((Math.random() * this.length))];
}

Array.prototype.group = function(keyFunction) {
    var groups = {};
    this.forEach(function(el) {
        var key = keyFunction(el);
        if (key in groups == false) {
            groups[key] = [];
        }
        groups[key].push(el);
    });
    return Object.keys(groups).map(function(key) {
        return {
            key: key,
            values: groups[key]
        };
    });
};

Array.prototype.unique = function() {
    return this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);
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

var getOrientIndex = function(t) {
    for (var j = 0; j < sex_orient.length; j++)
    {
        if (sex_orient[j].t === t) {
            return j;
        }
    }
};

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
    this.sex_orient = getOrientIndex(this.orientation);

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

    this.traits.sort(function(a, b) { return a.o - b.o });
    this.traits.forEach(function(t) {
        this.bio += t.t + " ";
        if (rangeRand(1,100) > 90) {
            this.bio += "<br><br>";
        }
    }, this);

    // Upper/Lower case modifier
    var bioModifier = rangeRand(0, 100);
    if (bioModifier > 85) {
        this.bio = this.bio.toLowerCase();
    } else if (bioModifier > 80) {
        this.bio = this.bio.toUpperCase();
    }

    // Ponctuation modifier
    bioModifier = rangeRand(0, 100);
    if (bioModifier > 70) {
        this.bio = this.bio.replace(/,/g, "").replace(/\./g, ",");
        this.bio = this.bio.substr(0, this.bio.length - 2);
    }

    // Emo modifier
    bioModifier = rangeRand(0, 100);
    if (bioModifier > 97) {
        this.bio = [].map.call(this.bio, function(e) {
            return rangeRand(0, 1) == 0 ? e.toUpperCase() : e.toLowerCase();
        }).join("");
    }
};

// Matches
var Match = function(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;

    this.calculate = function() {
        this.sex = 0;

        // Gender and Sexual orientation
        if (p1.sex_orient == 2 && p2.sex_orient == 2) {
            this.sex += 100;
        } else if (p1.sex_orient == 0 && p2.sex_orient == 0) {
            this.sex += p1.gender != p2.gender ? 100 : -150;
        } else if (p1.sex_orient == 1 && p2.sex_orient == 1) {
            this.sex += p1.gender == p2.gender ? 100 : -150;
        } else if (p1.sex_orient == 0 || p2.sex_orient == 0) {
            var v = p1.gender != p2.gender ? 100 : -100; 
            if (p1.sex_orient == 2 || p2.sex_orient == 2) {
                this.sex += v;
            } else if (p1.sex_orient == 1 || p2.sex_orient == 1) {
                this.sex -= v;
            } 
        } else if (p1.sex_orient == 1 || p2.sex_orient == 1) {
            var v = p1.gender == p2.gender ? 100 : -100; 
            if (p1.sex_orient == 2 || p2.sex_orient == 2) {
                this.sex += v;
            } else if (p1.sex_orient == 1 || p2.sex_orient == 1) {
                this.sex -= v;
            } 
        }

        // Traits
        this.positive = 0;
        this.neutral = 0;
        this.negative = 0;

        var tts = function(t) { return t.s; };
        var tr1sub = this.p1.traits.map(tts);
        var tr2sub = this.p2.traits.map(tts);
        var intersection = this.p1.traits.filter(function(t) { return tr2sub.indexOf(t.s) >= 0; }).concat(
                           this.p2.traits.filter(function(t) { return tr2sub.indexOf(t.s) >= 0; }));

        var tr1f = this.p1.traits.filter(function (t) { return intersection.map(tts).indexOf(t.s) == -1; });
        var tr2f = this.p2.traits.filter(function (t) { return intersection.map(tts).indexOf(t.s) == -1; });

        var ig = intersection.group(tts);
        ig.forEach(function(e) {
            var sum = e.values.reduce(function(acc, v, i, a) {
                return acc + v.d;
            }, 0) - 2;

            if (sum == 0) {
                this.negative++;
            } else {
                this.positive++;
            }
        }, this);

        this.neutral = tr1f.length + tr2f.length;

        this.subjects = this.p1.traits.concat(this.p2.traits).unique().map(function (t) { return subjects[t.s]; });
    }

    this.calculate();
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
        this.opeople = []
        this.people = [];
        for (var i = 0; i < 3; i++)
        {
            var p = new Person();
            this.opeople.push(p);
        }

        for (var i = 0; i < 15; i++)
        {
            var p = new Person();
            this.people.push(p);
        }

        this.drawPeople();

        this.currentPeople = [this.opeople[0], this.people[0]];
        this.renderDetails();
    };

    this.drawPeople = function() {
        var p1 = gId("peopleList1");
        var p2 = gId("peopleList2");

        var id = 0;
        this.opeople.forEach(function(p) {
            p1.innerHTML += peopleListTemplate(0, id, p.name);
            id++; 
        });
        id = 0;
        this.people.forEach(function(p) {
            p2.innerHTML += peopleListTemplate(1, id, p.name);
            id++; 
        });
    };

    this.clickPerson = function(l, id) {
        this.currentPeople[l] = l == 0 ? this.opeople[id] : this.people[id];
        this.renderDetails(l);
    };

    this.renderDetails = function() {
        var p1 = gId("personDescription1");
        var p2 = gId("personDescription2");

        p1.innerHTML = peopleDetail(this.currentPeople[0]);
        p2.innerHTML = peopleDetail(this.currentPeople[1]);
    };

    this.match = function() {
        var p1 = this.currentPeople[0];
        var p2 = this.currentPeople[1];
        showDialogOk("Do a Match?", 
                     texts.date_conf.replace("$1", p1.name).replace("$2", p2.name),
                     this.doMatch.bind(this, p1, p2));
    };

    this.doMatch = function(p1, p2) {
        var m = new Match(p1, p2);
        console.log(m);
    };

    this.removePeople = function(p1, p2) {

    }
}

var game = new Game();

(function() {
    game.start();
})();

