// Data
var subjects = [
    { name: "Video Game" },
    { name: "Play Tenis" },
    { name: "Soccer" },
    { name: "Drink" }
];

var traits = [
    { subject: 0, direction: 1, text: "I play videogames all day." },
    { subject: 1, direction: 1, text: "Love Tenis." },
    { subject: 2, direction: 1, text: "Wanna join me in a soccer game?" },
    { subject: 2, direction: 0, text: "Oh, and I seriously hate people who watch soccer." },
    { subject: 3, direction: 1, text: "Man, I love beer!" },
    { subject: 3, direction: 1, text: "We can go out for a beer?" },
    { subject: 3, direction: 0, text: "If you're wondering, I don't drink." }
];

var female_names = ["Joanna", "Linda", "Lorenna", "Alyssa", "Anna", "Anne", "Eduarda"];
var male_names = ["Bruno", "John", "Marcus", "Jay", "Rodrigo"];
var last_names = ["Smith", "Silva", "Johnson", "Kim", "Groom", "Lee", "Yamada"]

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

// Person

var Person = function () {
    this.gender = rangeRand(0, 1);
    if (this.gender == 0) this.name = female_names.rand() + " " + last_names.rand();
    else this.name = male_names.rand() + " " + last_names.rand();

    this.orientation = weightRand(sex_orient);
};

// Templates
function peopleListTemplate(l, id, name) {
    var t = gId("peopleListTemplate");
    return t.innerHTML.replace("$1", l).replace("$2", id).replace("$3", name);
}

// Game

var clickPerson = function(l, id) {
    showDialogOk("Hey!", "Testttt", function() { console.log(id); });
};

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

(function() {
    var p1 = gId("peopleList1");
    var p2 = gId("peopleList2");

    p1.innerHTML = "";
    p2.innerHTML = "";

    var people = [];
    for (var i = 0; i < 8; i++)
    {
        var p = new Person();
        people.push(p);
        p1.innerHTML += peopleListTemplate(0, i, p.name);
        p2.innerHTML += peopleListTemplate(0, i, p.name); 
    }
})();

