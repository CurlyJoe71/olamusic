$(document).ready(function () {
    var elem = document.querySelector('.collapsible.expandable');
    var instance = M.Collapsible.init(elem, {
        accordion: false
    });
    M.updateTextFields();
    M.textareaAutoResize($('#refrain'));
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
    let data = {};
    $('.tabs').tabs();

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

    //function for tab2 to create dropdown list based on composer, then listens for get reqeust based on composer
    $("#autocomplete-input2").one('focus', function () {
        $('input.autocomplete2').autocomplete({
            data: {}
        });
        let queryObject = [];
        let queryParam = "composer";

        $.get("/all/library", function (data) {

            for (let i = 0; i < data.length; i++) {
                queryObject[data[i][queryParam]] = null;
            };

            console.log(queryObject);

            let instance = M.Autocomplete.getInstance($('input.autocomplete2'));
            instance.updateData(queryObject);

            $(".dropdown-content").on("click", function (e) {
                e.preventDefault;
                let value2 = $("#autocomplete-input2").val();
                console.log(value2);
                $.ajax({
                    method: "PUT",
                    url: "/search/library/composer",
                    data: value2
                })
                    .then(function (data) {
                        console.log(data);

                        location.reload();
                    });
            });
        });
    });

    $("#autocomplete-input-season").one("focus", function() {
        let seasonArray = [];
        let seasonObj = {};
        $.get("/all/planner", function(data){
            let seasons = [];
            for (let i = 0; i < data.length; i ++) {
                seasons.push(data[i].season);
            }
            console.log(data[0].season);
            seasonArray = seasons.filter((x, i, a) => a.indexOf(x) == i);
            for (let i = 0; i < seasonArray.length; i ++) {
                seasonObj[seasonArray[i]] = null;
            }
            console.log(seasonObj);
        });

        $("input.autocomplete-season").autocomplete({
            data:seasonObj
        });
    });

    $("#autocomplete-input-litdate").one("focus", function() {
        let litdateArray = [];
        let litdateObj = {};
        $.get("/all/planner", function(data){
            let litdates = [];
            for (let i = 0; i < data.length; i ++) {
                litdates.push(data[i].litdate);
            }
            console.log(data[0].litdate);
            litdateArray = litdates.filter((x, i, a) => a.indexOf(x) == i);
            for (let i = 0; i < litdateArray.length; i ++) {
                litdateObj[litdateArray[i]] = null;
            }
            console.log(litdateObj);
        });

        $("input.autocomplete-litdate").autocomplete({
            data:litdateObj
        });
    });

    $("#autocomplete-input-calyear").one("focus", function() {
        let calyearArray = [];
        let calyearObj = {};
        $.get("/all/planner", function(data){
            let calyears = [];
            for (let i = 0; i < data.length; i ++) {
                calyears.push(data[i].calyear);
            }
            console.log(data[0].calyear);
            calyearArray = calyears.filter((x, i, a) => a.indexOf(x) == i);
            for (let i = 0; i < calyearArray.length; i ++) {
                calyearObj[calyearArray[i]] = null;
            }
            console.log(calyearObj);
        });

        $("input.autocomplete-calyear").autocomplete({
            data:calyearObj
        });
    });

    $("#planner-search").on("click", function (e) {
        e.preventDefault;
        console.log("hi");

        let season = $("input.autocomplete-season").val();
        let calyear = $("input.autocomplete-calyear").val();
        let litdate = $("input.autocomplete-litdate").val();
        console.log(`${season}, ${litdate}, ${calyear}`);

        let searchObj = {};
        if (season) {
            searchObj.season = season;
        }
        if (litdate) {
            searchObj.litdate = litdate;
        }
        if (calyear) {
            searchObj.calyear = calyear;
        }
            
        // searchObj = JSON.stringify(searchObj);
        console.log(searchObj);

        $.ajax({
            url:"/all/planner/search",
            method: "POST",
            data: searchObj
        })
        .then(function(data) {
            console.log(data);
        });

    });

    //function for tab1 to create dropdown list based on title, then listens for get request based on title
    $("#autocomplete-input1").one('focus', function () {
        $('input.autocomplete1').autocomplete({
            data: {}
        });
        let queryObject = [];
        let queryParam = "title";

        $.get("/all/library", function (data) {

            for (let i = 0; i < data.length; i++) {
                queryObject[data[i][queryParam]] = null;
            };

            console.log(queryObject);

            let instance = M.Autocomplete.getInstance($('input.autocomplete1'));
            instance.updateData(queryObject);

            $(".dropdown-content").on("click", function (e) {
                e.preventDefault;
                let value1 = $("#autocomplete-input1").val();
                console.log(value1);
                $.ajax({
                    method: "PUT",
                    url: "/search/library/title",
                    data: value1
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
