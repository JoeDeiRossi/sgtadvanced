

class SGT_template{
	/* constructor - sets up sgt object 

	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements it this object
		- Additionally, will generate an object to store created students 
		  who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor(elementConfig){
		this.elementConfig = elementConfig;
		this.data = {};
		this.handleCancel = this.handleCancel.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.deleteStudent = this.deleteStudent.bind(this);
		this.getAllStudents = this.getAllStudents.bind(this);
	}
	/* addEventHandlers - add event handlers to premade dom elements

	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers(){
		this.elementConfig.addButton.on('click', this.handleAdd);
		this.elementConfig.cancelButton.on('click', this.handleCancel);
		this.elementConfig.getDataButton.on('click', this.getAllStudents);
	}
	/* clearInputs - take the three inputs stored in our constructor and clear their values

	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	clearInputs(){
		this.elementConfig.nameInput.val(null);
		this.elementConfig.courseInput.val(null);
		this.elementConfig.gradeInput.val(null);
	}
	/* handleCancel - function to handle the cancel button press

	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel(){
		this.clearInputs();
	}
	/* handleAdd - function to handle the add button click

	purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd(){
		if (this.elementConfig.nameInput.val() === '' ||
			this.elementConfig.courseInput.val() === '' ||
			this.elementConfig.gradeInput.val() === '') {
			return;
		} else {
			var nameInput = this.elementConfig.nameInput.val();
			var courseInput = this.elementConfig.courseInput.val();
			var gradeInput = this.elementConfig.gradeInput.val();
			this.clearInputs();
			$.ajax({
				dataType: 'json',
				url: 'http://s-apis.learningfuze.com/sgt/create',
				method: 'post',
				data: {
					api_key: 'Hp4rg9MOoR',
					name: nameInput,
					course: courseInput,
					grade: gradeInput,
				},
				success: (response) => {
					console.log('handleAdd response:', response);
					if (response.errors) {
						var errorModal = new ErrorModal(response.errors);
						errorModal.render();
					};
					this.getAllStudents();
				}
			})
		}
	}
	/* displayAllStudents - iterate through all students in the model

	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents(){
		$('#displayArea').empty();
		var idNumber;
		for (idNumber in this.data) {
			var renderedStudent = this.data[idNumber].render();
			$('#displayArea').append(renderedStudent);
		}
		this.displayAverage();
	}
	/* displayAverage - get the grade average and display it

	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage(){
		var sumOfGrades = 0;
		var numberOfStudents = 0;
		var eachStudent;
		for (eachStudent in this.data) {
			sumOfGrades += this.data[eachStudent].data.grade;
			numberOfStudents++;
		}
		var averageGrade = (sumOfGrades / numberOfStudents).toFixed(2);
		if (isNaN(averageGrade)) {
			averageGrade = 0;
		};
		$('.avgGrade').text(averageGrade);
	}
	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudent( name, course, grade, id ){
		if (this.data[id]) {
			return false;
		}
		
		if (id === undefined) {
			var keysAsArray = Object.keys(this.data);
			var nextID = parseInt(keysAsArray[keysAsArray.length - 1]) + 1;
			if (isNaN(nextID)) {
				nextID = 1;
			}
			var newStudent = new Student(nextID, name, course, grade, this.deleteStudent);
			this.data[nextID] = newStudent;
			return true;
		} else {
			var newStudent = new Student(id, name, course, grade, this.deleteStudent);
			this.data[id] = newStudent;
			return true;
		}
	}
	/* doesStudentExist - determines if a student exists by ID.  returns true if yes, false if no

	purpose: check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id){
		if (typeof id !== 'number') {
			return false;
		}
		var idArray = Object.keys(this.data);
		for (var idArrayIndex = 0; idArrayIndex < idArray.length; idArrayIndex++) {
			if (id === parseInt(idArray[idArrayIndex])) {
				return true;
			}
		}
		return false;
	}
	/* readStudent - get the data for one or all students

	purpose: 
		determines if ID is given or not
		if ID is given, return the student by that ID, if present
		if ID is not given, return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(id){
		if (id) {
			if (this.doesStudentExist(id)) {
				return this.data[id];
			} else {
				return false;
			}
		} else {
			return Object.values(this.data);
		}
	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to

	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(){

	}
	/* deleteStudent - delete the given student at the given id
	purpose: 
		determine if the ID exists in this.data
		remove it from the object
		return true if successful, false if not
		this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteStudent(id){
		if (this.doesStudentExist(id)) {
			$.ajax({
				dataType: 'json',
				url: 'http://s-apis.learningfuze.com/sgt/delete',
				method: 'post',
				data: {
					api_key: 'Hp4rg9MOoR',
					student_id: id,
				},
				success: (response) => {
					console.log('deleteStudent response:', response);
					if (response.errors) {
						var errorModal = new ErrorModal(response.errors);
						errorModal.render();
					};
					if (response.success === true) {
						this.data[id].domElements.row.remove();
						delete this.data[id];
						this.displayAverage();
						return true;
					}
				}
			});
		} else {
			return false;
		}
	}

	getAllStudents() {
		$.ajax({
			dataType: 'json',
			url: 'http://s-apis.learningfuze.com/sgt/get',
			method: 'post',
			data: {
				api_key: 'Hp4rg9MOoR',
			},
			success: (response) => {
				console.log('getAllStudents response:', response);
				if (response.errors) {
					var errorModal = new ErrorModal(response.errors);
					errorModal.render();
				};
				for (var studentIndex = 0; studentIndex < response.data.length; studentIndex++) {
					var name = response.data[studentIndex].name;
					var course = response.data[studentIndex].course;
					var grade = response.data[studentIndex].grade;
					var id = response.data[studentIndex].id;
					this.createStudent( name, course, grade, id );
				}
				this.displayAllStudents();
			}
		})
	}
}