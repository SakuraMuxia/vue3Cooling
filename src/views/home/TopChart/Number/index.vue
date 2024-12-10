<template>
    <div class="counter">{{ displayNumber }}</div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, onMounted } from "vue";

export default defineComponent({
    name: 'NumberCounter',
    props: {
        start: {
            type: Number,
            default: 0, // 起始值
        },
        end: {
            type: Number,
            required: true, // 目标值
        },
        duration: {
            type: Number,
            default: 2000, // 动画时长（毫秒）
        }
    },

    setup(props) {
        const displayNumber = ref(props.start); // 显示的数字

        const animateCounter = () => {
            const range = props.end - props.start;
            const increment = range / (props.duration / 16.7); // 每帧增加的值
            let current = props.start;

            const step = () => {
                current += increment;
                if (current >= props.end) {
                    current = props.end; // 确保不会超过目标值
                }
                displayNumber.value = Math.floor(current); // 仅显示整数
                if (current < props.end) {
                    requestAnimationFrame(step); // 下一帧继续
                }
            };

            step();
        };
        // 在组件挂载时开始动画
        onMounted(() => {
            animateCounter();
        });
        // 监听 `end` 属性的变化，动态触发动画
        watch(
            () => props.end,
            () => {
                displayNumber.value = props.start; // 重置到起始值
                animateCounter();
            }
        );
        return {
            displayNumber,
        };
    }
})


</script>

<style scoped lang="scss">
.counter {
    text-indent: 10px;
    font-size: 32px;
    font-weight: bold;
    color: #3498db;
    text-align: center;
}
</style>