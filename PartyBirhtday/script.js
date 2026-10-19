import * as THREE from "three";

/* UBAH NAMA DAN TANGGAL DI SINI */
const CONFIG = {
  name: "my love",
  birthdayMonth: 10,
  birthdayDay: 20,
  musicFile: "birthday.mp3"
};

/* NAMA PACAR */
document.getElementById("introName").textContent = CONFIG.name;
document.getElementById("boyName").textContent = CONFIG.name;
document.getElementById("letterName").textContent = CONFIG.name;


/* AMPLOP ROMANTIS — MIDNIGHT LOVE */
const introScreen = document.getElementById("introScreen");
const envelopeBtn = document.getElementById("envelopeBtn");
const envelopeHint = document.getElementById("envelopeHint");
const skipIntro = document.getElementById("skipIntro");
const letterReveal = document.getElementById("letterReveal");
const introLoveMessage = document.getElementById("introLoveMessage");

let introOpened = false;
let introSequenceRunning = false;

function openBirthdayWorld(skipAnimation = false) {
  if (introOpened || introSequenceRunning) return;

  introSequenceRunning = true;

  // Tombol langsung dinonaktifkan agar tidak diklik berulang kali.
  envelopeBtn.disabled = true;
  skipIntro.disabled = true;

  // Jika pengguna memilih skip, langsung masuk ke halaman utama.
  if (skipAnimation) {
    showBirthdayPage();
    return;
  }

  // Tahap 1: amplop mulai terbuka.
  envelopeBtn.classList.add("opened");
  envelopeHint.textContent = "OPENING A LITTLE LOVE LETTER…";

  // Tahap 2: munculkan kata-kata romantis setelah surat mulai naik.
  setTimeout(() => {
    if (introLoveMessage) {
      introLoveMessage.classList.add("show");
    }

    envelopeHint.textContent = "A LITTLE LOVE, JUST FOR YOU ♡";
  }, 900);

  // Tahap 3: beri waktu untuk menikmati animasi sebelum masuk.
  setTimeout(() => {
    showBirthdayPage();
  }, 3800);
}

function showBirthdayPage() {
  if (introOpened) return;

  introOpened = true;

  // Musik mulai diputar setelah interaksi pengguna.
  if (music) {
    music.volume = 0.5;

    music.play()
      .then(() => {
        if (musicBtn) {
          musicBtn.innerHTML = "♫ <span>Pause music</span>";
        }
      })
      .catch((error) => {
        console.warn("Musik belum bisa diputar otomatis:", error);
      });
  }

  introScreen.classList.add("hidden");

  setTimeout(() => {
    introScreen.style.display = "none";
  }, 900);
}

envelopeBtn.addEventListener("click", () => {
  openBirthdayWorld(false);
});

skipIntro.addEventListener("click", () => {
  openBirthdayWorld(true);
});

/* COUNTDOWN */
function updateCountdown() {
  const now = new Date();

  let target = new Date(
    now.getFullYear(),
    CONFIG.birthdayMonth - 1,
    CONFIG.birthdayDay,
    0, 0, 0
  );

  if (target <= now) {
    target = new Date(
      now.getFullYear() + 1,
      CONFIG.birthdayMonth - 1,
      CONFIG.birthdayDay,
      0, 0, 0
    );
  }

  const diff = Math.max(0, target.getTime() - now.getTime());

  document.getElementById("days").textContent =
    String(Math.floor(diff / 86400000)).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

  const isBirthday =
    now.getMonth() === CONFIG.birthdayMonth - 1 &&
    now.getDate() === CONFIG.birthdayDay;

  document.getElementById("countdownMessage").textContent =
    isBirthday
      ? "TODAY IS YOUR DAY. HAPPY BIRTHDAY, MY LOVE! ♡"
      : "Every second brings us closer to your day ♡";
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* MUSIK */
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

music.src = CONFIG.musicFile;

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicBtn.innerHTML = "♫ <span>Pause music</span>";
    } catch (error) {
      alert(
        "Musik belum bisa diputar. Pastikan file birthday.mp3 berada di folder yang sama dengan index.html."
      );
    }
  } else {
    music.pause();
    musicBtn.innerHTML = "♫ <span>Play music</span>";
  }
});

/* BACKGROUND BINTANG 3D */
const universe = document.getElementById("universe");

try {
  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.PerspectiveCamera(
    65, window.innerWidth / window.innerHeight, 0.1, 100
  );

  bgCamera.position.z = 5;

  const bgRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  bgRenderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.5)
  );

  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  universe.appendChild(bgRenderer.domElement);

  const positions = [];

  for (let i = 0; i < 650; i++) {
    positions.push(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 15
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0x9ab7ff,
    size: 0.025,
    transparent: true,
    opacity: 0.8
  });

  const stars = new THREE.Points(geometry, material);
  bgScene.add(stars);

  function animateBackground() {
    requestAnimationFrame(animateBackground);
    stars.rotation.y += 0.00025;
    stars.rotation.x += 0.00008;
    bgRenderer.render(bgScene, bgCamera);
  }

  animateBackground();

  window.addEventListener("resize", () => {
    bgCamera.aspect = window.innerWidth / window.innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
  });
} catch (error) {
  console.error("Background stars gagal dimuat:", error);
}

/* KUE ULANG TAHUN 3D */
const container = document.getElementById("cakeScene");

let flame = null;
let flameLight = null;
let candleBlown = false;

try {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 2.1, 8.4);
  camera.lookAt(0, 0.75, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.75)
  );

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xb9ccff, 1.55));

  const keyLight = new THREE.PointLight(0x91b5ff, 45, 16);
  keyLight.position.set(3, 4, 4);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x8c6aff, 20, 12);
  fillLight.position.set(-3, 1, -2);
  scene.add(fillLight);

  const cake = new THREE.Group();
  scene.add(cake);

  const cakeMaterial = new THREE.MeshStandardMaterial({
    color: 0x465d8e,
    roughness: 0.32,
    metalness: 0.08
  });

  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0xa8bcf0,
    roughness: 0.28
  });

  const icingMaterial = new THREE.MeshStandardMaterial({
    color: 0xe7edff,
    roughness: 0.25
  });

  const candleMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2f5ff,
    roughness: 0.35
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd6b875,
    metalness: 0.75,
    roughness: 0.22
  });

  function addCylinder(
    parent, radiusTop, radiusBottom, height,
    material, x, y, z, segments = 64
  ) {
    const geometry = new THREE.CylinderGeometry(
      radiusTop, radiusBottom, height, segments
    );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  /* Lapisan kue */
  addCylinder(cake, 1.65, 1.72, 0.12, goldMaterial, 0, -0.12, 0);
  addCylinder(cake, 1.55, 1.55, 0.07, icingMaterial, 0, -0.04, 0);
  addCylinder(cake, 1.35, 1.45, 0.85, cakeMaterial, 0, 0.42, 0);
  addCylinder(cake, 1.38, 1.38, 0.12, icingMaterial, 0, 0.87, 0);
  addCylinder(cake, 0.95, 1.08, 0.52, topMaterial, 0, 1.18, 0);
  addCylinder(cake, 1.04, 1.04, 0.10, icingMaterial, 0, 1.48, 0);

  /* Hiasan mutiara */
  const pearlMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9e5ff,
    metalness: 0.25,
    roughness: 0.25
  });

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const pearl = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      pearlMaterial
    );

    pearl.position.set(
      Math.cos(angle) * 1.13,
      1.54,
      Math.sin(angle) * 1.13
    );

    cake.add(pearl);
  }

  /* Lilin */
  addCylinder(
    cake, 0.075, 0.075, 0.65,
    candleMaterial, 0, 1.84, 0, 24
  );

  const stripeMaterial = new THREE.MeshStandardMaterial({
    color: 0x829fff,
    metalness: 0.35,
    roughness: 0.3
  });

  for (let y = 1.62; y <= 2.08; y += 0.16) {
    const stripe = addCylinder(
      cake, 0.077, 0.077, 0.035,
      stripeMaterial, 0, y, 0, 24
    );
    stripe.rotation.z = 0.15;
  }

  
/* LILIN ANGKA ULANG TAHUN 21 */
const ageCanvas = document.createElement("canvas");
ageCanvas.width = 512;
ageCanvas.height = 384;

const ageCtx = ageCanvas.getContext("2d");

// Transparan agar hanya angka yang terlihat.
ageCtx.clearRect(0, 0, 512, 384);

// Gambar angka dengan gaya lilin biru-perak.
ageCtx.textAlign = "center";
ageCtx.textBaseline = "middle";
ageCtx.font = "bold 240px Georgia";

// Bayangan cahaya biru.
ageCtx.shadowColor = "#79baff";
ageCtx.shadowBlur = 28;

// Lapisan dasar angka berwarna biru.
ageCtx.lineWidth = 12;
ageCtx.strokeStyle = "#dceaff";
ageCtx.strokeText("23", 256, 190);

const ageGradient = ageCtx.createLinearGradient(0, 50, 0, 330);
ageGradient.addColorStop(0, "#f4f8ff");
ageGradient.addColorStop(0.45, "#8bbdff");
ageGradient.addColorStop(1, "#4269bd");

ageCtx.fillStyle = ageGradient;
ageCtx.fillText("23", 256, 190);

// Kilau kecil di permukaan angka.
ageCtx.shadowBlur = 0;
ageCtx.lineWidth = 3;
ageCtx.strokeStyle = "#ffffff";
ageCtx.strokeText("23", 256, 190);

// Jadikan gambar sebagai tekstur 3D.
const ageTexture = new THREE.CanvasTexture(ageCanvas);
ageTexture.colorSpace = THREE.SRGBColorSpace;

const ageMaterial = new THREE.MeshBasicMaterial({
  map: ageTexture,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false
});

const ageCandle = new THREE.Mesh(
  new THREE.PlaneGeometry(1.25, 0.94),
  ageMaterial
);

// Letakkan angka di atas kue, menghadap ke depan.
ageCandle.position.set(0, 2.12, 0.48);
cake.add(ageCandle);

// Cahaya lembut di sekitar lilin angka.
const ageLight = new THREE.PointLight(0x79baff, 1.2, 3);
ageLight.position.set(0, 2.15, 0.8);
cake.add(ageLight);


  /* Api lilin */
  flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffc66e })
  );

  flame.scale.set(0.7, 1.35, 0.7);
  flame.position.set(0, 2.27, 0);
  cake.add(flame);

  flameLight = new THREE.PointLight(0xffc66e, 2.2, 4);
  flameLight.position.copy(flame.position);
  cake.add(flameLight);

  /* Lingkaran cahaya */
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.85, 0.012, 8, 120),
    new THREE.MeshBasicMaterial({
      color: 0x779cff,
      transparent: true,
      opacity: 0.65
    })
  );

  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.18;
  cake.add(ring);

  /* Nama pacar melayang di atas kue */
  const nameCanvas = document.createElement("canvas");
  nameCanvas.width = 1024;
  nameCanvas.height = 256;

  const ctx = nameCanvas.getContext("2d");
  ctx.font = "italic 70px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#dce6ff";
  ctx.shadowColor = "#8ba9ff";
  ctx.shadowBlur = 22;
  ctx.fillText(`${CONFIG.name} ♡`, 512, 128);

  const nameTexture = new THREE.CanvasTexture(nameCanvas);
  nameTexture.colorSpace = THREE.SRGBColorSpace;

  const namePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 1.05),
    new THREE.MeshBasicMaterial({
      map: nameTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );

  namePlane.position.set(0, 2.95, 0);
  cake.add(namePlane);

  /* Putar kue dengan mouse atau jari */
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let rotationVelocity = 0;

  container.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;

    if (container.setPointerCapture) {
      container.setPointerCapture(event.pointerId);
    }
  });

  container.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    cake.rotation.y += dx * 0.009;
    cake.rotation.x = THREE.MathUtils.clamp(
      cake.rotation.x + dy * 0.004,
      -0.3,
      0.3
    );

    rotationVelocity = dx * 0.0005;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  function stopDragging() {
    dragging = false;
  }

  container.addEventListener("pointerup", stopDragging);
  container.addEventListener("pointercancel", stopDragging);
  container.addEventListener("lostpointercapture", stopDragging);

  /* Responsif */
  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  resizeObserver.observe(container);

  /* Animasi kue */
  const clock = new THREE.Clock();

  function animateCake() {
    requestAnimationFrame(animateCake);

    const time = clock.getElapsedTime();

    cake.position.y = Math.sin(time * 1.2) * 0.08;

    if (!dragging) {
      cake.rotation.y += 0.003 + rotationVelocity;
      rotationVelocity *= 0.96;
    }

    if (flame && flame.visible) {
      flame.scale.y = 1.25 + Math.sin(time * 12) * 0.12;
      flame.rotation.z = Math.sin(time * 8) * 0.1;
      flameLight.intensity = 1.8 + Math.sin(time * 15) * 0.4;
    }

    ring.rotation.z = time * 0.18;
    namePlane.position.y = 2.95 + Math.sin(time * 1.4) * 0.06;

    renderer.render(scene, camera);
  }

  animateCake();

} catch (error) {
  console.error("Kue 3D gagal dimuat:", error);

  container.innerHTML =
    '<div class="scene-fallback">Kue 3D tidak dapat dimuat.<br>Periksa koneksi internet dan dukungan WebGL.</div>';
}

/* POPUP */
const wishOverlay = document.getElementById("wishOverlay");
const letterOverlay = document.getElementById("letterOverlay");

document.getElementById("wishBtn").addEventListener("click", () => {
  wishOverlay.classList.add("show");
});

document.getElementById("letterBtn").addEventListener("click", () => {
  letterOverlay.classList.add("show");
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const overlay = document.getElementById(button.dataset.close);
    if (overlay) overlay.classList.remove("show");
  });
});

document.querySelectorAll(".overlay").forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.classList.remove("show");
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".overlay").forEach((overlay) => {
      overlay.classList.remove("show");
    });
  }
});

/* EFEK HATI SAAT LILIN DI TIUP */
function createHearts() {
  const symbols = ["♡", "✦", "♥", "✧"];
  const colors = ["#9ab7ff", "#e1e9ff", "#d6b875"];

  for (let i = 0; i < 45; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = "-30px";
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.fontSize = `${12 + Math.random() * 17}px`;

    document.body.appendChild(heart);

    const animation = heart.animate(
      [
        { transform: "translateY(0) rotate(0deg)", opacity: 0 },
        { opacity: 1, offset: 0.15 },
        {
          transform: `translate(${(Math.random() - 0.5) * 180}px, 110vh) rotate(360deg)`,
          opacity: 0
        }
      ],
      {
        duration: 2200 + Math.random() * 2500,
        easing: "ease-in",
        fill: "forwards"
      }
    );

    animation.onfinish = () => heart.remove();
  }
}

document.getElementById("blowBtn").addEventListener("click", () => {
  if (!candleBlown) {
    candleBlown = true;

    if (flame) flame.visible = false;
    if (flameLight) flameLight.visible = false;

    createHearts();
  }

  wishOverlay.classList.remove("show");
  letterOverlay.classList.add("show");
});

// Kata-kata romantis yang jatuh
const romanticWords = [
  "I love you ❤️",
  "kamu rumahku 🏡",
  "my favorite person 💗",
  "aku sayang kamu",
  "you are my happiness ✨",
  "bersamamu selalu",
  "my handsome boy 💙",
  "aku beruntung punya kamu",
  "you mean everything to me 💕",
  "selalu kamu, selamanya kamu",
  "my one and only 💖",
  "peluk jauh untukmu 🫂"
];

function createLoveRain() {
  const word = document.createElement("div");

  word.className = "love-rain";
  word.textContent =
    romanticWords[Math.floor(Math.random() * romanticWords.length)];

  word.style.left = Math.random() * 90 + "vw";
  word.style.fontSize = 12 + Math.random() * 9 + "px";

  const duration = 5 + Math.random() * 5;
  word.style.animationDuration = duration + "s";

  document.body.appendChild(word);

  setTimeout(() => {
    word.remove();
  }, duration * 1000);
}

// Mulai hujan kata-kata romantis
setInterval(createLoveRain, 700);


/* ==========================================
   MIDNIGHT LOVE — INTERACTIVE ENHANCEMENTS
   ========================================== */

(() => {
  "use strict";

  // Hindari inisialisasi ganda jika script terpanggil ulang.
  if (window.__midnightLoveEnhancementLoaded) return;
  window.__midnightLoveEnhancementLoaded = true;

  const mlMessages = [
    "Di antara semua hal indah di dunia ini, bertemu kamu adalah salah satu yang paling aku syukuri.",
    "Aku mungkin tidak bisa menjanjikan hari yang selalu sempurna, tapi aku ingin terus menemani kamu melewati semuanya.",
    "Semoga di umur yang baru ini, lebih banyak hal baik datang kepadamu. Aku akan selalu mendukung mimpi-mimpimu.",
    "Kalau suatu hari dunia terasa melelahkan, semoga kamu ingat kalau ada aku yang selalu ingin melihat kamu bahagia.",
    "Happy birthday, my favorite person. Terima kasih sudah hadir dan menjadi bagian paling indah dalam ceritaku. 💙"
  ];

  const mlLetters = [
    "Happy birthday, sayang. Semoga semua hal yang sedang kamu perjuangkan satu per satu menemukan jalannya. Aku bangga sama kamu. 💙",
    "Kalau aku bisa meminta satu hal, aku ingin kamu selalu punya alasan untuk tersenyum, bahkan di hari-hari yang berat.",
    "Terima kasih sudah menjadi kamu. Kamu tidak harus sempurna untuk menjadi seseorang yang sangat berarti bagiku.",
    "Aku berharap bisa melihat lebih banyak ulang tahunmu, mendengar lebih banyak ceritamu, dan merayakan lebih banyak hal kecil bersamamu.",
    "Di semesta yang luas ini, aku senang sekali karena ceritaku bertemu dengan ceritamu. I love you, always. 🤍"
  ];

  const mlCanvas = document.getElementById("ml-scene");
  const mlTypeTarget = document.getElementById("ml-typed-text");
  const mlBlowButton = document.getElementById("ml-blow-btn");
  const mlResult = document.getElementById("ml-surprise-result");
  const mlLetterLayer = document.getElementById("ml-letter-layer");
  const mlLetterModal = document.getElementById("ml-letter-modal");
  const mlLetterContent = document.getElementById("ml-letter-content");
  const mlCloseLetter = document.getElementById("ml-close-letter");
  const mlVisualizer = document.getElementById("ml-visualizer");
  const mlAudioStatus = document.getElementById("ml-audio-status");

  let mlThreeReady = false;
  let mlFlamesOut = false;
  let mlTypingTimer = null;
  let mlAudioContext = null;
  let mlAnalyser = null;
  let mlAudioSource = null;
  let mlAudioConnected = false;
  let mlBars = [];
  let mlAnimationId = null;
  let mlConfettiTimer = null;
  let mlLastLetterTime = 0;
  let mlCurrentMessage = 0;

  // 1. TEKS ROMANTIS SEPERTI DIKETIK
  function mlTypeMessage(message) {
    if (!mlTypeTarget) return;

    clearTimeout(mlTypingTimer);
    mlTypeTarget.textContent = "";

    let index = 0;

    function typeNext() {
      if (index < message.length) {
        mlTypeTarget.textContent += message.charAt(index);
        index++;

        // Jeda sedikit lebih lama setelah tanda baca.
        const char = message.charAt(index - 1);
        const delay = ".!?,".includes(char) ? 300 : 35;

        mlTypingTimer = setTimeout(typeNext, delay);
      } else {
        mlTypingTimer = setTimeout(() => {
          mlCurrentMessage = (mlCurrentMessage + 1) % mlMessages.length;
          mlTypeMessage(mlMessages[mlCurrentMessage]);
        }, 4500);
      }
    }

    typeNext();
  }

  if (mlTypeTarget) {
    mlTypeMessage(mlMessages[0]);
  }

  // 2. HUJAN SURAT CINTA
  function mlCreateLetter() {
    if (!mlLetterLayer) return;
    if (document.hidden) return;

    // Batasi jumlah surat yang masih berada di layar.
    if (mlLetterLayer.childElementCount >= 12) return;

    const letter = document.createElement("button");
    letter.type = "button";
    letter.className = "ml-love-letter";
    letter.textContent = Math.random() > 0.5 ? "💌" : "✉";
    letter.setAttribute("aria-label", "Buka surat cinta");

    const left = 3 + Math.random() * 90;
    const duration = 8 + Math.random() * 7;

    letter.style.left = left + "vw";
    letter.style.animationDuration = duration + "s";

    const letterIndex = Math.floor(Math.random() * mlLetters.length);

    letter.addEventListener("click", () => {
      mlOpenLetter(mlLetters[letterIndex]);
      letter.remove();
    });

    letter.addEventListener("animationend", () => {
      letter.remove();
    });

    mlLetterLayer.appendChild(letter);
  }

  function mlOpenLetter(message) {
    if (!mlLetterModal || !mlLetterContent) return;

    mlLetterContent.textContent = message;
    mlLetterModal.classList.add("ml-visible");
    mlLetterModal.setAttribute("aria-hidden", "false");

    if (mlCloseLetter) mlCloseLetter.focus();
  }

  function mlCloseLetterPopup() {
    if (!mlLetterModal) return;

    mlLetterModal.classList.remove("ml-visible");
    mlLetterModal.setAttribute("aria-hidden", "true");
  }

  if (mlCloseLetter) {
    mlCloseLetter.addEventListener("click", mlCloseLetterPopup);
  }

  if (mlLetterModal) {
    mlLetterModal.addEventListener("click", (event) => {
      if (event.target === mlLetterModal) mlCloseLetterPopup();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") mlCloseLetterPopup();
  });

  const mlLetterInterval = setInterval(mlCreateLetter, 1800);

  // 3. KONFETI KEJUTAN
  function mlLaunchConfetti() {
    const colors = ["#dff6ff", "#80ccff", "#468dff", "#b6c7ff", "#ffffff"];
    const count = 140;

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("span");
      confetti.className = "ml-confetti";

      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (3 + Math.random() * 4) + "s";
      confetti.style.animationDelay = Math.random() * 0.8 + "s";
      confetti.style.setProperty(
        "--ml-drift",
        (Math.random() * 260 - 130) + "px"
      );

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 8500);
    }
  }

  // 4. VISUALIZER MUSIK
  if (mlVisualizer) {
    for (let i = 0; i < 42; i++) {
      const bar = document.createElement("span");
      bar.className = "ml-bar";
      mlVisualizer.appendChild(bar);
      mlBars.push(bar);
    }
  }

  function mlFindAudio() {
    // Utamakan elemen audio yang berada di dalam website.
    return document.querySelector("#bgMusic")
      || document.querySelector("#backgroundMusic")
      || document.querySelector("#birthdayMusic")
      || document.querySelector("audio");
  }

  async function mlStartVisualizer() {
    const audio = mlFindAudio();

    if (!audio) {
      if (mlAudioStatus) {
        mlAudioStatus.textContent =
          "Tambahkan elemen audio untuk mengaktifkan visualizer.";
      }
      return;
    }

    if (mlAudioConnected && mlAnalyser) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) throw new Error("AudioContext tidak tersedia.");

      if (!mlAudioContext) {
        mlAudioContext = new AudioContextClass();
        mlAnalyser = mlAudioContext.createAnalyser();
        mlAnalyser.fftSize = 128;
        mlAnalyser.smoothingTimeConstant = 0.82;

        // Satu MediaElementSource untuk elemen audio ini.
        mlAudioSource = mlAudioContext.createMediaElementSource(audio);
        mlAudioSource.connect(mlAnalyser);
        mlAnalyser.connect(mlAudioContext.destination);
        mlAudioConnected = true;
      }

      if (mlAudioContext.state === "suspended") {
        await mlAudioContext.resume();
      }

      if (mlAudioStatus) {
        mlAudioStatus.textContent = "Now playing · just for you ♡";
      }
    } catch (error) {
      console.warn("Visualizer memakai animasi dekoratif:", error);

      if (mlAudioStatus) {
        mlAudioStatus.textContent =
          "Visualizer dekoratif aktif · audio tetap menggunakan pemutar website";
      }
    }
  }

  function mlAnimateVisualizer() {
    if (!mlBars.length) return;

    const frequencyData = mlAnalyser
      ? new Uint8Array(mlAnalyser.frequencyBinCount)
      : null;

    function draw() {
      mlAnimationId = requestAnimationFrame(draw);

      if (mlAnalyser && frequencyData && mlAudioContext?.state === "running") {
        mlAnalyser.getByteFrequencyData(frequencyData);

        mlBars.forEach((bar, index) => {
          const value = frequencyData[index % frequencyData.length] / 255;
          bar.style.height = (4 + value * 54) + "px";
        });
      } else {
        // Animasi fallback jika audio belum dimainkan.
        const now = performance.now();

        mlBars.forEach((bar, index) => {
          const wave =
            Math.sin(now * 0.003 + index * 0.48) *
            Math.cos(now * 0.0015 + index * 0.12);

          bar.style.height = (8 + Math.abs(wave) * 36) + "px";
        });
      }
    }

    draw();
  }

  // Mulai analisis audio setelah pengguna berinteraksi.
  document.addEventListener("click", () => {
    mlStartVisualizer();
  }, { passive: true });

  mlAnimateVisualizer();

  // 5. GALAKSI 3D, HATI 3D, DAN KUE ULANG TAHUN
  async function mlInitThree() {
    if (!mlCanvas || mlThreeReady) return;

    try {
      const THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
      );

      if (!mlCanvas.isConnected) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050b1b, 0.035);

      const camera = new THREE.PerspectiveCamera(
        45,
        1,
        0.1,
        100
      );
      camera.position.set(0, 0.5, 11);

      const renderer = new THREE.WebGLRenderer({
        canvas: mlCanvas,
        antialias: true,
        alpha: true
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // Cahaya biru lembut.
      scene.add(new THREE.AmbientLight(0x9bcfff, 1.8));

      const keyLight = new THREE.PointLight(0x69baff, 80, 40);
      keyLight.position.set(3, 4, 5);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0x526dff, 55, 35);
      rimLight.position.set(-4, -2, -2);
      scene.add(rimLight);

      // Bintang-bintang galaksi.
      const starCount = 1400;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        const radius = 5 + Math.random() * 28;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        starPositions[i * 3] =
          radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] =
          radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] =
          radius * Math.cos(phi) - 8;

        const tint = 0.65 + Math.random() * 0.35;
        starColors[i * 3] = 0.45 * tint;
        starColors[i * 3 + 1] = 0.75 * tint;
        starColors[i * 3 + 2] = tint;
      }

      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
      );
      starGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(starColors, 3)
      );

      const starMaterial = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // Debu galaksi berwarna biru.
      const dustPositions = new Float32Array(500 * 3);

      for (let i = 0; i < 500; i++) {
        dustPositions[i * 3] = (Math.random() - 0.5) * 17;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
        dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      }

      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(dustPositions, 3)
      );

      const dust = new THREE.Points(
        dustGeometry,
        new THREE.PointsMaterial({
          color: 0x72caff,
          size: 0.035,
          transparent: true,
          opacity: 0.7
        })
      );
      scene.add(dust);

      // Hati 3D dari bentuk extrude.
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0, 0.3);
      heartShape.bezierCurveTo(0, 0.3, -0.05, 1.2, -0.9, 1.2);
      heartShape.bezierCurveTo(-2.0, 1.2, -2.0, -0.2, -2.0, -0.2);
      heartShape.bezierCurveTo(-2.0, -0.95, -1.15, -1.65, 0, -2.4);
      heartShape.bezierCurveTo(1.15, -1.65, 2.0, -0.95, 2.0, -0.2);
      heartShape.bezierCurveTo(2.0, -0.2, 2.0, 1.2, 0.9, 1.2);
      heartShape.bezierCurveTo(0.05, 1.2, 0, 0.3, 0, 0.3);

      const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.42,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.12,
        bevelThickness: 0.12
      });

      heartGeometry.center();

      const heartMaterial = new THREE.MeshStandardMaterial({
        color: 0x4c9cff,
        emissive: 0x123d9b,
        emissiveIntensity: 0.7,
        metalness: 0.35,
        roughness: 0.24
      });

      const heart = new THREE.Mesh(heartGeometry, heartMaterial);
      heart.scale.setScalar(0.55);
      heart.position.set(0, 1.15, 0.1);
      scene.add(heart);

      // Lingkaran orbit di sekitar hati.
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(1.45, 0.012, 8, 140),
        new THREE.MeshBasicMaterial({
          color: 0x7bcaff,
          transparent: true,
          opacity: 0.7
        })
      );
      orbit.position.copy(heart.position);
      orbit.rotation.x = 1.1;
      orbit.rotation.y = -0.3;
      scene.add(orbit);

      // Kue ulang tahun 3D di bawah hati.
      const cake = new THREE.Group();
      cake.position.set(0, -1.45, 0.25);
      scene.add(cake);

      function mlCylinder(radiusTop, radiusBottom, height, color, y) {
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 48),
          new THREE.MeshStandardMaterial({
            color,
            roughness: 0.45,
            metalness: 0.12
          })
        );

        mesh.position.y = y;
        cake.add(mesh);
        return mesh;
      }

      mlCylinder(1.35, 1.35, 0.62, 0x234d86, 0);
      mlCylinder(1.13, 1.13, 0.28, 0x9bdcff, 0.45);

      // Hiasan mutiara di sekeliling kue.
      const pearlMaterial = new THREE.MeshStandardMaterial({
        color: 0xe7f7ff,
        emissive: 0x284b74,
        emissiveIntensity: 0.3,
        metalness: 0.2,
        roughness: 0.25
      });

      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const pearl = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 12, 12),
          pearlMaterial
        );

        pearl.position.set(
          Math.cos(angle) * 1.2,
          0.62,
          Math.sin(angle) * 1.2
        );
        cake.add(pearl);
      }

      // Lilin dan api.
      const candles = [];
      const flames = [];

      for (let i = 0; i < 3; i++) {
        const candle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.06, 0.48, 16),
          new THREE.MeshStandardMaterial({
            color: i === 1 ? 0xe2f4ff : 0x82c6ff,
            roughness: 0.35
          })
        );

        const offset = (i - 1) * 0.28;
        candle.position.set(offset, 0.94, 0.03);
        cake.add(candle);
        candles.push(candle);

        const flame = new THREE.Mesh(
          new THREE.SphereGeometry(0.085, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x9ee8ff })
        );

        flame.scale.set(0.7, 1.35, 0.7);
        flame.position.set(offset, 1.24, 0.03);
        cake.add(flame);
        flames.push(flame);

        const flameLight = new THREE.PointLight(0x69caff, 2.5, 2);
        flameLight.position.copy(flame.position);
        cake.add(flameLight);
        flames.push(flameLight);
      }

      // Interaksi mouse dan sentuhan.
      let mlPointerX = 0;
      let mlPointerY = 0;

      function mlOnPointerMove(event) {
        const rect = mlCanvas.getBoundingClientRect();

        mlPointerX =
          ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        mlPointerY =
          ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      }

      mlCanvas.addEventListener("pointermove", mlOnPointerMove);

      let mlBlowActive = false;

      function mlResizeScene() {
        const rect = mlCanvas.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 500 ? 12 : 11;
        camera.updateProjectionMatrix();
      }

      const mlResizeObserver = new ResizeObserver(mlResizeScene);
      mlResizeObserver.observe(mlCanvas.parentElement);
      mlResizeScene();

      // Animasi scene.
      const clock = new THREE.Clock();

      function mlRender() {
        if (!mlCanvas.isConnected) {
          cancelAnimationFrame(mlAnimationId);
          mlResizeObserver.disconnect();
          return;
        }

        mlAnimationId = requestAnimationFrame(mlRender);

        const elapsed = clock.getElapsedTime();

        stars.rotation.y = elapsed * 0.012;
        dust.rotation.z = elapsed * 0.009;

        heart.rotation.y +=
          (mlPointerX * 0.55 - heart.rotation.y) * 0.035;
        heart.rotation.x +=
          (-mlPointerY * 0.25 - heart.rotation.x) * 0.035;
        heart.position.y = 1.15 + Math.sin(elapsed * 1.3) * 0.12;

        orbit.position.y = heart.position.y;
        orbit.rotation.z = elapsed * 0.22;

        cake.rotation.y = Math.sin(elapsed * 0.55) * 0.08;

        flames.forEach((item, index) => {
          if (item.isMesh && !mlBlowActive) {
            const pulse = 1 + Math.sin(elapsed * 8 + index) * 0.14;
            item.scale.y = 1.35 * pulse;
          }
        });

        // Cahaya api juga berkedip lembut.
        flames.forEach((item, index) => {
          if (item.isLight && !mlBlowActive) {
            item.intensity = 2 + Math.sin(elapsed * 10 + index) * 0.5;
          }
        });

        renderer.render(scene, camera);
      }

      mlThreeReady = true;
      mlRender();

      // Tombol kejutan dapat memadamkan lilin dan menampilkan konfeti.
      if (mlBlowButton) {
        mlBlowButton.addEventListener("click", () => {
          if (mlBlowActive) {
            // Izinkan kejutan diulang.
            mlBlowActive = false;
            mlFlamesOut = false;
            flames.forEach((item) => {
              item.visible = true;
            });

            mlBlowButton.textContent = "✨ Tiup Lilin & Buka Kejutan";
            if (mlResult) mlResult.textContent = "";
            return;
          }

          mlBlowActive = true;
          mlFlamesOut = true;

          flames.forEach((item) => {
            item.visible = false;
          });

          mlLaunchConfetti();

          if (mlResult) {
            mlResult.textContent =
              "Happy birthday, sayang! 💙 Semoga semua harapan baikmu menjadi nyata. I love you!";
          }

          mlBlowButton.textContent = "💙 Ulangi Kejutan";

          mlCurrentMessage = 0;
          mlTypeMessage(
            "Happy birthday, my love. Kalau ada satu permohonan yang ingin aku titipkan untukmu, semoga hidup selalu memberi kamu alasan untuk bahagia. Aku sayang kamu. 💙"
          );
        });
      }
    } catch (error) {
      console.error("Animasi 3D tidak dapat dimuat:", error);

      if (mlCanvas) {
        const message = document.createElement("p");
        message.textContent =
          "Galaksi 3D perlu koneksi internet dan dukungan WebGL. Surat cinta dan pesan romantis tetap bisa digunakan.";
        message.style.cssText =
          "padding:30px;color:#b8dfff;text-align:center;line-height:1.8";
        mlCanvas.replaceWith(message);
      }
    }
  }

  // Mulai galaksi saat area mendekati layar agar lebih hemat.
  if (mlCanvas && "IntersectionObserver" in window) {
    const mlSceneObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        mlInitThree();
        mlSceneObserver.disconnect();
      }
    }, { rootMargin: "200px" });

    mlSceneObserver.observe(mlCanvas);
  } else {
    mlInitThree();
  }

  // Lepas animasi ketika tab tidak aktif untuk menghemat sumber daya.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && mlAnimationId) {
      cancelAnimationFrame(mlAnimationId);
      mlAnimationId = null;
    }
  });

})();

/* HATI BERTEBARAN SAAT GAMBAR HATI DIKLIK */
function scatterHearts(x, y) {
  const hearts = ["💗", "💖", "💕", "💘", "💙", "❤️"];

  for (let i = 0; i < 35; i++) {
    const heart = document.createElement("span");
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      z-index: 99999;
      pointer-events: none;
      font-size: ${16 + Math.random() * 20}px;
    `;

    document.body.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 180;

    heart.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.3)", opacity: 1 },
        {
          transform: `translate(
            calc(-50% + ${Math.cos(angle) * distance}px),
            calc(-50% + ${Math.sin(angle) * distance}px)
          ) scale(1.3) rotate(${Math.random() * 360}deg)`,
          opacity: 0
        }
      ],
      {
        duration: 900 + Math.random() * 700,
        easing: "ease-out",
        fill: "forwards"
      }
    );

    setTimeout(() => heart.remove(), 1700);
  }
}

const heart = new THREE.Mesh(heartGeometry, heartMaterial);
heart.scale.setScalar(0.55);
heart.position.set(0, 1.15, 0.1);
scene.add(heart);


        // KLIK HATI 3D UNTUK MEMUNCULKAN HATI BERTEBARAN
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        mlCanvas.style.cursor = "pointer";

        mlCanvas.addEventListener("click", (event) => {
            const rect = mlCanvas.getBoundingClientRect();

            pointer.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

            pointer.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);

            scatterHearts(event.clientX, event.clientY);
            
        });


if (heartImage) {
  heartImage.style.cursor = "pointer";

  heartImage.addEventListener("click", (event) => {
    scatterHearts(event.clientX, event.clientY);
  });
}