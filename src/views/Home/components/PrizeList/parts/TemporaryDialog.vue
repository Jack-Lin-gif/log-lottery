<script setup lang='ts'>
import type { IImage, IPrizeConfig } from '@/types/storeType'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    changePersonCount: () => void
    selectPrize: (prize: IPrizeConfig) => void
    localImageList: IImage[]
    submitTemporaryPrize: () => boolean
    addTemporaryPrize: () => void
    submitData: (separatedNumber: any) => void
}>()
const { t } = useI18n()
const dialogRef = ref<HTMLDialogElement | null>(null)
const temporaryPrize = defineModel<IPrizeConfig>('temporaryPrize', { required: true })
const selectedPrize = defineModel<IPrizeConfig | null>('selectedPrize', { required: true })
function handleSubmit() {
    if (props.submitTemporaryPrize()) {
        dialogRef.value?.close()
    }
}
function showDialog() {
    dialogRef.value?.showModal()
}
defineExpose({
    showDialog,
    closed,
})
</script>

<template>
  <EditSeparateDialog
    :total-number="selectedPrize?.count" :separated-number="selectedPrize?.separateCount.countList"
    @submit-data="submitData"
  />
  <dialog id="my_modal_1" ref="dialogRef" class="border-none modal">
    <div class="modal-box max-w-xl border border-fuchsia-400/30 bg-slate-900/80 text-slate-100 shadow-[0_0_40px_rgba(244,114,182,0.25)] backdrop-blur">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[10px] uppercase tracking-[0.35em] text-fuchsia-200/70">One More Thing</p>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-amber-200 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
            {{ t('dialog.titleTemporary') }}
          </h3>
        </div>
        <span class="px-3 py-1 text-xs font-semibold tracking-widest text-fuchsia-100 uppercase border rounded-full border-fuchsia-400/40 bg-fuchsia-500/10">
          Bonus Draw
        </span>
      </div>
      <div class="grid gap-4 mt-6">
        <label class="flex flex-col gap-2">
          <span class="text-xs text-slate-300">{{ t('table.prizeName') }}</span>
          <input
            v-model="temporaryPrize.name" type="text" :placeholder="t('placeHolder.name')"
            class="w-full input-sm input input-bordered bg-slate-950/60 border-fuchsia-400/30 focus:border-fuchsia-300"
          >
        </label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs text-slate-300">{{ t('table.fullParticipation') }}</span>
            <div class="flex items-center gap-3">
              <input
                type="checkbox" :checked="temporaryPrize.isAll"
                class="border-solid checkbox checkbox-secondary border"
                @change="temporaryPrize.isAll = !temporaryPrize.isAll"
              >
              <span class="text-xs text-slate-400">{{ t('table.fullParticipation') }}</span>
            </div>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs text-slate-300">{{ t('table.setLuckyNumber') }}</span>
            <input
              v-model="temporaryPrize.count" type="number" :placeholder="t('placeHolder.winnerCount')" class="input-sm input input-bordered bg-slate-950/60 border-fuchsia-400/30 focus:border-fuchsia-300"
              @change="changePersonCount"
            >
          </label>
        </div>
        <label class="flex flex-col gap-2">
          <span class="text-xs text-slate-300">{{ t('table.luckyPeopleNumber') }}</span>
          <input
            v-model="temporaryPrize.isUsedCount" disabled type="number" :placeholder="t('placeHolder.winnerCount')"
            class="input-sm input input-bordered bg-slate-950/60 border-fuchsia-400/30 opacity-70"
          >
        </label>
        <label v-if="temporaryPrize.separateCount" class="flex flex-col gap-2">
          <span class="text-xs text-slate-300">{{ t('table.onceNumber') }}</span>
          <div class="flex justify-start h-full" @click="selectPrize(temporaryPrize)">
            <ul
              v-if="temporaryPrize.separateCount.countList.length"
              class="flex flex-wrap w-full h-full gap-2 p-0 pt-1 m-0 cursor-pointer"
            >
              <li
                v-for="se in temporaryPrize.separateCount.countList"
                :key="se.id" class="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700/60 separated"
              >
                <div
                  class="flex items-center justify-center w-full h-full tooltip"
                  :data-tip="`${t('tooltip.doneCount') + se.isUsedCount}/${se.count}`"
                >
                  <div
                    class="absolute left-0 z-50 h-full rounded-lg bg-fuchsia-300/60"
                    :style="`width:${se.isUsedCount * 100 / se.count}%`"
                  />
                  <span class="text-sm font-semibold">{{ se.count }}</span>
                </div>
              </li>
            </ul>
            <button v-else class="btn btn-secondary btn-sm">{{ t('button.setting') }}</button>
          </div>
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs text-slate-300">{{ t('table.image') }}</span>
          <select v-model="temporaryPrize.picture" class="w-full select select-warning select-sm bg-slate-950/60 border-fuchsia-400/30">
            <option v-if="temporaryPrize.picture.id" :value="{ id: '', name: '', url: '' }">❌
            </option>
            <option disabled selected>{{ t('table.selectPicture') }}</option>
            <option v-for="picItem in localImageList" :key="picItem.id" class="w-auto" :value="picItem">{{
              picItem.name }}
            </option>
          </select>
        </label>
      </div>
      <div class="modal-action flex gap-3">
        <button type="button" class="btn btn-sm btn-primary" @click="handleSubmit">
          {{ t('button.confirm') }}
        </button>
        <button type="button" class="btn btn-sm btn-ghost" @click="dialogRef?.close()">
          {{ t('button.cancel') }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>
