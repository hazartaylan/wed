const targetDate = new Date("2026-08-09T00:00:00+03:00").getTime();

const body = document.body;
const introScreen = document.getElementById("introScreen");
const calendarButton = document.getElementById("calendarButton");
const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");

const countdownSegments = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const updateCountdown = () => {
  const now = Date.now();
  const difference = Math.max(targetDate - now, 0);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  countdownSegments.days.textContent = String(days).padStart(3, "0");
  countdownSegments.hours.textContent = String(hours).padStart(2, "0");
  countdownSegments.minutes.textContent = String(minutes).padStart(2, "0");
  countdownSegments.seconds.textContent = String(seconds).padStart(2, "0");
};

const dismissIntro = () => {
  if (!introScreen || introScreen.classList.contains("is-opening")) {
    return;
  }

  body.classList.remove("intro-active");
  body.classList.add("intro-opening");
  introScreen.classList.add("is-opening");

  window.setTimeout(() => {
    introScreen.classList.add("is-hidden");
    introScreen.setAttribute("aria-hidden", "true");
    body.classList.remove("intro-opening");
  }, 1450);
};

const instantDismissIntro = () => {
  body.classList.remove("intro-active", "intro-opening");
  introScreen?.classList.add("is-hidden");
  introScreen?.setAttribute("aria-hidden", "true");
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  },
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  observer.observe(element);
});

calendarButton?.addEventListener("click", () => {
  const icsFile = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//TR",
    "BEGIN:VEVENT",
    "UID:wedding-20260809@invite",
    "DTSTAMP:20260322T000000Z",
    "DTSTART;VALUE=DATE:20260809",
    "DTEND;VALUE=DATE:20260810",
    "SUMMARY:Büşra ve Hazar Düğünü",
    "LOCATION:Beylerbeyi Polisevi",
    "DESCRIPTION:Büşra ve Hazar'ın düğünü 9 Ağustos 2026 tarihinde Beylerbeyi Polisevi'nde.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsFile], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "busra-hazar-dugun.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

rsvpForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const payload = {
    name: formData.get("name"),
    attendance: formData.get("attendance"),
    guestCount: formData.get("guestCount"),
    note: formData.get("note"),
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem("wedding-rsvp-demo", JSON.stringify(payload));

  if (rsvpStatus) {
    rsvpStatus.textContent = "Teşekkürler. Yanıtınız bu tarayıcıda demo olarak kaydedildi.";
  }

  rsvpForm.reset();
});

updateCountdown();
window.setInterval(updateCountdown, 1000);

introScreen?.addEventListener("click", dismissIntro);
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    dismissIntro();
  }
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  instantDismissIntro();
}
