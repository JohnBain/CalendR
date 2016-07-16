$(document).ready(function() {

initialDate = populateCalendar(null); //populates the calendar. returns first day of month

$('.prev').click(prevMonth)
$('.next').click(nextMonth)


$('.schedule').hide();

$('.dayHolder').on("click", "td", function(pass) {
    selectDay(pass);
    $('.schedule').show();
})


$('.submit').on("click", function(pass) {
    submitToDatabase(pass)
    populateSchedule(pass.toElement.id)
    boldPopulatedDates();
})

$('.activities').on("click", ".delete", function(pass) {
    $.ajax({
        url: '/details',
        data: { sending: pass.toElement.id },
        type: 'delete'
        }
    )
    //If we're on a given date the .submit button's id will always be the date
    checkIfDateUnpopulated($('.submit').attr('id'))
    populateSchedule($('.submit').attr('id'))

})

$('.adder').hide();

$('.add').on("click", function() {
    $('.adder').toggle();

    if ($('.add').html() === "—"){
            //Once "&#8212;" is rendered as HTML, it becomes "—" (em dash)
        $('.add').html("&#10010;");
    }
    else {
        $('.add').html("&#8212;");
    }

})

//Query by tags to check user

//Track user with cookies.

//Reach goal: Checkbox to auto-clear when day has passed
});


function selectDay(passedTarget) {
    if ($(passedTarget.currentTarget).attr('id').length > 0) {
        $('.active').removeClass('active')
        $(passedTarget.currentTarget).addClass("active")
    }
    var x = $(passedTarget.currentTarget).attr('id');
    populateSchedule(x);
    alterAdder(x); //submit key in adder div now has same id as the date
}

function submitToDatabase(passedTarget) {

    var inputTime = $('.time').val();
    var meridiem = $('.meridiem')[0].value

    var formatTime = function() {
        var rawTime;
        var timeAry = inputTime.split(':')
        timeAry.length === 2 ? rawTime = parseInt(timeAry[0]) * 60 + parseInt(timeAry[1]) :
            rawTime = parseInt(timeAry[0]) * 60; //Takes time in either just hour or hour:minute
        if (meridiem === "pm") { rawTime += 720 };
        return rawTime
    }

    var objectToSend = {
        date: $(passedTarget.currentTarget).attr('id'),
        time: formatTime(),
        description: $('.description').val()
    }
    console.log(objectToSend)
        //validation before sending object. 
    if ($(passedTarget.currentTarget).attr('id').length > 0 && objectToSend.time > 0 || objectToSend.time > 1440 || typeof(objectToSend(time) != Integer)) {
        $.post('/details', objectToSend)
        $('.time').val("")
        $('.description').val("")
    } //else, do nothing 
}


//===SCHEDULE DIV AND 'ADDER' DIV BUILDING FUNCTIONS

function populateSchedule(date) {
    $.get('/details/' + date, function(data) {
        $('.activities').html(formatSchedule(data))
    })
    var sampleSchedule = [{ date: "a6_12_2016", time: 720, description: "Fencing" }]
    $('.schedDate').html(scheduleDivDate(date));
    // in production this is a DB query.
}

function boldPopulatedDates() {
    $.get('/details/', function(data) {
        data.forEach(function(each) {
            $(`#${each.date}`).addClass('populated')
        })
    })

}

function checkIfDateUnpopulated(date) {
    $.get('/details/' + date, function(data) {
        if (data.length === 0){
            $(`#${date}`).removeClass('populated')
        }
    })
}

function scheduleDivDate(date) {
    //date comes in "a6_12_2016" format
    var dateString = '',
        dateAry = date.split("_");

    var months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]

    var date = parseInt(dateAry[0].slice(1)) - 1
    dateString = months[date].concat(" ", dateAry[1], ", ", dateAry[2])
    return dateString
}

function formatTime(dataArray) {
    return dataArray.map(function(each) {
        if (each.time % 60 === 0)
            var minutes = "00"
        else
            var minutes = each.time % 60
        if (each.time > 720) {

            each.time = `${Math.floor(each.time / 60 / 2)}:${each.time % 60}PM`
        } else {

            each.time = `${Math.floor(each.time / 60)}:${minutes}AM`
        }
        return each
    })
}

function formatSchedule(schedule) {
    var finalString = ""
    schedule.sort(function(a, b) {
        return a.time - b.time
    })
    formatTime(schedule).forEach(function(each) {
            finalString += `<p><strong> ${each.time} </strong>: ${each.description}
        <span class='delete' id='${each._id}' >&#10005;</span></p>`
        })
        // Assuming that query returns an array of objects  with same date
    return finalString
}

function alterAdder(date) {
    $('.submit').attr('id', date)
}

//===CALENDAR BUILDING FUNCTIONS

function formatDaysTable(theDate) {
    var calendar = [],
        daysArray = [],
        finalString = ''

    //Calendar will end up as an array of arrays.   

    var firstDayNum = theDate.clearTime().moveToFirstDayOfMonth().getDay();
    var numDays = Date.getDaysInMonth(theDate.getYear(), theDate.getMonth());

    //Imagine a 5x7 grid. We start populating the grid at numDays.
    //Going on from there, we continue until each row has 7.

    for (var i = 1; i <= numDays; i++) {
        daysArray.push(i)
    }

    var firstLoop = true;

    //DRY refactor idea:
    //Just check if first day is a Wednesday or not.
    //You can just say "if (week=0)" to only act on the first week:
    //(7-firstDayNum+1) will reliably tell you where to start.
    //Populate  empty rows based on that. In this case, subtract from dayCount=7 accordingly.
    //Then populate remainder based on daysArray, using dayCount=7 for each.
    //if (daysArray.length === 0), fill the rest with empty rows.

    for (var week = 0; week < 5; week++) {
        calendar[week] = [];
        if (firstLoop === true) {


            //If we're on the first loop, populate the empty cells
            //(if, e.g., month starts on a Wednesday)

            var dayCount = 0

            for (var day = 0; day <= firstDayNum - 1; day++) {
                calendar[0][day] = "<td></td>"
                dayCount += 1 //Now we know what day to start on.
            };

            for (var r = dayCount; r < 7; r++) {
                var x = daysArray.shift()
                calendar[0][r] = "<td id=a" + theDate.toString("M") + "_" + x + "_" +
                    theDate.toString("yyyy") +
                    ">" + x + "</td>"
                    //Generates a data cell containing the day as a value and the
                    //exact date as an id (e.g.: a6_17_2016)
                dayCount += 1
                firstLoop = false
            }
        }
        //If it's not the first loop...
        else {
            for (var r = 0; r < 7; r++) {
                /*if (calendar[week][r]){
                    continue    //This checked for repeats
                };*/
                if (daysArray.length === 0) {
                    calendar[week][r] = "<td>" + "</td>"
                } else {
                    var x = daysArray.shift()
                    calendar[week][r] = "<td id=a" + theDate.toString("M") + "_" + x + "_" +
                        theDate.toString("yyyy") +
                        ">" + x + "</td>"
                }
            }
        }

    }

    calendar.forEach(function(eachRow) {
        finalString += '<tr>'
        eachRow.forEach(function(cell) {
            finalString += cell
        })
        finalString += '</tr>'
    })
    return finalString
}

function populateCalendar(theDate) {
    if (theDate === null) {
        date = new Date;
    } else {
        date = theDate
    };

    var month = date.toString("MMM");
    var year = date.toString("yyyy")

    $('.monthHolder').html(month);
    $('.yearHolder').html(year);
    $('.dayHolder').html(formatDaysTable(date))
    boldToday();
    boldPopulatedDates();
    return date
}


function boldToday() {
    var date = Date.today();
    var dateString = "a" + date.toString("M") + "_" + date.toString("d") + "_" + date.toString("yyyy")
    $(`#${dateString}`).addClass('today')
}

function prevMonth() {
    var newDate = initialDate.last().month()

    populateCalendar(newDate)
};

function nextMonth() {
    var newDate = initialDate.next().month()

    populateCalendar(newDate)
};
