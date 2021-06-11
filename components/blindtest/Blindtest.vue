<template>
  <div class="blindtest h-full text-white p-3">
    <div
      v-if="isAdmin && blindtestState === 'choosing' && genres && genres.length"
      class="genres grid grid-cols-4 gap-3"
    >
      <blindtest-genre-card
        v-for="genre in genres"
        :key="genre.id"
        :genre="genre"
      />
    </div>
    <div v-else-if="!isAdmin && blindtestState === 'choosing'">
      L'admin choisi un genre...
    </div>
    <div v-if="blindtestState === 'load_songs'">Tracks loading</div>
    <div v-if="blindtestState === 'end'">
      <div class="w-1/2 mr-auto ml-auto">
        <p class="text-xl text-center font-bold mb-8">La partie est finie ! Voici le classement final :</p>
        <div
          v-for="(member, index) in blindtestScores"
          :key="member.sessionId"
          class="flex items-center p-1.5 border-b"
        >
      <span class="mr-1.5">
        {{ index + 1 }}.
      </span>
          <img
            class="w-10"
            :src="member.avatarUrl ? member.avatarUrl : '/images/default-user.png'"
            alt=""
          />
          <p class="ml-1.5">{{ member.username }}</p>
          <span class="ml-auto mr-0"
          >{{ member.blindtestScore }}pts</span
          >
        </div>

        <div v-if="isAdmin" class="flex items-center justify-center mt-8">
          <button @click="restartBlindtest" class='rounded-md hover:bg-purple-800 bg-purple-600 text-white p-2 font-bold m-2.5'>
            Relancer
          </button>
          <button @click="disableBlindtest" class='rounded-md hover:bg-purple-800 bg-purple-600 text-white p-2 font-bold m-2.5'>
            Arrêter
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="blindtestState === 'next_round' || blindtestState === 'playing'"
      class="text-center font-bold text-3xl"
    >
      Round {{ round }}/15
    </div>
    <div v-if="blindtestState === 'next_round'">
      <blindtest-countdown :duration="5" :countdown="currentTimeNextRound"/>
    </div>
    <div v-if="blindtestState === 'playing'" class="text-center">
      <blindtest-countdown :duration="30" :countdown="currentTime"/>
      <div class="message text-center">
        <span v-if="message" class="inline-block bg-purple-600 p-2 rounded-2xl">{{ message }}</span>
      </div>
      <form class="text-black mt-8" @submit.prevent="checkAnswer">
        <input class="p-2 text-black w-1/2 mr-auto ml-auto" v-model="answer" type="text" placeholder="Proposition"/>
      </form>
      <div class="flex items-center justify-center mt-8">
        <div v-if="trackFound" class="mr-1.5 rounded-2xl bg-purple-600 p-2">
          {{ currentTrack.name }}
        </div>
        <div v-if="artistFound" class="rounded-2xl bg-purple-600 p-2">
          {{ currentTrackArtists }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'Blindtest',
  data: () => ({
    genres: [],
    audio: null,
    currentTime: 30,
    currentTimeNextRound: 5,
    intervalNextRound: 0,
    answer: '',
    message: '',
    trackFound: false,
    artistFound: false,
    allFoundMessage: false,
    artistFoundMessage: false,
    trackFoundMessage: false
  }),
  computed: {
    currentTrackArtists() {
      const { artists } = this.currentTrack || ''
      return artists.map((artist) => artist.name).join(', ')
    },
    blindtestScores() {
      return this.members.sort((a, b) =>
        a.blindtestScore < b.blindtestScore ? 1 : -1
      )
    },
    ...mapState({
      blindtestState: (state) => state.blindtest.blindtestState,
      round: (state) => state.blindtest.round,
      currentTrack: (state) => state.blindtest.currentTrack,
      members: (state) => state.room.users
    }),
    ...mapGetters({
      isAdmin: 'room/isAdmin'
    })
  },
  watch: {
    currentTrack(newVal) {
      console.log(newVal)
      this.message = ''
      this.trackFound = false
      this.artistFound = false
      this.allFoundMessage = false
      this.artistFoundMessage = false
      this.trackFoundMessage = false
      this.score = {
        artist: 0,
        track: 0,
        custom: 0,
        bonus: 0,
        artist_time: 0,
        track_time: 0,
        custom_time: 0,
        total_time: 0
      }
      if (newVal.previewUrl) {
        this.audio = new Audio(newVal.previewUrl)
        this.audio.volume = .2
        this.audio.controls = false
        this.audio.addEventListener('timeupdate', () => {
          this.currentTime =
            this.audio.duration.toFixed() - this.audio.currentTime.toFixed()
        })
        this.audio.play()
      }
    },
    blindtestState(newVal, oldVal) {
      if (newVal === 'next_round') {
        this.intervalNextRound = setInterval(() => {
          this.currentTimeNextRound = this.currentTimeNextRound - 1
        }, 1000)
      } else {
        clearInterval(this.intervalNextRound)
        this.currentTimeNextRound = 5
      }

      if (newVal === 'end' && this.audio) {
        this.audio.pause()
      }

      if (oldVal === 'end') {
        this.resetBlindtest()
      }
    }
  },
  created() {
    this.$axios
      .get(`${process.env.SPOTIFY_BASE_API_URL}/browse/categories`, {
        params: {
          country: 'FR',
          limit: 12
        },
        credentials: true,
        headers: {
          Authorization: `Bearer ${this.$cookies.get('access_token')}`
        }
      })
      .then((res) => {
        this.genres = res.data.categories.items
      })
      .catch((err) => {
        console.error(err)
      })
  },
  beforeDestroy() {
    if (this.audio) {
      this.audio.pause()
      this.audio = null
    }
  },
  methods: {
    sanitize(str) {
      // Specials cases
      const map = {
        a: 'á|à|ã|â|À|Á|Ã|Â',
        b: 'ß',
        e: 'é|è|ê|ë|É|È|Ê|Ë',
        i: 'í|ì|ï|î|Í|Ì|Î',
        o: 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ',
        oe: 'œ',
        u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        c: 'ç|Ç',
        n: 'ñ|Ñ',
        '-': '&|les|and|the',
        pink: 'p!nk',
        korn: 'koяn',
        1: 'un',
        2: 'deux',
        3: 'trois',
        4: 'quatre',
        5: 'cinq',
        6: 'six',
        7: 'sept',
        8: 'huit',
        9: 'neuf',
        10: 'dix',
        20: 'vingt',
        30: 'trente',
        40: 'quarante',
        50: 'cinquante',
        60: 'soixante',
        70: 'soixantedix',
        80: 'quatrevingt',
        90: 'quatrevingtdix',
        100: 'cent',
        1000: 'mille'
      }

      // Remove () and [] with content
      str = str.replace(/ *\([^)]*\) */g, '').replace(/ *\[[^)]*\] */g, '')

      // Lowercase
      str = str.toLowerCase()

      // Replace specials cases
      for (const pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern)
      }

      // Removing non-alphanumeric chars
      str = str.replace(/\W/g, '')

      // Return the sanitized string
      return str
    },

    checkAnswer() {
      if (this.artistFound && this.trackFound) {
        this.answer = ''
        return
      }
      const title = this.sanitize(this.currentTrack.name)
      const artist = this.sanitize(this.currentTrack.artists[0].name)

      const user = this.sanitize(this.answer)

      let titleSimilarity = this.similarity(title, user)
      let artistSimilarity = this.similarity(artist, user)

      const titleArtistSimilarity = this.similarity(title + ' ' + artist, user)
      const artistTitleSimilarity = this.similarity(artist + ' ' + title, user)

      // Perfect match
      if (user.includes(title)) {
        titleSimilarity = 1
      }
      if (user.includes(artist)) {
        artistSimilarity = 1
      }
      if (user.includes(title) && user.includes(artist)) {
        titleSimilarity = 1
        artistSimilarity = 1
      }

      if (titleArtistSimilarity > 0.9 || artistTitleSimilarity > 0.9) {
        if (!this.artistFound && !this.trackFound) this.sendUserPoints({ score: 3, type: 'all' })

        this.artistFound = true
        this.trackFound = true
      }

      if (titleSimilarity >= 0.9) {
        if (!this.trackFound) this.sendUserPoints({ score: 1, type: 'track' })
        this.trackFound = true
      }

      if (artistSimilarity >= 0.9) {
        if (!this.artistFound) this.sendUserPoints({ score: 1, type: 'artist' })
        this.artistFound = true
      }

      if (
        (titleSimilarity < 0.9 && titleSimilarity >= 0.6) ||
        (artistSimilarity < 0.9 && artistSimilarity >= 0.6) ||
        (titleArtistSimilarity < 0.9 && titleArtistSimilarity >= 0.6) ||
        (artistTitleSimilarity < 0.9 && artistTitleSimilarity >= 0.6)
      ) {
        this.message = 'Tu n\'es pas loin !'
      } else if (
        titleSimilarity < 0.6 ||
        artistSimilarity < 0.6 ||
        titleArtistSimilarity < 0.6 ||
        artistTitleSimilarity < 0.6
      ) {
        this.message = 'Tu n\'y es pas du tout...'
      }

      if (this.trackFound && this.artistFound && !this.allFoundMessage) {
        this.message = 'T\'as tout trouvé, bien joué !'
        this.allFoundMessage = true
      } else if (this.trackFound && !this.trackFoundMessage) {
        this.message = 'T\'as trouvé le nom de la musique !'
        this.trackFoundMessage = true
      } else if (this.artistFound && !this.artistFoundMessage) {
        this.message = 'T\'as trouvé l\'artiste !'
        this.artistFoundMessage = true
      }

      this.answer = ''
    },

    similarity(s1, s2) {
      let longer = s1
      let shorter = s2
      if (s1.length < s2.length) {
        longer = s2
        shorter = s1
      }
      const longerLength = longer.length
      if (longerLength === 0) {
        return 1.0
      }
      return (
        (longerLength - this.editDistance(longer, shorter)) /
        parseFloat(longerLength)
      )
    },

    editDistance(s1, s2) {
      s1 = s1.toLowerCase()
      s2 = s2.toLowerCase()

      const costs = []
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i
        for (let j = 0; j <= s2.length; j++) {
          if (i === 0) costs[j] = j
          else if (j > 0) {
            let newValue = costs[j - 1]
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
            costs[j - 1] = lastValue
            lastValue = newValue
          }
        }
        if (i > 0) costs[s2.length] = lastValue
      }
      return costs[s2.length]
    },
    ...mapMutations({
      resetBlindtest: 'blindtest/RESET_BLINDTEST'
    }),
    ...mapActions({
      sendUserPoints: 'blindtest/sendUserPoints',
      disableBlindtest: 'room/disableBlindtest',
      restartBlindtest: 'room/restartBlindtest'
    })
  }
}
</script>

<style scoped>
.circle {
  margin: 40px auto;
}

.message {
  height: 40px;
}
</style>
