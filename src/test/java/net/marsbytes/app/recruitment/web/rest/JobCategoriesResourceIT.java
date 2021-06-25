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
import net.marsbytes.app.recruitment.domain.JobCategories;
import net.marsbytes.app.recruitment.repository.JobCategoriesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link JobCategoriesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JobCategoriesResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/job-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JobCategoriesRepository jobCategoriesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJobCategoriesMockMvc;

    private JobCategories jobCategories;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCategories createEntity(EntityManager em) {
        JobCategories jobCategories = new JobCategories().code(DEFAULT_CODE).name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return jobCategories;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCategories createUpdatedEntity(EntityManager em) {
        JobCategories jobCategories = new JobCategories().code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return jobCategories;
    }

    @BeforeEach
    public void initTest() {
        jobCategories = createEntity(em);
    }

    @Test
    @Transactional
    void createJobCategories() throws Exception {
        int databaseSizeBeforeCreate = jobCategoriesRepository.findAll().size();
        // Create the JobCategories
        restJobCategoriesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isCreated());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeCreate + 1);
        JobCategories testJobCategories = jobCategoriesList.get(jobCategoriesList.size() - 1);
        assertThat(testJobCategories.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testJobCategories.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testJobCategories.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createJobCategoriesWithExistingId() throws Exception {
        // Create the JobCategories with an existing ID
        jobCategories.setId(1L);

        int databaseSizeBeforeCreate = jobCategoriesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobCategoriesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJobCategories() throws Exception {
        // Initialize the database
        jobCategoriesRepository.saveAndFlush(jobCategories);

        // Get all the jobCategoriesList
        restJobCategoriesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobCategories.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getJobCategories() throws Exception {
        // Initialize the database
        jobCategoriesRepository.saveAndFlush(jobCategories);

        // Get the jobCategories
        restJobCategoriesMockMvc
            .perform(get(ENTITY_API_URL_ID, jobCategories.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jobCategories.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingJobCategories() throws Exception {
        // Get the jobCategories
        restJobCategoriesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewJobCategories() throws Exception {
        // Initialize the database
        jobCategoriesRepository.saveAndFlush(jobCategories);

        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();

        // Update the jobCategories
        JobCategories updatedJobCategories = jobCategoriesRepository.findById(jobCategories.getId()).get();
        // Disconnect from session so that the updates on updatedJobCategories are not directly saved in db
        em.detach(updatedJobCategories);
        updatedJobCategories.code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restJobCategoriesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJobCategories.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJobCategories))
            )
            .andExpect(status().isOk());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
        JobCategories testJobCategories = jobCategoriesList.get(jobCategoriesList.size() - 1);
        assertThat(testJobCategories.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testJobCategories.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJobCategories.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingJobCategories() throws Exception {
        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();
        jobCategories.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobCategoriesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, jobCategories.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJobCategories() throws Exception {
        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();
        jobCategories.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobCategoriesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJobCategories() throws Exception {
        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();
        jobCategories.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobCategoriesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJobCategoriesWithPatch() throws Exception {
        // Initialize the database
        jobCategoriesRepository.saveAndFlush(jobCategories);

        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();

        // Update the jobCategories using partial update
        JobCategories partialUpdatedJobCategories = new JobCategories();
        partialUpdatedJobCategories.setId(jobCategories.getId());

        partialUpdatedJobCategories.code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restJobCategoriesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobCategories.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCategories))
            )
            .andExpect(status().isOk());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
        JobCategories testJobCategories = jobCategoriesList.get(jobCategoriesList.size() - 1);
        assertThat(testJobCategories.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testJobCategories.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJobCategories.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateJobCategoriesWithPatch() throws Exception {
        // Initialize the database
        jobCategoriesRepository.saveAndFlush(jobCategories);

        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();

        // Update the jobCategories using partial update
        JobCategories partialUpdatedJobCategories = new JobCategories();
        partialUpdatedJobCategories.setId(jobCategories.getId());

        partialUpdatedJobCategories.code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restJobCategoriesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobCategories.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCategories))
            )
            .andExpect(status().isOk());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
        JobCategories testJobCategories = jobCategoriesList.get(jobCategoriesList.size() - 1);
        assertThat(testJobCategories.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testJobCategories.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJobCategories.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingJobCategories() throws Exception {
        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();
        jobCategories.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobCategoriesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jobCategories.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJobCategories() throws Exception {
        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();
        jobCategories.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobCategoriesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJobCategories() throws Exception {
        int databaseSizeBeforeUpdate = jobCategoriesRepository.findAll().size();
        jobCategories.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobCategoriesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobCategories))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobCategories in the database
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJobCategories() throws Exception {
        // Initialize the database
        jobCategoriesRepository.saveAndFlush(jobCategories);

        int databaseSizeBeforeDelete = jobCategoriesRepository.findAll().size();

        // Delete the jobCategories
        restJobCategoriesMockMvc
            .perform(delete(ENTITY_API_URL_ID, jobCategories.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JobCategories> jobCategoriesList = jobCategoriesRepository.findAll();
        assertThat(jobCategoriesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
