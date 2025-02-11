$(document).ready(() => {
    $('#Login').click(() => {
        let email = $('#signInEmail').val();
        let password = $('#signInPassword').val();

        // Validaciones
        if (!email || !password) {
            alert('Por favor, complete todos los campos.');
            return false;
        }

        if (!validateEmail(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return false;
        }

        let data = {
            email: email,
            password: password
        };

        axios.post('http://localhost:3000/user/login', data)
            .then((res) => {
                if (res.data.token == null) {
                    document.getElementById('invalidUserAlert').hidden = false;
                    return;
                }
                localStorage.setItem('token', res.data.token);
                location.assign('http://localhost:3001/index.html');
            })
            .catch((err) => {
                console.log(err);
                document.getElementById('invalidUserAlert').hidden = false;
            });
        return false;
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});