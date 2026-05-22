document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Cordova est prêt !');
    document.getElementById('btn-calculer').addEventListener('click', calculerIMC);
}

// Sécurité si le test sur navigateur bloque l'événement deviceready
if (!window.cordova) {
    document.getElementById('btn-calculer').addEventListener('click', calculerIMC);
}

function calculerIMC() {
    const poids = parseFloat(document.getElementById('poids').value);
    const tailleCm = parseFloat(document.getElementById('taille').value);

    // Validation simple
    if (isNaN(poids) || isNaN(tailleCm) || poids <= 0 || tailleCm <= 0) {
        alert("Veuillez entrer des valeurs valides pour le poids et la taille.");
        return;
    }

    // Calcul
    const tailleM = tailleCm / 100;
    const imc = poids / (tailleM * tailleM);

    // Affichage de la valeur de l'IMC
    document.getElementById('valeur-imc').innerText = imc.toFixed(1);
    
    let interpretation = "";
    let classeCouleur = "";

    // Analyse des résultats
    if (imc < 18.5) {
        interpretation = "Insuffisance pondérale (Maigreur)";
        classeCouleur = "alerte";
    } else if (imc >= 18.5 && imc < 25) {
        interpretation = "Corpulence normale";
        classeCouleur = "normal";
    } else if (imc >= 25 && imc < 30) {
        interpretation = "Surpoids";
        classeCouleur = "alerte";
    } else {
        interpretation = "Obésité";
        classeCouleur = "alerte";
    }

    const interpretationTxt = document.getElementById('interpretation');
    interpretationTxt.innerText = interpretation;
    interpretationTxt.className = classeCouleur;

    // Afficher le bloc de résultat
    document.getElementById('resultat-container').style.display = 'block';
}