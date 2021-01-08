export function formatName(name, surname) {
    let newName = name + ' ' + surname
    if (newName.length > 15) {
        newName = name.charAt(0) + '. ' + surname
    }
    if (newName.length > 15) {
        const listOfNames = newName.split(' ')
        if (listOfNames.length > 2) {
            newName = listOfNames[0] + ' ' + listOfNames[1].charAt(0) + '. ' + listOfNames[2]
        } else {
            newName = listOfNames[0] + ' ' + listOfNames[1].charAt(0)
        }
    }
    return newName
}