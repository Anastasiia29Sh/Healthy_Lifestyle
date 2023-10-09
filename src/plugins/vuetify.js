/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VDatePicker } from "vuetify/labs/VDatePicker"
import {VDataTable} from "vuetify/labs/VDataTable"

import { en, ru } from "vuetify/locale"
import '@mdi/font/css/materialdesignicons.css'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDatePicker,
    VDataTable,
  },
  locale: {
    locale: "ru",
    fallback: "en",
    messages: { ru, en },
  },
})
