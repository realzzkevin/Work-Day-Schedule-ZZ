//array to hold all hour and work entries
var savedSchedule =[];

//find current date.
var curDay = $('#currentDay');
var today = moment();

//use to display today's date
function displayCurrentDay(){

    curDay.text(today.format('dddd, MMM Do, YYYY'));

}

// A simple clock 
function clock () {
    $('#clock').text(moment().format('h:mm:s a'));
}

//read data from local storage and load them into correct time slot.
function loadSchedule (){
    
    savedSchedule = JSON.parse(localStorage.getItem('schedule'));

    // to check if local storage is empty.
    if (savedSchedule === null){
        return;
    }

    if (savedSchedule.length > 0 ){

        for(var index = 0; index < savedSchedule.length; index++ ){
            
            var time = savedSchedule[index].hour;
            var task = savedSchedule[index].work;

            $('#'+time).children('textarea').text(task);
       
        }
    }

}

// creat time block, a unordered list, every list itme hold a lable for hour, 
// a textarea for work entries, and a button for save entry.
function initPage (){

    var ulEl = $('<ul>');
    ulEl.attr('class', 'time-blck');

    for(var i=6; i<22; i++) {

        var liEl = $('<li>');
       
        var labelEl = $('<label>');
        var txtareaEl = $('<textarea>');        
        var buttonEl = $('<button>');

        if (i<=12) {
            labelEl.text(i+' am');
        }else {
            labelEl.text((i-12)+' pm');
        }

       
        buttonEl.text('💾');
        buttonEl.addClass('saveBtn col-1');

        liEl.addClass('row');
        liEl.attr('id', i);

        labelEl.addClass('hour col-1');

        txtareaEl.addClass('col-10');

        liEl.append(labelEl);
        liEl.append(txtareaEl);
        liEl.append(buttonEl);

        ulEl.append(liEl);
    }

    $('.container').append(ulEl);
    // get current hour, travel through each li element and apply correct css style
    // to its children textarea element by its id. 
    var now = parseInt( moment().format('HH'));

    $('li').each(function(){
        
        var i = parseInt($(this).attr('id') );
        
        if(i < now){
            $(this).children('textarea').addClass('past');
            $(this).children('textarea').attr('disabled', true);

        }else if(i === now){
            $(this).children('textarea').addClass('present');
        }else  {
            $(this).children('textarea').addClass('future');
        }
        
    });
    // load saved schedule from local storage.
    loadSchedule();
}

// refresh page every hour, to update schedule.
function refreshPage(){
    // get the time from now to next hour in seconds then add one second.
    var toNexthour = Math.abs(parseInt(moment().diff(moment().endOf('hour'), 'seconds')))+1;
    
    // the refresh function will be called at the beginning of next hour. 
    setTimeout( function refresh () {
        //remove all css styling in textarea element.
        $('textarea').removeClass('past');
        $('textarea').removeClass('present');
        $('textarea').removeClass('future');

        var now = parseInt( moment().format('HH'));
        //reapply correct css styling to textarea element.
        $('li').each(function(){
            
            var i = parseInt($(this).attr('id') );    
            
            if(i < now){
                $(this).children('textarea').addClass('past');
                $(this).children('textarea').attr('disabled', true);
    
            }else if(i === now){
                $(this).children('textarea').addClass('present');
            }else  {
                $(this).children('textarea').addClass('future');
            }
            
        });
        //call refresh function recursively every hour.
        setTimeout (refresh, 3600000);
    
    }, toNexthour*1000);

}

// A jquery UI confirmation dialog, will be called after save task into local storage. 
function confirmSave (tarTxt){
    
     var divEl = $('<div>').attr('id','confirm');
     var message = $('<p>').text('Entry saved!');

     divEl.append(message);

     $('body').append(divEl);
     $('#confirm').dialog( {

        dialogClass : "no-close",
        modal: true,
        width: 20,
        height: 50,
        appendTo : 'body',
        show: {effct: 'fade', duration: 200},
        hide: {effct: 'fade', duration: 200},
        position: {my:'center', at:'center', of:$(tarTxt)},
        // close itself in .3 seconds.
        open: function (event, ui) {
            
                setTimeout(function(){

                $('#confirm').dialog('close');
                $('#confirm').remove();

            }, 300);
        }

     });

}

function start(){

    initPage();
    displayCurrentDay();

    //display clock immedinaly  
    clock();
    setInterval(clock, 1000);

    refreshPage();

//function use to save task into local storage.
    $('.saveBtn').on('click', function saveEntry(){

        var time = parseInt($(this).parent().attr('id'));
        var task =$(this).siblings('textarea').val();
        var tarTextArea = $(this).siblings('textarea');

        var entry = {
            hour: time,
            work : task
        }

        savedSchedule = JSON.parse(localStorage.getItem('schedule'));

        if (savedSchedule === null){

            savedSchedule =[entry];
          
            localStorage.setItem('schedule', JSON.stringify(savedSchedule));
            
        } else if(savedSchedule.length > 0){
            
            var len = savedSchedule.length;
            //Iterate through savedSchedule arry to find right position to inser current task.
            for (var i =0; i< len; i++){
                
                var savedHour = parseInt(savedSchedule[i].hour); 
                //replace the entry if it exists.
                if (savedHour === time) {

                    savedSchedule[i] = entry;
                    
                    break;
                //if later hour entry exists, save current entry infront of it.    
                } else if (savedHour > time) {
                    
                    savedSchedule.splice(i,0,entry);
                   
                    break ;
                // move to next entry, if saved entry is earlier than current 
                } else if(savedHour < time ) {
                    // save current entry at the end of array.
                    if(i === (len-1)){

                        savedSchedule.push(entry);
                        break;
                    }
                    
                }
            }

            localStorage.setItem('schedule', JSON.stringify(savedSchedule));
            confirmSave(tarTextArea);
        }    

    });
    
}

start();