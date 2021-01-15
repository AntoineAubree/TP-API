let Lesson = require('../model/lesson.js');

exports.checkFinished = (lessonJson) => {
    let now = Date.now();
    let lesson = new Lesson(
        lessonJson.id,
        lessonJson.title,
        lessonJson.hours,
        lessonJson.description,
        lessonJson.teacher,
        lessonJson.fileName,
        lessonJson.startingDate,
        lessonJson.endingDate
    )
    if (now > lesson.endingDate) {
        lesson.isFinished = true;
        return lesson
    } else {
        lesson.isFinished = false;
        return lesson

    }
}
