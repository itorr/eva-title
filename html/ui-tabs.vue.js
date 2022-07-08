Vue.component('ui-tabs',{
    template: `<span class="ui-tabs-box">
        <a v-for="item in _options" @click="set(item.value)" :data-checked="item.value === value" :data-text="item.text"></a>
</span>`,
    props:{
        value: [String,Number],
        options: Array
    },
    computed: {
        _options(){
            const {options} = this;
            if(options.constructor === Object){
                return Object.entries(options).map(option=>({
                    value: option[0],
                    text: option[1],
                }))
            }
            return options.map(option=>{
                if(option.constructor === String){
                    return {
                        value: option,
                        text: option
                    };
                }

                return option
            })
        }
    },
    methods:{
        set(v){
            this.$emit('input',v);
        }
    }
})