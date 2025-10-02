// Navbar scroll
window.addEventListener("scroll", () => {
    document.querySelector("nav").classList.toggle("scrolled", window.scrollY > 50);
});

// Menu responsivo
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    menuBtnIcon.className = isOpen ? 'ri-close-line' : 'ri-menu-line';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtnIcon.className = 'ri-menu-line';
    });
});