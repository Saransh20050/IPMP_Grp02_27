package com.example.service;

import com.example.model.Student;
import com.example.repository.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> getStudentsOlderThan(int age) {
        return studentRepository.findByAgeGreaterThan(age);
    }

    public List<Student> getStudentsByNamePrefix(String prefix) {
        return studentRepository.findByNameStartingWith(prefix);
    }
}
