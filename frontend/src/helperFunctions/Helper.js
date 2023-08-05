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
