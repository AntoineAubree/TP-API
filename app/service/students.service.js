exports.getYears = (date) => {
    let years = new Date().getFullYear() - new Date(date).getFullYear();
    let month = new Date().getMonth() - new Date(date).getMonth();
    let dateDiff = new Date().getDay() - new Date(date).getDay();
    if (dateDiff < 0) {
        month -= 1;
    }
    if (month < 0) {
        years -= 1;
    }
    return years;
}
