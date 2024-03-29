export function FormatName(name, surname) {
    const maxNameLength = 15
    let newName = name + ' ' + surname
    if (newName.length > maxNameLength) {
        newName = name.charAt(0) + '. ' + surname
    }
    if (newName.length > maxNameLength) {
        const listOfNames = newName.split(' ')
        if (listOfNames.length > 2) {
            newName = listOfNames[0] + ' ' + listOfNames[1].charAt(0) + '. ' + listOfNames[2]
        } else {
            newName = listOfNames[0] + ' ' + listOfNames[1].charAt(0)
        }
    }
    return newName
}