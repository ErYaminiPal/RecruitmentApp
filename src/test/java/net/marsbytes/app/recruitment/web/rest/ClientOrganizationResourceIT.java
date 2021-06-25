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
import net.marsbytes.app.recruitment.domain.ClientOrganization;
import net.marsbytes.app.recruitment.repository.ClientOrganizationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ClientOrganizationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClientOrganizationResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/client-organizations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClientOrganizationRepository clientOrganizationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClientOrganizationMockMvc;

    private ClientOrganization clientOrganization;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientOrganization createEntity(EntityManager em) {
        ClientOrganization clientOrganization = new ClientOrganization()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return clientOrganization;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientOrganization createUpdatedEntity(EntityManager em) {
        ClientOrganization clientOrganization = new ClientOrganization()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);
        return clientOrganization;
    }

    @BeforeEach
    public void initTest() {
        clientOrganization = createEntity(em);
    }

    @Test
    @Transactional
    void createClientOrganization() throws Exception {
        int databaseSizeBeforeCreate = clientOrganizationRepository.findAll().size();
        // Create the ClientOrganization
        restClientOrganizationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isCreated());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeCreate + 1);
        ClientOrganization testClientOrganization = clientOrganizationList.get(clientOrganizationList.size() - 1);
        assertThat(testClientOrganization.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testClientOrganization.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testClientOrganization.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createClientOrganizationWithExistingId() throws Exception {
        // Create the ClientOrganization with an existing ID
        clientOrganization.setId(1L);

        int databaseSizeBeforeCreate = clientOrganizationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClientOrganizationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClientOrganizations() throws Exception {
        // Initialize the database
        clientOrganizationRepository.saveAndFlush(clientOrganization);

        // Get all the clientOrganizationList
        restClientOrganizationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clientOrganization.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getClientOrganization() throws Exception {
        // Initialize the database
        clientOrganizationRepository.saveAndFlush(clientOrganization);

        // Get the clientOrganization
        restClientOrganizationMockMvc
            .perform(get(ENTITY_API_URL_ID, clientOrganization.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clientOrganization.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingClientOrganization() throws Exception {
        // Get the clientOrganization
        restClientOrganizationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClientOrganization() throws Exception {
        // Initialize the database
        clientOrganizationRepository.saveAndFlush(clientOrganization);

        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();

        // Update the clientOrganization
        ClientOrganization updatedClientOrganization = clientOrganizationRepository.findById(clientOrganization.getId()).get();
        // Disconnect from session so that the updates on updatedClientOrganization are not directly saved in db
        em.detach(updatedClientOrganization);
        updatedClientOrganization.code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restClientOrganizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClientOrganization.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClientOrganization))
            )
            .andExpect(status().isOk());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
        ClientOrganization testClientOrganization = clientOrganizationList.get(clientOrganizationList.size() - 1);
        assertThat(testClientOrganization.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testClientOrganization.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testClientOrganization.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingClientOrganization() throws Exception {
        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();
        clientOrganization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientOrganizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clientOrganization.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClientOrganization() throws Exception {
        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();
        clientOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrganizationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClientOrganization() throws Exception {
        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();
        clientOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrganizationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClientOrganizationWithPatch() throws Exception {
        // Initialize the database
        clientOrganizationRepository.saveAndFlush(clientOrganization);

        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();

        // Update the clientOrganization using partial update
        ClientOrganization partialUpdatedClientOrganization = new ClientOrganization();
        partialUpdatedClientOrganization.setId(clientOrganization.getId());

        partialUpdatedClientOrganization.code(UPDATED_CODE).name(UPDATED_NAME);

        restClientOrganizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientOrganization.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientOrganization))
            )
            .andExpect(status().isOk());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
        ClientOrganization testClientOrganization = clientOrganizationList.get(clientOrganizationList.size() - 1);
        assertThat(testClientOrganization.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testClientOrganization.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testClientOrganization.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateClientOrganizationWithPatch() throws Exception {
        // Initialize the database
        clientOrganizationRepository.saveAndFlush(clientOrganization);

        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();

        // Update the clientOrganization using partial update
        ClientOrganization partialUpdatedClientOrganization = new ClientOrganization();
        partialUpdatedClientOrganization.setId(clientOrganization.getId());

        partialUpdatedClientOrganization.code(UPDATED_CODE).name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restClientOrganizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientOrganization.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientOrganization))
            )
            .andExpect(status().isOk());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
        ClientOrganization testClientOrganization = clientOrganizationList.get(clientOrganizationList.size() - 1);
        assertThat(testClientOrganization.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testClientOrganization.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testClientOrganization.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingClientOrganization() throws Exception {
        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();
        clientOrganization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientOrganizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clientOrganization.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClientOrganization() throws Exception {
        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();
        clientOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrganizationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClientOrganization() throws Exception {
        int databaseSizeBeforeUpdate = clientOrganizationRepository.findAll().size();
        clientOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrganizationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientOrganization))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientOrganization in the database
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClientOrganization() throws Exception {
        // Initialize the database
        clientOrganizationRepository.saveAndFlush(clientOrganization);

        int databaseSizeBeforeDelete = clientOrganizationRepository.findAll().size();

        // Delete the clientOrganization
        restClientOrganizationMockMvc
            .perform(delete(ENTITY_API_URL_ID, clientOrganization.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClientOrganization> clientOrganizationList = clientOrganizationRepository.findAll();
        assertThat(clientOrganizationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
