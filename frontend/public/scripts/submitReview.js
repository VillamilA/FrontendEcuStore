$(document).ready(() => {
    $('#submitReview').click(() => {
        var userid = JSON.parse(atob(localStorage.token.split('.')[1])).userid;
        var gameid = JSON.parse(sessionStorage.gameInfo).gameid;
        let data = {
            content: $('#writeReviewInput').val(),
            rating: $('input[name="rate"]:checked').val()
        }
        axios.post(`http://localhost:3000/user/${userid}/game/${gameid}/review/`, data, {
            headers: {'authorization':`Bearer ${localStorage.getItem('token')}`}
        })
        .then((res) => {
            $('#reviewSubmitted')[0].hidden = false;
            $('#onlyOneReviewAlert')[0].hidden = true;
            location.reload();
        })
        .catch((err) => {
            if (err.response.status == 400) {
                $('#reviewSubmitted')[0].hidden = true;
                $('#onlyOneReviewAlert')[0].hidden = false;
                return;
            }
            if (err.response.status == 403) {
                $('#authorizationFailed')[0].hidden = false;
                return;
            }
            console.log(err)
        })
        return;
    })
})