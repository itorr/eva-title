Vue.component('ui-switch',{
    template: `<span class="ui-switch-box" :data-checked="value" @click="_switch">
        <a class="switch" :style="{color}">
            <i class="slider"></i>
        </a>
        <span><slot></slot></span>
    </span>`,
    props:{
        value: Boolean,
        color: String
    },
    methods:{
        _switch(){
            this.$emit('input',!this.value);
        }
    }
})