export const state = () => ({
  blindtestState: 'choosing',
  genre: '',
  currentTrack: {},
  historyTracks: [],
  round: 1,
})

export const mutations = {
  CHANGE_STATE(state, blindtestState) {
    state.blindtestState = blindtestState
  },
  SET_CURRENT_TRACK(state, track) {
    state.currentTrack = track
  },
  SET_ROUND(state, round) {
    state.round = round
  },
  ADD_TRACK_HISTORY(state, track) {
    state.historyTracks.push(track)
  },
  RESET_BLINDTEST(state) {
    state.blindtestState = 'choosing'
    state.genre = ''
    state.currentTrack = {}
    state.historyTracks = []
    state.round = 1
  },
}

export const actions = {
  getGenreSongs({ state, dispatch }, genre) {
    dispatch('room/sendGenreToGetTracks', genre, { root: true })
  },
  addUserScore({ rootState }, { user, score }) {
    const findIndex = rootState.room.users.findIndex(
      (roomUser) => roomUser.sessionId === user.sessionId
    )
    rootState.room.users[findIndex].blindtestScore += score
  },
  sendUserPoints({ rootState }, { score, type }) {
    rootState.room.room.send('increase_user_blindtestscore', { score, type })
  },
  resetBlindtest({commit}) {
    commit('room/RESET_USERS_SCORE', null, {root: true})
  }
}
