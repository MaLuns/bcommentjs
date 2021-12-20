<template>
    <div class="parent">
        <div class="div1"></div>
        <div class="div2"></div>
        <div class="div3"></div>
        <div class="div4"></div>
        <div class="div5"></div>
        <div class="div6"></div>
        <div class="div7"></div>
        <div class="div8"></div>
    </div>
</template>
<script>
export default {
    name: "HomePage"
}
</script>
<style lang="less" scoped>
@import url("css/variables.less");
.parent {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    > div {
        border-radius: @ui-border-radius;
        background-color: @ui-bg;
    }
    .div1 {
        height: 140px;
        grid-area: ~"1 / 1 / 2 / 2";
    }
    .div2 {
        grid-area: ~"1 / 2 / 2 / 3";
    }
    .div3 {
        grid-area: ~"1 / 3 / 2 / 4";
    }
    .div4 {
        grid-area: ~"1 / 4 / 2 / 5";
    }
    .div5 {
        grid-area: ~"2 / 1 / 4 / 4";
    }
    .div6 {
        grid-area: ~"4 / 1 / 6 / 4";
    }
    .div7 {
        grid-area: ~"2 / 4 / 6 / 5";
    }
}
</style>