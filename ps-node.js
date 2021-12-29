import ps from "ps-node"

// ps.lookup({ pid: 7341 }, function(err, resultList ) {
//     if (err) {
//         throw new Error( err );
//     }
//     var process = resultList[0];
//     if( process ){
//         console.log(process)
//         // console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
//     }
//     else {
//         console.log( 'No such process found!' );
//     }
// });

ps.kill( '1552', function( err ) {
    if (err) {
        throw new Error( err );
    }
    else {
        console.log( 'Process %s has been killed!');
    }
});