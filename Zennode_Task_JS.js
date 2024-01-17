/**
 * Calculate applicable discount and its amount based on the cart total and product quantities.
 * @param {number} cartTotal - Total value of the products in the cart.
 * @param {Object} productQuantities - Object containing quantities and gift wrap status for each product.
 * @returns {Array} - Array containing applicable discount name and its amount.
 */
function calculateDiscount(cartTotal, productQuantities) {
    var flat10Discount = cartTotal > 200 ? 10 : 0;
    var bulk5Discount = 0;
    var bulk10Discount = 0;
    var tiered50Discount = 0;

    // Calculate discounts based on quantity and rules for each product
    for (var product in productQuantities) {
        var quantity = productQuantities[product][0];
        var price = products[product];

        if (quantity > 10) {
            bulk5Discount = Math.max(bulk5Discount, 0.05 * price * quantity);
        }

        bulk10Discount = (bulk10Discount || 0) + quantity;
        tiered50Discount = (tiered50Discount || 0) + (quantity > 15 ? price * (quantity - 15) * 0.5 : 0);
    }

    // Apply bulk10 discount based on total quantity
    bulk10Discount = bulk10Discount > 20 ? 0.1 * cartTotal : 0;

    // Prepare discount information
    var discounts = {
        "flat_10_discount": flat10Discount,
        "bulk_5_discount": bulk5Discount,
        "bulk_10_discount": bulk10Discount,
        "tiered_50_discount": tiered50Discount
    };

    // Determine the most beneficial discount
    var applicableDiscount = Object.keys(discounts).reduce(function (a, b) {
        return discounts[a] > discounts[b] ? a : b;
    });

    return [applicableDiscount, discounts[applicableDiscount]];
}

/**
 * Calculate the total cost of the order, including discounts, gift wrap, and shipping fees.
 * @param {Object} productQuantities - Object containing quantities and gift wrap status for each product.
 * @param {number} giftWrapFee - Fee for gift wrapping each unit.
 * @param {number} shippingFeePerPackage - Shipping fee for each package.
 * @returns {Array} - Array containing applicable discount, discount amount, subtotal, gift wrap fee, shipping fee, and total cost.
 */
function calculateCost(productQuantities, giftWrapFee, shippingFeePerPackage) {
    var subtotal = 0;

    // Calculate the subtotal based on product quantities and prices
    for (var product in productQuantities) {
        var quantity = productQuantities[product][0];
        var price = products[product];
        subtotal += quantity * price;
    }

    // Calculate applicable discount and its amount
    var [applicableDiscount, discountAmount] = calculateDiscount(subtotal, productQuantities);

    // Calculate discounted subtotal
    var discountedSubtotal = subtotal - discountAmount;

    // Calculate gift wrap and shipping fees
    var giftWrapTotal = giftWrapFee * Object.values(productQuantities).reduce(function (acc, [_quantity, isGiftWrapped]) {
        return acc + isGiftWrapped;
    }, 0);

    var shippingTotal = shippingFeePerPackage * (Math.ceil(Object.values(productQuantities).reduce(function (acc, [quantity]) {
        return acc + quantity;
    }, 0) / 10));

    // Calculate total cost
    var total = discountedSubtotal + giftWrapTotal + shippingTotal;

    return [applicableDiscount, discountAmount, discountedSubtotal, giftWrapTotal, shippingTotal, total];
}

// Product prices
var products = {
    "Product A": 20,
    "Product B": 40,
    "Product C": 50
};

// Get quantity and gift wrap information for each product
var productQuantities = {};

for (var product in products) {
    var quantity = parseInt(prompt("Enter the quantity of ".concat(product, ": ")));
    var isGiftWrapped = prompt("Is ".concat(product, " wrapped as a gift? (yes/no): ")).toLowerCase() === "yes";
    productQuantities[product] = [quantity, isGiftWrapped ? 1 : 0]; // Array indicating quantity and gift wrap status
}

// Calculate and display the details
var [applicableDiscount, discountAmount, discountedSubtotal, giftWrapTotal, shippingTotal, total] = calculateCost(productQuantities, 1, 5);

console.log("\nOrder Details:");

// Display order details for each product
for (var _product in productQuantities) {
    var _quantity = productQuantities[_product][0];
    var isGiftWrapped = productQuantities[_product][1];
    var productTotal = _quantity * products[_product];
    console.log("".concat(_product, " - Quantity: ").concat(_quantity, ", Gift Wrap: ").concat(isGiftWrapped ? 'Yes' : 'No', ", Total: $").concat(productTotal));
}

// Display overall order summary
console.log("\nSubtotal:", discountedSubtotal);
console.log("".concat(applicableDiscount, " Applied - Discount Amount: $").concat(discountAmount));
console.log("Gift Wrap Fee:", giftWrapTotal);
console.log("Shipping Fee:", shippingTotal);
console.log("Total:", total);
