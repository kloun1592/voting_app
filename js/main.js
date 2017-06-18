function showTable()
{
    $.ajax(
    {
        type: "POST",
        url: 'app.php',
        data: { 'action': 'show_voting' },
        dataType: "json",
        success: function (data) 
        {
            for (i = 0; i < data["members"].length; i++) 
            {
                $tableRow = '<tr><td id="member_' + i + '">' + data["members"][i] + '</td>' +
                '<td id="counter_' + i + '">' + data["counters"][i] +'</td>' + 
                '<td><button value="add_vote" data-member="' + data["members"][i] + '"> Increase Vote</button>' + 
                '<button value="delete_vote" data-member="' + data["members"][i] + '">Deacrease Vote</button>' +
                '<button value="delete_member" data-member="' + data["members"][i] + '">Delete member</button></td></tr>'

                $("#votes_table tbody").append($tableRow) 
            }
            sortTable("#votes_table")
        },
        error: function (data)
        {
            alert("Something went wrong. Try again later.");
        }
    });
}

function sortTable(tableId)
{
    var $table = $(tableId).stupidtable();
    var $th_to_sort = $table.find("thead th").eq(1);
    $th_to_sort.stupidsort('desc');
}

function checkForEmptyTable(tableId)
{
    return $("#" + tableId + "tbody").is(':empty') ? 1 : 0
}


function updateValueInTable(tdId, operation)
{
    var number = $(tdId).html();
    if (operation == "incr")
    {
        $(tdId).updateSortVal(number++);
        $(tdId).text(number++);
    }
    else if(operation == "decr")
    {
        $(tdId).updateSortVal(number--);
        $(tdId).text(number--);
    }
    else
    {
        alert("Incorrect operation");
    }
}

$(document).ready(function()
{
    showTable();
    $(".add_member_form").submit(function(event)
    {
        var name = $("input[name=adding_member]").val();
        var ajaxurl = 'app.php',
        data =  
        {
            'action': "add_member",
            'name': name
        };
        $.post(ajaxurl, data, function(response) 
        {
            alert(data['name'] + 'is added! Please update the page to see it.');
            //showTable();
        });

        event.preventDefault();
    });

    $(document).on("click", "button", function() 
    {
        var clickBtnValue = $(this).val();
        var ajaxurl = 'app.php',
        data =  
        {
            'action': clickBtnValue,
            'name': $(this).data("member")
        };

        var currentRow = $(this).closest("tr"); 
        var cellId = currentRow.find("td:eq(1)").attr('id');

        if (clickBtnValue == "add_vote")
        {
            updateValueInTable("#" + cellId, "incr")
        }
        if (clickBtnValue == "delete_vote")
        {
            updateValueInTable("#" + cellId, "decr")
        }
        if (clickBtnValue == "delete_member")
        {
            currentRow.find("td").hide();
        }

        $.post(ajaxurl, data, function(response) 
        {
            if (response)
            {
                alert(response);
            }
        });
    });
});