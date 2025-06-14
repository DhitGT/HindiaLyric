<template>
  <div class="p-4 max-w-3xl bg-black mx-auto">
    <div class="flex w-full my-2 justify-center">
      <span class="text-white text-2xl opacity-20 " style="filter: blur(1px)">
        @adtydstn
      </span>
    </div>
    <audio
      ref="audio"
      controls
      @timeupdate="syncLyric"
      @seeked="resetLyrics"
      class="w-full mb-6 bg-black opacity-80"
    >
      <source :src="`/song/${fileName}.mp3`" type="audio/mpeg" />
      Browser tidak mendukung audio.
    </audio>
    <!-- <input type="text" v-model="text">
    </input> -->

    <div class="w-full flex justify-center">
      <select
        v-model="selectedSong"
        class="mx-auto w-full text-white text-2xl font-semibold text-center bg-transparent outline-none border-b border-white"
        style="filter: blur(1px)"
      >
        <option disabled value="">Pilih Lagu</option>
        <option
          class="bg-black"
          v-for="(song, i) in songList"
          :key="i"
          :value="song"
        >
          {{ song }}
        </option>
      </select>
    </div>
    <div id="textOverlay" ref="overlay" class="mx-auto">
      <div
        ref="textFitted"
        id="textFitted"
        class="textFitted mx-auto gap-4 justify-between flex flex-wrap text-justify w-full"
      >
        <div
          class="flex text-white filter-blur-3 blur-3 w-fit gap-4"
          v-for="(word, index) in typedWords"
          :key="index"
        >
          {{ word }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
const typedWords = ref([]);

const audio = ref(null);
let lyricsFetched = false;
const overlay = ref(null);
const textFitted = ref(null);
const fileName = ref("hargapil");
const selectedSong = ref("Hindia - Berapa Harga Satu Pil");
const songList = [
  "Hindia - Berapa Harga Satu Pil",
  "Hindia - Kids",
  "Hindia - Everything U Are",
];

watch(selectedSong, (val) => {
  switch (val) {
    case "Hindia - Berapa Harga Satu Pil":
      fileName.value = "hargapil";
      break;
    case "Hindia - Kids":
      fileName.value = "kids";
      break;
    case "Hindia - Everything U Are":
      fileName.value = "everything";
      break;
    default:
      fileName.value = "hargapil";
      break;
  }
});




const fontSize = ref(50);
const segments = ref([]);
const text = ref("");
const currentLine = ref([]);
let currentSegmentIndex = 0;
let wordTimeouts = [];

const fetchLyrics = async () => {
  const res = await fetch(`/lirik/${fileName.value}.json`);
  const json = await res.json();

  segments.value = (json.segments || []).map((segment) => ({
    start: segment.start,
    words: segment.words.map((w) => ({
      word: w.word.trim(),
      start: w.start,
      end: w.end,
    })),
  }));
};

const playSegmentWords = (words) => {
  wordTimeouts.forEach(clearTimeout);
  wordTimeouts = [];
  typedWords.value = [];

  words.forEach((wordObj, i) => {
    const delay = (wordObj.start - words[0].start) * 1000;

    const timeout = setTimeout(() => {
      typedWords.value.push(""); // prepare slot

      const letters = wordObj.word.split("");
      letters.forEach((char, j) => {
        const charTimeout = setTimeout(() => {
          typedWords.value[i] += char;
          resizeTextToFit(); // 👈 Call it right after push
        }, j * 50); // delay per character
        wordTimeouts.push(charTimeout);
      });
    }, delay);

    wordTimeouts.push(timeout);
  });
};

const syncLyric = () => {
  const currentTime = audio.value.currentTime;

  if (
    currentSegmentIndex < segments.value.length &&
    currentTime >= segments.value[currentSegmentIndex].start
  ) {
    const segment = segments.value[currentSegmentIndex];
    playSegmentWords(segment.words);
    currentSegmentIndex++;
  }
};

const resetLyrics = () => {
  wordTimeouts.forEach(clearTimeout);
  wordTimeouts = [];
  typedWords.value = []; // <--- pastikan kosong
  currentLine.value = [];
  currentSegmentIndex = 0;
};


const realFontsize = computed(() => {
  return fontSize;
});

const resizeTextToFit = () => {
  nextTick(() => {
    const container = document.getElementById("textOverlay");
    const text = document.getElementById("textFitted");

    if (!container || !text) return;

    const computedStyle = window.getComputedStyle(text);
    const baseFontSize = parseFloat(computedStyle.fontSize);

    let minFont = 10;
    let maxFont = 300;

    let current = baseFontSize;

    const fits = () => {
      return (
        text.scrollHeight <= container.clientHeight &&
        text.scrollWidth <= container.clientWidth
      );
    };

    // Start binary search
    while (minFont <= maxFont) {
      current = Math.floor((minFont + maxFont) / 2);
      text.style.fontSize = current + "px";

      if (fits()) {
        minFont = current + 1;
      } else {
        maxFont = current - 1;
      }
    }

    // Apply final size
    text.style.fontSize = maxFont + "px";
    console.log("Final fontSize:", maxFont + "px");
  });
};

watch(text, resizeTextToFit);
watch(fileName, async () => {
  resetLyrics();
  lyricsFetched = false;

  if (audio.value) {
    audio.value.pause();
    audio.value.load(); // reload audio
    audio.value.currentTime = 0;
  }
});

onMounted(() => {
  if (audio.value) {
    audio.value.addEventListener("play", async () => {
      if (!lyricsFetched) {
        await fetchLyrics();
        lyricsFetched = true;
      }
    });
  }
});
</script>

<style scoped>
#textOverlay {
  max-width: 520px;
  text-align: justify;
  text-align-last: justify;
  padding: 10px;
  max-height: 520px;
  min-height: 300px;
  overflow: hidden;
}

.textFitted {
  font-weight: 500;
  font-family: arial_narrowregular, "Arial Narrow", sans-serif;
  filter: blur(2px);
}
</style>
