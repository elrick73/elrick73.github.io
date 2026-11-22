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

const boutJouer = document.getElementById("Bouton-jouer");
const boutConstruire = document.getElementById("Construire");
const boutSuivant = document.getElementById("jourSuivant");
const boutPark = document.getElementById("park");
const boutMaison= document.getElementById("maison");
const boutEolienne = document.getElementById("eolienne");

let nombrePark = 0;
let nombreMaison = 0;
let nombreEolienne = 0;
let modeConstruction = false;
let batimentEnCours = null;

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
let nomVille = "Paris";
Ville.textContent = nomVille;

boutSuivant.addEventListener("click", () => {
    jourSuiv++;
    Jour.textContent = jourSuiv;
    argentIni += 50;
    Budget.textContent = argentIni;
    energieIni += nombreEolienne * 10;
    energieIni -= nombreMaison*5; 
    Energie.textContent = energieIni;
    ecologieIni += (nombrePark + nombreEolienne)*0.5;
    Ecologie.textContent = ecologieIni;
    if (argentIni < 0) {
        console.log("Faillite");
    }

});


boutJouer.addEventListener("click", () => {
    menuPrincipale.classList.toggle("inactif");
});


boutConstruire.addEventListener("click", () => {
    modeConstruction = true;
    if (modeConstruction == true){
        menuChoix.classList.toggle("actif");
    }
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

// Fonction pour récupérer la météo de Paris (Latitude: 48.85, Longitude: 2.35)
function chargerMeteo() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true";

    fetch(url)
        .then(response => response.json()) // On convertit la réponse en format JSON
        .then(data => {
            // On récupère la température et le code météo actuels
            let tempActuelle = data.current_weather.temperature;
            let codeMeteo = data.current_weather.weathercode;

            // On injecte les valeurs dans ton HTML
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
        case 1:
        case 2:
        case 3: return "☁️ Nuageux / Couvert";
        case 51:
        case 53:
        case 55: return "🌧️ Pluie légère";
        case 71:
        case 73:
        case 75: return "🌨️ Neige";
        default: return "🌡️ Temps variable";
    }
}

// Appeler la fonction au chargement de la page
chargerMeteo();

for (let i = 0; i < 100; i++){
    let maCase = document.createElement("div");
    maCase.classList.add("case");
    caseVille.appendChild(maCase);
    maCase.addEventListener("click", () => {
        switch(batimentEnCours){
            case "maison":
                let prixMaison = 100;
                if (argentIni >= prixMaison) {
                    argentIni -= prixMaison;
                    Budget.textContent = argentIni;
                    maCase.textContent = "🏠";
                    maCase.classList.add("case-maison");
                    nombreMaison++;
                    batimentEnCours = null; 
                } else {
                    console.log("Fonds insuffisants !");
                }
                break;
            case "park":
                let prixPark = 50;
                if (argentIni >= prixPark) {
                    argentIni -= prixPark;
                    Budget.textContent = argentIni;
                    maCase.textContent = "🌱";
                    maCase.classList.add("case-park");
                    nombrePark++;
                    batimentEnCours = null; 
                } else {
                    console.log("Fonds insuffisants !");
                }
                break;
            case "eolienne":
                let prixEolienne = 150;
                if (argentIni >= prixEolienne) {
                    argentIni -= prixEolienne;
                    Budget.textContent = argentIni;
                    maCase.textContent = "⚡";
                    maCase.classList.add("case-eolienne");
                    nombreEolienne++;
                    batimentEnCours = null; 
                } else {
                    console.log("Fonds insuffisants !");
                }
                break;
            default: return null;
        }
    });
}



