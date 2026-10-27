// Interviewer dossier modal: open/close, Esc to close, copy-email button.
function setupDossier() {
  const modal = document.querySelector<HTMLElement>("[data-dossier]");
  if (!modal) return;

  const openBtns = document.querySelectorAll<HTMLElement>("[data-open-dossier]");
  const closeBtns = modal.querySelectorAll<HTMLElement>("[data-dossier-close]");
  const copyBtn = modal.querySelector<HTMLButtonElement>("[data-copy-email]");

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtns.forEach(btn => btn.addEventListener("click", open));
  closeBtns.forEach(btn => btn.addEventListener("click", close));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      close();
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.copyEmail || "siddharthmukherjee.cs@gmail.com";
      const label = copyBtn.querySelector<HTMLElement>("[data-copy-label]");
      try {
        await navigator.clipboard.writeText(email);
        if (label) label.textContent = "✔ Email Copied!";
        setTimeout(() => {
          if (label) label.textContent = "📋 Copy Email";
        }, 2500);
      } catch {
        if (label) label.textContent = email;
      }
    });
  }
}

// Setup on page load
setupDossier();
document.addEventListener("astro:page-load", setupDossier);
