var e = jQuery.Event("keydown");
e.which = 50; // # Some key code value
$("input#username, input#password").keydown(function (e) {
    //alert(e.which);
    if(e.which == 13) {
        doLogin();
        return false;
    }
});
function goToUrl(url) {
    window.location.href = url;
}
/**
*Let's define a variable that acts similar to the 'On Air' light. When
*its active (true in this case), we will just return from the doSignup function
* silently or inform the user via a jquery-ui dialog or something like that.
*/
var isProcessing = false;

function doLogin() {
    var formId = '#form-login';
    var buttonId = '#btn-submit';
    var success = '#success';
    var warning = '#warning';
    var buttonText = '.button-text';
    var buttonLoading = '.button-loading';
    var data = $(formId).serialize();
    var url = $(formId).attr('action');
    $(buttonId).attr("disabled", true);
    $(buttonText).html('please wait ... ');
    $(buttonLoading).fadeIn("fast");
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(resp){
            if(resp.code == 201){
                successMessage(resp.message);
                setTimeout(function() {
                    goToUrl(BASE_URL + '/employees');
                }, 1000);
            } else {
                errorMessage(resp.message);

                $(buttonId).attr("disabled", false);
                $(buttonText).html('Login');
                $(buttonLoading).fadeOut("fast");
            }      
        },
        error: function(xhr, textStatus, error){
            $(buttonId).attr("disabled", false);
            $(buttonText).html('Login');
            $(buttonLoading).fadeOut("fast");
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
            errorMessage("The username and password you entered did not match our records. Please double-check and try again.");
        }
    });
}
function errorMessage(msg) {
    swal({
        type: 'error',
        title: 'Alert',
        text: msg
    })
}
function successMessage(msg) {
    swal({
        type: 'success',
        title: 'Success',
        text: msg
    })
}