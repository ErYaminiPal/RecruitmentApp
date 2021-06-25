package net.marsbytes.app.recruitment.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.marsbytes.app.recruitment.domain.Jobs;
import net.marsbytes.app.recruitment.repository.JobsRepository;
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
 * REST controller for managing {@link net.marsbytes.app.recruitment.domain.Jobs}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JobsResource {

    private final Logger log = LoggerFactory.getLogger(JobsResource.class);

    private static final String ENTITY_NAME = "jobs";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JobsRepository jobsRepository;

    public JobsResource(JobsRepository jobsRepository) {
        this.jobsRepository = jobsRepository;
    }

    /**
     * {@code POST  /jobs} : Create a new jobs.
     *
     * @param jobs the jobs to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobs, or with status {@code 400 (Bad Request)} if the jobs has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/jobs")
    public ResponseEntity<Jobs> createJobs(@RequestBody Jobs jobs) throws URISyntaxException {
        log.debug("REST request to save Jobs : {}", jobs);
        if (jobs.getId() != null) {
            throw new BadRequestAlertException("A new jobs cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Jobs result = jobsRepository.save(jobs);
        return ResponseEntity
            .created(new URI("/api/jobs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /jobs/:id} : Updates an existing jobs.
     *
     * @param id the id of the jobs to save.
     * @param jobs the jobs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobs,
     * or with status {@code 400 (Bad Request)} if the jobs is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/jobs/{id}")
    public ResponseEntity<Jobs> updateJobs(@PathVariable(value = "id", required = false) final Long id, @RequestBody Jobs jobs)
        throws URISyntaxException {
        log.debug("REST request to update Jobs : {}, {}", id, jobs);
        if (jobs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Jobs result = jobsRepository.save(jobs);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jobs.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /jobs/:id} : Partial updates given fields of an existing jobs, field will ignore if it is null
     *
     * @param id the id of the jobs to save.
     * @param jobs the jobs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobs,
     * or with status {@code 400 (Bad Request)} if the jobs is not valid,
     * or with status {@code 404 (Not Found)} if the jobs is not found,
     * or with status {@code 500 (Internal Server Error)} if the jobs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/jobs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Jobs> partialUpdateJobs(@PathVariable(value = "id", required = false) final Long id, @RequestBody Jobs jobs)
        throws URISyntaxException {
        log.debug("REST request to partial update Jobs partially : {}, {}", id, jobs);
        if (jobs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Jobs> result = jobsRepository
            .findById(jobs.getId())
            .map(
                existingJobs -> {
                    if (jobs.getCode() != null) {
                        existingJobs.setCode(jobs.getCode());
                    }
                    if (jobs.getName() != null) {
                        existingJobs.setName(jobs.getName());
                    }
                    if (jobs.getDescription() != null) {
                        existingJobs.setDescription(jobs.getDescription());
                    }
                    if (jobs.getDatePublished() != null) {
                        existingJobs.setDatePublished(jobs.getDatePublished());
                    }
                    if (jobs.getJobStartDate() != null) {
                        existingJobs.setJobStartDate(jobs.getJobStartDate());
                    }
                    if (jobs.getNoOfVacancies() != null) {
                        existingJobs.setNoOfVacancies(jobs.getNoOfVacancies());
                    }

                    return existingJobs;
                }
            )
            .map(jobsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jobs.getId().toString())
        );
    }

    /**
     * {@code GET  /jobs} : get all the jobs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobs in body.
     */
    @GetMapping("/jobs")
    public List<Jobs> getAllJobs() {
        log.debug("REST request to get all Jobs");
        return jobsRepository.findAll();
    }

    /**
     * {@code GET  /jobs/:id} : get the "id" jobs.
     *
     * @param id the id of the jobs to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobs, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/jobs/{id}")
    public ResponseEntity<Jobs> getJobs(@PathVariable Long id) {
        log.debug("REST request to get Jobs : {}", id);
        Optional<Jobs> jobs = jobsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jobs);
    }

    /**
     * {@code DELETE  /jobs/:id} : delete the "id" jobs.
     *
     * @param id the id of the jobs to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJobs(@PathVariable Long id) {
        log.debug("REST request to delete Jobs : {}", id);
        jobsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
