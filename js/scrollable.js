$(window).resize(function() {
    updateScrollable();
});


function updateScrollable(){
    var htmlHeight = $( window ).height();
    var navHeight = $('.navbar').outerHeight(true);
    var messageHeight = $('#message').outerHeight(true);
    $('.pre-scrollable').css('max-height', htmlHeight - navHeight -messageHeight);
}