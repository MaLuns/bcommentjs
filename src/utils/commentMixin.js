import tcb from './tcb';

export default {
    data () {
        return {
            comments: [],
            page: {
                total: 0,
                pageIndex: 1,
                pageSize: 10
            },
            audit: {
                show: false,
                comment: {}
            }
        }
    },
    methods: {
        // 审核评论
        auditComment (comment) {
            this.audit.comment = comment
            this.audit.show = true
        },
        // 审核通过
        handlePassAudit (content) {
            tcb.callFunction('updateComment', {
                id: this.audit.comment.id,
                isAudit: true,
                content
            }).then(res => {
                if (res) {
                    this.audit.comment.isAudit = true
                    this.audit.comment.content = content
                    this.audit = {
                        show: false,
                        comment: {}
                    }
                    this.$message.info('审核成功')
                }
            })
        },
        // 删除评论
        deleteComment (comment) {
            tcb.callFunction('updateComment', {
                id: comment.id,
                delete: true,
            }).then(res => {
                if (res) {
                    comment.delete = true
                    this.$message.info('删除成功')
                }
            })
        },
        // 添加评论
        addComment (comment, callback, reply = null) {
            let par = {
                ...comment,
                // content: marked(comment.content),
                isPrivate: reply === null ? comment.isPrivate : false,
                type: reply === null ? 0 : 1,
                hash: this.pageHash,
                ua: window.navigator.userAgent
            }
            if (reply) {
                par.replyId = reply.id
            }
            tcb.callFunction('addComment', par).then(res => {
                if (res) {
                    let com = { ...par, ...res }
                    if (par.type === 0) {
                        let index = this.comments.findIndex(item => !item.top)
                        this.comments.splice(index, 0, com)
                    } else {
                        let item = this.comments.find(item => item === reply || (item.childer && item.childer.includes(reply)))
                        item.childer.push(com)
                    }
                    this.$message.info('评论成功')
                    callback()
                }
            })
        },
    },
}