package net.marsbytes.app.recruitment.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import net.marsbytes.app.recruitment.IntegrationTest;
import net.marsbytes.app.recruitment.domain.JobPosition;
import net.marsbytes.app.recruitment.repository.JobPositionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link JobPositionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JobPositionResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/job-positions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JobPositionRepository jobPositionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJobPositionMockMvc;

    private JobPosition jobPosition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobPosition createEntity(EntityManager em) {
        JobPosition jobPosition = new JobPosition().code(DEFAULT_CODE).name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return jobPosition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobPosition createUpdatedEntity(EntityManager em) {
        JobPosition jobPosition = new JobPosition().code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return jobPosition;
    }

    @BeforeEach
    public void initTest() {
        jobPosition = createEntity(em);
    }

    @Test
    @Transactional
    void createJobPosition() throws Exception {
        int databaseSizeBeforeCreate = jobPositionRepository.findAll().size();
        // Create the JobPosition
        restJobPositionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isCreated());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeCreate + 1);
        JobPosition testJobPosition = jobPositionList.get(jobPositionList.size() - 1);
        assertThat(testJobPosition.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testJobPosition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testJobPosition.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createJobPositionWithExistingId() throws Exception {
        // Create the JobPosition with an existing ID
        jobPosition.setId(1L);

        int databaseSizeBeforeCreate = jobPositionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobPositionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJobPositions() throws Exception {
        // Initialize the database
        jobPositionRepository.saveAndFlush(jobPosition);

        // Get all the jobPositionList
        restJobPositionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobPosition.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getJobPosition() throws Exception {
        // Initialize the database
        jobPositionRepository.saveAndFlush(jobPosition);

        // Get the jobPosition
        restJobPositionMockMvc
            .perform(get(ENTITY_API_URL_ID, jobPosition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jobPosition.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingJobPosition() throws Exception {
        // Get the jobPosition
        restJobPositionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewJobPosition() throws Exception {
        // Initialize the database
        jobPositionRepository.saveAndFlush(jobPosition);

        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();

        // Update the jobPosition
        JobPosition updatedJobPosition = jobPositionRepository.findById(jobPosition.getId()).get();
        // Disconnect from session so that the updates on updatedJobPosition are not directly saved in db
        em.detach(updatedJobPosition);
        updatedJobPosition.code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restJobPositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJobPosition.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJobPosition))
            )
            .andExpect(status().isOk());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
        JobPosition testJobPosition = jobPositionList.get(jobPositionList.size() - 1);
        assertThat(testJobPosition.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testJobPosition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJobPosition.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingJobPosition() throws Exception {
        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();
        jobPosition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobPositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, jobPosition.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJobPosition() throws Exception {
        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();
        jobPosition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobPositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJobPosition() throws Exception {
        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();
        jobPosition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobPositionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJobPositionWithPatch() throws Exception {
        // Initialize the database
        jobPositionRepository.saveAndFlush(jobPosition);

        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();

        // Update the jobPosition using partial update
        JobPosition partialUpdatedJobPosition = new JobPosition();
        partialUpdatedJobPosition.setId(jobPosition.getId());

        partialUpdatedJobPosition.description(UPDATED_DESCRIPTION);

        restJobPositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobPosition.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobPosition))
            )
            .andExpect(status().isOk());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
        JobPosition testJobPosition = jobPositionList.get(jobPositionList.size() - 1);
        assertThat(testJobPosition.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testJobPosition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testJobPosition.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateJobPositionWithPatch() throws Exception {
        // Initialize the database
        jobPositionRepository.saveAndFlush(jobPosition);

        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();

        // Update the jobPosition using partial update
        JobPosition partialUpdatedJobPosition = new JobPosition();
        partialUpdatedJobPosition.setId(jobPosition.getId());

        partialUpdatedJobPosition.code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restJobPositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobPosition.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobPosition))
            )
            .andExpect(status().isOk());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
        JobPosition testJobPosition = jobPositionList.get(jobPositionList.size() - 1);
        assertThat(testJobPosition.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testJobPosition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJobPosition.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingJobPosition() throws Exception {
        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();
        jobPosition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobPositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jobPosition.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJobPosition() throws Exception {
        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();
        jobPosition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobPositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJobPosition() throws Exception {
        int databaseSizeBeforeUpdate = jobPositionRepository.findAll().size();
        jobPosition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobPositionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobPosition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobPosition in the database
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJobPosition() throws Exception {
        // Initialize the database
        jobPositionRepository.saveAndFlush(jobPosition);

        int databaseSizeBeforeDelete = jobPositionRepository.findAll().size();

        // Delete the jobPosition
        restJobPositionMockMvc
            .perform(delete(ENTITY_API_URL_ID, jobPosition.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JobPosition> jobPositionList = jobPositionRepository.findAll();
        assertThat(jobPositionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
