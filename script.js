// Application state
let appState = {
    version: null,
    category: null,
    breed: null,
    weight: null,
    stage: null
};

// Data from original app
const cowData = {
    "Laitières": ["Holstein", "Montbéliarde", "Normande", "Jersey"],
    "À viande": ["Charolaise", "Limousine", "Aubrac", "Brune de l'Atlas", "Guelmoise"],
    "Mixtes (lait & viande)": ["Salers", "Simmental", "Tarentaise"]
};

const physiologicalStages = {
    "Laitières": ["tarie", "gestante", "lactation"],
    "À viande": ["tarie", "gestante", "engraissement"],
    "Mixtes (lait & viande)": ["tarie", "gestante", "lactation", "croissance"]
};

const stageNames = {
    "tarie": "Tarie (Au repos)",
    "gestante": "Gestante",
    "lactation": "En lactation",
    "engraissement": "Engraissement",
    "croissance": "Croissance"
};

const cowNutritionCoefficients = {
    "Laitières": {
        "MS": 0.035,
        "stages": {
            "tarie": {"UF": 0.8, "PB": 0.12},
            "gestante": {"UF": 0.9, "PB": 0.14},
            "lactation": {"UF": 1.2, "PB": 0.16}
        }
    },
    "À viande": {
        "MS": 0.025,
        "stages": {
            "tarie": {"UF": 0.8, "PB": 0.12},
            "gestante": {"UF": 0.9, "PB": 0.14},
            "engraissement": {"UF": 1.2, "PB": 0.13}
        }
    },
    "Mixtes (lait & viande)": {
        "MS": 0.032,
        "stages": {
            "tarie": {"UF": 0.8, "PB": 0.12},
            "gestante": {"UF": 0.9, "PB": 0.14},
            "lactation": {"UF": 1.1, "PB": 0.15},
            "croissance": {"UF": 1.0, "PB": 0.15}
        }
    }
};

const feedComposition = {
    "Ensilage de maïs": {"UF": 0.9, "PB": 70},
    "Foin de luzerne": {"UF": 0.7, "PB": 180},
    "Maïs grain": {"UF": 1.2, "PB": 90},
    "Orge": {"UF": 1.1, "PB": 110},
    "Tourteau de soja": {"UF": 1.1, "PB": 450}
};

const nutrientDetails = {
    "Matière sèche": "Sources: Fourrages (herbe, foin, ensilage) et concentrés.\nRépartition suggérée:\n• 60-80% fourrages\n• 20-40% concentrés\n\nCalcul: 2,5 à 4% du poids vif selon le type d'animal",
    "UF/jour": "L'Unité Fourragère (UF) représente l'énergie de l'alimentation.\nSources: Herbe, ensilage, céréales.\n\nCalcul: Facteur × Poids vif (varie selon le stade physiologique)",
    "Protéines brutes": "Protéines nécessaires pour la production et l'entretien.\nCalcul: % PB × MS consommée\n\nSources principales:\n• Tourteau de soja: 450g/kg\n• Foin de luzerne: 180g/kg",
    "Ensilage de maïs": "Fourrage énergétique principal\n• UF: 0.9/kg\n• PB: 70g/kg\n• Représente généralement 40-60% de la ration de base",
    "Foin de luzerne": "Fourrage riche en protéines\n• UF: 0.7/kg\n• PB: 180g/kg\n• Complément protéique important",
    "Maïs grain": "Concentré énergétique\n• UF: 1.2/kg\n• PB: 90g/kg\n• Utilisé pour compléter l'énergie",
    "Orge": "Céréale énergétique\n• UF: 1.1/kg\n• PB: 110g/kg\n• Alternative au maïs",
    "Tourteau de soja": "Concentré protéique\n• UF: 1.1/kg\n• PB: 450g/kg\n• Principal complément protéique",
    "Minéraux": "Suppléments: Calcium, phosphore, sel, vitamines A, D, E et oligo-éléments.\nDosage: 50-100g/jour selon le poids"
};

// Initialize particles
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        container.appendChild(particle);
    }
}

// Screen management
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName).classList.add('active');
}

// Initialize app
function init() {
    createParticles();
    setTimeout(() => {
        showScreen('opening');
    }, 2500);
}

// Version selection
function setVersion(version) {
    appState.version = version;
    document.getElementById('weightLabel').textContent = 
        version === 'Prototype' ? 'Poids en g' : 'Poids en kg';
    document.getElementById('weightInput').placeholder = 
        version === 'Prototype' ? 'Ex: 450000' : 'Ex: 450';
    showScreen('category');
}

// Category selection
function selectCategory(category) {
    appState.category = category;
    document.getElementById('breedTitle').textContent = `Races ${category.toLowerCase()}`;
    
    const breedList = document.getElementById('breedList');
    breedList.innerHTML = '';
    breedList.className = 'grid';
    
    cowData[category].forEach(breed => {
        const breedCard = document.createElement('div');
        breedCard.className = 'breed-card';
        breedCard.onclick = () => selectBreed(breed);
        
        breedCard.innerHTML = `
            <div class="breed-icon">${getBreedIcon(breed)}</div>
            <div>
                <h3 style="margin-bottom: 0.5rem;">${breed}</h3>
                <p style="color: #94a3b8; font-size: 0.9rem;">Race ${category.toLowerCase()}</p>
            </div>
        `;
        breedList.appendChild(breedCard);
    });
    
    showScreen('breed');
}

function getBreedIcon(breed) {
    const icons = {
        'Holstein': '🐄',
        'Montbéliarde': '🐮',
        'Normande': '🐄',
        'Jersey': '🐮',
        'Charolaise': '🐂',
        'Limousine': '🐄',
        'Aubrac': '🐮',
        "Brune de l'Atlas": '🐂',
        'Guelmoise': '🐄',
        'Salers': '🐮',
        'Simmental': '🐄',
        'Tarentaise': '🐂'
    };
    return icons[breed] || '🐄';
}

// Breed selection
function selectBreed(breed) {
    appState.breed = breed;
    document.getElementById('weightModal').classList.add('active');
}

// Weight input
function submitWeight() {
    const weight = document.getElementById('weightInput').value;
    if (weight && weight > 0) {
        appState.weight = parseInt(weight);
        closeModal();
        showStageSelection();
    } else {
        alert('Veuillez entrer un poids valide');
    }
}

function closeModal() {
    document.getElementById('weightModal').classList.remove('active');
    document.getElementById('weightInput').value = '';
}

// Stage selection
function showStageSelection() {
    const unit = appState.version === 'Prototype' ? 'g' : 'kg';
    document.getElementById('stageTitle').textContent = 
        `${appState.breed} - ${appState.weight} ${unit}`;
    
    const stageList = document.getElementById('stageList');
    stageList.innerHTML = '';
    stageList.className = 'grid grid-2';
    
    physiologicalStages[appState.category].forEach(stage => {
        const stageCard = document.createElement('div');
        stageCard.className = 'glass-card category-card';
        stageCard.onclick = () => selectStage(stage);
        
        stageCard.innerHTML = `
            <div class="category-icon">${getStageIcon(stage)}</div>
            <h3 class="category-title">${stageNames[stage]}</h3>
            <p class="category-desc">Calculer la ration pour ce stade</p>
        `;
        stageList.appendChild(stageCard);
    });
    
    showScreen('stage');
}

function getStageIcon(stage) {
    const icons = {
        'tarie': '😴',
        'gestante': '🤱',
        'lactation': '🥛',
        'engraissement': '💪',
        'croissance': '📈'
    };
    return icons[stage] || '🐄';
}

// Stage selection and calculation
function selectStage(stage) {
    appState.stage = stage;
    calculateNutrition();
}

// Nutrition calculation
function calculateNutrition() {
    const { category, weight, stage, version } = appState;
    
    // Convert weight to kg if needed
    const wkg = version === 'Prototype' ? weight / 1000 : weight;
    
    // Get coefficients
    const coeff = cowNutritionCoefficients[category];
    const stageCoeff = coeff.stages[stage];
    
    // Calculate basic needs
    const MS = wkg * coeff.MS; // Dry matter in kg
    const UF = wkg * stageCoeff.UF; // Energy units
    const PB_kg = MS * stageCoeff.PB; // Protein in kg
    const PB_g = PB_kg * 1000; // Protein in grams
    
    // Calculate feed allocation
    const forage_MS = 0.7 * MS; // 70% of dry matter as forage
    const ensilage_kg = 0.6 * forage_MS;
    const foin_kg = 0.4 * forage_MS;
    
    // Calculate UF and PB provided by forages
    const forage_UF = (ensilage_kg * feedComposition["Ensilage de maïs"].UF + 
                      foin_kg * feedComposition["Foin de luzerne"].UF);
    const forage_PB_g = (ensilage_kg * feedComposition["Ensilage de maïs"].PB + 
                         foin_kg * feedComposition["Foin de luzerne"].PB);
    
    // Calculate remaining UF needs and add cereals
    const remaining_UF = Math.max(0, UF - forage_UF);
    const mais_kg = remaining_UF > 0 ? remaining_UF / feedComposition["Maïs grain"].UF : 0;
    
    // Calculate remaining protein needs and add protein supplements
    const current_PB_g = forage_PB_g + (mais_kg * feedComposition["Maïs grain"].PB);
    const remaining_PB_g = Math.max(0, PB_g - current_PB_g);
    const tourteau_kg = remaining_PB_g > 0 ? remaining_PB_g / feedComposition["Tourteau de soja"].PB : 0;
    
    // Minerals
    const minerals_kg = wkg * 0.001;
    
    // Convert to display units if needed
    const unit = version === 'Prototype' ? 'g' : 'kg';
    let displayMS = MS;
    let displayUF = UF;
    let displayPB = version === 'Prototype' ? PB_g : PB_kg;
    let displayEnsilage = ensilage_kg;
    let displayFoin = foin_kg;
    let displayMais = mais_kg;
    let displayTourteau = tourteau_kg;
    let displayMinerals = minerals_kg;
    
    if (version === 'Prototype') {
        displayMS *= 1000;
        displayUF *= 1000;
        displayEnsilage *= 1000;
        displayFoin *= 1000;
        displayMais *= 1000;
        displayTourteau *= 1000;
        displayMinerals *= 1000;
    }
    
    displayNutritionResults({
        MS: displayMS,
        UF: displayUF,
        PB: displayPB,
        ensilage: displayEnsilage,
        foin: displayFoin,
        mais: displayMais,
        tourteau: displayTourteau,
        minerals: displayMinerals,
        unit
    });
}

// Display nutrition results
function displayNutritionResults(results) {
    const { MS, UF, PB, ensilage, foin, mais, tourteau, minerals, unit } = results;
    const resultsContainer = document.getElementById('nutritionResults');
    
    resultsContainer.innerHTML = `
        <div class="glass-card" style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${getBreedIcon(appState.breed)}</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${appState.breed}</h3>
            <p style="color: #94a3b8;">${stageNames[appState.stage]} - ${appState.weight} ${unit}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="color: #22c55e; margin-bottom: 1rem; font-size: 1.5rem;">
                🎯 Besoins Nutritionnels
            </h3>
            <div class="grid grid-3">
                <div class="nutrition-card" onclick="showDetails('Matière sèche')">
                    <div class="nutrition-title">Matière sèche</div>
                    <div class="nutrition-value">${MS.toFixed(1)} ${unit}</div>
                </div>
                <div class="nutrition-card" onclick="showDetails('UF/jour')">
                    <div class="nutrition-title">UF/jour</div>
                    <div class="nutrition-value">${UF.toFixed(1)} ${unit}</div>
                </div>
                <div class="nutrition-card" onclick="showDetails('Protéines brutes')">
                    <div class="nutrition-title">Protéines brutes</div>
                    <div class="nutrition-value">${PB.toFixed(1)} ${unit}</div>
                </div>
            </div>
        </div>
        
        <div>
            <h3 style="color: #f59e0b; margin-bottom: 1rem; font-size: 1.5rem;">
                🌾 Ration Alimentaire
            </h3>
            <div class="grid grid-2">
                ${ensilage > 0 ? `
                <div class="nutrition-card" onclick="showDetails('Ensilage de maïs')" style="border-left-color: #16a34a;">
                    <div class="nutrition-title">🌽 Ensilage de maïs</div>
                    <div class="nutrition-value">${ensilage.toFixed(1)} ${unit}</div>
                </div>` : ''}
                
                ${foin > 0 ? `
                <div class="nutrition-card" onclick="showDetails('Foin de luzerne')" style="border-left-color: #eab308;">
                    <div class="nutrition-title">🌾 Foin de luzerne</div>
                    <div class="nutrition-value">${foin.toFixed(1)} ${unit}</div>
                </div>` : ''}
                
                ${mais > 0 ? `
                <div class="nutrition-card" onclick="showDetails('Maïs grain')" style="border-left-color: #f59e0b;">
                    <div class="nutrition-title">🌽 Maïs grain</div>
                    <div class="nutrition-value">${mais.toFixed(1)} ${unit}</div>
                </div>` : ''}
                
                ${tourteau > 0 ? `
                <div class="nutrition-card" onclick="showDetails('Tourteau de soja')" style="border-left-color: #84cc16;">
                    <div class="nutrition-title">🫘 Tourteau de soja</div>
                    <div class="nutrition-value">${tourteau.toFixed(1)} ${unit}</div>
                </div>` : ''}
                
                <div class="nutrition-card" onclick="showDetails('Minéraux')" style="border-left-color: #06b6d4;">
                    <div class="nutrition-title">⚡ Minéraux</div>
                    <div class="nutrition-value">${minerals.toFixed(1)} ${unit}</div>
                </div>
            </div>
        </div>
        
        <div class="glass-card" style="margin-top: 2rem; text-align: center;">
            <h4 style="color: #22c55e; margin-bottom: 1rem;">✅ Recommandations</h4>
            <p style="color: #cbd5e1; line-height: 1.6;">
                Cette ration a été calculée selon les standards nutritionnels pour optimiser la santé et la productivité de votre animal. 
                Adaptez les quantités selon les conditions météorologiques et l'état corporel de l'animal.
            </p>
        </div>
    `;
    
    showScreen('nutrition');
}

// Show nutrient details
function showDetails(nutrient) {
    document.getElementById('detailTitle').textContent = `Détails - ${nutrient}`;
    document.getElementById('detailContent').innerHTML = 
        nutrientDetails[nutrient]?.replace(/\n/g, '<br>') || 'Aucune information disponible.';
    document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover sound effect simulation
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('btn') || 
            e.target.classList.contains('category-card') ||
            e.target.classList.contains('breed-card') ||
            e.target.classList.contains('nutrition-card')) {
            e.target.style.transform = e.target.style.transform || '';
        }
    });
    
    // Add click ripple effect
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            e.target.style.position = 'relative';
            e.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
    
    // Initialize the app
    init();
});
