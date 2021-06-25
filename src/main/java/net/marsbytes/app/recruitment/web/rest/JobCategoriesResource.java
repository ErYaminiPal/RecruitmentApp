package net.marsbytes.app.recruitment.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.marsbytes.app.recruitment.domain.JobCategories;
import net.marsbytes.app.recruitment.repository.JobCategoriesRepository;
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
 * REST controller for managing {@link net.marsbytes.app.recruitment.domain.JobCategories}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JobCategoriesResource {

    private final Logger log = LoggerFactory.getLogger(JobCategoriesResource.class);

    private static final String ENTITY_NAME = "jobCategories";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JobCategoriesRepository jobCategoriesRepository;

    public JobCategoriesResource(JobCategoriesRepository jobCategoriesRepository) {
        this.jobCategoriesRepository = jobCategoriesRepository;
    }

    /**
     * {@code POST  /job-categories} : Create a new jobCategories.
     *
     * @param jobCategories the jobCategories to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobCategories, or with status {@code 400 (Bad Request)} if the jobCategories has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/job-categories")
    public ResponseEntity<JobCategories> createJobCategories(@RequestBody JobCategories jobCategories) throws URISyntaxException {
        log.debug("REST request to save JobCategories : {}", jobCategories);
        if (jobCategories.getId() != null) {
            throw new BadRequestAlertException("A new jobCategories cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JobCategories result = jobCategoriesRepository.save(jobCategories);
        return ResponseEntity
            .created(new URI("/api/job-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /job-categories/:id} : Updates an existing jobCategories.
     *
     * @param id the id of the jobCategories to save.
     * @param jobCategories the jobCategories to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobCategories,
     * or with status {@code 400 (Bad Request)} if the jobCategories is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobCategories couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/job-categories/{id}")
    public ResponseEntity<JobCategories> updateJobCategories(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JobCategories jobCategories
    ) throws URISyntaxException {
        log.debug("REST request to update JobCategories : {}, {}", id, jobCategories);
        if (jobCategories.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobCategories.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobCategoriesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JobCategories result = jobCategoriesRepository.save(jobCategories);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jobCategories.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /job-categories/:id} : Partial updates given fields of an existing jobCategories, field will ignore if it is null
     *
     * @param id the id of the jobCategories to save.
     * @param jobCategories the jobCategories to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobCategories,
     * or with status {@code 400 (Bad Request)} if the jobCategories is not valid,
     * or with status {@code 404 (Not Found)} if the jobCategories is not found,
     * or with status {@code 500 (Internal Server Error)} if the jobCategories couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/job-categories/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<JobCategories> partialUpdateJobCategories(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody JobCategories jobCategories
    ) throws URISyntaxException {
        log.debug("REST request to partial update JobCategories partially : {}, {}", id, jobCategories);
        if (jobCategories.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobCategories.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobCategoriesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JobCategories> result = jobCategoriesRepository
            .findById(jobCategories.getId())
            .map(
                existingJobCategories -> {
                    if (jobCategories.getCode() != null) {
                        existingJobCategories.setCode(jobCategories.getCode());
                    }
                    if (jobCategories.getName() != null) {
                        existingJobCategories.setName(jobCategories.getName());
                    }
                    if (jobCategories.getDescription() != null) {
                        existingJobCategories.setDescription(jobCategories.getDescription());
                    }

                    return existingJobCategories;
                }
            )
            .map(jobCategoriesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jobCategories.getId().toString())
        );
    }

    /**
     * {@code GET  /job-categories} : get all the jobCategories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobCategories in body.
     */
    @GetMapping("/job-categories")
    public List<JobCategories> getAllJobCategories() {
        log.debug("REST request to get all JobCategories");
        return jobCategoriesRepository.findAll();
    }

    /**
     * {@code GET  /job-categories/:id} : get the "id" jobCategories.
     *
     * @param id the id of the jobCategories to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobCategories, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/job-categories/{id}")
    public ResponseEntity<JobCategories> getJobCategories(@PathVariable Long id) {
        log.debug("REST request to get JobCategories : {}", id);
        Optional<JobCategories> jobCategories = jobCategoriesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jobCategories);
    }

    /**
     * {@code DELETE  /job-categories/:id} : delete the "id" jobCategories.
     *
     * @param id the id of the jobCategories to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/job-categories/{id}")
    public ResponseEntity<Void> deleteJobCategories(@PathVariable Long id) {
        log.debug("REST request to delete JobCategories : {}", id);
        jobCategoriesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
