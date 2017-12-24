import Vue from 'vue'
import Vuex from 'vuex'
import { Auth, database } from '~/plugins/firebase-client-init.js'
import { baseUpdate, baseRetrieve } from '~/plugins/functions.js'
//  import axios from '~/plugins/axios'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    user: null,
    data: '',
    all: '',
    loading: false,
    issueLoader: false,
    issueAdding: false,
    movieAdding: false,
    partnerAdding: false,
    partnersImagesAdding: false,
    previewPhotos: [],
    movies: [],
    issues: [],
    soundtracks: [],
    partners: [],
    partnersImages: []
  },
  getters: {
    issueLoader: (state, getters) => {
      return state.issueLoader
    },
    isLoading: (state, getters) => {
      return state.loading
    },
    activeUser: (state, getters) => {
      return state.user
    }
  },
  mutations: {
    set (state, {type, items}) {
      state[type] = items
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    issueLoading (state, payload) {
      state.issueLoader = payload
    }
  },
  actions: {
    async updatePartnersImages ({ commit }) {
      baseUpdate('child_added', 'PartnersImage', (cb) => {
        //  console.log(cb)
        commit('set', { type: 'partnersImages', items: cb })
      })
    },
    async getPartnersImages ({ commit }) {
      const data = await baseRetrieve('PartnersImage')
      commit('set', { type: 'partnersImages', items: data })
    },
    async updatePartners ({ commit }) {
      baseUpdate('child_added', 'Partners', (cb) => {
        //  console.log(cb)
        commit('set', { type: 'partners', items: cb })
      })
    },
    async getPartners ({ commit }) {
      const data = await baseRetrieve('Partners')
      commit('set', { type: 'partners', items: data })
    },
    async getSoundtracks ({ commit }) {
      const data = await baseRetrieve('Soundtracks')
      commit('set', { type: 'soundtracks', items: data })
    },
    async IssueEdit ({ commit }) {
      baseUpdate('value', 'Issues', (cb) => {
        //  console.log(cb)
        commit('set', { type: 'issues', items: cb })
      })
      commit('issueLoading', false)
    },
    async SignIn ({ commit }, payload) {
      commit('setLoading', true)
      const userData = await Auth.signInWithEmailAndPassword(payload.email, payload.password)
      commit('set', { type: 'user', items: { email: userData.email, uid: userData.uid } })
      //  console.log(this.state.user)
      commit('setLoading', false)
    },
    async getMovies ({ commit }) {
      let array = []
      try {
        const data = await database.ref('Movies').once('value')
        data.forEach((child) => {
          const childData = child.val()
          array.push(childData)
        })
        //  console.log(array)
        commit('set', { type: 'movies', items: array })
      } catch (err) {
        console.log(err)
      }
    },
    async getIssues ({ commit }) {
      let array = []
      try {
        const data = await database.ref('Issues').once('value')
        data.forEach((child) => {
          const childData = child.val()
          array.push(childData)
        })
        commit('set', { type: 'issues', items: array })
        //  console.log(this.state.issues)
      } catch (err) {
        console.log(err)
      }
    },
    async updateIssues ({ commit }) {
      let updateArray = []
      await database.ref('Issues').on('child_added', snapshot => {
        console.log('updated', snapshot.val())
        updateArray.push(snapshot.val())
        commit('set', { type: 'issues', items: updateArray })
      })
      commit('setLoading', false)
    },
    async getPreviewPhotos ({ commit }) {
      let array = []
      try {
        const data = await database.ref('Movies').once('value')
        data.forEach((child) => {
          const childData = child.val()
          array.push(childData)
        })
        commit('set', { type: 'previewPhotos', items: array })
        //  console.log(this.state.previewPhotos)
      } catch (err) {
        console.log(err)
      }
    },
    updatePhotos ({ commit }) {
      let updateArray = []
      database.ref('Movies').on('child_added', snapshot => {
        console.log('updated', snapshot.val())
        updateArray.push(snapshot.val())
        commit('set', { type: 'movies', items: updateArray })
      })
      commit('setLoading', false)
    }
  }
})

export default store
