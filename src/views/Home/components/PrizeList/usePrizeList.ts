import type { IPrizeConfig } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import { onMounted, ref, toRaw } from 'vue'
import i18n from '@/locales/i18n'

import useStore from '@/store'

export function usePrizeList(temporaryPrizeRef: any) {
    const prizeConfig = useStore().prizeConfig
    const globalConfig = useStore().globalConfig
    const system = useStore().system
    const {
        getPrizeConfig: localPrizeList,
        getCurrentPrize: currentPrize,
        getTemporaryPrize: temporaryPrize,
        getTemporaryPrizeList: temporaryPrizeList,
    } = storeToRefs(prizeConfig)
    const {
        getIsShowPrizeList: isShowPrizeList,
        getImageList: localImageList,
    }
        = storeToRefs(globalConfig)
    const { getIsMobile: isMobile } = storeToRefs(system)

    const selectedPrize = ref<IPrizeConfig | null>(null)
    const prizeShow = ref(structuredClone(isShowPrizeList.value))
    const editingTemporaryPrizeId = ref<number | string | null>(null)

    function openTemporaryPrizeDialog(item?: IPrizeConfig) {
        if (item) {
            editingTemporaryPrizeId.value = item.id
            prizeConfig.setTemporaryPrize(structuredClone(toRaw(item)))
        }
        else {
            editingTemporaryPrizeId.value = null
            prizeConfig.resetTemporaryPrize()
        }
        temporaryPrizeRef.value.showDialog()
    }
    function addTemporaryPrize() {
        openTemporaryPrizeDialog()
    }
    function editTemporaryPrize(item: IPrizeConfig) {
        openTemporaryPrizeDialog(item)
    }

    function deleteTemporaryPrize(item: IPrizeConfig) {
        prizeConfig.deleteTemporaryPrizeItem(item.id)
        if (currentPrize.value?.id === item.id) {
            setCurrentPrize()
        }
    }
    function submitTemporaryPrize() {
        if (!temporaryPrize.value.name || !temporaryPrize.value.count) {
            // eslint-disable-next-line no-alert
            alert(i18n.global.t('error.completeInformation'))
            return false
        }
        const payload = structuredClone(toRaw(temporaryPrize.value))
        payload.isShow = true
        if (editingTemporaryPrizeId.value) {
            payload.id = editingTemporaryPrizeId.value
            prizeConfig.updateTemporaryPrizeItem(payload)
        }
        else {
            payload.id = new Date().getTime().toString()
            prizeConfig.addTemporaryPrizeItem(payload)
        }
        prizeConfig.setCurrentPrize(payload)
        return true
    }
    function selectPrize(item: IPrizeConfig) {
        selectedPrize.value = item
        selectedPrize.value.isUsedCount = 0
        selectedPrize.value.isUsed = false

        if (selectedPrize.value.separateCount.countList.length > 1) {
            return
        }
        selectedPrize.value.separateCount = {
            enable: true,
            countList: [
                {
                    id: '0',
                    count: item.count,
                    isUsedCount: 0,
                },
            ],
        }
    }
    function submitData(value: any) {
        selectedPrize.value!.separateCount.countList = value
        selectedPrize.value = null
    }
    function changePersonCount() {
        temporaryPrize.value.separateCount.countList = []
    }
    function setCurrentPrize() {
        for (let i = 0; i < localPrizeList.value.length; i++) {
            if (localPrizeList.value[i].isUsedCount < localPrizeList.value[i].count) {
                prizeConfig.setCurrentPrize(localPrizeList.value[i])

                return
            }
        }
    }
    onMounted(() => {
        setCurrentPrize()
    })

    return {
        temporaryPrize,
        temporaryPrizeList,
        changePersonCount,
        selectPrize,
        currentPrize,
        localImageList,
        addTemporaryPrize,
        editTemporaryPrize,
        submitTemporaryPrize,
        submitData,
        deleteTemporaryPrize,
        prizeShow,
        localPrizeList,
        isMobile,
        selectedPrize,
    }
}
