<template>
  <div class="border">
    <div class="w-full h-full">
      <ul class="flex mb-0 list-none flex-wrap flex-row">
        <jukebox-tab-header
          v-for="(tab, index) in tabs"
          ref="tabHeader"
          :key="index"
          :is-open="index === openTab"
          @open_tab="openTab = index"
        >
          <template v-slot:content>
            <span
              v-if="index === 0"
              class="flex items-center justify-center text-center"
            >
              <i class="mr-1.5"><users class="w-5 h-5" /></i>
              {{ tabs[index].title }} ({{ users.length }})
            </span>
            <span
              v-if="index === 1"
              class="flex items-center justify-center text-center"
            >
              <i class="mr-1.5"><queue class="w-5 h-5" /></i>
              {{ tabs[index].title }} ({{ songsQueue.length }})
            </span>
            <span
              v-if="index === 2"
              class="flex items-center justify-center text-center"
            >
              <i class="mr-1.5"><history class="w-5 h-5" /></i>
              {{ tabs[index].title }} ({{ songsHistory.length }})</span
            >
          </template>
        </jukebox-tab-header>
      </ul>
      <div
        class="
          relative
          flex flex-col
          min-w-0
          break-words
          w-full
          shadow-lg
          tabs-items
        "
      >
        <div class="flex-auto h-full">
          <div class="tab-content tab-space h-full">
            <jukebox-tab
              v-for="(tab, index) in tabs"
              :key="index"
              :class="{ hidden: openTab !== index, block: openTab === index }"
            >
              <template v-slot:content>
                <chatroom-members v-if="index === 0" />
                <songs-queue v-if="index === 1" />
                <history-queue v-if="index === 2" />
              </template>
            </jukebox-tab>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import users from '~/assets/svg/users.svg?inline'
import queue from '~/assets/svg/queue.svg?inline'
import history from '~/assets/svg/history.svg?inline'

export default {
  name: 'Jukebox',
  components: {
    users,
    queue,
    history,
  },
  data: () => ({
    tabs: [
      {
        title: `Participants`,
      },
      {
        title: `File d'attente`,
      },
      {
        title: 'Historique',
      },
    ],
    openTab: 0,
  }),
  computed: {
    ...mapState({
      users: (state) => state.room.users,
      songsQueue: (state) => state.room.songsQueue,
      songsHistory: (state) => state.room.songsHistory,
    }),
  },
  methods: {
    ...mapActions({
      createBlindtest: 'room/createBlindtest',
    }),
  },
}
</script>

<style lang="scss" scoped>
.tabs-items {
  height: calc(100% - 44px);
}
</style>
