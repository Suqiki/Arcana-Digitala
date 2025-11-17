const toggleBtn = document.getElementById("themeToggle");
const hamburger = document.getElementById('hamburger');
const navList = document.querySelector('.nav-list');
const mainDropdowns = document.querySelectorAll('.dropdown');
const subDropdowns = document.querySelectorAll('.dropdown-sub');

// ===========================
// Tema dark/light
// ===========================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.documentElement.classList.add("light-mode");
    toggleBtn.textContent = "☀️";
} else {
    toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-mode");
    if (document.documentElement.classList.contains("light-mode")) {
        toggleBtn.textContent = "☀️";
        localStorage.setItem("theme", "light");
    } else {
        toggleBtn.textContent = "🌙";
        localStorage.setItem("theme", "dark");
    }
});

// ===========================
// Toggle navbar mobil
// ===========================
hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navList.classList.toggle("show");
});

// ===========================
// Dropdown principal (Cărți și Semnificații) – mobil
// ===========================
const mainToggles = document.querySelectorAll(".dropdown-toggle");
mainToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const drop = toggle.closest(".dropdown");
        drop.classList.toggle("show");
    });
});

// Subdropdown mobil
const subToggles = document.querySelectorAll(".sub-toggle");
subToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const sub = toggle.closest(".dropdown-sub");
        sub.classList.toggle("show");
    });
});

// ===========================
// Click în afara meniului (curăță meniul și dropdown-urile)
// ===========================
document.addEventListener("click", (e) => {
    if (window.innerWidth <= 600) {
        if (e.target !== hamburger && !navList.contains(e.target)) {

            // Închide meniul principal
            navList.classList.remove("show");

            // Închide toate dropdown-urile
            mainDropdowns.forEach(d => {
                d.classList.remove("show");
                d.querySelectorAll(".dropdown-sub").forEach(s => s.classList.remove("show"));
            });
        }
    }
});

// ===========================
// Butoane sus jos
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
    const scrollTopBtn = document.getElementById("scrollTop");
    const scrollBottomBtn = document.getElementById("scrollBottom");

    // Verifică dacă butoanele există înainte de a adăuga evenimente
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            // Scroll Sus
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener("click", () => {
            // Scroll Jos: Utilizează document.body.scrollHeight pentru a ajunge la baza paginii
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        });
    }
});

// ===================================
// Logica de căutare dinamică (Filtrare)
// ===================================

const cardSearchInput = document.getElementById('cardSearch');
const allCards = document.querySelectorAll('.carte');
// Selectăm atât titlurile principale cât și subtitlurile pentru a le ascunde/arăta
const sectionTitles = document.querySelectorAll('.section-title, .section-title-sub'); 

if (cardSearchInput) {
    cardSearchInput.addEventListener('keyup', searchCards);
}

function normalizeText(text) {
    // Înlocuiește diacriticele și convertește la litere mici
    // Face textul "Șase" -> "sase", sau "Doi de Spade" -> "doi de spade"
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function mapNumberWord(term) {
    // Mapează cuvintele numerice cheie ȘI CIFRELE la o valoare numerică standardizată pentru căutare
    const numberMap = {
        'asul': '1', 'unul': '1', '1': '1',
        'doi': '2', '2': '2',
        'trei': '3', '3': '3',
        'patru': '4', '4': '4',
        'cinci': '5', '5': '5',
        'sase': '6', 'șase': '6', '6': '6',
        'sapte': '7', 'șapte': '7', '7': '7',
        'opt': '8', '8': '8',
        'noua': '9', '9': '9',
        'zece': '10', '10': '10',
        
        // Cărți de curte
        'valet': 'valet', 'paget': 'valet', '11': 'valet', 
        'cal': 'cal', 'cavalerul': 'cal', '12': 'cal', 
        'regina': 'regina', '13': 'regina',
        'rege': 'rege', '14': 'rege'
    };

    const normalized = normalizeText(term);
    
    // Returnează echivalentul standardizat (ex: '4') sau termenul original dacă nu este mapat
    return numberMap[normalized] || normalized;
}


function searchCards() {
    const searchTerm = normalizeText(cardSearchInput.value.trim());

    allCards.forEach(card => {
        const titleElement = card.querySelector('h3');
        let cardText = '';
        let cardNumericalMatch = ''; // Valoarea standardizată a numărului cărții (ex: '4', 'rege')

        if (titleElement) {
            const title = normalizeText(titleElement.textContent);
            cardText = title; // Ex: "patru de monede"

            // 1. Încearcă să extragi cuvântul/numărul cărții din titlu (ex: "patru")
            const numberMatch = title.match(/^(asul|doi|trei|patru|cinci|sase|sapte|opt|noua|zece|valet|paget|cal|cavalerul|regina|rege)/);
            if (numberMatch) {
                // 2. Converteste cuvântul extras în valoarea standardizată (ex: "patru" -> "4")
                cardNumericalMatch = mapNumberWord(numberMatch[0]); 
            }
            
            // Adaugă numele suitelor la text (Cupe, Bate, Monede, Spade)
            // Căutare după suita ("cupe") sau semnificații.
            cardText += ' ' + card.parentNode.parentNode.id.replace(/-/g, ' '); // Adaugă "arcane majore", "arcane minore"
            
            // Adaugă textul cheie din semnificațiile Upright/Reversed
            const contentElements = card.querySelectorAll('p strong');
             contentElements.forEach(strong => {
                cardText += ' ' + normalizeText(strong.parentNode.textContent);
            });
        }
        
        // ----------------------------------------------------
        // LOGICA DE POTRIVIRE FINALĂ
        // ----------------------------------------------------
        let isMatch = false;
        
        // 1. Potrivire directă de text (ex: "moartea", "cupe", "succes")
        if (cardText.includes(searchTerm)) {
            isMatch = true;
        }

        // 2. Potrivire numerică (Termenul căutat convertit se potrivește cu numărul standardizat al cărții)
        // Ex: Caut '4' -> mapNumberWord('4') = '4'. cardNumericalMatch = '4' (de la "Patru de Cupe") -> Match.
        // Ex: Caut 'patru' -> mapNumberWord('patru') = '4'. cardNumericalMatch = '4' -> Match.
        const mappedSearchTerm = mapNumberWord(searchTerm);
        if (!isMatch && cardNumericalMatch && mappedSearchTerm === cardNumericalMatch) {
            isMatch = true;
        }
        
        // Afișează sau ascunde cartea
        card.style.display = isMatch ? 'block' : 'none';
    });

    // Ajustează vizibilitatea titlurilor secțiunilor
    adjustSectionVisibility();
}

// Această funcție ascunde titlurile (Arcane Majore, Cupe etc.) dacă nu există cărți vizibile sub ele.
function adjustSectionVisibility() {
    sectionTitles.forEach(title => {
        // Găsește următorul element relevant (grid-ul)
        let nextSibling = title.nextElementSibling;
        let grid = null;

        // Caută elementul carti-grid asociat
        while (nextSibling && nextSibling.tagName !== 'DIV' && !nextSibling.classList.contains('carti-grid')) {
            nextSibling = nextSibling.nextElementSibling;
        }
        if (nextSibling && nextSibling.classList.contains('carti-grid')) {
            grid = nextSibling;
        }

        // Dacă nu găsește gridul imediat următor, presupunem că nu ar trebui ascuns.
        if (grid) {
            const visibleCards = Array.from(grid.querySelectorAll('.carte')).filter(
                // Filtrează doar cardurile care nu au display: none
                card => card.style.display !== 'none'
            );

            // Ascunde titlul dacă nu există cărți vizibile
            title.style.display = visibleCards.length === 0 ? 'none' : 'block';
        }
    });
}

