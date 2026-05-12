export const PAGES = new class PageConfig{
    HOME(){
        return "/"
    }
    MY_PROFILE(){
        return "/profile/"
    }
    PROFILE(id: number){
        return `/profile/${id}/`
    }
    KVANTUMID(){
        return "/kvantumid/"
    }
    ACHIEVEMENTS() {
        return `${this.MY_PROFILE()}/achievements/`
    }
    ADMINPANEL() {
        return "/admin/"
    }
    NEWS() {
        return "/news/"
    }
    QUANTS() {
        return "/quants/"
    }
    KVANTUM_FORM_NEW() {
        return "/kvanto_form/new/"
    }
}