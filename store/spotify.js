export const state = () => ({
  user: null,
  playlists: [],
  isConnected: true,
  message: null,
  nowPlaying: {},
  recentlyPlayed: {},
  trackProgress: 0,
  isPlaying: false,
})

export const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_PLAYLISTS: (state, playlists) => {
    state.playlists = playlists
  },
  SET_CONNECTION(state, isConnected) {
    state.isConnected = isConnected
  },
  SET_MESSAGE(state, message) {
    state.message = message
  },
  SET_NOW_PLAYING(state, nowPlaying) {
    state.nowPlaying = nowPlaying
  },
  SET_IS_PLAYING(state, isPlaying) {
    state.isPlaying = isPlaying
  },
  SET_PROGRESS(state, { progress, duration }) {
    state.trackProgress = (progress / duration) * 100
  },
  SET_RECENTLY_PLAYED(state, recentlyPlayed) {
    state.recentlyPlayed = recentlyPlayed
  },
}

export const actions = {
  async getUserInfo({ commit, dispatch }) {
    const spotifyAccessToken = this.$cookies.get('access_token')
    if (spotifyAccessToken) {
      await this.$axios
        .get(`${process.env.SPOTIFY_BASE_API_URL}/me`, {
          credentials: true,
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        })
        .then((res) => {
          commit('spotify/SET_USER', res.data)
        })
        .catch((err) => {
          const status = err.response.status
          if (status === 401) {
            dispatch('spotify/refreshToken')
          }
        })
    }
  },
  async refreshToken() {
    await this.$axios
      .get(
        `${
          process.env.SERVER_URL
        }/refresh_token?refresh_token=${this.$cookies.get('refresh_token')}`
      )
      .then((res) => {})
  },
  updateProgress({ commit, state }, props) {
    commit('progressChange', props)
    return state.trackProgress
  },
  updateTrack({ commit, state }, nowPlaying) {
    commit('nowPlayingChange', nowPlaying)
    return state.nowPlaying
  },
  updateStatus({ commit, state }, isPlaying) {
    commit('isPlayingChange', isPlaying)
    return state.isPlaying
  },
  updateConnection({ commit, state }, isConnected) {
    commit('connectionChange', isConnected)
    return state.isConnected
  },
}
