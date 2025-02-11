$(document).ready(() => {
    setTimeout(() => {
        var deleteButtons = $('.deleteButton')
        for (let i = 0; i < deleteButtons.length; i++) {
            $(deleteButtons[i]).click(() => {
                let itemid = $(deleteButtons[i]).attr('id').replace('cart','');
                axios.delete('http://localhost:3000/cart/', {
                    headers: {'authorization':`Bearer ${localStorage.getItem('token')}`},
                    params: {itemid: itemid}
                })
                .then((res) => {
                    location.reload();
                })
                .catch((err) => {
                    console.log(err)
                    if (err.response.status == 403) {
                        $('.sessionExpiredAlert')[0].hidden = false;
                        return;
                    }
                    console.log(err)
                })
            })
        }
    }, 200);
    return false;
})