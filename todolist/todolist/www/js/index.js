$(document).on('pagecreate', '#page-main', function () {

    $('#btn-ajouter').on('click', function () {
        ajouterTache();
    });

    $('#btn-reinitialiser').on('click', function () {
        reinitialiser();
    });

    $('#taskList li').each(function () {
        attacherEvenements(this, false);
    });

    majBadges();
});

function attacherEvenements(item, estTermine) {
    $(item).off('swiperight swipeleft');

    $(item).on('swiperight', function () {
        const self = this;
        if (estTermine) {
            $(self).hide('slow', function () {
                $(self).show(0);
                attacherEvenements(self, false);
                $('#taskList').append(self);
                $('#taskList').listview('refresh');
                majBadges();
            });
        } else {
            $(self).hide('slow', function () {
                $(self).show(0);
                attacherEvenements(self, true);
                $('#taskListTermine').append(self);
                $('#taskListTermine').listview('refresh');
                majBadges();
            });
        }
    });

    $(item).on('swipeleft', function () {
        $(this).hide('slow', function () {
            $(this).remove();
            majBadges();
        });
    });
}

function majBadges() {
    $('#badgeEnCours').text($('#taskList li').length);
    $('#badgeTermine').text($('#taskListTermine li').length);
}

function ajouterTache() {
    const task = $('#task');
    const texte = task.val().trim();

    if (texte !== '') {
        const newItem = $('<li></li>').text(texte);
        attacherEvenements(newItem[0], false);
        $('#taskList').append(newItem);
        $('#taskList').listview('refresh');
        majBadges();
        task.val('');
        task.focus();
    }
}

function reinitialiser() {
    $('#taskList').empty();
    $('#taskListTermine').empty();
    $('#taskList').listview('refresh');
    $('#taskListTermine').listview('refresh');
    $('#task').val('');
    majBadges();
    $('#task').focus();
}