$(document).ready(function () {
    $('.collapsible').collapsible();
    M.updateTextFields();
    M.textareaAutoResize($('#refrain'));
    $('.scrollspy').scrollSpy();

    document.addEventListener('DOMContentLoaded', function () {
    });

    let titleObject = {};

    $("#autocomplete-input").one('focus', function () {
        $.get("/all/library", function (data) {
            for (let i = 0; i < data.length; i++) {
                titleObject[data[i].title] = null;
            };
            console.log(titleObject);
            $('input.autocomplete').autocomplete({
                data: titleObject
            });

            $(".dropdown-content").on("click", function(e) {
                // e.preventDefault;
                let value = $("input").val();
                // value = Object.keys(value);
                console.log(value);
                $.ajax({
                    method: "PUT",
                    url: "/search/library",
                    data: value
                })
                .then(function(data) {
                    console.log(data);
                    location.reload();
                    if (data) {
                    }
                })
            });
        });
    });

    $("#library_edit").submit(function (e) {
        e.preventDefault();

        let id = $(this).data("id");
        let url = "/update/library/" + id;
        let title = $("#title").val();
        let composer = $("#composer").val();
        let refrain = $("#refrain").val();
        let versesElements = $(".verse");
        let verses = {};
        for (let i = 0; i < versesElements.length; i++) {
            verses[versesElements[i].id] = versesElements[i].value;
        };
        let copyright = $("#copyright").val();

        let formObject = {
            title: title,
            composer: composer,
            refrain: refrain,
            verses,
            copyright: copyright
        };

        console.log(formObject);
        console.log(verses);

        $.ajax({
            method: "PUT",
            url: url,
            data: formObject
        })
        .then(data => {
            console.log(data);
        })
    });

    $("#library_add").submit(function (e) {
        e.preventDefault();

        let url = "/add/library/new";
        let title = $("#title").val();
        let composer = $("#composer").val();
        let refrain = $("#refrain").val();
        let versesElements = $(".verse");
        let verses = {};
        for (let i = 0; i < versesElements.length; i++) {
            verses[versesElements[i].id] = versesElements[i].value;
        };
        let copyright = $("#copyright").val();

        let formObject = {
            title: title,
            composer: composer,
            refrain: refrain,
            verses,
            copyright: copyright
        };

        console.log(formObject);
        console.log(verses);

        $.post(url, formObject, function (data) {
            console.log(data);
        });
    });

});
