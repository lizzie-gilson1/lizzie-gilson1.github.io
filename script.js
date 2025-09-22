function toggleFact(card) {
    card.classList.toggle('flipped'); // flip front/back

    const isTruth = card.getAttribute('data-truth') === "true";
    if (card.classList.contains('flipped')) {
        if(isTruth){
            card.classList.add('truth');
            card.classList.remove('lie');
        } else {
            card.classList.add('lie');
            card.classList.remove('truth');
        }
    } else {
        card.classList.remove('truth', 'lie');
    }
}
