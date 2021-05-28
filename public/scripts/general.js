$(document).ready(() => {
    const logoutbtn = document.getElementsByClassName("logoutbtn");
    [...logoutbtn].forEach(button => {
        button.addEventListener("click",() => {
            $.ajax({
                url: "//" + window.location.host+ "/users/logout",
                type: "POST",
                statusCode: {
                    200: () => {window.location = "/"}
                }
            });
        });
    });
});