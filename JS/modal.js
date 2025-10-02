
const modal = document.getElementById("formModal");
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeFormBtn");

openBtn.addEventListener("click", () => modal.style.display = "block");
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});