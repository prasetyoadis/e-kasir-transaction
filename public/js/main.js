const container = document.getElementById("container");
const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

toRegister.addEventListener("click", () => {
    container.classList.add("active");
});

toLogin.addEventListener("click", () => {
    container.classList.remove("active");
});
