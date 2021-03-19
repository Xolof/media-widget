<template>
  <div>
    <div v-if="postChunks.length">
        <transition-group name="fade" tag="div">
          <div v-for="i in [currentIndex]" :key="i" class="postChunk">
              <div
                v-for="post in currentPostChunk"
                :key="post.id"
                class="post"
              >
                  <img
                      :src="post.media_url"
                   />
                   <!-- Caption and permalink should be hidden
                        and visible on hover .
                    -->
                   <!-- <p>{{post.caption}}</p>
                   <a v-bind:href="post.permalink">Show on Instagram</a> -->
              </div>
          </div>
        </transition-group>
        <a
            v-if="currentIndex > 0"
            class="prev"
            @click="prev"
            href="#">&#10094;
        </a>
        <a
            v-if="currentIndex < maxPostChunks - 1"
            class="next"
            @click="next"
            href="#">&#10095;
        </a>
    </div>
    <h1 v-else>Loading...</h1>
  </div>
</template>
<script>
export default {
  name: "Slider",
  data() {
    return {
      maxPosts: 15,
      concurrentPosts: 6,
      totalNumPosts: null,
      postChunks: [],
      currentIndex: 0,
      loading: false,
      error: null
    };
  },

  created: function() {
      this.fetchData();
  },

  methods: {
    fetchData () {
        this.error = null;
        this.loading = true;
        fetch("http://localhost:8000")
            .then(response => response.json())
            .then(data => {
                this.setTotalNumPosts(data["data"]);
                this.formatData(data["data"]);
            }
        );
    },

    setTotalNumPosts (data) {
        // Total number of posts in the account.
        // To know when there are no older posts to fetch.
        this.totalNumPosts = data.length;
    },

    formatData (data) {
        // Slice the data to get only the number
        // of posts equivalent to this.maxPosts.
        let slicedData = data.slice(0, this.maxPosts)

        // Divide into groups of this.concurrentPosts
        this.postChunks = this.chunkArray(slicedData, this.concurrentPosts);
        console.log(this.postChunks);
    },

    chunkArray(arr, size) {
        const chunkedArr = [];
        let i = 0;
        while (i < arr.length) {
            let chunk = arr.slice(i, i + size);
            chunkedArr.push(chunk);
            i += size;
        }
        return chunkedArr;
    },

    next () {
      if (this.currentIndex < this.maxPostChunks - 1) {
          this.currentIndex += 1;
          console.log(this.currentIndex)
          console.log(this.currentPostChunk)
      }
    },

    prev () {
      if (this.currentIndex > 0) {
          this.currentIndex -= 1;
          console.log(this.currentIndex)
          console.log(this.currentPostChunk)
      }
    }
  },

  computed: {
    currentPostChunk () {
      let i = Math.abs(this.currentIndex) % this.postChunks.length;
      return this.postChunks[i];
    },

    maxPostChunks () {
        const maxChunks = Math.ceil(this.maxPosts / this.concurrentPosts);
        // console.log(maxChunks);
        return maxChunks;
    },
  }
};
</script>

<style scope>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.9s ease;
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

.prev, .next {
  background-color: rgba(0,0,0,0.9);
  cursor: pointer;
  position: absolute;
  /* top: 40%; */
  top: 0;
  width: auto;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.7s ease;
  /* border-radius: 0 4px 4px 0; */
  border-radius: 4px;
  text-decoration: none;
  user-select: none;
}

.next {
  right: 0;
}

.prev {
  left: 0;
}

.prev:hover, .next:hover {
    background: #000;
}

img {
  width: 95%;
}

.postChunk {
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    margin-top: 14px;
}

.post {
    width: 40%;
    margin-bottom: 7px;
}
</style>
