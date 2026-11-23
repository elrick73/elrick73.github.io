const Budget = document.getElementById("Budget");
const Energie = document.getElementById("Energie");
const Ecologie = document.getElementById("Ecologie");
const Satisfaction = document.getElementById("Satisfaction");
const Jour = document.getElementById("Jour");
const Ville = document.getElementById("Ville");
const Meteo = document.getElementById("meteo");
const Temperature = document.getElementById("temperature");
const caseVille = document.getElementById("grid_container");
const menuChoix = document.getElementById("menu-choix");
const menuPrincipale = document.getElementById("menu-principale");
const modalGameOver = document.getElementById("game-over");
const boutRecommencer = document.getElementById("bouton-recommencer");
const Population = document.getElementById("Population");
const modalVictoire = document.getElementById("game-victoire");


const boutJouer = document.getElementById("Bouton-jouer");
const boutRecommencerVictoire = document.getElementById("bouton-recommencer-victoire");
const boutConstruire = document.getElementById("Construire");
const boutDemolir = document.getElementById("demolir");
const boutSuivant = document.getElementById("jourSuivant");
const boutPark = document.getElementById("park");
const boutMaison= document.getElementById("maison");
const boutEolienne = document.getElementById("eolienne");
const boutCommerce = document.getElementById("commerce");
const boutEau = document.getElementById("eau");
const modalChargement = document.getElementById("modal-chargement");
const btnOui = document.getElementById("btn-oui");
const btnNon = document.getElementById("btn-non");


let nombrePark = 0;
let listeParks = [];
let nombreMaison = 0;
let listeMaisons = [];
let nombreEolienne = 0;
let listeEoliennes = [];
let nombreCommerce = 0;
let listeCommerces = [];
let nombreEau = 0;
let listeEau = [];
let tempActuelleGlobal = 25; 
let codeMeteoGlobal = 0;
let modeConstruction = false;
let batimentEnCours = null;

let populationActuelle = 0;
Population.textContent = populationActuelle;
let argentIni = 1000;
Budget.textContent = argentIni;
let energieIni = 100;
Energie.textContent = energieIni;
let ecologieIni = 100;
Ecologie.textContent = ecologieIni;
let satisfactionIni = 90;
Satisfaction.textContent = satisfactionIni;
let jourSuiv = 1;
Jour.textContent = jourSuiv;
let nomVille = "Cayenne";
Ville.textContent = nomVille;

if (localStorage.getItem("sauvegardeArgent") !== null) {
    modalChargement.classList.remove("inactif");
}

function redessinerGrille() {
    // 1. On remet toutes les cases à zéro visuellement au cas où
    let toutesLesCases = document.querySelectorAll(".case");
    toutesLesCases.forEach(c => {
        c.textContent = "";
        c.classList.remove("case-maison", "case-eolienne", "case-commerce", "case-eau", "case-park");
    });

    // 2. On replace les maisons
    listeMaisons.forEach(m => {
        let maCase = document.querySelector(`[data-ligne='${m.ligne}'][data-colonne='${m.colonne}']`);
        if (maCase) {
            maCase.textContent = "🏠";
            maCase.classList.add("case-maison");
        }
    });

    // 3. On replace les éoliennes
    listeEoliennes.forEach(e => {
        let maCase = document.querySelector(`[data-ligne='${e.ligne}'][data-colonne='${e.colonne}']`);
        if (maCase) {
            maCase.textContent = "⚡";
            maCase.classList.add("case-eolienne");
        }
    });

    // 4. On replace les commerces
    listeCommerces.forEach(co => {
        let maCase = document.querySelector(`[data-ligne='${co.ligne}'][data-colonne='${co.colonne}']`);
        if (maCase) {
            maCase.textContent = "🏬";
            maCase.classList.add("case-commerce");
        }
    });

    // 5. On replace l'eau
    listeEau.forEach(eau => {
        let maCase = document.querySelector(`[data-ligne='${eau.ligne}'][data-colonne='${eau.colonne}']`);
        if (maCase) {
            maCase.textContent = "💧";
            maCase.classList.add("case-eau");
        }
    });

    // 6. On replace les parcs
    listeParks.forEach(p => {
        let maCase = document.querySelector(`[data-ligne='${p.ligne}'][data-colonne='${p.colonne}']`);
        if (maCase) {
            maCase.textContent = "🌱";
            maCase.classList.add("case-park");
        }
    });
}

// 2. On vérifie si une sauvegarde existe
if (localStorage.getItem("sauvegardeArgent") !== null) {
    // Si oui, on affiche la modale pour demander au joueur
    modalChargement.classList.remove("inactif");
}

// 3. Si le joueur clique sur "Oui"
btnOui.addEventListener("click", () => {
    // Tu récupères toutes tes données avec JSON.parse pour les listes
    argentIni = parseInt(localStorage.getItem("sauvegardeArgent"));
    Budget.textContent = argentIni;
    
    jourSuiv = parseInt(localStorage.getItem("sauvegardeJour"));
    Jour.textContent = jourSuiv;

    energieIni = parseInt(localStorage.getItem("sauvegardeEnergie"));
    Energie.textContent = energieIni;

    // Récupération des tableaux de bâtiments
    listeMaisons = JSON.parse(localStorage.getItem("listeMaisons")) || [];
    nombreMaison = parseInt(localStorage.getItem("nombreMaison")) || 0;

    listeEoliennes = JSON.parse(localStorage.getItem("listeEoliennes")) || [];
    nombreEolienne = parseInt(localStorage.getItem("nombreEolienne")) || 0;

    listeCommerces = JSON.parse(localStorage.getItem("listeCommerces")) || [];
    nombreCommerce = parseInt(localStorage.getItem("nombreCommerce")) || 0;

    listeEau = JSON.parse(localStorage.getItem("listeEau")) || [];
    nombreEau = parseInt(localStorage.getItem("nombreEau")) || 0;

    listeParks = JSON.parse(localStorage.getItem("listeParks")) || [];
    nombrePark = parseInt(localStorage.getItem("nombrePark")) || 0;
    populationActuelle = parseInt(localStorage.getItem("populationActuelle")) || 0;
    Population.textContent = populationActuelle;
    
    redessinerGrille();
    modalChargement.classList.add("inactif");
});


btnNon.addEventListener("click", () => {
    localStorage.clear();
    modalChargement.classList.add("inactif");
});

boutSuivant.addEventListener("click", () => {
    jourSuiv++;
    Jour.textContent = jourSuiv;

    let capaciteMaxMaisons = nombreEolienne * 4;
    let maisonsAlimenteesElec = 0;
    let maisonsAlimenteesEau = 0;
    let commercesAlimentes = 0;

    for (let i = 0; i < nombreMaison; i++){
        let estAlimenteesElec = false;
        for (let j = 0; j < nombreEolienne; j++){
            let distanceLigne = Math.abs(listeMaisons[i].ligne - listeEoliennes[j].ligne);
            let distanceColonne = Math.abs(listeMaisons[i].colonne - listeEoliennes[j].colonne);

            let distanceTotale = distanceLigne + distanceColonne;
            if (distanceTotale <= 2){
                estAlimenteesElec = true;
                maisonsAlimenteesElec++;
                break;
            }
        }
    }
    
    for (let i = 0; i < nombreMaison; i++){
        let estAlimenteesEau = false;
        for (let j = 0; j < nombreEau; j++){
            let distanceLigne = Math.abs(listeMaisons[i].ligne - listeEau[j].ligne);
            let distanceColonne = Math.abs(listeMaisons[i].colonne - listeEau[j].colonne);

            let distanceTotale = distanceLigne + distanceColonne;
            if (distanceTotale <= 2){
                estAlimenteesEau = true;
                maisonsAlimenteesEau++;
                break;
            }
        }
    }

    for (let i = 0; i < nombreCommerce; i++){
        let commerceAlimente = false;
        for (let j = 0; j < nombreEolienne; j++){
            let distanceLigne = Math.abs(listeCommerces[i].ligne - listeEoliennes[j].ligne);
            let distanceColonne = Math.abs(listeCommerces[i].colonne - listeEoliennes[j].colonne);

            let distanceTotale = distanceLigne + distanceColonne;
            if (distanceTotale <= 2){
                commerceAlimente = true;
                commercesAlimentes++;
                break;
            }
        }
    }


    // Une maison est pleinement active si elle a l'électricité ET l'eau
    // On peut estimer la population selon le minimum des deux ou les maisons connectées
    let maisonsParfaitementDesservies = Math.min(maisonsAlimenteesElec, maisonsAlimenteesEau);
    populationActuelle = maisonsParfaitementDesservies * 4;
    Population.textContent = populationActuelle;
    let depensesEntretien = (nombreMaison * 10) + (nombreCommerce * 25) + (nombreEolienne * 30) + (nombreEau * 25) + (nombrePark * 5);
    let revenusTaxes = (maisonsAlimenteesElec + maisonsAlimenteesEau) * 15;
    let revenusCommerces = commercesAlimentes * 60;


    argentIni = argentIni + (revenusTaxes - depensesEntretien) + revenusCommerces;
    Budget.textContent = argentIni;

    let productionEnergie = (nombreEolienne + nombreEau) * 15;
    
    // Consommation de base par maison (ex: 4 au lieu de 5)
    let consommationParMaison = 4;

    if (tempActuelleGlobal > 28) {
        consommationParMaison = 8; // Forte hausse en cas de chaleur tropicale
    }

    energieIni += productionEnergie;
    energieIni -= nombreMaison * consommationParMaison; 
    Energie.textContent = energieIni;

    
    let bonusEcologie = (nombrePark * 2) + (nombreEolienne * 1);
    let malusEcologie = nombreCommerce * 1.5;

    
    ecologieIni = ecologieIni + bonusEcologie - malusEcologie;

    if (ecologieIni > 100) ecologieIni = 100;
    if (ecologieIni < 0) ecologieIni = 0;

    Ecologie.textContent = ecologieIni;
    

    if (nombreMaison > maisonsAlimenteesElec) {
        satisfactionIni -= (nombreMaison - maisonsAlimenteesElec) * 5;
    }

    if (nombreMaison > maisonsAlimenteesEau) {
        satisfactionIni -= (nombreMaison - maisonsAlimenteesEau) * 5;
    }
    // Mise à jour de l'affichage des stats
    document.getElementById("val-elec").textContent = maisonsAlimenteesElec;
    document.getElementById("val-maisons-total").textContent = nombreMaison;
    document.getElementById("val-eau").textContent = maisonsAlimenteesEau;
    document.getElementById("val-commerces").textContent = commercesAlimentes;

    // >>> AJOUTE LA SAUVEGARDE ICI <<<
    localStorage.setItem("sauvegardeArgent", argentIni);
    localStorage.setItem("sauvegardeJour", jourSuiv);
    localStorage.setItem("sauvegardeEnergie", energieIni);
    localStorage.setItem("listeMaisons", JSON.stringify(listeMaisons));
    localStorage.setItem("listeEoliennes", JSON.stringify(listeEoliennes));
    localStorage.setItem("listeCommerces", JSON.stringify(listeCommerces));
    localStorage.setItem("listeEau", JSON.stringify(listeEau));
    localStorage.setItem("listeParks", JSON.stringify(listeParks));
    localStorage.setItem("nombreMaison", nombreMaison);
    localStorage.setItem("nombreEolienne", nombreEolienne);
    localStorage.setItem("nombreCommerce", nombreCommerce);
    localStorage.setItem("nombreEau", nombreEau);
    localStorage.setItem("nombrePark", nombrePark);
    localStorage.setItem("populationActuelle", populationActuelle);
    

    chargerMeteo();
    if (argentIni <= 0) {
        modalGameOver.classList.remove("inactif");
    }
    // Vérification de la condition de victoire
    if (jourSuiv >= 100 && satisfactionIni > 60 && populationActuelle > 60) {
        modalVictoire.classList.remove("inactif");
    }

});


boutRecommencerVictoire.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

boutJouer.addEventListener("click", () => {
    menuPrincipale.classList.toggle("inactif");
});

boutRecommencer.addEventListener("click", () => {
    location.reload();
});

boutConstruire.addEventListener("click", () => {
    modeConstruction = true;
    if (modeConstruction == true){
        menuChoix.classList.toggle("actif");
    }
});

boutDemolir.addEventListener("click", () => {
    batimentEnCours = "demolir";
});

boutPark.addEventListener("click", () => {
    batimentEnCours = "park";
});

boutMaison.addEventListener("click", () => {
    batimentEnCours = "maison";
});

boutEolienne.addEventListener("click", () => {
    batimentEnCours ="eolienne";
});

boutEau.addEventListener("click", () => {
    batimentEnCours = "eau";
});

boutCommerce.addEventListener("click", () => {
    batimentEnCours = "commerce";
});


function chargerMeteo() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=4.9224&longitude=-52.3136&current_weather=true";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let tempActuelle = data.current_weather.temperature;
            let codeMeteo = data.current_weather.weathercode;

            tempActuelleGlobal = tempActuelle;
            codeMeteoGlobal = codeMeteo;

            Temperature.textContent = tempActuelle + " °C";
            Meteo.textContent = traduireCodeMeteo(codeMeteo);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération de la météo :", error);
            Meteo.textContent = "Erreur";
        });
}

function traduireCodeMeteo(code) {
    switch (code) {
        case 0: return "☀️ Ensoleillé";
        case 3: return "☁️ Nuageux / Éclaircies";
        case 55: return "🌧️ Averse tropicale";
        case 65: return "🌧️ Pluie intense";
        case 99: return "⚡ Orage tropical";
        default: return "🌡️ Temps tropical";
    }
}


chargerMeteo();

for (let i = 0; i < 100; i++){
    let maCase = document.createElement("div");
    maCase.classList.add("case");
    caseVille.appendChild(maCase);
    maCase.dataset.ligne = Math.floor(i / 10);
    maCase.dataset.colonne = Math.floor(i % 10);
    maCase.addEventListener("click", () => {
        if (maCase.textContent != "" && batimentEnCours != "demolir"){
            console.log("Case occupé");
        }else{
            switch(batimentEnCours){
                case "maison":
                    let prixMaison = 100;
                    if (argentIni >= prixMaison) {
                        argentIni -= prixMaison;
                        Budget.textContent = argentIni;
                        maCase.textContent = "🏠";
                        maCase.classList.add("case-maison");
                        nombreMaison++;
                        listeMaisons.push({ ligne: maCase.dataset.ligne, colonne: maCase.dataset.colonne });
                        batimentEnCours = null; 
                    } else {
                        console.log("Fonds insuffisants !");
                    }
                    break;
                case "park":
                    let prixPark = 60;
                    if (argentIni >= prixPark) {
                        argentIni -= prixPark;
                        Budget.textContent = argentIni;
                        maCase.textContent = "🌱";
                        maCase.classList.add("case-park");
                        nombrePark++;
                        listeParks.push({ ligne: maCase.dataset.ligne, colonne: maCase.dataset.colonne });
                        batimentEnCours = null; 
                    } else {
                        console.log("Fonds insuffisants !");
                    }
                    break;
                case "eolienne":
                    let prixEolienne = 200;
                    if (argentIni >= prixEolienne) {
                        argentIni -= prixEolienne;
                        Budget.textContent = argentIni;
                        maCase.textContent = "⚡";
                        maCase.classList.add("case-eolienne");
                        nombreEolienne++;
                        listeEoliennes.push({ ligne: maCase.dataset.ligne, colonne: maCase.dataset.colonne });
                        batimentEnCours = null; 
                    } else {
                        console.log("Fonds insuffisants !");
                    }
                    break;
                case "commerce":
                    let prixCommerce = 250;
                    if (argentIni >= prixCommerce) {
                        argentIni -= prixCommerce;
                        Budget.textContent = argentIni;
                        maCase.textContent = "🏬";
                        maCase.classList.add("case-commerce");
                        nombreCommerce++;
                        listeCommerces.push({ ligne: maCase.dataset.ligne, colonne: maCase.dataset.colonne });
                        batimentEnCours = null; 
                    } else {
                        console.log("Fonds insuffisants !");
                    }
                    break;
                case "eau":
                    let prixEau = 180;
                    if (argentIni >= prixEau) {
                        argentIni -= prixEau;
                        Budget.textContent = argentIni;
                        maCase.textContent = "💧";
                        maCase.classList.add("case-eau");
                        nombreEau++;
                        listeEau.push({ ligne: maCase.dataset.ligne, colonne: maCase.dataset.colonne });
                        batimentEnCours = null; 
                    } else {
                        console.log("Fonds insuffisants !");
                    }
                    break;
                case "demolir":
                    if (maCase.classList.contains("case-maison")) {
                        nombreMaison--;
                        listeMaisons = listeMaisons.filter(m => m.ligne !== maCase.dataset.ligne || m.colonne !== maCase.dataset.colonne);
                        
                    } else if (maCase.classList.contains("case-eolienne")) {
                        nombreEolienne--;
                        listeEoliennes = listeEoliennes.filter(e => e.ligne !== maCase.dataset.ligne || e.colonne !== maCase.dataset.colonne);
                    }
                   
                    else if (maCase.classList.contains("case-commerce")) {
                        nombreCommerce--;
                        listeCommerces = listeCommerces.filter(e => e.ligne !== maCase.dataset.ligne || e.colonne !== maCase.dataset.colonne);
                    }
                    else if (maCase.classList.contains("case-park")) {
                        nombrePark--;
                        listeParks = listeParks.filter(e => e.ligne !== maCase.dataset.ligne || e.colonne !== maCase.dataset.colonne);
                    }
                    else if (maCase.classList.contains("case-eau")) {
                        nombreEau--;
                        listeEau = listeEau.filter(e => e.ligne !== maCase.dataset.ligne || e.colonne !== maCase.dataset.colonne);
                    }

                    maCase.textContent = "";
                    maCase.classList.remove("case-eau", "case-maison", "case-eolienne", "case-commerce", "case-park");
                    batimentEnCours = null;
                    break;
                default: return null;
            }
        }

        maCase.addEventListener("mouseenter", () => {
            if (maCase.textContent === "⚡" || maCase.textContent === "💧") {
                let ligneActuelle = parseInt(maCase.dataset.ligne);
                let colonneActuelle = parseInt(maCase.dataset.colonne);

                // On parcourt toutes les cases de la grille
                let toutesLesCases = document.querySelectorAll(".case");
                toutesLesCases.forEach(c => {
                    let cLigne = parseInt(c.dataset.ligne);
                    let cCol = parseInt(c.dataset.colonne);

                    // On calcule la distance de Manhattan
                    let distance = Math.abs(ligneActuelle - cLigne) + Math.abs(colonneActuelle - cCol);

                    // Si la case est dans un rayon de 2, on l'illumine
                    if (distance <= 2) {
                        c.classList.add("case-portee");
                    }
                });
            }
        });

        maCase.addEventListener("mouseleave", () => {
            let toutesLesCases = document.querySelectorAll(".case");
            toutesLesCases.forEach(c => c.classList.remove("case-portee"));
        });
        
    });
}


