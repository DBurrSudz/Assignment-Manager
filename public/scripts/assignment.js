$(document).ready(() => {
    $('.edit_assignment').on('click', e => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        const course = $target.attr('data-course');
        const endpoint = "//" + window.location.host + "/courses/assignments/edit/" + id;
        const redirectURL = "//" + window.location.host + "/courses/assignments/edit/" + id;
        $.ajax({
            url: endpoint,
            type: "GET",
            success: (results) => {window.location.href = redirectURL}
        })
    })

    $('.delete_assignment').on('click', e => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        const course = $target.attr('data-course');
        const endpoint = "//" + window.location.host + "/courses/assignments/remove/" + id;
        const redirectURL = "//" + window.location.host + "/courses/assignments?course_id=" + course;
        $.ajax({
            url: endpoint,
            type: "DELETE",
            success: (results) => {window.location.href = redirectURL}
        })
    })

    $('.done_assignment').on('click', e => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        const course = $target.attr('data-course');
        const endpoint = "//" + window.location.host + "/courses/assignments/edit/" + id;
        $.ajax({
            url: endpoint,
            type: "POST",
            dataType: "JSON",
            data: {done: true},
            success: (results) => {
                $('i').find(`[data-id='${id}']`).removeClass("fa-times");
                $('i').find(`[data-id='${id}']`).addClass(results.class);
            }
        })
    })

    
})

$(function() {
    $("#datetimepicker1 input").datetimepicker({
        useCurrent: false
    });
});