$(document).ready(() => {
    if (localStorage.token) {
        $('.navlogout')[0].hidden = false;
        for (let i = 0; i < $('.navlogin').length; i++) {
            $('.navlogin')[i].hidden = true;
        }
        $('#myCart')[0].hidden = false;
    } else {
        $('.navlogout')[0].hidden = true;
        for (let i = 0; i < $('.navlogin').length; i++) {
            $('.navlogin')[i].hidden = false;
        }
        $('#myCart')[0].hidden = true;
    }
    // Hides admin button if user is not admin
    if (localStorage.token == undefined || JSON.parse(atob(localStorage.token.split('.')[1])).role != 'admin') {
        $('#navAdmin')[0].hidden = true;
    }
})