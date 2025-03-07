package com.example.controller;

import com.example.model.*;
import com.example.service.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class StudentManagementController {
    private final StudentService studentService;
    private final ProfessorService professorService;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    public StudentManagementController(StudentService studentService, ProfessorService professorService, CourseService courseService, EnrollmentService enrollmentService) {
        this.studentService = studentService;
        this.professorService = professorService;
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    // STUDENT ENDPOINTS
    @PostMapping("/students/create")
    public Student createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/students/older-than/{age}")
    public List<Student> getStudentsOlderThan(@PathVariable int age) {
        return studentService.getStudentsOlderThan(age);
    }

    @GetMapping("/students/name-starts/{prefix}")
    public List<Student> getStudentsByNamePrefix(@PathVariable String prefix) {
        return studentService.getStudentsByNamePrefix(prefix);
    }

    @PutMapping("/students/update-bob-age")
    public String updateBobAge() {
        studentService.updateStudentAge("Bob", 23);
        return "Bob's age updated successfully!";
    }

    @PutMapping("/students/update-phone-numbers")
    public String updatePhoneNumbers() {
        studentService.assignRandomPhoneNumbers();
        return "Phone numbers updated successfully for all students!";
    }

    @DeleteMapping("/students/delete-charlie")
    public String deleteStudentCharlie() {
        studentService.deleteStudentByName("Charlie");
        return "Charlie and related records deleted successfully!";
    }

    // PROFESSOR ENDPOINTS
    @PostMapping("/professors/create")
    public Professor createProfessor(@RequestBody Professor professor) {
        return professorService.createProfessor(professor);
    }

    @GetMapping("/professors")
    public List<Professor> getAllProfessors() {
        return professorService.getAllProfessors();
    }

    // COURSE ENDPOINTS
    @PostMapping("/courses/create")
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/courses/unique-enrolled")
    public List<String> getUniqueEnrolledCourses() {
        return courseService.getUniqueEnrolledCourses();
    }

    // ENROLLMENT ENDPOINTS
    @PostMapping("/enrollments/enroll")
    public Enrollment enrollStudent(@RequestBody Enrollment enrollment) {
        return enrollmentService.enrollStudent(enrollment);
    }

    @GetMapping("/enrollments/count-per-course")
    public List<Object[]> countStudentsPerCourse() {
        return enrollmentService.countStudentsPerCourse();
    }
}
