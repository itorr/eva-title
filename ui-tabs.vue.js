Vue.component('ui-tabs',{
    template: `<span class="ui-tabs-box">
        <a v-for="item in options" @click="set(item.value)" :data-checked="item.value === value">{{item.text}}</a>
</span>`,
    props:{
        value: [String,Number],
        options: Array
    },
    methods:{
        set(val){
            this.$emit('input',val);
        }
    }
})