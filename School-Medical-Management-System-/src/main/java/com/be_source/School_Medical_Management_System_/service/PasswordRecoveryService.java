package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.PasswordRecovery;
import com.be_source.School_Medical_Management_System_.repository.PasswordRecoveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PasswordRecoveryService {

    @Autowired
    private PasswordRecoveryRepository passwordRecoveryRepository;

    public List<PasswordRecovery> getAllRecoveries() {
        return passwordRecoveryRepository.findAll();
    }

    public Optional<PasswordRecovery> getRecoveryById(Long id) {
        return passwordRecoveryRepository.findById(id);
    }

    public PasswordRecovery saveRecovery(PasswordRecovery recovery) {
        return passwordRecoveryRepository.save(recovery);
    }

    public void deleteRecovery(Long id) {
        passwordRecoveryRepository.deleteById(id);
    }
}
