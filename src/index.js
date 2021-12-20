import { registe } from './views/app'
import ComSiteCount from '~/siteCount'
import ComComment from '~/comment'

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