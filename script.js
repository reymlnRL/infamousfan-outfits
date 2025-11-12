const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-tab");

    if (tab === "generate") {
      const choice = confirm("🚧 Esta página está en mantenimiento.\n¿Deseas continuar de todos modos?");
      if (!choice) return; // si no quiere continuar, se queda donde está
    }

    contents.forEach(c => c.classList.remove("active"));
    document.getElementById(tab).classList.add("active");
  });
});
