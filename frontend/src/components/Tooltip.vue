<template>
    <div class="inline" @mouseenter="showTooltip()" @mouseleave="hideTooltip()" @focus="showTooltip()" @blur="hideTooltip()" aria-describedby="tooltip">
        <span class="tooltip-button"><slot></slot></span>
        <Transition name="fade">
            <div class="tooltip-content" role="tooltip" v-show="visibleTooltip" v-html="content"></div>
        </Transition>
    </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
    name: 'Tooltip',
    props: {
        content: {
            type: String,
            required: false,
            default () {
                return ''
            }
        }
    },
    data () {
        return {
            visibleTooltip: false,
            tooltip: null,
        }
    },
    mounted () {
        this.tooltip = createPopper(
            this.$el.querySelector('.tooltip-button'),
            this.$el.querySelector('.tooltip-content'),
            {
                placement: 'bottom',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                    {
                        name: 'flip',
                        options: {
                            boundary: document.querySelector('body'),
                            padding: 8,
                            fallbackPlacements: ['top'],
                        },
                    },
                ],
            }
        )
    },
    beforeDestroy () {
        if (this.tooltip) {
            this.tooltip.destroy()
            this.tooltip = null
        }
    },
    methods: {
        showTooltip () {
            this.visibleTooltip = true
        },
        hideTooltip () {
            this.visibleTooltip = false
        }
    }
}
</script>

<style scoped>
.tooltip-content {
    @apply px-8 py-4 bg-white shadow transition-opacity max-w-full;
}

.fade-enter-active, .fade-leave-active {
    @apply transition-opacity duration-200;
}

.fade-enter, .fade-leave-to {
    @apply opacity-0;
}
</style>