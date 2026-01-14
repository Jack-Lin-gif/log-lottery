<script setup lang='ts'>
import type { IPersonConfig, IPrizeConfig } from '@/types/storeType'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useStore from '@/store'

const props = defineProps<{
    prize: IPrizeConfig | null
}>()

const { t } = useI18n()
const personConfig = useStore().personConfig
const dialogRef = ref<HTMLDialogElement | null>(null)

// 获取该奖项的中奖人员
const winners = computed(() => {
    if (!props.prize) {
        console.log('prize is null')
        return []
    }
    const prizeId = props.prize.id
    console.log('looking for prizeId:', prizeId, typeof prizeId)
    const result = personConfig.getWinnersByPrizeId(prizeId).value
    console.log('found winners:', result.length, result)
    return result
})

function showDialog() {
    dialogRef.value?.showModal()
}

function closeDialog() {
    dialogRef.value?.close()
}

defineExpose({
    showDialog,
    closeDialog,
})
</script>

<template>
  <dialog id="my_modal_2" ref="dialogRef" class="border-none modal">
    <div class="modal-box max-w-2xl border border-fuchsia-400/30 bg-slate-900/80 text-slate-100 shadow-[0_0_40px_rgba(244,114,182,0.25)] backdrop-blur">
      <div class="flex items-center justify-between gap-4 mb-4">
        <h3 class="text-xl font-bold bg-gradient-to-r from-amber-200 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
          {{ prize?.name }} - {{ t('dialog.titleWinners') }}
        </h3>
        <span class="px-3 py-1 text-xs font-semibold tracking-widest text-fuchsia-100 uppercase border rounded-full border-fuchsia-400/40 bg-fuchsia-500/10">
          {{ winners.length }}/{{ prize?.count }}
        </span>
      </div>

      <div v-if="winners.length === 0" class="py-8 text-center text-slate-400">
        {{ t('message.noWinners') }}
      </div>

      <div v-else class="max-h-80 overflow-y-auto space-y-2 pr-2">
        <div
          v-for="person in winners"
          :key="person.id"
          class="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50"
        >
          <div class="flex-1">
            <div class="font-medium">{{ person.name }}</div>
            <div v-if="person.prizeTime && person.prizeTime.length > 0" class="text-xs text-slate-400">
              {{ person.prizeTime[person.prizeTime.length - 1] }}
            </div>
          </div>
          <div v-if="person.department" class="text-sm text-slate-400">
            {{ person.department }}
          </div>
        </div>
      </div>

      <div class="modal-action mt-4">
        <button type="button" class="btn btn-sm btn-primary" @click="closeDialog">
          {{ t('button.close') }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
}
</style>
