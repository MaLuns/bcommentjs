import { registe } from '@/util'
import ComSiteCount from '~/siteCount'
import ComComment from '~/comment/index.vue'

const customElementObj = {
    ComSiteCount,
    ComComment
}

registe(customElementObj)

export default {
    setConfig () {
        console.log(1);
    }
}