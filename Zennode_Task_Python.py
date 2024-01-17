def calculate_discount(cart_total, product_quantities):
    """
    Calculate applicable discount and its amount based on the cart total and product quantities.

    Parameters:
    - cart_total (float): Total value of the products in the cart.
    - product_quantities (dict): Dictionary containing quantities and gift wrap status for each product.

    Returns:
    - Tuple: Applicable discount name and its amount.
    """
    flat_10_discount = 10 if cart_total > 200 else 0
    bulk_5_discount = max([0.05 * products[product] * quantity if quantity > 10 else 0 for product, (quantity, _) in product_quantities.items()])
    bulk_10_discount = 0.1 * cart_total if sum([quantity for quantity, _ in product_quantities.values()]) > 20 else 0
    tiered_50_discount = 0.5 * sum([products[product] * (quantity - 15) for product, (quantity, _) in product_quantities.items() if quantity > 15 and quantity > 0])

    discounts = {"flat_10_discount": flat_10_discount, "bulk_5_discount": bulk_5_discount, "bulk_10_discount": bulk_10_discount, "tiered_50_discount": tiered_50_discount}
    applicable_discount = max(discounts, key=discounts.get)

    return applicable_discount, discounts[applicable_discount]


def calculate_cost(product_quantities, gift_wrap_fee, shipping_fee_per_package):
    """
    Calculate the total cost of the order, including discounts, gift wrap, and shipping fees.

    Parameters:
    - product_quantities (dict): Dictionary containing quantities and gift wrap status for each product.
    - gift_wrap_fee (float): Fee for gift wrapping each unit.
    - shipping_fee_per_package (float): Shipping fee for each package.

    Returns:
    - Tuple: Applicable discount, discount amount, discounted subtotal, gift wrap fee, shipping fee, and total cost.
    """
    subtotal = 0
    for product, (quantity, _) in product_quantities.items():
        subtotal += quantity * products[product]

    applicable_discount, discount_amount = calculate_discount(subtotal, product_quantities)
    discounted_subtotal = subtotal - discount_amount

    gift_wrap_total = gift_wrap_fee * sum([is_gift_wrapped for _, is_gift_wrapped in product_quantities.values()])
    shipping_total = shipping_fee_per_package * ((sum([quantity for quantity, _ in product_quantities.values()]) - 1) // 10 + 1)

    total = discounted_subtotal + gift_wrap_total + shipping_total

    return applicable_discount, discount_amount, discounted_subtotal, gift_wrap_total, shipping_total, total


# Product prices
products = {"Product A": 20, "Product B": 40, "Product C": 50}

# Get quantity and gift wrap information for each product
product_quantities = {}
for product in products:
    quantity = int(input(f"Enter the quantity of {product}: "))
    is_gift_wrapped = input(f"Is {product} wrapped as a gift? (yes/no): ").lower() == "yes"
    if is_gift_wrapped:
        product_quantities[product] = quantity, 1  # Tuple indicating quantity and gift wrap status
    else:
        product_quantities[product] = quantity, 0  # Tuple indicating quantity and no gift wrap

# Calculate and display the details
applicable_discount, discount_amount, discounted_subtotal, gift_wrap_total, shipping_total, total = calculate_cost(product_quantities, 1, 5)

print("\nOrder Details:")
for product, (quantity, is_gift_wrapped) in product_quantities.items():
    product_total = quantity * products[product]
    print(f"{product} - Quantity: {quantity}, Gift Wrap: {'Yes' if is_gift_wrapped else 'No'}, Total: ${product_total}")

print("\nSubtotal:", discounted_subtotal)
print(f"{applicable_discount} Applied - Discount Amount: ${discount_amount}")
print("Gift Wrap Fee:", gift_wrap_total)
print("Shipping Fee:", shipping_total)
print("Total:", total)
