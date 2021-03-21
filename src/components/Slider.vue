<template>
  <main>
    <div
      class="heading"
      :class="{ fullHeight: userName }"
    >
      <h2>
        <a
          :href="'https://www.instagram.com/explore/tags/' + userName"
          target="_blank"
          rel="noopener noreferrer"
          @click="headerClicked('header clicked', $event)"
        >
          #{{ userName }}
        </a>
      </h2>
    </div>
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
                  Here is a
                  <a
                    :href="post.media_url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    link to the video
                  </a>
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
                      post.caption.length > 80 ?
                        post.caption.slice(0, 79) + "..." :
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

<script src="./slider.js"></script>

<style scope>
    @import "../assets/styles/slider.css"
</style>
