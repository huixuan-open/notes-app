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
                    deleteButton.className = 'delete-button';  // Apply the delete-button class
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

   // Delete Note
   const deleteNote = (id) => {

    // Add a confirmation message
    const isConfirmed = window.confirm('Are you sure you want to delete this note?');

    if (isConfirmed) {
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Success:', data);
            // Refresh the entire page after successful deletion
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
            // Optionally, handle the error and update the UI accordingly
        });
    } else {
        // The user clicked "Cancel" in the confirmation dialog
        console.log('Delete operation canceled.');
    }
};
