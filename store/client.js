export const state = () => ({
  client: null,
})

export const mutations = {
  SET_CLIENT: (state, client) => {
    state.client = client
  },
}
