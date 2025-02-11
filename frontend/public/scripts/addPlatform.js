$(document).ready(() => {
    $('#submitPlatform').click(() => {
        let data = {
            platform_name: $('#newPlatformName').val(),
            description: $('#newPlatformDescription').val()
        }
        axios.post('http://localhost:3000/platform/', data, {
            headers: {'authorization':`Bearer ${localStorage.getItem('token')}`}
        })
        .then((res) => {
            $('#addPlatformSuccess')[0].hidden = false;
            $('#addPlatformFailed')[0].hidden = true;
        })
        .catch((err) => {
            if (err.response.status == 422) {
                $('#addPlatformSuccess')[0].hidden = true;
                $('#addPlatformFailed')[0].hidden = false;
                return;
            }
            if (err.response.status == 403) {
                $('.authorizationFailed')[1].hidden = false;
                return;
            }
            console.log(err);
        })
        return false;
    })
})