<template>
  <div>
    <!-- Аудіо без стандартних controls -->
    <audio
      ref="audio"
      :src="audioSrc"
      preload="metadata"
      crossorigin="anonymous"
    ></audio>

    <!--    &lt;!&ndash; Кастомні кнопки &ndash;&gt;-->
    <!--    <div style="margin: 10px 0;">-->
    <!--      <button @click="toggleAudio">-->
    <!--        {{ isPlaying ? '⏸ Pause' : '▶️ Play' }}-->
    <!--      </button>-->
    <!--    </div>-->

    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  audioSrc: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 600,
  },
  height: {
    type: Number,
    default: 200,
  },
  userAmplitudeMultiplier: {
    type: Number,
    default: 3,
  },
  maxAmplitudeRatio: {
    type: Number,
    default: 0.95,
  },
  topPadding: {
    type: Number,
    default: 8,
  },
  fillColor: {
    type: String,
    default: 'rgba(255, 50, 50, 0.3)',
  },
  strokeColor: {
    type: String,
    default: 'rgba(255, 50, 50, 0.8)',
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
});

const audio = ref(null);
const canvas = ref(null);
// const isPlaying = ref(false);

let audioContext = null;
let analyser = null;
let source = null;
let animationId = null;
let dataArrayFreq = null;

function draw() {
  const ctx = canvas.value.getContext('2d');
  const width = props.width;
  const height = props.height;

  function renderFrame() {
    animationId = requestAnimationFrame(renderFrame);

    analyser.getByteFrequencyData(dataArrayFreq);

    ctx.clearRect(0, 0, width, height);

    const sliceWidth = width / (dataArrayFreq.length - 1);
    const maxBarHeight = Math.max(...dataArrayFreq);
    const maxWaveHeight = height * props.maxAmplitudeRatio - props.topPadding;

    const maxAllowedMultiplier =
      maxBarHeight > 0
        ? maxWaveHeight / (maxBarHeight / 2)
        : props.userAmplitudeMultiplier;

    const amplitudeMultiplier = Math.min(
      props.userAmplitudeMultiplier,
      maxAllowedMultiplier,
    );

    // Fill
    ctx.fillStyle = props.fillColor;
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let i = 0; i < dataArrayFreq.length; i++) {
      const barHeight = dataArrayFreq[i];
      const x = i * sliceWidth;
      let y = height - (barHeight / 2) * amplitudeMultiplier;
      if (y < props.topPadding) y = props.topPadding;

      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        const prevX = (i - 1) * sliceWidth;
        const prevBarHeight = dataArrayFreq[i - 1];
        let prevY = height - (prevBarHeight / 2) * amplitudeMultiplier;
        if (prevY < props.topPadding) prevY = props.topPadding;

        const cx = (prevX + x) / 2;
        const cy = (prevY + y) / 2;

        ctx.quadraticCurveTo(prevX, prevY, cx, cy);
      }
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Stroke
    ctx.strokeStyle = props.strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let i = 0; i < dataArrayFreq.length; i++) {
      const barHeight = dataArrayFreq[i];
      const x = i * sliceWidth;
      let y = height - (barHeight / 2) * amplitudeMultiplier;
      if (y < props.topPadding) y = props.topPadding;

      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        const prevX = (i - 1) * sliceWidth;
        const prevBarHeight = dataArrayFreq[i - 1];
        let prevY = height - (prevBarHeight / 2) * amplitudeMultiplier;
        if (prevY < props.topPadding) prevY = props.topPadding;

        const cx = (prevX + x) / 2;
        const cy = (prevY + y) / 2;

        ctx.quadraticCurveTo(prevX, prevY, cx, cy);
      }
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.stroke();
  }

  renderFrame();
}

function startAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();

    source = audioContext.createMediaElementSource(audio.value);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    dataArrayFreq = new Uint8Array(analyser.frequencyBinCount);
  }

  draw();
}

async function toggleAudio() {
  if (!audioContext) {
    startAudio();
  }

  await audioContext.resume();

  if (audio.value.paused) {
    audio.value.play();
  } else {
    audio.value.pause();
  }
}

watch(
  () => props.isPlaying,
  () => {
    toggleAudio();
  },
);

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  if (audioContext) {
    audioContext.close();
  }
});
</script>

<style lang="sass">
canvas
  max-width: 100%
</style>
