$(document).ready(() => {
    axios.get('http://localhost:3000/cart/', {
            headers: {'authorization':`Bearer ${localStorage.getItem('token')}`}
        })
    .then((res) => {
        var grandTotal = 0;
        var shoppingCart = res.data;
        itemCount = shoppingCart.length;
        //Iterate javascript shopping cart array
        shoppingCart.forEach((item) => {
            var itemid = item.id
            var title = item.title;
            var platform = item.platform;
            var price = item.price;
            
            var entryTitle = `<p>${title}</p>`;
            var entryPlatform = `<p>${platform}</p>`;
            var entryPrice = `<p>$${price.toFixed(2)}</p>`;
            var entryDelete = `<button id="cart${itemid}" class="deleteButton btn btn-outline-danger btn-sm d-block">-</button>`
            grandTotal += price;
            
            $('#cartNames').append(entryTitle);
            $('#cartPlatforms').append(entryPlatform);
            $('#cartPrices').append(entryPrice);
            $('#cartDelete').append(entryDelete);
        });
    
        $('#grandTotal').text('Grand Total: $' + grandTotal.toFixed(2));
    
        // To clear cart
        $('#emptyCart').click(() => {
            if (sessionStorage.getItem('shopping-cart')) {
                sessionStorage.removeItem('shopping-cart');
            }
            location.assign('http://localhost:3001/cart.html')
        })
    })
})