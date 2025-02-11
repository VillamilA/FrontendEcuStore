$(document).ready(() => {
    $('#Signup').click(() => {
        let username = $('#signUpUsername').val();
        let email = $('#signUpEmail').val();
        let password = $('#signUpPassword').val();

        // Validaciones
        if (!username || !email || !password) {
            alert('Por favor, complete todos los campos.');
            return false;
        }

        if (username.length > 20) {
            alert('El nombre de usuario no puede tener más de 20 caracteres.');
            return false;
        }

        if (!validateEmail(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return false;
        }

        let data = {
            username: username,
            email: email,
            password: password,
            type: 'customer',
            profile_pic_url: ''
        };

        axios.post('http://localhost:3000/users/', data)
            .then((res) => {
                document.getElementById('accountCreationSuccess').hidden = false;
            })
            .catch((err) => {
                console.log('err', err);
                document.getElementById('accountCreationFailure').hidden = false;
            });
        return false;
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});