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
