package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.CheckupSignup;
import com.be_source.School_Medical_Management_System_.repository.CheckupSignupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CheckupSignupService {

    @Autowired
    private CheckupSignupRepository checkupSignupRepository;

    public List<CheckupSignup> getAllSignups() {
        return checkupSignupRepository.findAll();
    }

    public Optional<CheckupSignup> getSignupById(Long id) {
        return checkupSignupRepository.findById(id);
    }

    public CheckupSignup saveSignup(CheckupSignup signup) {
        return checkupSignupRepository.save(signup);
    }

    public void deleteSignup(Long id) {
        checkupSignupRepository.deleteById(id);
    }
}
