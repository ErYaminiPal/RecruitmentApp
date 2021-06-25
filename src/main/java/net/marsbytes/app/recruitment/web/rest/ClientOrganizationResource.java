package net.marsbytes.app.recruitment.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.marsbytes.app.recruitment.domain.ClientOrganization;
import net.marsbytes.app.recruitment.repository.ClientOrganizationRepository;
import net.marsbytes.app.recruitment.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.marsbytes.app.recruitment.domain.ClientOrganization}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClientOrganizationResource {

    private final Logger log = LoggerFactory.getLogger(ClientOrganizationResource.class);

    private static final String ENTITY_NAME = "clientOrganization";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClientOrganizationRepository clientOrganizationRepository;

    public ClientOrganizationResource(ClientOrganizationRepository clientOrganizationRepository) {
        this.clientOrganizationRepository = clientOrganizationRepository;
    }

    /**
     * {@code POST  /client-organizations} : Create a new clientOrganization.
     *
     * @param clientOrganization the clientOrganization to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clientOrganization, or with status {@code 400 (Bad Request)} if the clientOrganization has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/client-organizations")
    public ResponseEntity<ClientOrganization> createClientOrganization(@RequestBody ClientOrganization clientOrganization)
        throws URISyntaxException {
        log.debug("REST request to save ClientOrganization : {}", clientOrganization);
        if (clientOrganization.getId() != null) {
            throw new BadRequestAlertException("A new clientOrganization cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClientOrganization result = clientOrganizationRepository.save(clientOrganization);
        return ResponseEntity
            .created(new URI("/api/client-organizations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /client-organizations/:id} : Updates an existing clientOrganization.
     *
     * @param id the id of the clientOrganization to save.
     * @param clientOrganization the clientOrganization to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientOrganization,
     * or with status {@code 400 (Bad Request)} if the clientOrganization is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clientOrganization couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/client-organizations/{id}")
    public ResponseEntity<ClientOrganization> updateClientOrganization(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClientOrganization clientOrganization
    ) throws URISyntaxException {
        log.debug("REST request to update ClientOrganization : {}, {}", id, clientOrganization);
        if (clientOrganization.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientOrganization.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientOrganizationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClientOrganization result = clientOrganizationRepository.save(clientOrganization);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clientOrganization.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /client-organizations/:id} : Partial updates given fields of an existing clientOrganization, field will ignore if it is null
     *
     * @param id the id of the clientOrganization to save.
     * @param clientOrganization the clientOrganization to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientOrganization,
     * or with status {@code 400 (Bad Request)} if the clientOrganization is not valid,
     * or with status {@code 404 (Not Found)} if the clientOrganization is not found,
     * or with status {@code 500 (Internal Server Error)} if the clientOrganization couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/client-organizations/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ClientOrganization> partialUpdateClientOrganization(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClientOrganization clientOrganization
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClientOrganization partially : {}, {}", id, clientOrganization);
        if (clientOrganization.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientOrganization.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientOrganizationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClientOrganization> result = clientOrganizationRepository
            .findById(clientOrganization.getId())
            .map(
                existingClientOrganization -> {
                    if (clientOrganization.getCode() != null) {
                        existingClientOrganization.setCode(clientOrganization.getCode());
                    }
                    if (clientOrganization.getName() != null) {
                        existingClientOrganization.setName(clientOrganization.getName());
                    }
                    if (clientOrganization.getDescription() != null) {
                        existingClientOrganization.setDescription(clientOrganization.getDescription());
                    }

                    return existingClientOrganization;
                }
            )
            .map(clientOrganizationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clientOrganization.getId().toString())
        );
    }

    /**
     * {@code GET  /client-organizations} : get all the clientOrganizations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clientOrganizations in body.
     */
    @GetMapping("/client-organizations")
    public List<ClientOrganization> getAllClientOrganizations() {
        log.debug("REST request to get all ClientOrganizations");
        return clientOrganizationRepository.findAll();
    }

    /**
     * {@code GET  /client-organizations/:id} : get the "id" clientOrganization.
     *
     * @param id the id of the clientOrganization to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clientOrganization, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/client-organizations/{id}")
    public ResponseEntity<ClientOrganization> getClientOrganization(@PathVariable Long id) {
        log.debug("REST request to get ClientOrganization : {}", id);
        Optional<ClientOrganization> clientOrganization = clientOrganizationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(clientOrganization);
    }

    /**
     * {@code DELETE  /client-organizations/:id} : delete the "id" clientOrganization.
     *
     * @param id the id of the clientOrganization to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/client-organizations/{id}")
    public ResponseEntity<Void> deleteClientOrganization(@PathVariable Long id) {
        log.debug("REST request to delete ClientOrganization : {}", id);
        clientOrganizationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
