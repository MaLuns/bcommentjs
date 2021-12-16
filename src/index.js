import { registe } from '@/util'
import ComSiteCount from '~/siteCount'
import ComComment from '~/comment/index.js'

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