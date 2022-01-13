# commentjs
一个简洁、安全的静态网站评论系统，基于腾讯云开发。

## 易用
[x] 支持回复
[ ] 无需额外适配，支持搭配浅色主题与深色主题使用
[ ] 支持插入表情（可禁用）
[x] 支持 Ctrl + Enter 快捷回复
[x] 评论框内容实时保存草稿，刷新不会丢失
[x] 隐私信息安全（通过云函数控制敏感字段（邮箱、IP、环境配置等）不会泄露）
[x] 支持人工审核模式
[x] 防 XSS 注入
[x] 支持限制每个 IP 每 10 分钟最多发表多少条评论

## 即时
[x] 支持邮件提醒（访客和博主）

## 个性
[x] 支持自定义评论框背景图片
[x] 支持自定义“博主”标识文字
[x] 支持自定义通知邮件模板
[x] 支持自定义评论框提示信息（placeholder）
[x] 支持自定义【昵称】【邮箱】【网址】必填 / 选填
[x] 支持自定义代码高亮主题

## 便捷管理
[x] 内嵌式管理面板，通过邮箱登录，可方便地查看评论、回复评论、删除评论、修改配置、站点统计信息
[x] 通过邮箱登录快捷回复管理


##
``` html
<script src="//unpkg.com/vue@3.2.26/dist/vue.runtime.global.prod.js"></script>
<script src="//unpkg.com/@highlightjs/cdn-assets@11.4.0/highlight.min.js"></script>
<script src="//unpkg.com/commentjs/dist/index.min.js"></script>
```