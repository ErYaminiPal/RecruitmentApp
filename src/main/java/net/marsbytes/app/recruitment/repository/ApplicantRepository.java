package net.marsbytes.app.recruitment.repository;

import net.marsbytes.app.recruitment.domain.Applicant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Applicant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {}
