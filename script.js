// script.js


document.addEventListener('DOMContentLoaded', () => {
    const noteTitleInput = document.getElementById('noteTitle');
    const noteContentInput = document.getElementById('noteContent');
    const saveButton = document.getElementById('saveButton');
    const noteList = document.getElementById('noteList');
   
   
    // Function to fetch existing notes
    function fetchNotes() {
        fetch('/api/notes')
            .then(response => response.json())
            .then(notes => {
                noteList.innerHTML = '';
                notes.forEach(note => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${note.title}: ${note.content}`;
                    noteList.appendChild(listItem);
                   
                    // Create delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteNote(note.id));
                    listItem.appendChild(deleteButton);

                    noteList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching notes:', error));
    }
   
   
    // Fetch existing notes when page loads
    fetchNotes();
   
   
    // Save button event listener
    saveButton.addEventListener('click', () => {
        const title = noteTitleInput.value;
        const content = noteContentInput.value;
   
   
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        .then(response => {
            if (response.ok) {
                noteTitleInput.value = '';
                noteContentInput.value = '';
                fetchNotes();
            } else {
                console.error('Error saving note:', response.statusText);
            }
        })
        .catch(error => console.error('Error saving note:', error));
    });
   });

// Function to delete a note
function deleteNote(noteId) {
    fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            fetchNotes();
        } else {
            console.error('Error deleting note:', response.statusText);
        }
    })
    .catch(error => console.error('Error deleting note:', error));
}