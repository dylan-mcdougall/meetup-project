export const dateSort = (arr) => {
    const pivot = Date.now();

    const upcoming = [];
    const past = [];

    for (let i = 0; i < arr.length; i++) {
        if (Date.parse(arr[i].startDate) >= pivot) {
            upcoming.push(arr[i]);
        } else {
            past.push(arr[i])
        }
    }

    upcoming.sort((a, b) => {
        const dateA = Date.parse(a.startDate);
        const dateB = Date.parse(b.startDate);
        return dateA - dateB;
    });

    past.sort((a, b) => {
        const dateA = Date.parse(a.startDate);
        const dateB = Date.parse(b.startDate);
        return dateB - dateA;
    });

    return [...upcoming, ...past];
}

export const dateTimeAmPm = (string) => {
    const dateOptions = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: false };

    let [datePart, timePart] = string.split(', ');
    let [month, day, year] = datePart.split('/');
    let [time, timePeriod] = timePart.split(' ');
    let [hours, minutes] = time.split('/') || time.split(':');

    let hourInt = parseInt(hours, 10);

    if ((timePeriod.toLowerCase() === 'pm') && hourInt !== 12) {
        hourInt += 12;
    }
    if ((timePeriod.toLowerCase() === 'am') && hourInt === 12) {
        hourInt = 0;
    }

    const tempDate = new Date(year, month - 1, day, hourInt, minutes);
    const koreanFormatDate = new Intl.DateTimeFormat('ko-KR', dateOptions).format(tempDate);
    const englishFormatTime = new Intl.DateTimeFormat('en-US', timeOptions).format(tempDate);
    const databaseDate = koreanFormatDate.toString().split(' ').join('').replace('.', '-').replace('.', '-').replace('.', ' ');
    const finalDateTime = databaseDate + englishFormatTime.toString() + ':00';
    return finalDateTime;
}
