<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import defaultPrizeImage from '@/assets/images/龙.png'
import TemporaryList from '../TemporaryList.vue'
import { useGsap } from './useGsap'

const props = defineProps<{
    isMobile: boolean
    localPrizeList: IPrizeConfig[]
    currentPrize: IPrizeConfig
    addTemporaryPrize: () => void
    editTemporaryPrize: (item: IPrizeConfig) => void
    deleteTemporaryPrize: (item: IPrizeConfig) => void
    setCurrentPrize: (item: IPrizeConfig) => void
    viewWinners: (item: IPrizeConfig) => void
    temporaryPrizeList: IPrizeConfig[]
}>()

const { t } = useI18n()
const prizeShow = defineModel<boolean>('prizeShow')
const scrollContainerRef = ref<any>(null)
const ulContainerRef = ref<any>(null)
const isScroll = ref(false)
const liRefs = ref([])

const {
    showUpButton,
    showDownButton,
    handleScroll,
} = useGsap(scrollContainerRef, liRefs, isScroll, prizeShow)

// 获取ulContainerRef的高度
function getUlContainerHeight() {
    if (ulContainerRef.value) {
        return ulContainerRef.value.offsetHeight
    }
    return 0
}
// 获取scrollContainerRef的高度
function getScrollContainerHeight() {
    if (scrollContainerRef.value) {
        return scrollContainerRef.value.offsetHeight
    }
    return 0
}

function getIsScroll() {
    const ulHeight = getUlContainerHeight()
    const scrollHeight = getScrollContainerHeight()
    if (ulHeight > scrollHeight + 20) {
        isScroll.value = true
    }
    else {
        isScroll.value = false
        scrollContainerRef.value.style.height = `${ulHeight}px`
    }
}

watch([prizeShow, () => props.localPrizeList.length, () => props.temporaryPrizeList.length], (val) => {
    if (!val[0]) {
        return
    }
    setTimeout (() => {
        getIsScroll()
    }, 0)
}, { immediate: true })
</script>

<template>
  <transition name="prize-list" class="h-full" :appear="true">
    <div v-show="prizeShow && !isMobile" class="flex items-center h-full relative ">
      <div v-if="isScroll" class="w-full h-16 flex justify-center scroll-button scroll-button-up absolute top-0 z-50">
        <SvgIcon v-show="showUpButton" name="chevron-up" size="64px" class="text-gray-200/80 cursor-pointer" @click="handleScroll(-150)" />
      </div>
      <div ref="scrollContainerRef" :class="isScroll ? (showDownButton ? 'scroll-container' : 'scroll-container-end') : 'no-scroll bg-slate-500/50'" class="h-full no-before overflow-y-auto overflow-x-hidden  scroll-smooth hide-scrollbar before:bg-slate-500/50 z-20 rounded-xl">
        <ul ref="ulContainerRef" class="flex flex-col gap-1 p-2">
          <li v-for="item in temporaryPrizeList" :key="item.id" ref="liRefs">
            <TemporaryList
              :temporary-prize="item"
              :is-current="currentPrize.id === item.id"
              :edit-temporary-prize="editTemporaryPrize"
              :delete-temporary-prize="deleteTemporaryPrize"
              :set-current-prize="setCurrentPrize"
              :view-winners="viewWinners"
            />
          </li>
          <li
            v-for="item in localPrizeList"
            ref="liRefs" :key="item.id"
            :class="currentPrize.id === item.id ? 'current-prize' : ''"
          >
            <div
              v-if="item.isShow"
              class="relative flex flex-row items-center justify-between w-64 h-20 px-3 gap-6 shadow-xl card bg-base-100 cursor-pointer hover:bg-base-200 transition-colors"
              @click="setCurrentPrize(item)"
            >
              <div
                v-if="item.isUsed"
                class="absolute z-50 w-full left-0 h-full bg-gray-800/70 item-mask rounded-xl"
              />
              <figure class="w-10 h-10 rounded-xl">
                <ImageSync v-if="item.picture.url" :img-item="item.picture" />
                <img
                  v-else :src="defaultPrizeImage" alt="Prize"
                  class="object-cover h-full rounded-xl"
                >
              </figure>
              <div class="items-center p-0 card-body">
                <div class="tooltip tooltip-left w-full pl-1" :data-tip="item.name">
                  <h2
                    class="w-24 p-0 m-0 overflow-hidden card-title whitespace-nowrap text-ellipsis"
                  >
                    {{ item.name }}
                  </h2>
                </div>
                <p class="absolute z-40 p-0 m-0 text-gray-300/80 mt-9">
                  {{ item.isUsedCount }}/{{
                    item.count }}
                </p>
                <progress
                  class="w-full h-6 progress bg-[#52545b] progress-primary" :value="item.isUsedCount"
                  :max="item.count"
                />
              </div>
              <div class="flex flex-col gap-1 mr-1 z-60">
                <div class="tooltip tooltip-left" :data-tip="t('tooltip.viewWinners')">
                  <div class="cursor-pointer hover:text-fuchsia-400" @click.stop="viewWinners(item)">
                    <svg-icon name="eye" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="isScroll" class="h-24" />
      </div>
      <div v-if="isScroll" class="w-full h-16 flex justify-center scroll-button scroll-button-down absolute bottom-0 z-50">
        <SvgIcon v-show="showDownButton" name="chevron-down" size="64px" class="text-gray-200/80 cursor-pointer" @click="handleScroll(150)" />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@use "./index.scss";
</style>
