
// datatable
var dataTable = $('#table-grid').DataTable( {
    "processing": false,
    "serverSide": true,
    "info": true,
    "searching": false,
    "columns": [
        { "searchable": false, "sortable": false },
        { "searchable": false, "sortable": false },
        { "searchable": false, "sortable": false },
        { "searchable": false, "sortable": false },
        { "searchable": false, "sortable": false }
    ],
    "ajax":{
        "data": function(){
            var info = $('#table-grid').DataTable().page.info();
            $('#table-grid').DataTable().ajax.url(
                $('#table-grid').attr('data-url') + "?page="+(info.page + 1)
            );
        },
        url : $('#table-grid').attr('data-url'), // json datasource
        type: "post",  // method  , by default get
        error: function(){  // error handling
            $(".table-grid-error").html("");
            $("#table-grid").append('<tbody class="table-grid-error"><tr><th colspan="5">No data found in the server</th></tr></tbody>');
            $("#table-grid_processing").css("display","none");
            $("#overlay").hide();
        },
        error: function (data, textStatus, jqXHR) {
            ajaxError(data);
        }
    }
});