export default {
    name: 'm-page',
    emits: ['change'],
    data () {
        return {
            page: this.pageIndex
        }
    },
    render () {
        return this.total > this.pageSize ? (<div class="m-page center">
            <m-button type="text" disabled={this.pageIndex < 2} onClick={this.handleLast}>上一页</m-button>
            <span class="ml-10 mr-10">{this.pageIndex} / {this.maxPageIndex}</span>
            <m-button type="text" disabled={this.maxPageIndex === this.pageIndex} onClick={this.handleNext}> 下一页</m-button>
        </div>) : null;
    },
    props: {
        pageIndex: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 0
        }
    },
    computed: {
        maxPageIndex () {
            return Math.ceil(this.total / this.pageSize)
        }
    },
    methods: {
        handleLast () {
            this.$emit("change", this.pageIndex - 1)
        },
        handleNext () {
            this.$emit("change", this.pageIndex + 1)
        }
    },
}