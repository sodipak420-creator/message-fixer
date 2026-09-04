"use strict";

/*
  VoiceEmoji V1
  No API keys.
  Uses the browser/device Web Speech API.
*/


// -----------------------------
// EMOJIS
// -----------------------------

const EMOJIS = [
  "😀", "😃", "😄", "😁",
  "😆", "😅", "😂", "🤣",
  "😊", "😇", "🙂", "🙃",
  "😉", "😌", "😍", "🥰",
  "😘", "😎", "🤩", "🥳",
  "🤔", "🤨", "😐", "😑",
  "😶", "🙄", "😏", "😣",
  "😥", "😮", "🤐", "😯",
  "😪", "😫", "🥱", "😴",
  "🤗", "🤭", "🤫", "🤥",
  "😶‍🌫️", "😱", "😨", "😰",
  "😢", "😭", "😤", "😡",
  "🤬", "🤯", "😈", "👿",
  "💀", "👻", "👹", "👺",
  "🤖", "👽", "🎃", "❤️",
  "🔥", "💯", "⭐", "✨"
];


// -----------------------------
// STATE
// -----------------------------

let selectedEmoji = "😀";
let voices = [];
let savedEmojis = [];

let currentShareData = null;


// -----------------------------
// ELEMENTS
// -----------------------------

const emojiGrid =
  document.getElementById("emojiGrid");

const previewEmoji =
  document.getElementById("previewEmoji");

const previewStatus =
  document.getElementById("previewStatus");

const messageInput =
  document.getElementById("message");

const charCount =
  document.getElementById("charCount");

const voiceSelect =
  document.getElementById("voiceSelect");

const speed =
  document.getElementById("speed");

const pitch =
  document.getElementById("pitch");

const speedValue =
  document.getElementById("speedValue");

const pitchValue =
  document.getElementById("pitchValue");

const speakBtn =
  document.getElementById("speakBtn");

const createBtn =
  document.getElementById("createBtn");

const stopBtn =
  document.getElementById("stopBtn");

const savedList =
  document.getElementById("savedList");

const clearBtn =
  document.getElementById("clearBtn");

const shareModal =
  document.getElementById("shareModal");

const closeModal =
  document.getElementById("closeModal");

const shareEmoji =
  document.getElementById("shareEmoji");

const shareText =
  document.getElementById("shareText");

const copyBtn =
  document.getElementById("copyBtn");

const shareBtn =
  document.getElementById("shareBtn");

const toast =
  document.getElementById("toast");


// -----------------------------
// INITIALIZE
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {

  renderEmojiGrid();

  loadSavedEmojis();

  loadVoices();

  setupEvents();

  updateCharacterCount();

});


// -----------------------------
// EMOJI GRID
// -----------------------------

function renderEmojiGrid() {

  emojiGrid.innerHTML = "";

  EMOJIS.forEach((emoji) => {

    const button =
      document.createElement("button");

    button.className = "emoji-btn";

    if (emoji === selectedEmoji) {
      button.classList.add("selected");
    }

    button.textContent = emoji;

    button.setAttribute(
      "aria-label",
      `Select ${emoji}`
    );

    button.addEventListener("click", () => {

      selectedEmoji = emoji;

      previewEmoji.textContent = emoji;

      document
        .querySelectorAll(".emoji-btn")
        .forEach(btn =>
          btn.classList.remove("selected")
        );

      button.classList.add("selected");

      previewStatus.textContent =
        "Emoji selected";

    });

    emojiGrid.appendChild(button);

  });

}


// -----------------------------
// VOICES
// -----------------------------

function loadVoices() {

  if (!("speechSynthesis" in window)) {

    voiceSelect.innerHTML =
      `<option value="">Speech not supported</option>`;

    speakBtn.disabled = true;

    return;
  }

  voices =
    window.speechSynthesis.getVoices();

  if (!voices.length) {

    voiceSelect.innerHTML =
      `<option value="">Loading voices...</option>`;

    return;
  }

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {

    const option =
      document.createElement("option");

    option.value = index;

    option.textContent =
      `${voice.name} — ${voice.lang}`;

    voiceSelect.appendChild(option);

  });

}


// Some browsers load voices asynchronously.

if ("speechSynthesis" in window) {

  window.speechSynthesis.onvoiceschanged =
    loadVoices;

}


// -----------------------------
// EVENTS
// -----------------------------

function setupEvents() {

  messageInput.addEventListener(
    "input",
    updateCharacterCount
  );

  speed.addEventListener(
    "input",
    () => {

      speedValue.textContent =
        `${Number(speed.value).toFixed(1)}×`;

    }
  );

  pitch.addEventListener(
    "input",
    () => {

      pitchValue.textContent =
        Number(pitch.value).toFixed(1);

    }
  );

  speakBtn.addEventListener(
    "click",
    speakCurrent
  );

  stopBtn.addEventListener(
    "click",
    stopSpeaking
  );

  createBtn.addEventListener(
    "click",
    createVoiceEmoji
  );

  clearBtn.addEventListener(
    "click",
    clearAll
  );

  closeModal.addEventListener(
    "click",
    closeShareModal
  );

  copyBtn.addEventListener(
    "click",
    copyVoiceEmoji
  );

  shareBtn.addEventListener(
    "click",
    shareVoiceEmoji
  );

  shareModal.addEventListener(
    "click",
    (event) => {

      if (event.target === shareModal) {
        closeShareModal();
      }

    }
  );

}


// -----------------------------
// CHARACTER COUNT
// -----------------------------

function updateCharacterCount() {

  charCount.textContent =
    messageInput.value.length;

}


// -----------------------------
// SPEAK
// -----------------------------

function speakCurrent() {

  const text =
    messageInput.value.trim();

  if (!text) {

    showToast(
      "Type something first."
    );

    messageInput.focus();

    return;
  }

  if (!("speechSynthesis" in window)) {

    showToast(
      "Speech synthesis is not supported."
    );

    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  const selectedVoiceIndex =
    Number(voiceSelect.value);

  if (
    Number.isInteger(selectedVoiceIndex) &&
    voices[selectedVoiceIndex]
  ) {

    utterance.voice =
      voices[selectedVoiceIndex];

  }

  utterance.rate =
    Number(speed.value);

  utterance.pitch =
    Number(pitch.value);

  utterance.volume = 1;

  utterance.onstart = () => {

    previewStatus.textContent =
      "🔊 Speaking...";

    speakBtn.textContent =
      "🔊 Speaking...";

  };

  utterance.onend = () => {

    previewStatus.textContent =
      "Finished";

    speakBtn.textContent =
      "🔊 Speak Emoji";

  };

  utterance.onerror = () => {

    previewStatus.textContent =
      "Speech error";

    speakBtn.textContent =
      "🔊 Speak Emoji";

    showToast(
      "Could not speak this message."
    );

  };

  window.speechSynthesis.speak(
    utterance
  );

}


// -----------------------------
// STOP
// -----------------------------

function stopSpeaking() {

  if ("speechSynthesis" in window) {

    window.speechSynthesis.cancel();

  }

  previewStatus.textContent =
    "Stopped";

  speakBtn.textContent =
    "🔊 Speak Emoji";

}


// -----------------------------
// CREATE
// -----------------------------

function createVoiceEmoji() {

  const text =
    messageInput.value.trim();

  if (!text) {

    showToast(
      "Write a message first."
    );

    messageInput.focus();

    return;
  }

  const selectedVoiceIndex =
    Number(voiceSelect.value);

  const voice =
    voices[selectedVoiceIndex] || null;

  const item = {

    id:
      crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(),

    emoji:
      selectedEmoji,

    text:
      text,

    voiceName:
      voice ? voice.name : "Default",

    voiceLang:
      voice ? voice.lang : "",

    voiceIndex:
      selectedVoiceIndex,

    rate:
      Number(speed.value),

    pitch:
      Number(pitch.value),

    createdAt:
      new Date().toISOString()

  };

  savedEmojis.unshift(item);

  saveSavedEmojis();

  renderSavedEmojis();

  currentShareData = item;

  openShareModal(item);

  previewStatus.textContent =
    "Voice Emoji created!";

}


// -----------------------------
// LOCAL STORAGE
// -----------------------------

function saveSavedEmojis() {

  localStorage.setItem(
    "voiceEmojiItems",
    JSON.stringify(savedEmojis)
  );

}


function loadSavedEmojis() {

  try {

    const raw =
      localStorage.getItem(
        "voiceEmojiItems"
      );

    savedEmojis =
      raw ? JSON.parse(raw) : [];

  } catch {

    savedEmojis = [];

  }

  renderSavedEmojis();

}


// -----------------------------
// SAVED EMOJIS
// -----------------------------

function renderSavedEmojis() {

  savedList.innerHTML = "";

  if (!savedEmojis.length) {

    savedList.innerHTML =
      `<div class="empty">
        You haven't created any Voice Emojis yet.
      </div>`;

    return;
  }

  savedEmojis.forEach((item) => {

    const row =
      document.createElement("div");

    row.className =
      "saved-item";

    const emoji =
      document.createElement("div");

    emoji.className =
      "saved-emoji";

    emoji.textContent =
      item.emoji;

    const info =
      document.createElement("div");

    info.className =
      "saved-info";

    const message =
      document.createElement("div");

    message.className =
      "saved-message";

    message.textContent =
      item.text;

    const meta =
      document.createElement("div");

    meta.className =
      "saved-meta";

    meta.textContent =
      `${item.voiceName} • ${item.voiceLang || "default"}`;

    info.appendChild(message);
    info.appendChild(meta);


    const actions =
      document.createElement("div");

    actions.className =
      "saved-actions";


    const play =
      document.createElement("button");

    play.className =
      "icon-btn";

    play.textContent =
      "▶";

    play.title =
      "Play";

    play.addEventListener(
      "click",
      () => playSaved(item)
    );


    const share =
      document.createElement("button");

    share.className =
      "icon-btn";

    share.textContent =
      "📤";

    share.title =
      "Share";

    share.addEventListener(
      "click",
      () => openShareModal(item)
    );


    const remove =
      document.createElement("button");

    remove.className =
      "icon-btn delete-btn";

    remove.textContent =
      "×";

    remove.title =
      "Delete";

    remove.addEventListener(
      "click",
      () => deleteSaved(item.id)
    );


    actions.appendChild(play);
    actions.appendChild(share);
    actions.appendChild(remove);

    row.appendChild(emoji);
    row.appendChild(info);
    row.appendChild(actions);

    savedList.appendChild(row);

  });

}


// -----------------------------
// PLAY SAVED
// -----------------------------

function playSaved(item) {

  if (!("speechSynthesis" in window)) {

    showToast(
      "Speech synthesis is not supported."
    );

    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(
      item.text
    );

  const voice =
    voices.find(
      v =>
        v.name === item.voiceName &&
        v.lang === item.voiceLang
    );

  if (voice) {

    utterance.voice = voice;

  }

  utterance.rate =
    item.rate;

  utterance.pitch =
    item.pitch;

  previewEmoji.textContent =
    item.emoji;

  previewStatus.textContent =
    "🔊 Speaking...";

  utterance.onend = () => {

    previewStatus.textContent =
      "Finished";

  };

  window.speechSynthesis.speak(
    utterance
  );

}


// -----------------------------
// DELETE
// -----------------------------

function deleteSaved(id) {

  savedEmojis =
    savedEmojis.filter(
      item => item.id !== id
    );

  saveSavedEmojis();

  renderSavedEmojis();

  showToast(
    "Voice Emoji deleted."
  );

}


// -----------------------------
// CLEAR
// -----------------------------

function clearAll() {

  if (!savedEmojis.length) {

    return;

  }

  const confirmed =
    confirm(
      "Delete all your Voice Emojis?"
    );

  if (!confirmed) {

    return;

  }

  savedEmojis = [];

  saveSavedEmojis();

  renderSavedEmojis();

  showToast(
    "All Voice Emojis deleted."
  );

}


// -----------------------------
// SHARE MODAL
// -----------------------------

function openShareModal(item) {

  currentShareData = item;

  shareEmoji.textContent =
    item.emoji;

  shareText.textContent =
    item.text;

  shareModal.classList.remove(
    "hidden"
  );

}


function closeShareModal() {

  shareModal.classList.add(
    "hidden"
  );

}


// -----------------------------
// COPY
// -----------------------------

async function copyVoiceEmoji() {

  if (!currentShareData) {

    return;

  }

  const item =
    currentShareData;

  /*
    This is the portable representation
    used by V1.
  */

  const packageData = {

    type:
      "voice-emoji",

    version:
      1,

    emoji:
      item.emoji,

    text:
      item.text,

    voice:
      item.voiceName,

    language:
      item.voiceLang,

    rate:
      item.rate,

    pitch:
      item.pitch

  };

  const encoded =
    btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify(packageData)
        )
      )
    );

  const result =
    `🎤 VoiceEmoji\n${item.emoji} ${item.text}\n\n${encoded}`;


  try {

    await navigator.clipboard.writeText(
      result
    );

    showToast(
      "Voice Emoji copied!"
    );

  } catch {

    showToast(
      "Copy failed."
    );

  }

}


// -----------------------------
// NATIVE SHARE
// -----------------------------

async function shareVoiceEmoji() {

  if (!currentShareData) {

    return;

  }

  const item =
    currentShareData;

  const shareData = {

    title:
      "VoiceEmoji",

    text:
      `🎤 ${item.emoji} ${item.text}`

  };

  if (
    navigator.share
  ) {

    try {

      await navigator.share(
        shareData
      );

    } catch {

      // User cancelled share.

    }

  } else {

    await copyVoiceEmoji();

  }

}


// -----------------------------
// TOAST
// -----------------------------

let toastTimer = null;

function showToast(text) {

  toast.textContent =
    text;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

      }
