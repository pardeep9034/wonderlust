
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('click',  async function() {
    const id = this.getAttribute('data-listingId');
    // Navigate to the show page for the clicked listing
     window.location.href = `/listings/:id/reviews/show/${id}`;
  });
});
