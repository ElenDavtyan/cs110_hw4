"use strict";
const list = $('#list');


const getList = function() {
let searchtext = $('#searchbox').val();
$('#searchbox').val('');

   $.ajax({
       url      : "/todos",
       type     : 'get',
       dataType : 'json',
       data     : {
           searchtext : searchtext
       },
       success  : function(data) {        
           list.html(''); 
           data.items.forEach(function(listItem) {
           	const li = $('<li>'+listItem.message+'<input type="checkbox" class="completed" onclick=updateTask(this.id)><button class="delete" id="'+listItem.id+'" onclick=deleteTask(this.id)>(-)</button></li>');
           	const input = li.find('.completed');
           	input.prop('checked', listItem.completed);
           	input.on('change', function() {
           	const isChecked = input.prop('checked');
           	         
            
           	});
        list.append(li);
           });
       },
       error    : function(data) {
           alert('Error searching');
       }
   });


};
getList(); 


$('#search').on('click', function() {
	getList();
});


$("#add").on('click', function(){
  const newTask = $('#addbox').val();
    $('#addbox').val(''); 

    $.ajax({
        url         : "/todos",
        type        : 'post',
        dataType    : 'json',
        data        : JSON.stringify({
            message   : newTask,
            completed : false
        }),
        contentType : "application/json; charset=utf-8",
        success     : function(data) {
           
           getList(); 
          
        },
        error       : function(data) {
            alert('Error creating todo');
        }
    }); 

});

const deleteTask = function(itemID){
      
        $.ajax({
        url     : "/todos/" + itemID ,
        type    : 'delete',
        success : function(data) {
       
          getList();  I
        },
        error   : function(data) {
            alert('Error deleting the item');
        }
    });
};

const updateTask= function(itemID){
$.ajax({
               url         : "/todos/" + itemID,
               type        : 'put',
                dataType    : 'json',
                data        : JSON.stringify(listItem),
               contentType : "application/json; charset=utf-8",
               success     : function(data) {
                    getList();
                },
                error       : function(data) {
                 alert('Error creating todo');
                }
           });
};