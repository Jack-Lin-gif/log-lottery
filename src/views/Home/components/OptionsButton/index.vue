<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { computed, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LotteryStatus } from '@/views/Home/type'

interface Props {
    currentStatus: LotteryStatus
    tableData: any[]
    enterLottery: () => void
    startLottery: () => void
    stopLottery: () => void
    continueLottery: () => void
    quitLottery: () => void
    currentPrize: IPrizeConfig
    minPrizeCount: number
    setPrizeCount: (count: number) => void
    increasePrizeCount: () => void
    decreasePrizeCount: () => void
    roundDrawCount: number
    minRoundCount: number
    maxRoundCount: number
    setRoundCount: (count: number) => void
    increaseRoundCount: () => void
    decreaseRoundCount: () => void
}
const props = defineProps<Props>()

const {
    currentStatus,
    tableData,
    enterLottery,
    startLottery,
    stopLottery,
    continueLottery,
    quitLottery,
    currentPrize,
    minPrizeCount,
    setPrizeCount,
    increasePrizeCount,
    decreasePrizeCount,
    roundDrawCount,
    minRoundCount,
    maxRoundCount,
    setRoundCount,
    increaseRoundCount,
    decreaseRoundCount,
} = toRefs(props)
const prizeCountInput = ref<number | string>(1)
const roundCountInput = ref<number | string>(1)
const canEditCount = computed(() => currentStatus.value === LotteryStatus.ready || currentStatus.value === LotteryStatus.end)
const showCountEditor = computed(() => canEditCount.value && tableData.value.length > 0)
const canDecrease = computed(() => canEditCount.value && currentPrize.value.count > minPrizeCount.value)
const canEditRound = computed(() => canEditCount.value && maxRoundCount.value > 0)
const canDecreaseRound = computed(() => canEditRound.value && roundDrawCount.value > minRoundCount.value)
const canIncreaseRound = computed(() => canEditRound.value && roundDrawCount.value < maxRoundCount.value)

watch(() => currentPrize.value.count, (value) => {
    prizeCountInput.value = value
}, { immediate: true })
watch(() => roundDrawCount.value, (value) => {
    roundCountInput.value = value
}, { immediate: true })

function commitPrizeCount() {
    const nextValue = Number(prizeCountInput.value)
    if (!Number.isFinite(nextValue)) {
        prizeCountInput.value = currentPrize.value.count
        return
    }
    setPrizeCount.value(nextValue)
    prizeCountInput.value = currentPrize.value.count
}
function commitRoundCount() {
    const nextValue = Number(roundCountInput.value)
    if (!Number.isFinite(nextValue)) {
        roundCountInput.value = roundDrawCount.value
        return
    }
    setRoundCount.value(nextValue)
    roundCountInput.value = roundDrawCount.value
}
const { t } = useI18n()
</script>

<template>
  <div id="menu">
    <div v-if="showCountEditor" class="flex justify-center mb-4 text-sm">
      <div class="flex items-center gap-4 px-4 py-3 border border-white/10 rounded-2xl bg-slate-900/60 text-slate-100 shadow-lg backdrop-blur">
        <div class="flex flex-col items-start pr-4 border-r border-white/10">
          <span class="text-[10px] uppercase tracking-[0.2em] text-slate-200/70">{{ t('table.numberParticipants') }}</span>
          <span class="text-sm font-semibold">{{ currentPrize.name }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <span class="w-20 text-[11px] text-slate-200/70">{{ t('table.numberParticipants') }}</span>
            <div class="join">
              <button class="btn btn-sm join-item" :disabled="!canDecrease" @click="decreasePrizeCount()">
                -
              </button>
              <input
                v-model.number="prizeCountInput"
                type="number"
                :min="minPrizeCount"
                class="input input-bordered input-sm join-item w-20 text-center"
                :disabled="!canEditCount"
                @change="commitPrizeCount"
                @blur="commitPrizeCount"
                @keydown.enter="commitPrizeCount"
              >
              <button class="btn btn-sm join-item" :disabled="!canEditCount" @click="increasePrizeCount()">
                +
              </button>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-20 text-[11px] text-slate-200/70">{{ t('table.onceNumber') }}</span>
            <div class="join">
              <button class="btn btn-sm join-item" :disabled="!canDecreaseRound" @click="decreaseRoundCount()">
                -
              </button>
              <input
                v-model.number="roundCountInput"
                type="number"
                :min="minRoundCount"
                :max="maxRoundCount"
                class="input input-bordered input-sm join-item w-20 text-center"
                :disabled="!canEditRound"
                @change="commitRoundCount"
                @blur="commitRoundCount"
                @keydown.enter="commitRoundCount"
              >
              <button class="btn btn-sm join-item" :disabled="!canIncreaseRound" @click="increaseRoundCount()">
                +
              </button>
            </div>
            <span class="text-[11px] text-slate-200/50">/ {{ maxRoundCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <button v-if="currentStatus === LotteryStatus.init && tableData.length > 0" class="btn-neon" @click="enterLottery">
      {{ t('button.enterLottery') }}
    </button>

    <div v-if="currentStatus === LotteryStatus.ready" class="start">
      <button class="btn-stars" @click="startLottery">
        <strong>{{ t('button.start') }}</strong>
        <div id="container-stars">
          <div id="stars" />
        </div>

        <div id="glow">
          <div class="circle" />
          <div class="circle" />
        </div>
      </button>
    </div>

    <button v-if="currentStatus === LotteryStatus.running" class="btn-neon btn glass btn-lg" @click="stopLottery">
      {{ t('button.selectLucky') }}
    </button>

    <div v-if="currentStatus === LotteryStatus.end" class="flex justify-center gap-6 enStop">
      <div class="start">
        <button class="btn-stars" @click="continueLottery">
          <strong>{{ t('button.continue') }}</strong>
          <div id="container-stars">
            <div id="stars" />
          </div>

          <div id="glow">
            <div class="circle" />
            <div class="circle" />
          </div>
        </button>
      </div>

      <div class="start">
        <button class="btn-stars btn-cancel" @click="quitLottery">
          <strong>{{ t('button.cancel') }}</strong>
          <div id="container-stars">
            <div id="stars" />
          </div>

          <div id="glow">
            <div class="circle" />
            <div class="circle" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss'
</style>
