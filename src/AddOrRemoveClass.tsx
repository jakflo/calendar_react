// k retezci className elementu pridame nebo odeberem tridu
function addClass(className: string, classToAdd: string): string {
    const classesArray = className.split(' ');
    if (!classesArray.includes(classToAdd)) {
        classesArray.push(classToAdd);
    }

    return classesArray.join(' ');
}

function removeClass(className: string, classToRemove: string): string {
    const classesArray = className.split(' ');
    const classesKey = classesArray.indexOf(classToRemove);
    if (classesKey !== -1) {
        classesArray.splice(classesKey, 1);
    }

    return classesArray.join(' ');
}

export {addClass, removeClass};
