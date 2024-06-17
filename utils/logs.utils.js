const path = require('path');
const fs = require('fs');
const { MongooseError } = require('mongoose');

function addSuperscript(num) {
    const j = num % 10,
        k = num % 100;
    if (j === 1 && k !== 11) {
        return num + "st";
    }
    if (j === 2 && k !== 12) {
        return num + "nd";
    }
    if (j === 3 && k !== 13) {
        return num + "rd";
    }
    return num + "th";
}

module.exports.logError = (error, url, callFunction) => {
    console.error(error)
    const stackTrace = error.stack;
    const errorCode = error.code || "Unknown";

    const logFilePath = path.join(__dirname, '..', 'logs', 'crash.log');
    const datestamp = this.getSystemDate();
    const timestamp = this.getSystemTime();

    const logDate = `${datestamp.day},${addSuperscript(datestamp.date)}-${datestamp.month}-${datestamp.year}`;
    const logTime = `${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}`;

    const crashLog = `${url}//:: ${logDate} at ${logTime} - CallingFunction:{${callFunction}}, Error Code: {${errorCode}}, message {${error.message}}\n Stack Trace:\n ${stackTrace}\n`;

    fs.appendFileSync(logFilePath, crashLog);
    return 0;
};


module.exports.logSession = (username, ip, status = "") => {

    try {
        const logFilePath = path.join(__dirname, '..', 'logs', 'session.log');

        const datestamp = this.getSystemDate()
        const timestamp = this.getSystemTime()

        const logDate = `${datestamp.day},${addSuperscript(datestamp.date)}-${datestamp.month}-${datestamp.year}`;
        const logTime = `${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}`;

        const sessionLog = `${status.toUpperCase()}//:: ${logDate} at ${logTime} - Username:{${username}}, IP:= {${ip}}\n`;

        fs.appendFileSync(logFilePath, sessionLog);

        console.log('Session logged successfully.');
    } catch (error) {
        console.error('Error logging session:', error);
    }
}

module.exports.getSystemDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();

    return {
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        year: date.getFullYear()
    };
}

module.exports.getSystemTime = () => {
    const time = new Date();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return {
        hours: hours < 10 ? "0" + hours : hours,
        minutes: minutes < 10 ? "0" + minutes : minutes,
        seconds: seconds < 10 ? "0" + seconds : seconds
    }
}