$(document).ready(() => {
    $('#submitGame').click(() => {
        var platforms = $('.newGamePlatformCheckbox:checked')
        var platformArr = [];
        var priceArr = [];
        for (let i = 0; i < platforms.length; i++) {
            var platformid = platforms[i].value
            platformArr.push(platformid);
            var price = $(`#${platformid}Price`).val();
            if (price == '') { // set price as 0 if there is no input
                price = '0';
            }
            priceArr.push(price)
        }
        let data = {
            title: $('#newGameTitle').val(),
            description: $('#newGameDescription').val(),
            price: priceArr,
            platformid: platformArr,
            categoryid: $('#newGameCategories').val(),
            year: $('#newGameYear').val()
        }
        // Return if the form is not fully filled
        for (let i = 0; i < Object.values(data).length; i++) {
            if (Object.values(data)[i].length == 0) {
                $("#formNotFilledAlert")[0].hidden = false;
                return false;
            } else {
                $("#formNotFilledAlert")[0].hidden = true;
            }
        }
        axios.post('http://localhost:3000/game/', data, {
            headers: {'authorization':`Bearer ${localStorage.getItem('token')}`}
        })
        .then((res) => {
            var gameid = res.data.gameid;
            var formData = new FormData();
            formData.append("image", $('#newGameImage')[0].files[0]);
            return axios.post(`http://localhost:3000/game/${gameid}/image`, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'authorization':`Bearer ${localStorage.getItem('token')}`
                }
            })
        })
        .then((res) => {
            $('#gameAddedSuccessAlert')[0].hidden = false;
            $('#gameAlreadyExistsAlert')[0].hidden = true;
        })
        .catch((err) => {
            $('#gameAddedSuccessAlert')[0].hidden = true;
            if (err.response.status == 422) {
                $('#gameAlreadyExistsAlert')[0].hidden = false;
                return;
            }
            if (err.response.status == 403) {
                $('.authorizationFailed')[0].hidden = false;
                return;
            }
            console.log(err)
        })
    return false;
    })
})
