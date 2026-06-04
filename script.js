const canvas = document.querySelector("#signal-field");
const ctx = canvas.getContext("2d");
const cursor = document.querySelector(".cursor");
const dot = document.querySelector(".cursor-dot");
const form = document.querySelector("#terminal-form");
const input = document.querySelector("#command-input");
const log = document.querySelector("#terminal-log");
const toast = document.querySelector("#toast");
const panicButton = document.querySelector("#panic-button");
const copySignal = document.querySelector("#copy-signal");

let width = 0;
let height = 0;
let nodes = [];
let toastTimer = 0;

const commands = {
  lore: {
    target: "#lore",
    message: "opening origin.story: human context mounted.",
  },
  experiments: {
    target: "#experiments",
    message: "case.files unlocked: three evidence packets found.",
  },
  internship: {
    target: "#internship",
    message: "experience.logs mounted: Telkom internship plus practicum assistant timeline found.",
  },
  scan: {
    action: () => {
      appendLog("scan", "identity: Universitas Pertamina student / software builder.");
      appendLog("scan", "experience: Telkom Indonesia intern, Web Programming PA, OOP PA x2, Operating Systems PA.");
      appendLog("scan", "proof: dashboardtws.cloud, MagangTelkom-Dashboard, cv.pdf.");
      appendLog("scan", "stack: Java, Python, C/C++, PHP, TypeScript, Swift, MySQL, Laravel/Blade.");
      document.querySelector("#telkom-case").scrollIntoView({ behavior: "smooth", block: "center" });
    },
    message: "scan complete.",
  },
  source: {
    target: "#source",
    message: "repository.access granted: 30 public repos, LinkedIn dossier linked.",
  },
  cv: {
    target: "#source",
    message: "cv dossier available: cv.pdf",
  },
  linkedin: {
    target: "#source",
    message: "external dossier located: linkedin.com/in/ferdinandtj",
  },
  signal: {
    target: "#signal",
    message: "send.signal ready: ferdinandtj4@gmail.com, LinkedIn, or GitHub.",
  },
  chaos: {
    action: () => toggleChaos("chaos mode toggled from terminal."),
  },
  help: {
    message: "commands: scan, lore, internship, experiments, source, cv, linkedin, signal, chaos. secret: double click the forbidden button.",
  },
};

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  const count = Math.max(28, Math.floor(window.innerWidth / 28));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45 * window.devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.45 * window.devicePixelRatio,
    r: (Math.random() * 2 + 1) * window.devicePixelRatio,
  }));
}

function drawField() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(139, 214, 199, 0.62)";
  ctx.strokeStyle = "rgba(255, 107, 53, 0.2)";
  ctx.lineWidth = window.devicePixelRatio;

  nodes.forEach((node, index) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < nodes.length; next += 1) {
      const other = nodes[next];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150 * window.devicePixelRatio) {
        ctx.globalAlpha = 1 - distance / (150 * window.devicePixelRatio);
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  });

  requestAnimationFrame(drawField);
}

function appendLog(prefix, text) {
  const line = document.createElement("p");
  line.innerHTML = `<span>${prefix}</span> ${text}`;
  log.append(line);
  log.scrollTop = log.scrollHeight;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;

  appendLog("you", command);
  const entry = commands[command];

  if (!entry) {
    appendLog("system", `unknown command "${command}". try help.`);
    showToast("Unknown command. The machine is dramatic, not psychic.");
    return;
  }

  if (entry.action) {
    entry.action();
    appendLog("system", entry.message || "done.");
    return;
  }

  appendLog("system", entry.message);
  if (entry.target) {
    document.querySelector(entry.target).scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function toggleChaos(message = "easter egg unlocked: brutalist overdrive online.") {
  document.body.classList.toggle("chaos");
  showToast(message);
}

function moveCursor(event) {
  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;
  cursor.style.transform = `translate(${x}, ${y}) translate(-50%, -50%)`;
  dot.style.transform = `translate(${x}, ${y}) translate(-50%, -50%)`;
}

function tiltArtifact(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  const baseTransform = getComputedStyle(card).getPropertyValue("--base-transform").trim();
  card.style.setProperty("--tilt-x", `${y * -7}deg`);
  card.style.setProperty("--tilt-y", `${x * 7}deg`);
  card.style.transform = `perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) ${baseTransform}`;
}

function resetTilt(event) {
  event.currentTarget.style.transform = "var(--base-transform)";
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", moveCursor);

document.querySelectorAll("a, button, input").forEach((item) => {
  item.addEventListener("pointerenter", () => document.body.classList.add("is-hovering"));
  item.addEventListener("pointerleave", () => document.body.classList.remove("is-hovering"));
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.dataset.command;
    input.value = command;
    runCommand(command);
    input.value = "";
  });
});

document.querySelectorAll("[data-tilt]").forEach((artifact) => {
  artifact.addEventListener("pointermove", tiltArtifact);
  artifact.addEventListener("pointerleave", resetTilt);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

panicButton.addEventListener("dblclick", () => toggleChaos());

copySignal.addEventListener("click", async () => {
  const signal = "Email: ferdinandtj4@gmail.com | GitHub: https://github.com/FerdinandTJ/ | LinkedIn: https://www.linkedin.com/in/ferdinandtj";

  try {
    await navigator.clipboard.writeText(signal);
    showToast("Signal copied: email, GitHub, and LinkedIn.");
  } catch {
    showToast(signal);
  }
});

resizeCanvas();
drawField();
