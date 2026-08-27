const azTax = 0.056;
let cart = JSON.parse(localStorage.getItem("chilisCart")) || [];
let openEditId = null; // keeps track of which item's edit box is open, same idea as app.js

let details = document.getElementById("details");
let summaryInfo = document.getElementById("summaryInfo");

// needed so the edit box can look up an item's ingredient list, same helper as app.js
function findMenuItem(id) {
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].id === id) {
            return menuItems[i];
        }
    }

    return null;
}

// builds the checkbox list for removing ingredients, same pattern as app.js's buildEditBoxHtml
function buildEditBoxHtml(item) {
    let menuItem = findMenuItem(item.id);

    if (
        !menuItem ||
        !menuItem.ingredients ||
        menuItem.ingredients.length === 0
    ) {
        return '<p class="edit-note">Nothing to customize on this one.</p>';
    }

    let html = '<p class="edit-note">Uncheck anything you want left off:</p>';

    for (let i = 0; i < menuItem.ingredients.length; i++) {
        let ingredient = menuItem.ingredients[i];
        let isRemoved = item.removedIngredients.indexOf(ingredient) !== -1;

        html +=
            '<label class="edit-check">' +
            '<input type="checkbox" onchange="toggleIngredient(\'' +
            item.id +
            "', '" +
            ingredient +
            "')\" " +
            (isRemoved ? "" : "checked") +
            ">" +
            ingredient +
            "</label>";
    }

    return html;
}

// clicking Edit again on the same item closes it, same as app.js's toggleEditBox
function toggleEditBox(id) {
    openEditId = (openEditId === id) ? null : id;
    renderDetails();
}

// check/uncheck an ingredient, same as app.js's toggleIngredient
function toggleIngredient(cartId, ingredientName) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === cartId) {
            let removedList = cart[i].removedIngredients;
            let spot = removedList.indexOf(ingredientName);

            if (spot === -1) {
                removedList.push(ingredientName);
            } else {
                removedList.splice(spot, 1);
            }
        }
    }

    localStorage.setItem("chilisCart", JSON.stringify(cart));
    renderDetails();
}


// Display cart items
function renderDetails() {
    details.innerHTML = "";

    if (cart.length === 0) {
        details.innerHTML = `
            <div class="checkout-item">
                <h3>Your cart is empty</h3>
                <p>Go back to the menu to add some food.</p>
            </div>
        `;
    } else {
        for (let i = 0; i < cart.length; i++) {
            let item = cart[i];

            let itemTotal = item.price * item.qty;

            let removedText = "";

            if (
                item.removedIngredients &&
                item.removedIngredients.length > 0
            ) {
                removedText = `
                    <p class="removed-text">
                        No ${item.removedIngredients.join(", ")}
                    </p>
                `;
            }

            details.innerHTML += `
                <div class="checkout-item">

                    <div class="checkout-item-top">
                        <h3>${item.name}</h3>

                        <button
                            class="edit-btn"
                            onclick="toggleEditBox('${item.id}')"
                        >
                            Edit
                        </button>
                    </div>

                    <p>Quantity: ${item.qty}</p>

                    <p>Price: $${itemTotal.toFixed(2)}</p>

                    ${removedText}

                    ${
                        openEditId === item.id
                            ? `<div class="edit-box">${buildEditBoxHtml(item)}</div>`
                            : ""
                    }

                </div>
            `;
        }
    }
}

renderDetails();


// Order summary
function renderSummary() {
    let itemCount = cart.reduce(
        (total, item) => total + item.qty,
        0
    );

    let subtotal = cart.reduce(
        (total, item) => total + (item.price * item.qty),
        0
    );

    let tax = subtotal * azTax;

    let total = subtotal + tax;

    summaryInfo.innerHTML = `

        <div class="summary-row">
            <h3>Items</h3>
            <span>${itemCount}</span>
        </div>

        <div class="summary-row">
            <h3>Subtotal</h3>
            <span>$${subtotal.toFixed(2)}</span>
        </div>

        <div class="summary-row">
            <h3>Tax</h3>
            <span>$${tax.toFixed(2)}</span>
        </div>

        <div class="summary-row summary-total">
            <h3>Total</h3>
            <span>$${total.toFixed(2)}</span>
        </div>

    `;
}

renderSummary();


// Edit button


// Place order

let orderBtn = document.getElementById("orderBtn");

orderBtn.addEventListener("click", function () {

    let firstName = document.getElementById("fname").value.trim();
    let lastName = document.getElementById("lname").value.trim();
    let number = document.getElementById("number").value.trim();
    let email = document.getElementById("email").value.trim();


    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }


    if (
        firstName === "" ||
        lastName === "" ||
        number === "" ||
        email === ""
    ) {
        alert("Please fill out all contact information.");
        return;
    }


    alert(
        "Thank you, " +
        firstName +
        "! Your order has been placed."
    );


    localStorage.removeItem("chilisCart");
    window.location.href = "../menu/index.html";

});

function switchTheme(){
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        }

        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }