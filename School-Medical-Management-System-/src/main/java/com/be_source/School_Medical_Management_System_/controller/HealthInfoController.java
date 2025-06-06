package com.be_source.School_Medical_Management_System_.controller;

import com.be_source.School_Medical_Management_System_.model.Health_Info;
import com.be_source.School_Medical_Management_System_.service.HealthInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/health-info")
public class HealthInfoController {

    @Autowired
    private HealthInfoService healthInfoService;

    @GetMapping
    public List<Health_Info> getAllHealthInfo() {
        return healthInfoService.getAllHealthInfo();
    }

    @GetMapping("/{id}")
    public Optional<Health_Info> getHealthInfoById(@PathVariable Long id) {
        return healthInfoService.getHealthInfoById(id);
    }

    @PostMapping
    public Health_Info createHealthInfo(@RequestBody Health_Info healthInfo) {
        return healthInfoService.saveHealthInfo(healthInfo);
    }

    @PutMapping("/{id}")
    public Health_Info updateHealthInfo(@PathVariable Long id, @RequestBody Health_Info healthInfo) {
        healthInfo.setHealthInfoId(id);
        return healthInfoService.saveHealthInfo(healthInfo);
    }

    @DeleteMapping("/{id}")
    public void deleteHealthInfo(@PathVariable Long id) {
        healthInfoService.deleteHealthInfo(id);
    }
}