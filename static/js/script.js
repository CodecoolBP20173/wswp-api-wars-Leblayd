function appendUnitToLargeNumber(num, unitType) {
    let units = [];
    switch(unitType) {
        case 'length':
            units.push(' km', ' Mm', ' Gm', ' Tm');
        case 'general':
            units.push('', ' Thousand', ' Million', ' Billion', ' Trillion', 'Quadrillion', 'Quintillion');
    }
    let unitIndex = 0;

    // Divide the number by 1000 as long as it stays above 1
    while ( !Math.floor(num / 1000) < 1) {
        unitIndex++;
        num = num / 1000;
    }
    return num.toString() + units[unitIndex];
}


function appendResidentData(resident, currentIndex, lastIndex) {
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
        resident
    );
    $('#large-modal-content').append(content);
    if (currentIndex === lastIndex) {
        $('#modal-large').modal('show');
    }
}


function openResidentsModal(object) {
    let container = $('#large-modal-content');
    container.empty();
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
        </div>`);
    // Get and load each resident's data.
    $.each(
        object.residents,
        function(index, link) {
            $.getJSON(link, function(resident) {
                appendResidentData(resident, index, object.residents.length - 1);
            });
        });
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

        $('#button-' + object.index + '-residents').click(function () {
            openResidentsModal(object);
        });
    }
}

function appendPagination(prev, next) {
    let prevItem = $('#prev-page-item');
    let nextItem = $('#next-page-item');
    prevItem.off('click');
    nextItem.off('click');
    if (!prev) {
        prevItem.addClass('disabled');
    } else {
        prevItem.removeClass('disabled');
        prevItem.on('click', function () {
            $.getJSON(prev, loadDataToTable);
        });
    }
    if (!next) {
        nextItem.addClass('disabled');
    } else {
        nextItem.removeClass('disabled');
        nextItem.on('click', function () {
            $.getJSON(next, loadDataToTable);
        });
    }
}


function loadDataToTable(response) {
    let data = response.results;
    let tableBody = $('#index-table-body');
    tableBody.empty();
    $('#loading-placeholder').remove();
    $.each(data, function(index, object) {
        object['index'] = index;
        object.diameter = appendUnitToLargeNumber(object.diameter, 'length');
        if (object.population !== 'unknown') {
            object.population = appendUnitToLargeNumber(object.population, 'general') + ' people';
        }
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
        tableBody.append(tableRow);

        appendResidentsButton(object);
    });

    appendPagination(response.previous, response.next);
}


// Login / registration handling

function openCenteredModal(confirmName, titleName, callback) {
    let container = $('#centered-modal-content');
    container.empty();
    container.append(
        `<div class="text-center">
            <label for="username-input">Username:</label><br>
            <input id="username-input" type="text"><br>
            <label for="password-input">Password:</label><br>
            <input id="password-input" type="password">
        </div>
        `);
    $('#centered-modal-confirm')
        .text(confirmName)
        .off('click')
        .on('click', callback);
    $('#centered-modal-title').text(titleName);

    $('#modal-centered').modal('show');
}

function openConfirmModal(titleName, message, callback) {
    // This is supposedly how optional parameters are done in JS.
    message = message || 0;
    let container = $('#centered-modal-content');
    container.empty();

    let html = message ?
        Mustache.render(`<div class="text-center">{{message}}</div>`,
            {"message": message}) :
        `<div class="text-center">Are you sure?</div>`;

    container.append(html);
    $('#centered-modal-confirm')
        .text('Yes')
        .off('click')
        .on('click', callback);
    $('#centered-modal-title').text(titleName);

    $('#modal-centered').modal('show');
}


function logoutButtonListener() {
    openConfirmModal('Logout', 'Are you sure you want to log out?', function () {
        ajaxPostHelper('/logout', "Logout unsuccessful");
    });
}


function loginButtonListener() {
    openCenteredModal('Log in', 'Login', function () {
        let link = Mustache.render(
            '/login?username={{un}}&password={{pw}}',
            {'un': $('#username-input').val(), 'pw': $('#password-input').val()});
        ajaxPostHelper(link, "Username or password incorrect");
    });
}


function registerButtonListener() {
    openCenteredModal('Register', 'Registration', function () {
        let link = Mustache.render(
            '/register?username={{un}}&password={{pw}}',
            {'un': $('#username-input').val(), 'pw': $('#password-input').val()});
        ajaxPostHelper(link, "Username is already in use");
    });
}


function ajaxPostHelper(link, errorMessage) {
    let warningElement = $('#modal-error-message');
    $.ajax({
        type: "POST",
        url: link,
        success: backToIndex,
        error: function () {
            console.log(warningElement);
            if (warningElement.length === 0) {
                // I'm appending to the body, since that gets cleared on every opening of any modal, anyways.
                $('.modal-body').append(
                    '<div class="alert alert-danger" role="alert" id="modal-error-message">' + errorMessage + '</div>'
                );
            } else {
                warningElement.text('As I said, ' + errorMessage);
            }
        }
    });
}

function backToIndex() {
    location.replace('/');
}

$(document).ready(
    function () {
        $.getJSON('https://swapi.co/api/planets/', loadDataToTable);

        $('#button-logout').click(logoutButtonListener);
        $('#button-login').click(loginButtonListener);
        $('#button-register').click(registerButtonListener);
    }
);