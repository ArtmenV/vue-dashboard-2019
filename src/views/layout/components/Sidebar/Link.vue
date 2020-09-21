
<template>
  <div>
    <div v-if="!isActive">
      <!-- eslint-disable vue/require-component-is -->
      <component v-bind="linkProps(to)">
        <slot/>
      </component>
    </div>'
    <div v-if="isActive"> 
      <div @click="getUpgradeModal">
        <div>
          <slot  />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'links',
  data () {
    return {
      isUpgrade: false
    }
  },
  props: ['to', 'isActive'],
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    },

    getUpgradeModal() {
      this.$emit('getUpgradeModal')
    }
  }
}
</script>
