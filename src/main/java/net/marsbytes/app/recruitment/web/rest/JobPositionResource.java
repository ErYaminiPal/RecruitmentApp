package net.marsbytes.app.recruitment.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.marsbytes.app.recruitment.domain.JobPosition;
import net.marsbytes.app.recruitment.repository.JobPositionRepository;
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
 * REST controller for managing {@link net.marsbytes.app.recruitment.domain.JobPosition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JobPositionResource {

    private final Logger log = LoggerFactory.getLogger(JobPositionResource.class);

    private static final String ENTITY_NAME = "jobPosition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JobPositionRepository jobPositionRepository;

    public JobPositionResource(JobPositionRepository jobPositionRepository) {
        this.jobPositionRepository = jobPositionRepository;
    }

    /**
     * {@code POST  /job-positions} : Create a new jobPosition.
     *
     * @param jobPosition the jobPosition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobPosition, or with status {@code 400 (Bad Request)} if the jobPosition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/job-positions")
    public ResponseEntity<JobPosition> createJobPosition(@RequestBody JobPosition jobPosition) throws URISyntaxException {
        log.debug("REST request to save JobPosition : {}", jobPosition);
        if (jobPosition.getId() != null) {
            throw new BadRequestAlertException("A new jobPosition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JobPosition result = jobPositionRepository.save(jobPosition);
        return ResponseEntity
            .created(new URI("/api/job-positions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /job-positions/:id} : Updates an existing jobPosition.
     *
     * @param id the id of the jobPosition to save.
     * @param jobPosition the jobPosition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobPosition,
     * or with status {@code 400 (Bad Request)} if the jobPosition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobPosition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/job-positions/{id}")
    public ResponseEntity<JobPosition> updateJobPosition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JobPosition jobPosition
    ) throws URISyntaxException {
        log.debug("REST request to update JobPosition : {}, {}", id, jobPosition);
        if (jobPosition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobPosition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobPositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JobPosition result = jobPositionRepository.save(jobPosition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jobPosition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /job-positions/:id} : Partial updates given fields of an existing jobPosition, field will ignore if it is null
     *
     * @param id the id of the jobPosition to save.
     * @param jobPosition the jobPosition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobPosition,
     * or with status {@code 400 (Bad Request)} if the jobPosition is not valid,
     * or with status {@code 404 (Not Found)} if the jobPosition is not found,
     * or with status {@code 500 (Internal Server Error)} if the jobPosition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/job-positions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<JobPosition> partialUpdateJobPosition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JobPosition jobPosition
    ) throws URISyntaxException {
        log.debug("REST request to partial update JobPosition partially : {}, {}", id, jobPosition);
        if (jobPosition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobPosition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobPositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JobPosition> result = jobPositionRepository
            .findById(jobPosition.getId())
            .map(
                existingJobPosition -> {
                    if (jobPosition.getCode() != null) {
                        existingJobPosition.setCode(jobPosition.getCode());
                    }
                    if (jobPosition.getName() != null) {
                        existingJobPosition.setName(jobPosition.getName());
                    }
                    if (jobPosition.getDescription() != null) {
                        existingJobPosition.setDescription(jobPosition.getDescription());
                    }

                    return existingJobPosition;
                }
            )
            .map(jobPositionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jobPosition.getId().toString())
        );
    }

    /**
     * {@code GET  /job-positions} : get all the jobPositions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobPositions in body.
     */
    @GetMapping("/job-positions")
    public List<JobPosition> getAllJobPositions() {
        log.debug("REST request to get all JobPositions");
        return jobPositionRepository.findAll();
    }

    /**
     * {@code GET  /job-positions/:id} : get the "id" jobPosition.
     *
     * @param id the id of the jobPosition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobPosition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/job-positions/{id}")
    public ResponseEntity<JobPosition> getJobPosition(@PathVariable Long id) {
        log.debug("REST request to get JobPosition : {}", id);
        Optional<JobPosition> jobPosition = jobPositionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jobPosition);
    }

    /**
     * {@code DELETE  /job-positions/:id} : delete the "id" jobPosition.
     *
     * @param id the id of the jobPosition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/job-positions/{id}")
    public ResponseEntity<Void> deleteJobPosition(@PathVariable Long id) {
        log.debug("REST request to delete JobPosition : {}", id);
        jobPositionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
