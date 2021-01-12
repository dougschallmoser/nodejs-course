const fs = require('fs');
const chalk = require('chalk');

const getNotes = () => {
  return 'Your notes...'
}

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find(note => note.title === title)

  if (!duplicateNote) {
    notes.push({
      title: title,
      body: body
    })
    saveNotes(notes)
    console.log(chalk.green.inverse('New note added!'))
  } else {
    console.log(chalk.red.inverse('Note title taken!'))
  }
}

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync('notes.json', dataJSON);
}

const removeNote = (title) => {
   const notes = loadNotes();
   const filteredNotes = notes.filter(note => note.title !== title)

   if (notes.length > filteredNotes.length) {
     saveNotes(filteredNotes);
     console.log(chalk.green.inverse('Note removed!'))
   } else {
    console.log(chalk.red.inverse('No note found!'))
   }
}

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
}

const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.blue.inverse("Your Notes:"))

  for (let note of notes) {
    console.log(chalk.black.inverse(note.title))
  }
}

const readNote = (title) => {
  const notes = loadNotes();
  const note = notes.find(note => note.title === title)

  if (note) {
    console.log(chalk.black.inverse('Title: ', note.title))
    console.log(chalk.blue.inverse('Body: ', note.body))
  } else {
    console.log(chalk.red.inverse('Note not found!'))
  }
}

module.exports = {
  getNotes: getNotes,
  addNote: addNote,
  removeNote: removeNote,
  listNotes: listNotes,
  readNote: readNote
}