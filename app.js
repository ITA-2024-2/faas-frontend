document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://gvt1224fn5.execute-api.us-east-1.amazonaws.com/dev';
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTcxNzY3ODA3OCwiZXhwIjoxNzE3NjgxNjc4fQ.4kw5j4iImyxLVu34pAlUk0nxAIxVRrf3jdZu0aZzPnI";

    document.getElementById('createExamForm').addEventListener('submit', createExam);
    document.getElementById('fetchExamsButton').addEventListener('click', fetchExams);
    document.getElementById('updateExamForm').addEventListener('submit', updateExam);

    async function createExam(event) {
        event.preventDefault();

        const examData = {
            examSubject: document.getElementById('examSubject').value,
            examDate: document.getElementById('examDate').value,
            professor: document.getElementById('professor').value,
            assistant: document.getElementById('assistant').value,
            numberOfStudents: document.getElementById('numberOfStudents').value,
            examLocation: document.getElementById('examLocation').value,
            examClass: document.getElementById('examClass').value
        };

        try {
            const response = await fetch(`${apiUrl}/exams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(examData)
            });

            if (!response.ok) {
                throw new Error(`Error creating exam: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Exam created:', result);
            fetchExams();
        } catch (error) {
            console.error('Error creating exam:', error);
        }
    }

    async function fetchExams() {
        try {
            const response = await fetch(`${apiUrl}/exams`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error fetching exams: ${response.statusText}, ${errorText}`);
            }

            const exams = await response.json();
            displayExams(exams);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    }

    function displayExams(exams) {
        const examsList = document.getElementById('examsList');
        examsList.innerHTML = '';

        if (Array.isArray(exams)) {
            exams.forEach(exam => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
            Subject: ${exam.examSubject}, Date: ${exam.examDate}, Professor: ${exam.professor}, Assistant: ${exam.assistant}, Students: ${exam.numberOfStudents}, Location: ${exam.examLocation}, Class: ${exam.examClass}
            <button class="updateButton" data-id="${exam.id}">Update</button>
            <button class="deleteButton" data-id="${exam.id}">Delete</button>
          `;

                examsList.appendChild(listItem);

                listItem.querySelector('.updateButton').addEventListener('click', handleUpdate);
                listItem.querySelector('.deleteButton').addEventListener('click', handleDelete);
            });
        } else {
            console.error('Exams data is not an array:', exams);
        }
    }

    function handleUpdate(event) {
        const examId = event.target.getAttribute('data-id');
        const listItem = event.target.parentNode;
        document.getElementById('updateExamId').value = examId;
        document.getElementById('updateExamSubject').value = listItem.childNodes[0].textContent.split(': ')[1];
        document.getElementById('updateExamDate').value = listItem.childNodes[1].textContent.split(': ')[1];
        document.getElementById('updateProfessor').value = listItem.childNodes[2].textContent.split(': ')[1];
        document.getElementById('updateAssistant').value = listItem.childNodes[3].textContent.split(': ')[1];
        document.getElementById('updateNumberOfStudents').value = listItem.childNodes[4].textContent.split(': ')[1];
        document.getElementById('updateExamLocation').value = listItem.childNodes[5].textContent.split(': ')[1];
        document.getElementById('updateExamClass').value = listItem.childNodes[6].textContent.split(': ')[1];
        document.getElementById('updateExamFormContainer').style.display = 'block';
    }

    async function updateExam(event) {
        event.preventDefault();
        const examId = document.getElementById('updateExamId').value;

        const examData = {
            examSubject: document.getElementById('updateExamSubject').value,
            examDate: document.getElementById('updateExamDate').value,
            professor: document.getElementById('updateProfessor').value,
            assistant: document.getElementById('updateAssistant').value,
            numberOfStudents: document.getElementById('updateNumberOfStudents').value,
            examLocation: document.getElementById('updateExamLocation').value,
            examClass: document.getElementById('updateExamClass').value
        };

        try {
            const response = await fetch(`${apiUrl}/exams/${examId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(examData)
            });

            if (!response.ok) {
                throw new Error(`Error updating exam: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Exam updated:', result);
            fetchExams();
            document.getElementById('updateExamFormContainer').style.display = 'none';
        } catch (error) {
            console.error('Error updating exam:', error);
        }
    }

    async function handleDelete(event) {
        const examId = event.target.getAttribute('data-id');

        try {
            const response = await fetch(`${apiUrl}/exams/${examId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting exam: ${response.statusText}`);
            }

            console.log(`Exam with id ${examId} deleted`);
            fetchExams();
        } catch (error) {
            console.error('Error deleting exam:', error);
        }
    }

    fetchExams();
});
