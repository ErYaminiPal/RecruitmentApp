package net.marsbytes.app.recruitment.repository;

import java.time.LocalDate;
import java.util.List;
import net.marsbytes.app.recruitment.domain.PersistentToken;
import net.marsbytes.app.recruitment.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link PersistentToken} entity.
 */
public interface PersistentTokenRepository extends JpaRepository<PersistentToken, String> {
    List<PersistentToken> findByUser(User user);

    List<PersistentToken> findByTokenDateBefore(LocalDate localDate);
}
