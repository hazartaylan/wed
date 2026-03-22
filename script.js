const targetDate = new Date("2026-08-09T00:00:00+03:00").getTime();
const body = document.body;
const splashScreen = document.getElementById("splashScreen");

const segments = {
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

  segments.days.textContent = String(days).padStart(3, "0");
  segments.hours.textContent = String(hours).padStart(2, "0");
  segments.minutes.textContent = String(minutes).padStart(2, "0");
  segments.seconds.textContent = String(seconds).padStart(2, "0");
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
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  observer.observe(element);
});

const unlockInvitation = () => {
  if (!body.classList.contains("is-locked")) {
    return;
  }

  body.classList.add("is-opening");

  window.setTimeout(() => {
    body.classList.remove("is-locked", "is-opening");
    body.classList.add("is-unlocked");
    splashScreen?.setAttribute("aria-hidden", "true");
  }, 900);
};

const calendarButton = document.getElementById("calendarButton");

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
  link.download = "dugun-daveti-9-agustos-2026.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

updateCountdown();

window.setTimeout(unlockInvitation, 500);

window.setInterval(updateCountdown, 1000);
