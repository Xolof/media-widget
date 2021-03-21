<template>
  <main>
    <div
      class="slider"
    >
      <nav>
        <span>
          <a
            v-if="currentIndex > 0"
            class="prev"
            href="#"
            @click="prev"
          >
            &#10094;
          </a>
        </span>
        <span>
          <a
            v-if="currentIndex < numChunks - 1"
            class="next"
            href="#"
            @click="next"
          >
            &#10095;
          </a>
        </span>
      </nav>
      <transition-group
        v-if="postChunks.length"
        name="fade"
        tag="div"
        class="transitionGroup"
      >
        <div
          v-for="i in [currentIndex]"
          :key="i"
          class="postChunk"
        >
          <div
            v-for="post in currentPostChunk"
            :key="post.id"
            class="post"
            @mouseover="hoverPost = post.id"
            @mouseleave="hoverPost = false"
          >
            <div
              class="mediaWrapper"
              :class="{ visible: loadedImages.includes(post.id) }"
            >
              <img
                v-if="(post.media_type === 'IMAGE')"
                :key="post.media_url"
                :src="post.media_url"
                :alt="post.caption"
                @load="imgLoaded(post.id)"
              >
              <img
                v-else-if="post.media_type === 'CAROUSEL_ALBUM'"
                :key="post.media_url"
                :src="post.media_url"
                :alt="post.caption"
                @load="imgLoaded(post.id)"
              >
              <video
                v-if="post.media_type === 'VIDEO'"
                :key="post.media_url"
                :src="post.media_url"
                type="video/mp4"
                :title="post.caption"
                autoplay
                loop
                muted
                @canplay="imgLoaded(post.id)"
              >
                <p>
                  Your browser doesn't support HTML5 video.
                  Here is a <a :href="post.media_url">link to the video</a>
                  instead.
                </p>
              </video>
              <div
                :class="{ active: hoverPost === post.id }"
                class="postDetailsOverlay"
              >
                <div class="postDetailsText">
                  <p>
                    {{
                      post.caption.length > 120 ?
                        post.caption.slice(0, 119) + "..." :
                        post.caption
                    }}
                  </p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    :href="post.permalink"
                  >
                    Show on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <div v-else>
        <div class="spinner" />
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: 'Slider',
  data () {
    return {
      maxPosts: 12, // Max number of posts to display in the widget.
      concurrentPosts: 6, // Number of posts per slide.
      totalNumPosts: null,
      postChunks: [],
      numChunks: null,
      currentIndex: 0,
      loading: false,
      loadedImages: [], // Id's of images that have been loaded.
      error: null,
      hoverPost: false
    }
  },

  computed: {
    currentPostChunk () {
      const i = Math.abs(this.currentIndex) % this.postChunks.length
      return this.postChunks[i]
    },

    maxPostChunks () {
      const maxChunks = Math.ceil(this.maxPosts / this.concurrentPosts)
      return maxChunks
    }
  },

  created: function () {
    this.fetchData()
  },

  methods: {
    fetchData () {
      this.error = null
      this.loading = true
      fetch('http://localhost:8000')
        .then(response => response.json())
        .then(data => {
          this.setTotalNumPosts(data.data)
          this.formatData(data.data)
        }
        )
    },

    setTotalNumPosts (data) {
      // Total number of posts in the account.
      // To know when there are no older posts to fetch.
      this.totalNumPosts = data.length
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
        this.currentIndex += 1
      }
    },

    prev () {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1
      }
    },

    imgLoaded (imageId) {
      this.loadedImages.push(imageId)
    }
  }
}
</script>

<style scope>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
  overflow: hidden;
  visibility: visible;
  position: absolute;
  width:100%;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  visibility: hidden;
  width:100%;
  opacity: 0;
}

nav {
    top: 0;
    position: -webkit-sticky;
    position: sticky;
    display: flex;
    z-index: 200;
}

nav span {
    width: 50%;
    height: 50px;
    background-color: rgba(0,0,0,0.96);
}

.prev,
.next {
  display: block;
  height: 100%;
  width: 100%;
  cursor: pointer;
  line-height: 50px;
  color: white;
  font-weight: bold;
  font-size: 24px;
  transition: 0.5s ease;
  text-decoration: none;
  user-select: none;
}

.prev:hover,
.next:hover {
    background: #000;
}

img,
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mediaWrapper {
    opacity: 0;
}

.visible {
    opacity: 1;
    transition: 0.5s;
}

.postChunk {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: center;
}

.post {
    width: 49vw;
    height: 49vw;
    position: relative;
}

.postDetailsOverlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.67);
    z-index: 100;
    opacity: 0;
    transition: 0.5s;
}

.postDetailsOverlay.active {
    opacity: 1;
}

.postDetailsText {
    position: absolute;
    margin: 0;
    padding: 0.8em 0.2em 1.2em;
    top: 44%;
    left: 5%;
    right: 5%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 12px;
    background-color: #0d0d0d;
}

.postDetailsText p {
    color: #f0f0f0;
    margin-bottom: 1.4em;
}

.postDetailsText a {
    color: #e452e2;
    text-decoration: none;
}

.postDetailsText a:hover {
    color: #fb5cf9;
}

.spinner {
    height: 100px;
    width: 100px;
    border: 12px solid #f7f7f7;
    border-top: 12px solid fuchsia;
    border-right: 12px solid fuchsia;
    border-bottom: 12px solid fuchsia;
    border-radius: 50%;
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
      transform: rotate(0deg);
  }

  100% {
      transform: rotate(360deg);
  }
}

@media (min-width: 900px) {
    .post {
        width: 33vw;
        height: 33vw;
    }
}

@media (min-width: 1100px) {
    .post {
        width: 16.66vw;
        height: 16.66vw;
    }
}
</style>
