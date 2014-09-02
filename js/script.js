$(document).ready(function() {
    $('.dbcolumn').click(function() {
        //alert("Clicked!");
        console.log($(this).text()+"clicked.");
        updateTimePlot($(this).text());
    });
    $('.objectnames').click(function() {
        objectNm = $(this).text();
        updateTimePlot(param);
    })
    $('.dbcolumn').mouseenter(function() {
        $(this).fadeTo('fast', 1.0);
    });
    $('div').mouseleave(function() {
        $('.dbcolumn').fadeTo('fast', 0.85);
    });
});

function determineTable(par) {
    switch(par) {
/* OBSERVATIONS TABLE */

        case 'propid':
            return 'observations';
            break;
        case 'rexptime':
            return 'observations';
            break;
        case 'exptime':
            return 'observations';
            break;
        case 'texptime':
            return 'observations';
            break;
        case 'darktime':
            return 'observations';
            break;
        case 'pixtime':
            return 'observations';
            break;
        case 'powstat':
            return 'observations';
            break;
        case 'deckpos':
            return 'observations';
            break;
        case 'focus':
            return 'observations';
            break;
        case 'maxexp':
            return 'observations';
            break;
        case 'obs_ra':
            return 'observations';
            break;
        case 'obs_dec':
            return 'observations';
            break;
        case 'alt':
            return 'observations';
            break;
        case 'ha':
            return 'observations';
            break;
        case 'st':
            return 'observations';
            break;
        case 'zd':
            return 'observations';
            break;
        case 'airmass':
            return 'observations';
            break;

/*VELOCITIES TABLE */

        case 'mnvel':
            return 'velocities';
            break;
        case 'mdvel':
            return 'velocities';
            break;
        case 'bc':
            return 'velocities';
            break;
        case 'z':
            return 'velocities';
            break;
        case 'gain':
            return 'velocities';
            break;
        case 'cts':
            return 'velocities';
            break;
        case 'errvel':
            return 'velocities';
            break;
        case 'mdchi':
            return 'velocities';
            break;
        case 'nchunk':
            return 'velocities';
            break;

/* ENVIRONMENT TABLE */

        case 'ccdtemp':
            return 'environment';
            break;
        case 'necktemp':
            return 'environment';
            break;
        case 'tempgrat':
            return 'environment';
            break;
        case 'temptlow':
            return 'environment';
            break;
        case 'temptcen':
            return 'environment';
            break;
        case 'tempstru':
            return 'environment';
            break;
        case 'tempencl':
            return 'environment';
            break;
        case 'tempcoud':
            return 'environment';
            break;
        case 'tempinst':
            return 'environment';
            break;
        case 'tempiodin':
            return 'environment';
            break;
        case 'dewpress':
            return 'environment';
            break;
        case 'echpress':
            return 'environment';
            break;
        case 'baromete':
            return 'environment';
            break;
    }
}

/*
        $.ajax({
            type: "POST", 
            url: "php/getNewData.php", 
            data: { param: $(this).text(); }
        },
        success: function( data ) {
            console.log(data);
        }
        });
        });


$(function (){
   $("#myimg").click(function() {
      $.ajax({
        type: "POST",
        url: "some.php",
        data: { param: $(this).attr('src'); }
      }).done(function( msg ) {
             alert( "Data Saved: " + msg );
     });
  });
}

    $('button').click(function() {
    });


*/

/*
    $.ajax({
        type: 'GET',
        url: 'getNewData.php',
        data: {
            param: 'mnvel'
        },
        success: function(data) {
            console.log("jQuery ajax success in script.js!!");
            //var newdata = data;
            //makeTimeSeriesPlot(newdata);
            $('#newdata').append('<p>' + newdata + '</p>');
        }
    });
*/