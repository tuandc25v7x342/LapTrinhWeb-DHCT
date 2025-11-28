function isExistedInCart(item, arrCart) {
  let myIndex = -1;
  arrCart.forEach((itemCard, index) => {
    if (item.id == itemCard.id) myIndex = index;
  });
  return myIndex;
}

let updatedCart = []; //chứa các mặt hàng của giỏ hàng

//Xử lý và thêm sản phẩm được chọn vào giỏ hàng
const selectedItem = (evt) => {
  // function with Event Objects
  const linkClicked = evt.currentTarget || evt.target;
  alert(
    'Item-id:' + linkClicked.previousElementSibling.children[0].textContent
  );

  if (typeof Storage !== 'undefined') {
    let newItem = {
      //sản phẩm vừa được click chọn mua
      id: linkClicked.previousElementSibling.children[0].textContent,
      name: linkClicked.previousElementSibling.children[1].textContent,
      price: linkClicked.previousElementSibling.children[2].textContent,
      quantity: 1,
    };

    if (JSON.parse(localStorage.getItem('cartItems')) === null) {
      //giỏ hàng chưa tồn tại -> tạo mới cartItems
      updatedCart.push(newItem);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      window.location.reload();
    } else {
      //localStorage đã tồn tại
      const updatedCart = JSON.parse(localStorage.getItem('cartItems'));

      let index = -1;
      if ((index = isExistedInCart(newItem, updatedCart)) >= 0) {
        //trh 1: nếu newItem.id đã tồn tại trong giỏ thì cập nhật số lượng lên 1
        updatedCart[index].quantity++;
      } else {
        //trh 2: newItem chưa tồn tại trong giỏ thì thêm mới vào giỏ
        updatedCart.push(newItem);
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      location.reload();
    }
  } else {
    alert('local storage is not working on your browser.');
  }
}; // end selectedItem

//--- Utility and action functions (kept global so they can be used from HTML) ---
function addEventToAllCartButtons() {
  
  const add2CartLinks = document.getElementsByClassName('add-cart');
  const arrCartLinks = Array.from(add2CartLinks); // Array.isArray(arrCartLinks) -> true

  //Add event listener into an element/HTML DOM node
  const registerEventListener = (elmt) =>
    elmt.addEventListener('click', selectedItem, false);

  //Add the registerEventListener function into each element of arrCartLinks.
  arrCartLinks.forEach(registerEventListener);
  //Array.prototype.forEach.call(add2CartLinks, registerEventListener);

  const shoppingCart = document.querySelector('.shopping-cart');
  if (shoppingCart) {
    shoppingCart.addEventListener('click', function () {
      // click vào giỏ hàng để xem
      // location.href = 'showcart.html';
      window.open('showcart.html', '_blank');
    });
  }

  // adding product items to shopping cart
  if (localStorage.cartItems != undefined) {
    const numberOrderedItems = document.querySelector(
      '.shopping-cart .no-ordered-items'
    );
    let numberOfItems = 0;
    let customerCart = JSON.parse(localStorage.getItem('cartItems'));
    customerCart.forEach((item) => {
      numberOfItems += item.quantity;
    });
    if (numberOrderedItems) numberOrderedItems.innerHTML = numberOfItems;
  }
}
function showCart() {
  // được gọi từ showcart.html
  if (localStorage.cartItems == undefined) {
    alert('Your cart is empty. Please go back homepage to shopping.');
    location.href = 'mayanh.html';
  } else {
    let customerCart = JSON.parse(localStorage.getItem('cartItems'));
    const tblHead = document.getElementsByTagName('thead')[0];
    const tblBody = document.getElementsByTagName('tbody')[0];
    const tblHFoot = document.getElementsByTagName('tfoot')[0];

    let headColumns = (bodyRows = footColumns = '');
    headColumns +=
      '<tr><th>No</th><th>Item Id</th><th>Item Name</th><th>Quantity</th><th>Item Price</th><th>Delete</th></tr>';
    tblHead.innerHTML = headColumns;

    vat = total = amountPaid = no = 0;
    if (customerCart[0] == null) {
      bodyRows += '<tr><td colspan="5">No items found</td></tr>';
    } else {
      customerCart.forEach((item) => {
        const itemPrice = Number(item.price.replace(/[^\d]/g, ''));
        const itemQuantity = Number(item.quantity);
        total += itemQuantity * itemPrice;
        bodyRows +=
          '<tr><td>' +
          ++no +
          '</td><td>' +
          item.id +
          '</td><td>' +
          item.name +
          '</td><td>' +
          item.quantity +
          '</td><td>' +
          formatCurrency(itemPrice) +
          '</td>' +
          '<td><a href="#" onclick="deleteCart(this)">Delete</a></td></tr>';
      });
    }
    tblBody.innerHTML = bodyRows;

    footColumns +=
      '<tr><td colspan="4">Total:</td><td>' +
      formatCurrency(total) +
      '</td><td rowspan="3"></td></tr>';
    footColumns +=
      '<tr><td colspan="4">VAT (10%):</td><td>' +
      formatCurrency(Math.floor(total * 0.1)) +
      '</td></tr>';
    footColumns +=
      '<tr><td colspan="4">Amount paid:</td><td>' +
      formatCurrency(Math.floor(total * 1.1)) +
      '</td></tr>';
    tblHFoot.innerHTML = footColumns;
  }
}
function deleteCart(elmt) {
  let updatedDeleteCart = [];
  let customerCart = JSON.parse(localStorage.getItem('cartItems'));
  customerCart.forEach((item) => {
    if (item.id != elmt.parentElement.parentElement.children[1].textContent) {
      updatedDeleteCart.push(item);
    }
  });
  localStorage.setItem('cartItems', JSON.stringify(updatedDeleteCart));
  location.reload(); // reload the current page
}

//---Currency & Percentage format---
const formatPercentage = (value, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

const formatCurrency = (amount, locale = 'vi-VN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// The file exposes a few helper functions to the window scope for inline HTML scripts
window.addEventToAllCartButtons = addEventToAllCartButtons;
window.showCart = showCart;
window.deleteCart = deleteCart;
window.formatCurrency = formatCurrency;
