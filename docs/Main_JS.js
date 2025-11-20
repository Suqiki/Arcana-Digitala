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



// carusel
const track = document.querySelector('.carousel-track');
let slides = Array.from(track.children); // toate slide-urile inițiale
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dotsContainer = document.querySelector('.carousel-dots');

if (track && slides.length > 0) {
    let index = 1; // start pe primul slide real
    let autoSlide;

    // Clone primul și ultimul slide
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    // Recalculăm slides după clone
    slides = Array.from(track.children);

    // Setăm track la primul slide real
    track.style.transform = `translateX(-${index * 100}%)`;

    // Creăm bulele
    slides.slice(1, slides.length-1).forEach((_, i) => {
        const dot = document.createElement('button');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('button');

    const moveToSlide = (i) => {
        index = i;
        track.style.transition = 'transform 0.8s ease';
        track.style.transform = `translateX(-${index * 100}%)`;

        // Actualizare bule
        let activeIndex = index - 1;
        if(activeIndex < 0) activeIndex = slides.length - 3;
        if(activeIndex > slides.length - 3) activeIndex = 0;
        dots.forEach(d => d.classList.remove('active'));
        dots[activeIndex].classList.add('active');
    };

    // Detectăm când tranziția s-a terminat pe clone
    track.addEventListener('transitionend', () => {
        if (slides[index].id === 'first-clone') {
            track.style.transition = 'none';
            index = 1;
            track.style.transform = `translateX(-${index * 100}%)`;
        }
        if (slides[index].id === 'last-clone') {
            track.style.transition = 'none';
            index = slides.length - 2;
            track.style.transform = `translateX(-${index * 100}%)`;
        }
    });

    const startAuto = () => {
        autoSlide = setInterval(() => moveToSlide(index + 1), 4000);
    };
    const stopAuto = () => clearInterval(autoSlide);

    // Butoane
    prevBtn.addEventListener('click', () => { moveToSlide(index - 1); stopAuto(); startAuto(); });
    nextBtn.addEventListener('click', () => { moveToSlide(index + 1); stopAuto(); startAuto(); });

    // Bule click
    dots.forEach((dot, i) => { dot.addEventListener('click', () => { moveToSlide(i + 1); stopAuto(); startAuto(); }); });

    // Pauză hover
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    // Start automat
    startAuto();
}


// ===================================
// Logica de extragere carte (Draw Card)
// ===================================

const drawCardButton = document.getElementById('drawCard');
const drawnCardImage = document.getElementById('drawnCardImage');
const cardInfoDiv = document.getElementById('cardInfo');
const cardTitleH3 = document.getElementById('cardTitle');
const cardOrientationP = document.getElementById('cardOrientation');
const helpLinkA = document.getElementById('helpLink');

// Definirea pachetului de cărți (simplificat, folosind numele și calea)
const fullTarotDeck = [
    // --- ARCANE MAJORE (Index 0-21) ---
    { id: 'Nebunul', path: 'Imagini/Tarot/Arcane Majore/00-TheFool.jpg', anchor: '#arcane-majore' },
    { id: 'Magicianul', path: 'Imagini/Tarot/Arcane Majore/01-TheMagician.jpg', anchor: '#arcane-majore' },
    { id: 'Marea Preoteasă', path: 'Imagini/Tarot/Arcane Majore/02-TheHighPriestess.jpg', anchor: '#arcane-majore' },
    { id: 'Împărăteasa', path: 'Imagini/Tarot/Arcane Majore/03-TheEmpress.jpg', anchor: '#arcane-majore' },
    { id: 'Împăratul', path: 'Imagini/Tarot/Arcane Majore/04-TheEmperor.jpg', anchor: '#arcane-majore' },
    { id: 'Hierofantul', path: 'Imagini/Tarot/Arcane Majore/05-TheHierophant.jpg', anchor: '#arcane-majore' },
    { id: 'Îndrăgostiții', path: 'Imagini/Tarot/Arcane Majore/06-TheLovers.jpg', anchor: '#arcane-majore' },
    { id: 'Carul', path: 'Imagini/Tarot/Arcane Majore/07-TheChariot.jpg', anchor: '#arcane-majore' },
    { id: 'Puterea', path: 'Imagini/Tarot/Arcane Majore/08-Strength.jpg', anchor: '#arcane-majore' },
    { id: 'Sihastrul', path: 'Imagini/Tarot/Arcane Majore/09-TheHermit.jpg', anchor: '#arcane-majore' },
    { id: 'Roata Norocului', path: 'Imagini/Tarot/Arcane Majore/10-WheelOfFortune.jpg', anchor: '#arcane-majore' },
    { id: 'Dreptatea', path: 'Imagini/Tarot/Arcane Majore/11-Justice.jpg', anchor: '#arcane-majore' },
    { id: 'Spânzuratul', path: 'Imagini/Tarot/Arcane Majore/12-TheHangedMan.jpg', anchor: '#arcane-majore' },
    { id: 'Moartea', path: 'Imagini/Tarot/Arcane Majore/13-Death.jpg', anchor: '#arcane-majore' },
    { id: 'Temperanța', path: 'Imagini/Tarot/Arcane Majore/14-Temperance.jpg', anchor: '#arcane-majore' },
    { id: 'Diavolul', path: 'Imagini/Tarot/Arcane Majore/15-TheDevil.jpg', anchor: '#arcane-majore' },
    { id: 'Turnul', path: 'Imagini/Tarot/Arcane Majore/16-TheTower.jpg', anchor: '#arcane-majore' },
    { id: 'Steaua', path: 'Imagini/Tarot/Arcane Majore/17-TheStar.jpg', anchor: '#arcane-majore' },
    { id: 'Luna', path: 'Imagini/Tarot/Arcane Majore/18-TheMoon.jpg', anchor: '#arcane-majore' },
    { id: 'Soarele', path: 'Imagini/Tarot/Arcane Majore/19-TheSun.jpg', anchor: '#arcane-majore' },
    { id: 'Judecata', path: 'Imagini/Tarot/Arcane Majore/20-Judgement.jpg', anchor: '#arcane-majore' },
    { id: 'Lumea', path: 'Imagini/Tarot/Arcane Majore/21-TheWorld.jpg', anchor: '#arcane-majore' },

    // --- ARCANE MINORE (14 cărți x 4 suite) ---
    // Cupe (Cups) - De la 1 la 14
    { id: 'Asul de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups01.jpg', anchor: '#cupe' },
    { id: 'Doi de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups02.jpg', anchor: '#cupe' },
    { id: 'Trei de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups03.jpg', anchor: '#cupe' },
    { id: 'Patru de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups04.jpg', anchor: '#cupe' },
    { id: 'Cinci de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups05.jpg', anchor: '#cupe' },
    { id: 'Șase de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups06.jpg', anchor: '#cupe' },
    { id: 'Șapte de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups07.jpg', anchor: '#cupe' },
    { id: 'Opt de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups08.jpg', anchor: '#cupe' },
    { id: 'Nouă de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups09.jpg', anchor: '#cupe' },
    { id: 'Zece de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups10.jpg', anchor: '#cupe' },
    { id: 'Valet de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups11.jpg', anchor: '#cupe' },
    { id: 'Cal de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups12.jpg', anchor: '#cupe' },
    { id: 'Regină de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups13.jpg', anchor: '#cupe' },
    { id: 'Rege de Cupe', path: 'Imagini/Tarot/Arcane Minore/Cup/Cups14.jpg', anchor: '#cupe' },

    // Bâte (Wands)
    { id: 'Asul de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands01.jpg', anchor: '#bate' },
    { id: 'Doi de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands02.jpg', anchor: '#bate' },
    { id: 'Trei de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands03.jpg', anchor: '#bate' },
    { id: 'Patru de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands04.jpg', anchor: '#bate' },
    { id: 'Cinci de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands05.jpg', anchor: '#bate' },
    { id: 'Șase de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands06.jpg', anchor: '#bate' },
    { id: 'Șapte de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands07.jpg', anchor: '#bate' },
    { id: 'Opt de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands08.jpg', anchor: '#bate' },
    { id: 'Nouă de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands09.jpg', anchor: '#bate' },
    { id: 'Zece de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands10.jpg', anchor: '#bate' },
    { id: 'Paget de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands11.jpg', anchor: '#bate' },
    { id: 'Cavalerul de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands12.jpg', anchor: '#bate' },
    { id: 'Regina de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands13.jpg', anchor: '#bate' },
    { id: 'Regele de Bâte', path: 'Imagini/Tarot/Arcane Minore/Wand/Wands14.jpg', anchor: '#bate' },

    // Monede (Pentacles)
    { id: 'Asul de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles01.jpg', anchor: '#monede' },
    { id: 'Doi de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles02.jpg', anchor: '#monede' },
    { id: 'Trei de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles03.jpg', anchor: '#monede' },
    { id: 'Patru de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles04.jpg', anchor: '#monede' },
    { id: 'Cinci de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles05.jpg', anchor: '#monede' },
    { id: 'Șase de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles06.jpg', anchor: '#monede' },
    { id: 'Șapte de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles07.jpg', anchor: '#monede' },
    { id: 'Opt de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles08.jpg', anchor: '#monede' },
    { id: 'Nouă de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles09.jpg', anchor: '#monede' },
    { id: 'Zece de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles10.jpg', anchor: '#monede' },
    { id: 'Paget de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles11.jpg', anchor: '#monede' },
    { id: 'Cavalerul de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles12.jpg', anchor: '#monede' },
    { id: 'Regina de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles13.jpg', anchor: '#monede' },
    { id: 'Rege de Monede', path: 'Imagini/Tarot/Arcane Minore/Pentacle/Pentacles14.jpg', anchor: '#monede' },
    
    // Spade (Swords)
    { id: 'Asul de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords01.jpg', anchor: '#spada' },
    { id: 'Doi de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords02.jpg', anchor: '#spada' },
    { id: 'Trei de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords03.jpg', anchor: '#spada' },
    { id: 'Patru de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords04.jpg', anchor: '#spada' },
    { id: 'Cinci de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords05.jpg', anchor: '#spada' },
    { id: 'Șase de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords06.jpg', anchor: '#spada' },
    { id: 'Șapte de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords07.jpg', anchor: '#spada' },
    { id: 'Opt de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords08.jpg', anchor: '#spada' },
    { id: 'Nouă de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords09.jpg', anchor: '#spada' },
    { id: 'Zece de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords10.jpg', anchor: '#spada' },
    { id: 'Valet de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords11.jpg', anchor: '#spada' },
    { id: 'Cavaler de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords12.jpg', anchor: '#spada' },
    { id: 'Regină de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords13.jpg', anchor: '#spada' },
    { id: 'Rege de Spade', path: 'Imagini/Tarot/Arcane Minore/Sword/Swords14.jpg', anchor: '#spada' },
];

function drawRandomCard() {
    // 1. Alege o carte la întâmplare
    const randomIndex = Math.floor(Math.random() * fullTarotDeck.length);
    const drawnCard = fullTarotDeck[randomIndex];

    // 2. Decide orientarea (normală sau inversată)
    const isReversed = Math.random() < 0.5; // 50% șanse de a fi inversată

    // 3. Afișează imaginea
    drawnCardImage.src = drawnCard.path;
    drawnCardImage.alt = drawnCard.id;
    drawnCardImage.style.display = 'block';
    
    // 4. Aplică rotația (inversată)
    if (isReversed) {
        drawnCardImage.style.transform = 'rotate(180deg)';
        cardOrientationP.textContent = 'Orientare: Întoarsă (Reversed)';
        cardOrientationP.style.color = '#ff6347'; // Roșu/Portocaliu pentru a marca inversarea
    } else {
        drawnCardImage.style.transform = 'rotate(0deg)';
        cardOrientationP.textContent = 'Orientare: Normală (Upright)';
        cardOrientationP.style.color = '#4e8f0dff'; // Verde pentru a marca orientarea normală
    }
    
    // 5. Actualizează textul și link-ul de ajutor
    cardTitleH3.textContent = drawnCard.id;
    
    // Construiește URL-ul către pagina de semnificații (carti.html)
    // Link-ul merge la titlul secțiunii (Arcane Majore, #cupe, #spada etc.)
    helpLinkA.href = `03.Carti si Semnificatii/carti.html${drawnCard.anchor}`;
    
    // 6. Afișează rezultatul
    cardInfoDiv.style.display = 'block';
}

if (drawCardButton) {
    drawCardButton.addEventListener('click', drawRandomCard);
}
