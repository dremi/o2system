function validateForm(formId) { // validate return status
    $elements = $('form#' + formId + ' input, form#' + formId + ' select, form#' + formId + ' textarea').not('input[type=submit]').toArray();
    var status = true;
    for($index in $elements)
        status = (validateField($($elements[$index])) && status);

    return status;
}

function bindValidation(formId) {
    $elements = $('form#' + formId + ' input, form#' + formId + ' select, form#' + formId + ' textarea').not('input[type=submit]').toArray();

    for($index in $elements)
    {
        var fieldId = $elements[$index].id;
        $('form#' + formId + ' #' + fieldId).blur(function() {
            return validateField($(this));
        });
    }

    $(document).on('submit','form#' + formId,function(e) {
        if(! validateForm(this.id) )
        {
            e.preventDefault();
            return false;
        }
        return true;
    });
}

function validateField(field) {
    var formId = $(field).closest('form').attr('id');
    var fieldId = $(field).attr('id');
    var classes = $(field).attr('class');
    //var status = true;

    if (classes) {
        var classesArr = classes.split(' ');
        for($iClass in classesArr) {
            if (!validate(formId, fieldId, classesArr[$iClass]))
                return false;
        }
    }

    return true;
}

function validate(formId, fieldId, action) {
    var fieldValue = $('form#' + formId + ' #' + fieldId).val();

    $arg3 = formId;
    $arg4 = fieldId;
    if (action.indexOf('fmatch') != -1) {
        var actionArr = action.split('-');
        $arg3 = $('form#' + formId + ' #' + actionArr[1]).val();
        action = actionArr[0];
    }

    if((action.indexOf('-') == -1) && action != "" && eval("typeof "+action+" === 'function'")){
        $validate = {"femail":[/^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i,'Please enter a valid email address in this field.'],
                     "falnumspc":[/^[a-zA-Z0-9 ]+$/,'Please use only letters (a-z or A-Z), numbers (0-9) or spaces only in this field.'],
                     "falnum":[/^[a-zA-Z0-9]+$/,'Please use only letters (a-z or A-Z) or numbers (0-9) only in this field. No spaces or other characters are allowed.'],
                     "falphaspc":[/^[a-zA-Z ]+$/,'Please use letters only (a-z or A-Z) or spaces only in this field.'],
                     "falphaaddress":[/^[a-zA-Z0-9.,():\#\-\"\' ]+$/,'Please use letters only (A - Z, 0-9, ". , ( ) : # -") in this field.'],
                     "falpha":[/^[a-zA-Z ]+$/,'Please use letters only (a-z or A-Z) in this field.'],
                     "fnumeric":[/^[0-9]+$/,'Please enter a valid number in this field.']
        };

        if (action == 'fminlen') {
            var fieldValue = $('form#' + formId + ' #' + fieldId).val();
            var minlength = $('form#' + formId + ' #' + fieldId).attr('minlength');

            if (typeof minlength == 'undefined' || minlength == false) {
                return true;
            }

            $arg3 = minlength;
        }

        else if (action == 'fmaxlen') {
            var fieldValue = $('form#' + formId + ' #' + fieldId).val();
            var maxlength = $('form#' + formId + ' #' + fieldId).attr('maxlength');

            if (typeof maxlength == 'undefined' || maxlength == false) {
                return true;
            }

            $arg3 = maxlength;

        }

        else if ($validate[action]!=undefined){
            $arg3 = $validate[action];
            action = 'fregex';
        }

        if (eval(action).call(null,fieldValue,function($message){errorHandling(formId, fieldId, $message);},$arg3,$arg4)) {
            successHandling(formId, fieldId);
            return true;
        }else
            return false;
    }
    return true;

}

function validateMinMax(formId, fieldId) {
    var fieldValue = $('form#' + formId + ' #' + fieldId).val();
    var minlength = $('form#' + formId + ' #' + fieldId).attr('minlength');
    var maxlength = $('form#' + formId + ' #' + fieldId).attr('maxlength');
    var status = true;

    if (typeof minlength !== typeof undefined && minlength !== false) {
        if (fminlen(fieldValue, minlength) == false) {
            errorHandling(formId, fieldId, 'Please enter minimum ' + minlength + ' characters.');
            return false;
        }
        else {
            successHandling(formId, fieldId);
            status = true;
        }
    }

    if (typeof maxlength !== typeof undefined && maxlength !== false) {
        if (fmaxlen(fieldValue, maxlength) == false) {
            errorHandling(formId, fieldId, 'Please enter maximum ' + maxlength + ' characters.');
            return false;
        }
        else {
            successHandling(formId, fieldId);
            status = true;
        }
    }

    return status;
}

function isEmpty(v) {
    if (v == '' || v == null) {
        return true;
    }

    return false;
}

function nempty(v, errorCallback) {
    if (v == '' || v == '0' || v == null) {
        if(typeof errorCallback=='function'){
            errorCallback('This is a required field.');
        }
        return false;
    }
    return true;
}

function fselect(v, errorCallback) {
    if (v == '' || v == '0') {
        if(typeof errorCallback=='function'){
            errorCallback('Please select an option.');
        }
        return false;
    }

    return true;

}

function falphaaddress(v, errorCallback) {

}

function fcheck($v, errorCallback, frm, fld) {
    if ($('form#' + frm + ' #' + fld).is(':checked')) {
        return true;
    }
    if(typeof errorCallback=='function'){
        errorCallback('Please checked an option.');
    }
    return false;
}

function femail(v, errorCallback) {
    $result =  isEmpty(v) || /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i.test(v);
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('This is a required field.');
        }
    }
    return $result;
}

function fphone(v, errorCallback, frm, fld) {
    if (nempty(v)) {
        var prefixLength = 2;
        var prefix = v.substr(0, prefixLength);
        var phoneLength = v.length;
        var phone = v;

        if (prefix == '62') {
            phone = '0' + v.substr(prefixLength, phoneLength);
            $('form#' + frm + ' #' + fld).val(phone);
        }
    }

    $result = (fnumeric(phone) && fminlen(phone, null, 7) && fmaxlen(phone, null, 20));
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('Please enter a valid phone number. For example 0212902213 or 08123456789.');
        }
    }
    return $result;
}

function fdate(v, errorCallback) {
    parseDate = v.split('/');
    var day     = parseDate[0];
    var month   = parseDate[1];
    var year    = parseDate[2];

    var test = new Date(year, month, day);
    $result = isEmpty(v) || !isNaN(test);
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('Please enter a valid date.');
        }
    }
    return $result;
}

function fdatetime(v, errorCallback) {
    var vArr = v.split(' ');
    var test = new Date(v[0]);

    if (isEmpty(v[0]) || !isNaN(test)) {
        $result = /^(\d{2}):(\d{2}):(\d{2})$/.text(v[1]);
        if(!$result){
            if(typeof errorCallback=='function'){
                errorCallback('Please enter a valid datetime.');
            }
        }
        return $result;
    }

    if(typeof errorCallback=='function'){
        errorCallback('Please enter a valid datetime.');
    }
    return false;
}

function falpha(v, errorCallback) {
    $result = isEmpty(v) || /^[a-zA-Z ]+$/.test(v);
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('Please use letters only (a-z or A-Z) in this field.');
        }
    }
    return $result;
}

function fnumeric(v, errorCallback) {
    $result = isEmpty(v) || /^[0-9]+$/.test(v);
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('Please enter a valid number in this field.');
        }
    }
    return $result;
}

function fregex(v, errorCallback, regex) {
    $result = isEmpty(v) || regex[0].test(v);
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback(regex[1]);
        }
    }
    return $result;
}

function fminlen(v, errorCallback, l) {
    $result = isEmpty(v) || v.length >= l;
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('Please enter minimum ' + l + ' characters.');
        }
    }
    return $result;
}

function fmaxlen(v, errorCallback, l) {
    $result = (isEmpty(v) || v.length <= l);
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('Please enter maximum ' + l + ' characters.');
        }
    }
    return $result;
}

function fmatch(v, errorCallback, v2) {
    $result = (v == v2);
    if(!$result){
        if(typeof errorCallback=='function'){
            errorCallback('Please make sure your passwords match.');
        }
    }
    return $result;
}

function errorHandling(formId, fieldId, message) {
    $('form#' + formId + ' #' + fieldId).addClass('error');
    $('form#' + formId + ' #' + fieldId).attr('invalid', true);

    if ($('form#' + formId + ' #advice-validate-entry-' + fieldId).length == 0) {        
        $('form#' + formId + ' #' + fieldId).parent().append('<div class="help-block" id="advice-validate-entry-' + fieldId + '"><span>' + message + '</span></div>');
    }
    else {
        $('form#' + formId + ' #advice-validate-entry-' + fieldId).html('<span>' + message + '</span>');
    }
}

function successHandling(formId, fieldId) {
    $('form#' + formId + ' #' + fieldId).removeClass('error');
    $('form#' + formId + ' #advice-validate-entry-' + fieldId).remove();
    $('form#' + formId + ' #' + fieldId).removeAttr('invalid');
}

function resetValidation(formId) {
    $('form#' + formId + ' .form-group').removeClass('error');
    $('form#' + formId + ' input, form#' + formId + ' select, form#' + formId + ' textarea').removeAttr('invalid');
    $('form#' + formId + ' div.help-block').remove();
}

function ajaxFormHandling(formId, buttonId, redirectUrl) {
    $('#' + buttonId).on('click', function() {
        var status = false;
        status = validateForm(formId);
        if(status == true) {
            var data = $("#" + formId).serialize();
            showLoader();
            $.ajax({
                data     : data,
                type     : 'POST',
                dataType : 'json',
                url      : $("#" + formId).attr('action'),
                success  : function(response) {
                    if(response.status === 'undefined') {
                        $('.wrap-middle-content .flash-message').remove();
                        window.location.href = baseUri;
                    }
                    if(response.clearForm != 'undefined' && response.clearForm == true) {
                        $('#'+formId+' input, #'+formId+' textarea').not('input#'+buttonId).val('');
                    }
                    ajaxResponseAfterSuccess(response, redirectUrl);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    ajaxError(xhr, ajaxOptions, thrownError);
                }
            });
        }
        return false;
    });
}