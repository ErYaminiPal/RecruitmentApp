package net.marsbytes.app.recruitment.repository;

import net.marsbytes.app.recruitment.domain.JobCategories;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the JobCategories entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobCategoriesRepository extends JpaRepository<JobCategories, Long> {}
