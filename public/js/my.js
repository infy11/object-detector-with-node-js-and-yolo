
$("#predicted").hide();
    



var loader=$("#loader");
$("document").ready(function()
{
    loader.hide();

});
$(document).ready(function(){
    $("#predict-button").click(function(){
        loader.show();
        jQuery.ajax({
            url: "http://localhost:3000/ajax",
            type: "POST",
            async: true,
            contentType: "application/json",
            //data: param,
            success: function (response) {
                //Manage your response.
                
                //Finished processing, hide the Progress!
               console.log(response);
                
    
              
    
            },

            
            error: function (response) {
               console.log(response);
    
            },
            complete: function (data) {
                $("#loader").hide();
                $("#img-ele-a").attr('href', "uploads/predictions.png");
                $("#img-ele-img").attr('src', "uploads/predictions.png");
                $("#predicted").show();
               }
            
        });
    
       
        
       
       
    });



});
