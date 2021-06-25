package net.marsbytes.app.recruitment.repository;

import net.marsbytes.app.recruitment.domain.JobPosition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the JobPosition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {}
