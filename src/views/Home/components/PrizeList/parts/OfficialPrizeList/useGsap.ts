import type { Ref } from 'vue'
import gsap from 'gsap'
import { onBeforeUnmount, onUnmounted, ref, watch } from 'vue'

export function useGsap(scrollContainerRef: any, liRefs: any, isScroll: Ref<boolean>, prizeShow: any) {
    const ctx = ref()
    const showUpButton = ref(false)
    const showDownButton = ref(true)
    function initGsapAnimation() {
        ctx.value = gsap.context(() => {
            liRefs.value.forEach((box: any) => {
                gsap.set(box, { rotationX: 0, rotateZ: 0, opacity: 1 })
            })
        }, scrollContainerRef.value) // <- Scope!
    }

    function disposeGsapAnimation() {
        if (!ctx.value) {
            return
        }
        ctx.value.revert() // <- Easy Cleanup!
    }
    function scrollHandler() {
        const scrollHeight = scrollContainerRef.value.scrollHeight
        const scrollTop = scrollContainerRef.value.scrollTop
        const containerHeight = scrollContainerRef.value.clientHeight
        // 滚动滑到底部
        if (scrollTop + containerHeight >= scrollHeight - 10) {
            showDownButton.value = false
            showUpButton.value = true
        }
        // 在中间
        else if (scrollTop && scrollTop + containerHeight < scrollHeight) {
            showDownButton.value = true
            showUpButton.value = true
        }
        // 滚动滑到顶部
        else {
            showDownButton.value = true
            showUpButton.value = false
        }
    }
    function listenScrollContainer() {
        scrollContainerRef.value.addEventListener('scroll', scrollHandler)
    }
    function removeScrollContainer() {
        if (scrollContainerRef.value) {
            scrollContainerRef.value.removeEventListener('scroll', scrollHandler)
        }
    }

    function handleScroll(h: number) {
        scrollContainerRef.value.scrollTop += h
    }
    watch([isScroll, prizeShow], ([val1, val2]) => {
        if (val1 && val2) {
            setTimeout(() => {
                initGsapAnimation()
                listenScrollContainer()
            }, 0)
        }
    })
    onBeforeUnmount(() => {
        if (!isScroll.value)
            return
        removeScrollContainer()
    })
    onUnmounted(() => {
        if (!isScroll.value)
            return
        disposeGsapAnimation()
    })

    return {
        showUpButton,
        showDownButton,
        handleScroll,
    }
}
