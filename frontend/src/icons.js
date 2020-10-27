import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faSearch,
    faFilter,
    faAlignJustify,
    faAlignLeft,
    faCode,
    faHighlighter,
    faTimes,
    faAngleDown,
    faAngleUp,
    faGlobeStand,
    faBuilding
} from '@fortawesome/pro-regular-svg-icons'
import { faUser as faSolidUser } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Regular
library.add(faSearch)
library.add(faFilter)
library.add(faAlignJustify)
library.add(faAlignLeft)
library.add(faCode)
library.add(faHighlighter)
library.add(faTimes)
library.add(faAngleDown)
library.add(faAngleUp)
library.add(faGlobeStand)
library.add(faBuilding)

// Solid
library.add(faSolidUser)

// Brand
library.add(faGithub)

Vue.component('font-awesome-icon', FontAwesomeIcon)
