<script setup lang='ts'>
import { ref } from 'vue'
import type { IPrizeConfig } from '@/types/storeType'
import OfficialPrizeList from './parts/OfficialPrizeList/index.vue'
import OperationButton from './parts/OperationButton.vue'
import TemporaryDialog from './parts/TemporaryDialog.vue'
import PrizeWinnersDialog from './parts/PrizeWinnersDialog.vue'
import { usePrizeList } from './usePrizeList'
import useStore from '@/store'

const temporaryPrizeRef = ref()
const prizeWinnersRef = ref()
const selectedPrizeForView = ref<IPrizeConfig | null>(null)

const {
    temporaryPrize,
    temporaryPrizeList,
    changePersonCount,
    selectPrize,
    localImageList,
    addTemporaryPrize,
    editTemporaryPrize,
    submitTemporaryPrize,
    submitData,
    deleteTemporaryPrize,
    prizeShow,
    currentPrize,
    localPrizeList,
    isMobile,
    selectedPrize,
} = usePrizeList(temporaryPrizeRef)

const prizeConfig = useStore().prizeConfig

// 设置当前奖项
function setCurrentPrize(item: IPrizeConfig) {
    prizeConfig.setCurrentPrize(item)
}

// 查看中奖人员
function viewWinners(item: IPrizeConfig) {
    selectedPrizeForView.value = item
    prizeWinnersRef.value?.showDialog()
}
</script>

<template>
  <div v-if="localPrizeList.length" class="flex h-2/3 items-center overflow-hidden">
    <TemporaryDialog
      ref="temporaryPrizeRef"
      v-model:temporary-prize="temporaryPrize"
      v-model:selected-prize="selectedPrize"
      :change-person-count="changePersonCount"
      :select-prize="selectPrize"
      :local-image-list="localImageList"
      :add-temporary-prize="addTemporaryPrize"
      :submit-temporary-prize="submitTemporaryPrize"
      :submit-data="submitData"
    />
    <PrizeWinnersDialog
      ref="prizeWinnersRef"
      :prize="selectedPrizeForView"
    />
    <div class="h-full">
      <OfficialPrizeList
        v-model:prize-show="prizeShow"
        :local-prize-list="localPrizeList"
        :current-prize="currentPrize"
        :is-mobile="isMobile"
        :add-temporary-prize="addTemporaryPrize"
        :edit-temporary-prize="editTemporaryPrize"
        :delete-temporary-prize="deleteTemporaryPrize"
        :set-current-prize="setCurrentPrize"
        :view-winners="viewWinners"
        :temporary-prize-list="temporaryPrizeList"
      />
    </div>
    <OperationButton v-model:prize-show="prizeShow" :add-temporary-prize="addTemporaryPrize" />
  </div>
</template>

<style lang='scss' scoped>
@use "./index.scss";
</style>
