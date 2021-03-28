/* eslint-disable camelcase */
export const state = () => ({
  currentTrackState: {},
  deviceId: 0,
})

export const getters = {
  currentTrackArtists: (state) => {
    const { artists } = state.currentTrackState?.item || []
    return artists ? artists.map((artist) => artist.name).join(', ') : null
  },
  currentTrackName: (state) => {
    const { name } = state.currentTrackState?.item || ''
    return name
  },
  currentTrackId: (state) => {
    const { id } = state.currentTrackState?.item || 0
    return id
  },
  currentTrackCover: (state) => {
    const { imageUrl } = state.currentTrackState?.item || ''
    return imageUrl
  },
  currentTrackPosition: (state) => {
    const { progressMs } = state.currentTrackState
    return progressMs
  },
  isPlaying: (state) => {
    const { isPlaying } = state.currentTrackState
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
}
