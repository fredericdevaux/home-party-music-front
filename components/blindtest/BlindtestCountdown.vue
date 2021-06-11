<template>
  <div class="circle center" :style="`--duration: ${duration}s`">
    <div class="count">{{ countdown }}</div>
    <div class="l-half"></div>
    <div class="r-half"></div>
  </div>
</template>

<script>
export default {
  name: 'BlindtestCountdown',
  props: {
    countdown: {
      required: true,
      type: Number,
      default() {
        return 5
      },
    },
    duration: {
      required: true,
      type: Number,
      default() {
        return 5
      },
    },
  },
}
</script>

<style lang="scss" scoped>
$d: 100;
$w: 20;

/* -- CIRCLE -- */

.circle {
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 999px;
  box-shadow: inset 0 0 0 20px rgba(#7C3AED, .3);
}

.l-half,
.r-half {
  float: left;
  width: 50%;
  height: 100%;
  overflow: hidden;

  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 20px solid #7C3AED;
    animation-duration: var(--duration);
    animation-iteration-count: 1;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
}

.l-half:before {
  border-right: none;
  border-top-left-radius: 999px;
  border-bottom-left-radius: 999px;
  transform-origin: center right;
  animation-name: l-rotate;
}

.r-half:before {
  border-left: none;
  border-top-right-radius: 999px;
  border-bottom-right-radius: 999px;
  transform-origin: center left;
  animation-name: r-rotate;
}

/* -- TIMER -- */

.count {
  position: absolute;
  width: 100%;
  line-height: $d + px;
  text-align: center;
  font-weight: 800;
  font-size: (($d - ($w * 2)) / 2) + px;
  color: #fff;
  z-index: 2;
}

@keyframes l-rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(-180deg);
  }
  100% {
    -webkit-transform: rotate(-180deg);
  }
}

@keyframes r-rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-180deg);
  }
}
</style>
