export const state = () => ({
  user: null,
  playlists: [],
})

export const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_PLAYLISTS: (state, playlists) => {
    state.playlists = playlists
  },
}
