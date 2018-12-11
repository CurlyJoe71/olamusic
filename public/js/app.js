$(document).ready(function () {
    $('.collapsible').collapsible();
    M.updateTextFields();
    M.textareaAutoResize($('#refrain'));
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
    let data = {};
    $('input.autocomplete').autocomplete({data});

    let titleObject = {};
    let radioValue;


    $("input[type='radio']").click(function () {
        radioValue = $("input[name='query']:checked").parent().find("span").text();
        console.log(radioValue);

        let instance = M.Autocomplete.getInstance($(".autocomplete"));
        instance.close();
    });

    $("#library_reset").on("click", function (e) {
        e.preventDefault;

        $.ajax({
            method: "GET",
            url: "/reset/library"
        })
            .then(function (data) {
                location.reload();
            });
    });



    $("#autocomplete-input").one('focus', function () {
        $.get("/all/library", function (data) {

            let queryParam = "title";
            let queryObject = {};

            if (radioValue) {
                queryParam = "composer";
            };

            for (let i = 0; i < data.length; i++) {
                queryObject[data[i][queryParam]] = null;
            };
            console.log(queryObject);

            $('input.autocomplete').autocomplete({
                data: queryObject
            });

            $(".dropdown-content").on("click", function (e) {
                e.preventDefault;
                let value = $("input").val();
                console.log(value);
                $.ajax({
                    method: "PUT",
                    url: "/search/library",
                    data: value
                })
                    .then(function (data) {
                        console.log(data);
                        location.reload();
                    });
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
                let instance = M.Modal.getInstance($(".modal"));
                instance.open();
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
            copyright: copyright,
            render: true
        };

        console.log(formObject);
        console.log(verses);

        $.post(url, formObject, function (data) {
            console.log(data);
        });
    });

});
