export default {
    name: 'MAudit',
    emits: ['pass', 'update:show'],
    props: {
        show: Boolean,
        comment: Object
    },
    computed: {
        shows: {
            get () {
                return this.show
            },
            set (val) {
                console.log(this.content);
                this.$emit('update:show', val)
            }
        }
    },
    watch: {
        shows: {
            immediate: true,
            handler () {
                this.content = this.comment.content
            }
        }
    },
    data () {
        return {
            content: '',
        }
    },
    methods: {
        handlePassAudit () {
            this.$emit('pass', this.content)
        }
    },
    render () {
        return (
            <MModel v-model={this.shows} title="评论审核" width={500} scroll={false}>
                <h4 class="pb-10">@{this.comment.nick}</h4>
                <textarea v-model={this.content} rows="5" class="w100p"></textarea>
                <div class="right mt-10">
                    <MButton type="primary" onClick={this.handlePassAudit}>通过</MButton>
                    <MButton class="ml-10" onClick={() => this.shows = false}>关闭</MButton>
                </div>
            </MModel>
        )
    },
}