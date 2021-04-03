var savedSchedule =[];
var entries ={
    hour:'',
    work:''
}


var curDay = $('#currentDay');
var today = moment();
//var timeInterval;


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

    /*savedSchedule = [
        {
            hour : 10 ,
            work : 'do homework'
        },
    
        {
            hour : 20 ,
    
            work : 'do more home work'
        }
    
    
    ]*/

    if (savedSchedule.length > 0 ){

        for(var index = 0; index < savedSchedule.length; index++ ){
            
            var time = savedSchedule[index].hour;
            var task = savedSchedule[index].work;

            $('#'+time).children('textarea').text(task);
            //console.log($('#'+time).children('textarea'));
        }
    }

}

/*function saveSchedule (e) {

    var hour = parseInt(e.parent().attr('id'));
    var task =e.siblings('textarea').value();

    console.log(hour);
    console.log(task);

}*/

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
            //$(this).children('textarea').text('Who controls the past?');
        }else if(i === now){
            $(this).children('textarea').addClass('present');
        }else  {
            $(this).children('textarea').addClass('future');
        }
        
    });
    
    loadSchedule();
}

function start(){

    initPage();
    displayCurrentDay();

    //display clock immedinaly  
    clock();
    setInterval(clock, 1000);


    /*$('textarea').on('click', function(){
        console.log('yes, text');
    });*/

    $('.saveBtn').on('click', function(){

        var time = parseInt($(this).parent().attr('id'));
        var task =$(this).siblings('textarea').val();
        console.log(task);

        //var index = hour-6;

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
    
   /* $('.saveBtn').click(function(){
        var hour = parseInt($(this).parent().attr('id'));
        var task = $(this).siblings('textarea').text();

        console.log(hour);
        console.log(task);

    })*/

}

start()