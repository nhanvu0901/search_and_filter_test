import {reactive} from 'vue'

export const reactive_navbar = reactive({
    user_name: null,
    user_img: null,
    need_save: false,
    set_user_name(value) {
        this.user_name = value;
    },
    set_user_img(value) {
        this.user_img = value;
    },
    set_need_save(value) {
        this.need_save = value;
    },
})