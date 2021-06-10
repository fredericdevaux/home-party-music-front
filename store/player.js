/* eslint-disable camelcase */
export const state = () => ({
  currentTrackState: {},
  deviceId: 0,
  volume: 50,
  playerProgress: 0,
})

export const getters = {
  currentTrackArtists: (state) => {
    const { artists } = state.currentTrackState?.item || ''
    return artists.map((artist) => artist.name).join(', ')
  },
  currentTrackName: (state) => {
    const { name } = state.currentTrackState?.item || ''
    return name
  },
  currentTrackId: (state) => {
    const { id } = state.currentTrackState?.item || ''
    return id
  },
  currentTrackUid: (state) => {
    const { uid } = state.currentTrackState?.item || ''
    return uid
  },
  currentTrackCover: (state) => {
    const { imageUrl } = state.currentTrackState?.item || ''
    return imageUrl || '/images/default-cover.png'
  },
  currentTrackProgress: (state) => {
    const { progressMs } = state.currentTrackState || 0
    return progressMs
  },
  currentTrackDuration: (state) => {
    const { duration } = state.currentTrackState?.item || 0
    return duration
  },
  isPlaying: (state) => {
    const { isPlaying } = state.currentTrackState || false
    return isPlaying
  },
}

export const mutations = {
  SET_CURRENT_TRACK(state, track) {
    state.currentTrackState = track
  },
  SET_DEVICE_ID(state, deviceId) {
    state.deviceId = deviceId
  },
  CHANGE_VOLUME(state, volumePercent) {
    state.volume = volumePercent
  },
  SET_PLAYER_PROGRESS(state, playerProgress) {
    state.playerProgress = playerProgress
  },
  INCREMENT_PLAYER_PROGRESS(state, playerProgress) {
    state.playerProgress += playerProgress
  },
}
