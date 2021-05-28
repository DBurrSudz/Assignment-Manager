$(document).ready(() => {
    $('.view_assignment').on('click', e => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            url: "courses/assignments?course_id=" + id,
            type: "GET",
            statusCode: {
                404: () => {console.log("Failed To Retrieve Page");}
            },
            success: (results) => {window.location.href = "courses/assignments?course_id=" + id}
        })
    })

    $('.delete_course').on('click', e => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            url: "courses/remove/" + id,
            type: "DELETE",
            statusCode: {
                200: () => {window.location.href = "/courses"}
            }
        });
        
    })
});