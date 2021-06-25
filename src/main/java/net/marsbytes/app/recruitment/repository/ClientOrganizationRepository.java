package net.marsbytes.app.recruitment.repository;

import net.marsbytes.app.recruitment.domain.ClientOrganization;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ClientOrganization entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClientOrganizationRepository extends JpaRepository<ClientOrganization, Long> {}
