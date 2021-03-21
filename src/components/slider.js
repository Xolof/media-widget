export default {
  name: 'Slider',
  data () {
    return {
      userName: null,
      maxPosts: 12,
      concurrentPosts: 6,
      postChunks: [],
      numChunks: null,
      currentIndex: 0,
      loading: false,
      loadedImages: [],
      error: null,
      hoverPost: false,
      apiURL: process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://media-api.oljo.xyz"
    }
  },

  computed: {
    currentPostChunk () {
      const i = Math.abs(this.currentIndex) % this.postChunks.length
      return this.postChunks[i]
    },

    progressBarSectionStyle () {
      return {
        height: '100%',
        width: 100 / this.postChunks.length + '%'
      }
    }
  },

  created: function () {
    try {
      this.fetchData()
    } catch (err) {
      console.error(err)
    }
  },

  methods: {
    fetchData () {
      this.error = null
      this.loading = true
      fetch(this.apiURL)
        .then(response => response.json())
        .then(data => {
          const instaData = data.data
          this.userName = instaData[0].username
          this.formatData(instaData)
        })
    },

    formatData (data) {
      // Slice the data to get only the number
      // of posts equivalent to this.maxPosts.
      const slicedData = data.slice(0, this.maxPosts)

      // Divide into groups of this.concurrentPosts
      this.postChunks = this.chunkArray(slicedData, this.concurrentPosts)
      this.numChunks = this.postChunks.length
    },

    chunkArray (arr, size) {
      const chunkedArr = []
      let i = 0
      while (i < arr.length) {
        const chunk = arr.slice(i, i + size)
        chunkedArr.push(chunk)
        i += size
      }
      return chunkedArr
    },

    next () {
      if (this.currentIndex < this.numChunks - 1) {
        this.currentIndex++
      }
    },

    prev () {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },

    imgLoaded (imageId) {
      this.loadedImages.push(imageId)
    },

    headerClicked (message, event) {
      if (!this.userName) {
        event.preventDefault()
      }
    }
  }
}
