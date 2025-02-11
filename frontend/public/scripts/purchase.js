$(document).ready(() => {
    // Validar el número de tarjeta de crédito
    $('#creditNo').on('input', function () {
        let cardNumber = $(this).val().replace(/\D/g, ''); // Eliminar todo lo que no sea número
        if (cardNumber.length > 16) {
            cardNumber = cardNumber.substring(0, 16); // Limitar a 16 dígitos
        }
        $(this).val(cardNumber); // Mostrar el número completo sin formato
    });

    // Validar el CVV
    $('#cvv').on('input', function () {
        let cvv = $(this).val().replace(/\D/g, ''); // Eliminar todo lo que no sea número
        if (cvv.length > 3) {
            cvv = cvv.substring(0, 4); // Limitar a 3 dígitos
        }
        $(this).val(cvv);
    });

    // Validar el formulario antes de enviar
    $('#purchase').click(() => {
        let name = $('#name').val().trim();
        let cardNumber = $('#creditNo').val().replace(/\D/g, ''); // Eliminar espacios y caracteres no numéricos
        let cvv = $('#cvv').val().trim();

        // Validar que el nombre no esté vacío
        if (!name) {
            alert('Por favor, ingresa tu nombre.');
            return;
        }

        // Validar que el número de tarjeta tenga 16 dígitos
        if (cardNumber.length !== 16) {
            alert('El número de tarjeta debe tener 16 dígitos.');
            return;
        }

        // Validar que el CVV tenga 3 dígitos
        if (cvv.length !== 4) {
            alert('El CVV debe tener entre 3 y 4 dígitos.');
            return;
        }

        // Si todo está correcto, proceder con la compra
        proceedWithPurchase();
    });

    // Función para proceder con la compra
    function proceedWithPurchase() {
        axios.get('http://localhost:3000/cart', {
            headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then((res) => {
            return axios.post('http://localhost:3000/purchase', {}, {
                headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        })
        .then((res) => {
            return axios.delete('http://localhost:3000/cart', {
                headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        })
        .then((res) => {
            $('#checkoutDiv')[0].hidden = true;
            $('#successDiv')[0].hidden = false;
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) { // Si el carrito está vacío
                $('#checkoutDiv')[0].hidden = true;
                $('#noItemsDiv')[0].hidden = false;
                return;
            }
            console.log(err);
        });
    }
});