export default {
    name: 'MPage',
    emits: ['change'],
    data () {
        return {
            page: this.pageIndex
        }
    },
    render () {
        return this.total > this.pageSize ? (<div class="m-page center">
            <MButton type="text" disabled={this.pageIndex < 2} onClick={this.handleLast}>上一页</MButton>
            <span class="ml-10 mr-10">{this.pageIndex} / {this.maxPageIndex}</span>
            <MButton type="text" disabled={this.maxPageIndex === this.pageIndex} onClick={this.handleNext}> 下一页</MButton>
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
            this.$emit('change', this.pageIndex - 1)
        },
        handleNext () {
            this.$emit('change', this.pageIndex + 1)
        }
    },
}