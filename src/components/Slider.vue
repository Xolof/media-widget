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
      <div class="progressBar">
        <div
          v-for="i in postChunks.length"
          :key="i"
          class="progressBarSection"
          :class="{ active: i === currentIndex + 1 }"
          :style="progressBarSectionStyle"
        />
      </div>
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
        <div class="postChunk">
          <div
            v-for="i in concurrentPosts"
            :key="i"
            class="post postPlaceholder"
          />
        </div>
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
    },

    progressBarSectionStyle () {
      return {
        height: '100%',
        width: 100 / this.postChunks.length + '%'
      }
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
main {
    width: 100%;
}

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
    z-index: 1000;
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
  background: #333;
}

.mediaWrapper {
    opacity: 0;
    z-index: 100;
    height: 100%;
}

.postChunk {
    display: flex;
    flex-flow: wrap;
    align-content: space-between;
    justify-content: space-around;
    width: 100%;
    margin: 6px auto;
    padding: 0 2px 0;
}

.post {
    width: 47vw;
    height: 47vw;
    position: relative;
    margin-bottom: 8px;
    box-shadow: 3px 3px 6px #333;

    /* Animated background to show when loading. */
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 2s ease infinite;
}

/* Keyframes for animated background to show when loading. */
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.postDetailsOverlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.67);
    z-index: 500;
    opacity: 0;
    transition: 0.5s;
}

.postDetailsOverlay.active {
    opacity: 1;
}

.postDetailsText {
    position: absolute;
    margin: 0;
    padding: 0.8em 0.4em 1.2em;
    top: 44%;
    left: 5%;
    right: 5%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 16px;
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

.visible {
    opacity: 1;
    transition: 0.5s;
}

.progressBar {
    top: 50px;
    position: -webkit-sticky;
    position: sticky;
    display: flex;
    flex-flow: row;
    width: 100%;
    height: 5px;
    background: #ccc;
    z-index: 1000;
    background-color: rgba(0,0,0,0.96);
}

.progressBarSection.active {
    background: #919191;
}

@media (min-width: 768px) {
    .post {
        width: 32.5vw;
        height: 32.5vw;
        margin-bottom: 8px;
    }
}

@media (min-width: 992px) {
    .post {
        width: 16vw;
        height: 16vw;
    }
    .postDetailsText {
        font-size: 15px;
    }
}
</style>
