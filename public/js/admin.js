const deleteProduct = (btn) => {
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const prodId = btn.parentNode.querySelector('[name=prodId]').value;
  const url = '/admin/products/' + prodId;

  const elementToDelete = btn.closest('article');

  fetch(url, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((jsonMsg) => {
      console.log(jsonMsg);
      elementToDelete.parentNode.removeChild(elementToDelete);
    })
    .catch((err) => console.log(err));
};
