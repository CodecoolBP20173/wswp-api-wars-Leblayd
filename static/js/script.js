function appendUnitToLargeNumber(num) {
    let units = ['', ' Thousand', ' Million', ' Billion', ' Trillion', 'Quadrillion', 'Quintillion'];
    let unitIndex = 0;

    // Divide the number by 1000 as long as it stays above 1
    while ( !Math.floor(num / 1000) < 1) {
        unitIndex++;
        num = num / 1000;
    }
    return num.toString() + units[unitIndex];
}


function appendDataToModal(response) {
    let data = response;
    let container = $('#large-modal-content');
    console.log(container);
    if (container[0].innerHTML === "") {
        container.append(
            `<div class="row">
                <div class="col-4 card-header">Name</div>
                <div class="col-1 card-header">Height</div>
                <div class="col-1 card-header">Weight</div>
                <div class="col-1 card-header">Skin</div>
                <div class="col-1 card-header">Hair</div>
                <div class="col-1 card-header">Eye</div>
                <div class="col-1 card-header">Born</div>
                <div class="col-2 card-header">Gender</div>
            </div>`
        );
    }

    // Note: The html is not a variable, so only handles residents' data
    let content = Mustache.render(
        `<div class="row">
            <div class="col-4">{{name}}</div>
            <div class="col-1">{{height}}</div>
            <div class="col-1">{{mass}}</div>
            <div class="col-1">{{skin_color}}</div>
            <div class="col-1">{{hair_color}}</div>
            <div class="col-1">{{eye_color}}</div>
            <div class="col-1">{{birth_year}}</div>
            <div class="col-2">{{gender}}</div>
        </div>`,
        data
    );
    container.append(content);
}


function appendResidentsButton(object) {
    if (object.residents.length > 0) {
        let buttonHTML = Mustache.render(
            `<button class="btn btn-primary" id="button-{{index}}-residents" data-toggle="modal">
                {{residents.length}} resident(s)
            </button>`,
            object);
        let buttonCell = $('#table-' + object.index + '-residents');
        buttonCell.append(buttonHTML);

        $('#button-' + object.index + '-residents').click(function() {
            $('#large-modal-content').empty();
            // Get and load each resident's data.
            $.each(
                object.residents,
                function(index, value) {
                    getDataFromLink(value, appendDataToModal);
                });

            $('#modal-large').modal('show');
        });
    }
}


function loadDataToTable(response) {
    let data = response.results;

    $('#loading-placeholder').remove();
    $.each(data, function(index, object) {
        object['index'] = index;
        object.population = appendUnitToLargeNumber(object.population);
        if (object.surface_water !== 'unknown') {
            object.surface_water += '%';
        }
        let tableRow = Mustache.render(
            `<tr>
                <td id="table-{{index}}-name">{{ name }}</td>
                <td id="table-{{index}}-diameter">{{ diameter }}</td>
                <td id="table-{{index}}-climate">{{ climate }}</td>
                <td id="table-{{index}}-terrain">{{ terrain }}</td>
                <td id="table-{{index}}-surface-water">{{ surface_water }}</td>
                <td id="table-{{index}}-population">{{ population }}</td>
                <td id="table-{{index}}-residents"></td>
            </tr>`,
            object);
        $('#index-table').append(tableRow);

        appendResidentsButton(object);
    });
}


function getPlanetsData() {
    $.getJSON('https://swapi.co/api/planets', loadDataToTable);
}

function getDataFromLink(link, callback) {
    $.getJSON(link, callback);
}



// Login / registration handling

function openCenteredModal(confirmName, titleName) {
    let container = $('#centered-modal-content');
    container.empty();
    container.append(
        `<div class="text-center">
            <label for="username-input">Username:</label><br>
            <input id="username-input" type="text"><br>
            <label for="password-input">Password:</label><br>
            <input id="password-input" type="text">
        </div>
        `);
    $('#centered-modal-confirm').text(confirmName);
    $('#centered-modal-title').text(titleName);

    $('#modal-centered').modal('show');
}

function openConfirmModal(titleName, message) {
    message = message || 0;
    let container = $('#centered-modal-content');
    container.empty();

    let html = message ?
        Mustache.render(`<div class="text-center">{{message}}</div>`,
            {"message": message}) :
        `<div class="text-center">Are you sure?</div>`;

    container.append(html);
    $('#centered-modal-confirm').text('Yes');
    $('#centered-modal-title').text(titleName);

    $('#modal-centered').modal('show');
}


$(document).ready(
    function () {
        getPlanetsData();

        $('#button-logout').click(function() {
            openConfirmModal('Logout', 'Are you sure you want to log out?');
        });
        $('#button-login').click(function() {
            openCenteredModal('Log in', 'Login');
        });
        $('#button-register').click(function() {
            openCenteredModal('Register', 'Registration');
        });
    });