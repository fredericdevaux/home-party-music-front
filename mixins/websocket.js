import { mapMutations, mapState } from 'vuex'

export const websocket = {
  computed: {
    ...mapState({
      client: (state) => state.client.client,
    }),
  },
  mounted() {
    const client = new this.$colyseus.Client(process.env.WEBSOCKET_URL)
    this.setClient(client)
  },
  methods: {
    ...mapMutations({
      setClient: 'client/SET_CLIENT',
    }),
  },
}
