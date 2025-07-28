package com.be_source.School_Medical_Management_System_.repository;

import com.be_source.School_Medical_Management_System_.enums.ConfirmationStatus;
import com.be_source.School_Medical_Management_System_.model.Inventory;
import com.be_source.School_Medical_Management_System_.model.MedicationRequest;
import com.be_source.School_Medical_Management_System_.model.Students;
import com.be_source.School_Medical_Management_System_.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicationRequestRepository extends JpaRepository<MedicationRequest, Long> {
    List<MedicationRequest> findByRequestedBy(User parent);
    Optional<MedicationRequest> findByRequestIdAndRequestedBy(Long id, User parent);
    List<MedicationRequest> findByStudentOrderByCreatedAtDesc(Students student);
    List<MedicationRequest> findByConfirmationStatus(ConfirmationStatus status);
    List<MedicationRequest> findByInventory(Inventory inventory);
    List<MedicationRequest> findByMedicationNameIgnoreCaseAndInventoryIsNull(String medicationName);
    List<MedicationRequest> findByInventoryIsNull();
    List<MedicationRequest> findByRequestedByOrderByCreatedAtDesc(User requestedBy);
    List<MedicationRequest> findByConfirmationStatusOrderByCreatedAtDesc(ConfirmationStatus status);


}