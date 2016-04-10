var gra;
var odpowiedzi = [];
var idPytan = [];
var dane;
var nrPytania = 0;
var idPytania = 0;
var pytanie;
var punkty = 0;
var podsumowanie;
var ekranPowitalny;

function mieszajDane() {
    var tab = new Array(dane.length);
    for (var i = 0; i < tab.length; i++) {
        tab[i] = i;
    }
    nrPytania = 0;
    punkty = 0;
    idPytan = mieszaj(tab);
    idPytania = idPytan[nrPytania];
}

function nacisnietoStart() {
    mieszajDane();
    ekranPowitalny.ukryj();
    wyswietlPytanie();
    podsumowanie = new Podsumowanie();
}

var EkranPowitalny = function() {
    this.tlo = gra.add.sprite(150, 150, 'ekran_powitalny');
    this.tekst = gra.add.text(200, 180, 'Quiz Naukowy');
    this.przycisk = gra.add.button(350, 350, 'przycisk_start', nacisnietoStart, this, 0, 0, 0);
    this.przyciskTekst = gra.add.text(360, 360, 'Start');
    this.ukryj = function() {
        this.tlo.visible = false;
        this.tekst.visible = false;
        this.przycisk.visible = false;
        this.przyciskTekst.visible = false;
    }
}

var Przycisk = function(x, y, odpowiedzi, numerOdpowiedzi) {
    this.x = x;
    this.y = y;
    this.przycisk = gra.add.button(x, y, 'przycisk', nacisnieto, this, 0, 1, 2);
    this.przycisk.name = odpowiedzi[numerOdpowiedzi].odpowiedz;
    this.tekst = gra.add.text(x + 60, y + 20, this.przycisk.name);

    this.ukryj = function() {
        this.przycisk.visible = false;
        this.tekst.visible = false;
    }
}

var Pytanie = function(dobraOdpowiedz) {
    this.dobraOdpowiedz = dobraOdpowiedz;
    
    this.tlo = gra.add.sprite(40, 40, 'pytanie');
    this.tekst = gra.add.text(100, 80, dane[idPytania].pytanie);
    this.obiekt = gra.add.sprite(470, 160, 'obiekt');
    this.ukryj = function() {
        this.tlo.visible = false;
        this.tekst.visible = false;
        this.obiekt.visible = false;
    }
}

var Wynik = function(jaki) {
    this.tlo = gra.add.sprite(200, 200, 'odpowiedz_' + jaki);
    this.wynik = 0;
    var tekst = '';
    
    if (jaki === 'dobra') {
        this.wynik++;
        tekst = 'Dobra odpowiedź';
    } else {
        tekst = 'Zła odpowiedź';
    }
    this.tekst = gra.add.text(320, 240, tekst);
    
    this.ukryj = function() {
        this.tlo.visible = false;
        this.tekst.visible = false;
    }
}

var Podsumowanie = function() {
    this.wynik = gra.add.sprite(0, 500, 'wynik');
    this.tekst = gra.add.text(40, 540, 'Wynik: ' + punkty + '   ' + 'Pytanie: ' + (nrPytania + 1) + ' / ' + dane.length);
    
    this.aktualizuj = function() {
        this.tekst.text = 'Wynik: ' + punkty + '   ' + 'Pytanie: ' + (nrPytania + 1) + ' / ' + dane.length;
    }
    this.ukryj = function() {
        this.wynik.visible = false; 
        this.tekst.visible = false;
    }
}

function wyswietlPytanie() {
    pytanie = new Pytanie(dane[idPytania].odpowiedzi[0].odpowiedz);

    var tab = mieszaj(dane[idPytania].odpowiedzi);
    for (let i = 0; i < 4; i++) {
        //odpowiedzi[i].anchor.setTo(0.5, 0.5);
        odpowiedzi[i] = new Przycisk(40, 160 + i*80, tab, i);
     }
}

function wygrales() {
    podsumowanie.ukryj();
    ekranPowitalny = new EkranPowitalny();
}

function przegrales() {
    podsumowanie.ukryj();
    ekranPowitalny = new EkranPowitalny();
}

function nastepnePytanie() {
    wynik.ukryj();
    
    if (wynik.wynik == 0) {
        przegrales();
        return;
    }
    
    punkty++;
    nrPytania++;
    
    if (nrPytania < idPytan.length) {
        idPytania = idPytan[nrPytania];
        wyswietlPytanie();
        podsumowanie.aktualizuj();
    } else {
        wygrales();
    }
}

function wyswietlWynik(jaki) {
    wynik = new Wynik(jaki);
    
    setTimeout(nastepnePytanie, 2000);
}

function przedZaladowaniem() {
    gra.load.image('tlo', 'img/tlo.jpg');
    gra.load.image('pytanie', 'img/napis_duzy.png');
    gra.load.spritesheet('przycisk', 'img/przycisk.png', 400, 60);
    gra.load.image('wynik', 'img/wynik.png');
    gra.load.image('odpowiedz_dobra', 'img/odpowiedz_dobra.png');
    gra.load.image('odpowiedz_zla', 'img/odpowiedz_zla.png');
    gra.load.image('ekran_powitalny', 'img/ekran_powitalny.png');
    gra.load.spritesheet('przycisk_start', 'img/przycisk_start.png', 200, 80);
    gra.load.image('obiekt', 'img/obiekt.png');
    
    dane = pobierzDane();
    mieszajDane();
}

function nacisnieto(przycisk) {
    pytanie.ukryj();
    
    for (var i = 0; i < odpowiedzi.length; i++) {
        odpowiedzi[i].ukryj();
    }
    if (pytanie.dobraOdpowiedz === przycisk.name) {
        wyswietlWynik('dobra');
    } else {
        wyswietlWynik('zla');
    }
}

function mieszaj(tab) {
    var j, x, i;
    var nowaTab = tab.slice();
    for (i = nowaTab.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = nowaTab[i - 1];
        nowaTab[i - 1] = nowaTab[j];
        nowaTab[j] = x;
    }
    return nowaTab;
}

function tworzenie() {
    gra.add.sprite(0, 0, 'tlo');
    ekranPowitalny = new EkranPowitalny();
}

function aktualizacja() {
    
}

function rozpocznijGre() {
    gra = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: przedZaladowaniem, create: tworzenie, update: aktualizacja });    
}