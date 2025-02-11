$(document).ready(() => {
    $('#addToCart').click(() => {
        let data = JSON.parse(sessionStorage.gameInfo);
        data.userid = JSON.parse(atob(localStorage.token.split('.')[1])).userid;
        axios.post('http://localhost:3000/cart/', data, {
            headers: {'authorization':`Bearer ${localStorage.getItem('token')}`}
        })
        .then((res) => {
            $('#addedToCartAlert')[0].hidden = false;
            $('#alreadyInCartAlert')[0].hidden = true;
        })
        .catch((err) => {
            console.log(err)
            $('#addedToCartAlert')[0].hidden = true;
            if (err.response.status == 409) {
                $('#alreadyInCartAlert')[0].hidden = false;
                return;
            }
            if (err.response.status == 403) {
                $('#sessionExpiredAlert')[0].hidden = false;
                return;
            }
        })
    })
    return false;
})