/** 
 * The global javascript to handling template
 */

function ajaxError(data) {
    swal({
        type: 'error',
        title: 'Error',
        text: data.responseText
    })
}
function messageSuccess(modalTitle, message) {
    swal({
        type: 'success',
        title: modalTitle,
        text: message
    })
}
function messageWarning(modalTitle, message) {
    swal({
        type: 'warning',
        title: modalTitle,
        text: message
    })
}
function messageFailed(modalTitle, message) {
    swal({
        type: 'error',
        title: modalTitle,
        text: message
    })
}
function messageConfirm(modalTitle, message) {
    swal({
        title: modalTitle,
        text: message,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
    function(){
      swal("Deleted!", "Your imaginary file has been deleted.", "success");
    });
}
function closeModal() {
    $('#modal-close-button').click();
}
function confirmationAjaxDelete(msg, increamentId, urlRemove, dataTable, modalTitle) {
    swal({
        title: modalTitle,
        text: msg,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
    function(){
        $.ajax({
            url: urlRemove, 
            type: 'post', 
            dataType: 'json', 
            success: function(data){
                if(data.status == 'success') {
                    messageSuccess(modalTitle, data.message);                
                } else {
                    messageWarning(modalTitle, data.message);
                }
            }, 
            complete: function() {
                if (dataTable != 'undefined') {
                    dataTable.ajax.reload( null, false ); // user paging is not reset on reload
                }
            }
        });
        
    });
}
$(document).ready(function() {    
    // ajax modal
    $('.ajax-modal-button').on('click', function(e){
        var currentModalId = $(this).attr('data-target');
        $(currentModalId + ' .modal-body').html('Loading .. Please wait');
        var dataUrl = $(this).attr('data-url');
        $.ajax({
            url: dataUrl,
            type: 'get',
            dataType: 'html',
            context: $(this),
            success: function( response ) {
                $(currentModalId + ' .modal-title').html($(this).attr('data-label'));
                $(currentModalId + ' .modal-body').html(response);
                $(currentModalId).modal({show:true});
            },
            error: function (data, textStatus, jqXHR) {
                ajaxError(data);
            }
        });
    });
    
    if ($('#table-grid').length > 0) {   
        // ajax modal grid
        $('#table-grid').on('click', '.cell-modal-button', function(){
            var currentModalId = $(this).attr('data-target');
            $(currentModalId + ' .modal-body').html('Loading .. Please wait');
            var dataUrl = $(this).attr('data-url');
            $.ajax({
                url: dataUrl,
                type: 'get',
                dataType: 'html',
                context: $(this),
                success: function( response ) {
                    dataTable.ajax.reload( null, false );
                    $(currentModalId + ' .modal-title').html($(this).attr('data-label'));
                    $(currentModalId + ' .modal-body').html(response);
                    $(currentModalId).modal({show:true});
                },
                error: function (data, textStatus, jqXHR) {
                    ajaxError(data);
                }
            });
        });

        // modal confirmation
        $('#table-grid').on('click', '.cell-confirm-button', function(e){
            e.preventDefault();
            var increamentId = $(this).attr('data-i');
            var message = 'Are you sure you want to delete #' + increamentId + ' ?';
            var removeUrl = $(this).attr('data-url');
            var modalTitle = $(this).attr('data-title');

            confirmationAjaxDelete(message, increamentId, removeUrl, dataTable, modalTitle);

        });
    }
    
    // modal form handler
    var buttonId = 'btn-submit';
    var formId = 'main-form';
    $('.modal-content').keypress(function(e){
        if ((e.keyCode == 13) && (e.target.type != 'textarea')) {
            e.preventDefault();
            _submitForm(buttonId, formId);
            return false;
        }
    });
    $('#'+buttonId).on('click', function(e){     
        e.preventDefault();
        _submitForm(buttonId, formId); 
        return false;   
    });
    function _submitForm(buttonId, formId) {
        var data = $('#'+formId).serialize();
        var url = $('#'+formId).attr('action');
        var status = false;
        var dataValue = $('#'+buttonId).attr('data-value');
        status = validateForm(formId);
        console.log(status)
        if(status == true) {
            $.ajax({
                    type: "post",
                    data: data,
                    //contentType: "application/json",
                    url: url,
                    dataType: 'json', // <-- notice that this should be dataType, not datattype
                    success: function(response, textStatus, jqXHR) {
                        if (response.code == 201) {
                            messageSuccess('Success', response.message);
                            if ($('#table-grid').length > 0) { 
                                dataTable.ajax.reload( null, false );
                                
                            } else {
                                //setTimeout('goToUrl("'+response.redirect+'")', 1000);
                            }
                            closeModal();
                        } else {
                            messageWarning(null, response.message);
                        }
                    },
                    error: function (data, textStatus, jqXHR) {
                        console.log(data);
                        console.log(textStatus);
                        console.log(jqXHR);
                        
                        // ajaxError(data);
                    }
            });
        }
    }
} );
