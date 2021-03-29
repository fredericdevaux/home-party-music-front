<template>
  <li class="flex-auto">
    <a
      class="text-xs font-bold px-5 py-3 block leading-normal"
      :class="{
        'text-purple-600 bg-white cursor-pointer': !isOpen,
        'text-white bg-purple-600': isOpen,
      }"
      @click="toggleTabs()"
    >
      <slot name="content"> </slot>
    </a>
  </li>
</template>

<script>
export default {
  name: 'JukeboxTabHeader',
  props: {
    isOpen: {
      type: Boolean,
      default() {
        return false
      },
      required: true,
    },
  },
  methods: {
    toggleTabs() {
      this.$emit('open_tab')
    },
  },
}
</script>

<style scoped></style>
