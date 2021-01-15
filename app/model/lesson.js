class Lesson {
    constructor(id, title, hours, description, fileName, startingDate, endingDate, isFinished) {
        this.id = id;
        this.title = title;
        this.hours = hours;
        this.description = description;
        this.startingDate = startingDate;
        this.fileName = fileName;
        this.endingDate = endingDate;
        this.isFinished = isFinished;
    }
}
module.exports = Lesson;
