package com.be_source.School_Medical_Management_System_.service;

import com.be_source.School_Medical_Management_System_.model.Health_Info;
import com.be_source.School_Medical_Management_System_.repository.HealthInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HealthInfoService {

    @Autowired
    private HealthInfoRepository healthInfoRepository;

    public List<Health_Info> getAllHealthInfo() {
        return healthInfoRepository.findAll();
    }

    public Optional<Health_Info> getHealthInfoById(Long id) {
        return healthInfoRepository.findById(id);
    }

    public Health_Info saveHealthInfo(Health_Info info) {
        return healthInfoRepository.save(info);
    }

    public void deleteHealthInfo(Long id) {
        healthInfoRepository.deleteById(id);
    }
}