<template>
    <el-card class="container">

        <div class="header_title">
            <slot name="header"></slot>
        </div>

        <div class="number">
            <slot name="number"></slot>
        </div>

        <div class="bottom">
            <slot name="bottom"></slot>
        </div>

    </el-card>
</template>

<script setup lang='ts'>

</script>

<style scoped lang="scss">
$color: rgba(125, 136, 138, 0.814);

.container {
    background-image: linear-gradient(to bottom, #D5E3FF, #FCFDFF);
    border-radius: 20px;
    min-width: 240px;

    .header_title {
        margin: 10px 10px 10px 0px;
        font-size: 1.25rem;
        font-weight: 600;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.75rem;
        color: $color;
    }

    .number {
        color: $color;
        font-weight: 500;
        margin: 20px 0px;
        font-size: 20px;
    }

    .bottom {
        border-top: 1px solid #3498db
    }
}
</style>