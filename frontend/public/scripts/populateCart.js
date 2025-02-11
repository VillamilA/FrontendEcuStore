$(document).ready(() => {
	var grandTotal = 0;

	if (sessionStorage.getItem('shopping-cart')) {
		var shoppingCart = JSON.parse(sessionStorage.getItem('shopping-cart'));
		itemCount = shoppingCart.length;
		//Iterate javascript shopping cart array
		shoppingCart.forEach((item) => {
			var cartItem = JSON.parse(item);
            var price = parseFloat(cartItem.price);
            var title = cartItem.title;
            var platform = (cartItem.platform);

            var entryTitle = `<p>${title}</p>`;
            var entryPlatform = `<p>${platform}</p>`;
            var entryPrice = `<p>$${price.toFixed(2)}</p>`;
			grandTotal += price;
            
            $('#cartNames').append(entryTitle);
            $('#cartPlatforms').append(entryPlatform);
            $('#cartPrices').append(entryPrice);
		});
	}

	$('#grandTotal').text('Grand Total: $' + grandTotal.toFixed(2));

    // To clear cart
    $('#emptyCart').click(() => {
        if (sessionStorage.getItem('shopping-cart')) {
            sessionStorage.removeItem('shopping-cart');
        }
        location.assign('http://localhost:3001/cart.html')
    })
})