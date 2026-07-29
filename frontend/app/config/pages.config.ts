export const PAGES = new class PageConfig{
    HOME(){
        return "/"
    }
    MY_PROFILE(){
        return "/profile/"
    }
    PROFILE(username: string){
        return `/profile/${username}/`
    }
    KVANTUMID(){
        return "/kvantumid/"
    }
    ACHIEVEMENTS() {
        return `${this.MY_PROFILE()}/achievements/`
    }
    ADMINPANEL() {
        return "/admin-panel/"
    }
    NEWS() {
        return "/news/"
    }
    QUANTS() {
        return "/quants/"
    }
    PAID_COURSES() {
        return "/paid-courses/"
    }
    KVANTUM_FORM_NEW() {
        return "/kvanto_form/new/"
    }
    INSTRUCTION() {
        return "/instruction/"
    }
    COURSES_CHESS() {
        return "/courses/chess/"
    }
    COURSES_ENGLISH() {
        return "/courses/english/"
    }
    COURSES_HITECH() {
        return "/courses/hi-tech/"
    }
    COURSES_IT() {
        return "/courses/it/"
    }
    COURSES_MATHEMATICS() {
        return "/courses/mathematics/"
    }
    COURSES_PROM() {
        return "/courses/prom/"
    }
    COURSES_VRAR() {
        return "/courses/vr-ar/"
    }
}