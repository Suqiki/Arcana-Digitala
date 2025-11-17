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
// Logica Formularului
// ===========================
const form = document.getElementById('cardIdeaForm');
const successModal = document.getElementById('successModal'); // Noul ID al pop-up-ului
const closeModalBtn = document.getElementById('closeModal');

if (form && successModal) {
    
    // Asigurăm că modalul este ascuns la încărcarea paginii
    successModal.classList.add('hidden'); 

    // Funcția de afișare/trimitere
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // Extrage și validează câmpurile obligatorii
        const nume = document.getElementById('nume').value.trim();
        const email = document.getElementById('email').value.trim();
        const carte = document.getElementById('carte').value;
        const idee = document.getElementById('idee').value.trim();

        if (nume === "" || email === "" || carte === "" || idee === "") {
            alert("Vă rugăm să completați toate câmpurile obligatorii.");
            return;
        }

        // 1. Resetează formularul (îl face gol)
        form.reset(); 
        
        // 2. Afișează modalul de succes
        successModal.classList.remove('hidden'); 
    });

    // Logica pentru închiderea modalului când se apasă butonul
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.add('hidden');
    });

    // Opțional: Închide modalul dacă utilizatorul dă click în afara lui (pe overlay)
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.add('hidden');
        }
    });
}