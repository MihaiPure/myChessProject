function newGame(gameType) {
    var form = document.forms[1]


    if (gameType === 'pve') {
        //just go to pve page
        var currUrl = window.location.href
        var newUrl = currUrl.replace('/GameSession/New', '/GameSession/Computer')
        document.location.href = newUrl
    } else {
        // do more stuff
        form.submit()
    }
}

function adjustHeight() {
    var navbar = $("#main-nav")[0]
    var navHeight = navbar.offsetHeight

    var windowHeight = window.innerHeight
    $("#choose-game-container").css('height', windowHeight - navHeight + "px" )


    $(".choose-game-option").css('height', windowHeight - navHeight + "px")

    $('svg').css('margin-top', (windowHeight - navHeight) / 2 - 120 + "px")
    $('svg').css('fill', 'white')
    document.body.style.paddingBottom = "0"
}

window.onload = function () {
    adjustHeight()
    $(window).resize(adjustHeight)
};