<template>
  <div>
    <div v-if="posts.length">
        <transition-group name="fade" tag="div">
          <div v-for="i in [currentIndex]" :key="i">
            <img :src="currentImage" />
            <p>{{currentCaption}}</p>
            <a v-bind:href="currentLink">Show on Instagram</a>
          </div>
        </transition-group>
        <a
            v-if="currentIndex > 0"
            class="prev"
            @click="prev"
            href="#">&#10094;
        </a>
        <a
            v-if="currentIndex < maxPosts - 1"
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
      maxPosts: 12,
      concurrentPosts: 6,
      totalNumPosts: null,
      posts: [],
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
        let currentPosts = [];

        console.log("posts to show at a time: " + this.concurrentPosts);
        // Divide into groups of this.concurrentPosts

        console.log(this.chunkArray(data, this.concurrentPosts));

        data.forEach((item, i) => {
            // console.log("item.caption: " + item.caption);
            // console.log("item.permalink: " + item.permalink);
            // console.log("item.media_url: " + item.media_url);
            // console.log("item.media_type: " + item.media_type);
            console.log("index: " + i);
            // console.log();

            if (item.media_type === "IMAGE") {
                currentPosts.push({
                    caption: item.caption,
                    media_url: item.media_url,
                    permalink: item.permalink
                });
            }
        });

        this.posts = currentPosts;
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
      if (this.currentIndex < this.maxPosts - 1) {
          this.currentIndex += 1;
      }
      // console.log(Math.abs(this.currentIndex) % this.posts.length);
      // console.log([this.currentIndex]);
      // for (let i in [this.currentIndex]) {
      //     console.log(i);
      // }
    },

    prev () {
      if (this.currentIndex > 0) {
          this.currentIndex -= 1;
      }
      // console.log(Math.abs(this.currentIndex) % this.posts.length);
    }
  },

  computed: {
    currentImage () {
      let i = Math.abs(this.currentIndex) % this.posts.length;
      return this.posts[i].media_url;
    },

    currentCaption () {
        let i = Math.abs(this.currentIndex) % this.posts.length;
        return this.posts[i].caption;
    },

    currentLink () {
        let i = Math.abs(this.currentIndex) % this.posts.length;
        return this.posts[i].permalink;
    },
  }
};
</script>

<style>
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

img {
  width: 50%;
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
</style>
