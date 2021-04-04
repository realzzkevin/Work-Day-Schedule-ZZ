
var savedSchedule =[];

var curDay = $('#currentDay');
var today = moment();


function displayCurrentDay(){

    curDay.text(today.format('dddd, MMM Do, YYYY'));

}

function clock () {
    $('#clock').text(moment().format('h:mm:s a'));
}

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
            labelEl.text((i-12)+'pm');
        }

       
        buttonEl.text('💾');
        buttonEl.attr('class','saveBtn');
        buttonEl.addClass('col-1')

        liEl.attr('class', 'row');
        liEl.attr('id', i);
        labelEl.attr('class', 'hour');
        labelEl.addClass('col-1')
        txtareaEl.addClass('col-10');

        liEl.append(labelEl);
        liEl.append(txtareaEl);
        liEl.append(buttonEl);

        ulEl.append(liEl);
    }

    $('.container').append(ulEl);
    
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
    
    loadSchedule();
}

function refreshPage(){

    var toNexthour = Math.abs(parseInt(moment().diff(moment().endOf('hour'), 'seconds')))+1;
    console.log(toNexthour+' seconds to next hour');
    
    setTimeout( function refresh () {

        $('textarea').removeClass('past');
        $('textarea').removeClass('present');
        $('textarea').removeClass('future');

        var now = parseInt( moment().format('HH'));
        console.log('curren hour is'+ now);

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

        console.log('refresh has run');
        setTimeout (refresh, 3600000);

    }, toNexthour*1000);

}

function start(){

    initPage();
    displayCurrentDay();

    //display clock immedinaly  
    clock();
    setInterval(clock, 1000);

    refreshPage();


    $('.saveBtn').on('click', function saveEntry(){

        var time = parseInt($(this).parent().attr('id'));
        var task =$(this).siblings('textarea').val();
        console.log(task);

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

            for (var i =0; i< len; i++){
                
                var savedHour = parseInt(savedSchedule[i].hour); 

                if (savedHour === time) {

                    savedSchedule[i] = entry;
                    
                    break;

                } else if (savedHour > time) {
                    
                    savedSchedule.splice(i,0,entry);
                   
                    break ;

                } else if(savedHour < time ) {
                    
                    if(i === (len-1)){

                        savedSchedule.push(entry);
                        break;
                    }
                    
                }
            }

            localStorage.setItem('schedule', JSON.stringify(savedSchedule));
        }    

    });

    
}

start();