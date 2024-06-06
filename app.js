document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://gvt1224fn5.execute-api.us-east-1.amazonaws.com/dev';
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTcxNzY3ODA3OCwiZXhwIjoxNzE3NjgxNjc4fQ.4kw5j4iImyxLVu34pAlUk0nxAIxVRrf3jdZu0aZzPnI";
  
    document.getElementById('createExamForm').addEventListener('submit', createExam);
    document.getElementById('fetchExamsButton').addEventListener('click', fetchExams);
  
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
          listItem.textContent = `Subject: ${exam.examSubject}, Date: ${exam.examDate}, Professor: ${exam.professor}, Assistant: ${exam.assistant}, Students: ${exam.numberOfStudents}, Location: ${exam.examLocation}, Class: ${exam.examClass}`;
  
          examsList.appendChild(listItem);
        });
      } else {
        console.error('Exams data is not an array:', exams);
      }
    }
  });
  