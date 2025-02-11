$(document).ready(() => {
    $('.navlogout').click(() => {
        localStorage.clear();
        location.reload()
    })
})