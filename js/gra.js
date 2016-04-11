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
var dzwKoniecGry;
var dzwWygrales;

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
    this.pytajnik = gra.add.sprite(513, 160, 'pytajnik');
    this.wynik = 0;
    this.dzwDobra = gra.add.audio('dzw_dobra');
    this.dzwZla = gra.add.audio('dzw_zla');

    this.ukryj = function() {
        this.tlo.visible = false;
        this.tekst.visible = false;
        this.obiekt.visible = false;
        this.pytajnik.visible = false;
    }
    
    this.zakoncz = function(czyDobraOdpowiedz) {
        var tekst = '';

        if (czyDobraOdpowiedz) {
            this.wynik++;
            this.odpowiedz = gra.add.sprite(470, 160, 'odpowiedz_dobra');
            this.dzwDobra.play();
        } else {
            this.odpowiedz = gra.add.sprite(470, 160, 'odpowiedz_zla');
            this.dzwZla.play();
        }
    }
    
    this.nowe = function() {
        this.odpowiedz.visible = false;
        this.ukryj();
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
        odpowiedzi[i] = new Przycisk(40, 160 + i*80, tab, i);
     }
}

function zacznijGre() {
    podsumowanie.ukryj();
    ekranPowitalny = new EkranPowitalny();
}

function wygrales() {
    dzwWygrales.play();
    setTimeout(zacznijGre, 6000);
}

function przegrales() {
    dzwKoniecGry.play();
    setTimeout(zacznijGre, 1500);
}

function nastepnePytanie() {
    pytanie.nowe();
    
    if (pytanie.wynik == 0) {
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

function wyswietlOdpowiedz(czyDobraOdpowiedz) {
    pytanie.zakoncz(czyDobraOdpowiedz);
    setTimeout(nastepnePytanie, 1500);
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
    gra.load.image('pytajnik', 'img/pytajnik.png');

    gra.load.audio('dzw_dobra', 'audio/odpowiedz_dobra.mp3');
    gra.load.audio('dzw_zla', 'audio/odpowiedz_zla.mp3');
    gra.load.audio('dzw_wygrales', 'audio/wygrales.mp3');
    gra.load.audio('dzw_koniec_gry', 'audio/koniec_gry.mp3');
    
    dane = pobierzDane();
    mieszajDane();
}

function nacisnieto(przycisk) {
    for (var i = 0; i < odpowiedzi.length; i++) {
        odpowiedzi[i].ukryj();
    }
    if (pytanie.dobraOdpowiedz === przycisk.name) {
        wyswietlOdpowiedz(true);
    } else {
        wyswietlOdpowiedz(false);
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
    dzwWygrales = gra.add.audio('dzw_wygrales');
    dzwKoniecGry = gra.add.audio('dzw_koniec_gry');
}

function aktualizacja() {
    
}

function rozpocznijGre() {
    gra = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: przedZaladowaniem, create: tworzenie, update: aktualizacja });    
}
