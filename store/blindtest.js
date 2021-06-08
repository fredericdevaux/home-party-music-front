export const state = () => ({
  blindtestState: 'choosing',
  genre: '',
  currentTrack: {},
  tracks: [],
  round: 1
})

export const mutations = {
  CHANGE_STATE(state, blindtestState) {
    state.blindtestState = blindtestState
  },
  SET_CURRENT_TRACK(state, track) {
    state.currentTrack = track
  }
}

export const actions = {
  getGenreSongs({ state, dispatch }, genre) {
    dispatch('room/sendGenreToGetTracks', genre, { root: true } )
  }
}
