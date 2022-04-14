package com.clarabernerd.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.clarabernerd.myapp.IntegrationTest;
import com.clarabernerd.myapp.domain.DeliveryMan;
import com.clarabernerd.myapp.repository.DeliveryManRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DeliveryManResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DeliveryManResourceIT {

    private static final String DEFAULT_VEHICLE = "AAAAAAAAAA";
    private static final String UPDATED_VEHICLE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMBER_OF_EARNINGS = 1;
    private static final Integer UPDATED_NUMBER_OF_EARNINGS = 2;

    private static final Integer DEFAULT_NUMBER_OF_RIDES = 1;
    private static final Integer UPDATED_NUMBER_OF_RIDES = 2;

    private static final String DEFAULT_RATING = "AAAAAAAAAA";
    private static final String UPDATED_RATING = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/delivery-men";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DeliveryManRepository deliveryManRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDeliveryManMockMvc;

    private DeliveryMan deliveryMan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DeliveryMan createEntity(EntityManager em) {
        DeliveryMan deliveryMan = new DeliveryMan()
            .vehicle(DEFAULT_VEHICLE)
            .numberOfEarnings(DEFAULT_NUMBER_OF_EARNINGS)
            .numberOfRides(DEFAULT_NUMBER_OF_RIDES)
            .rating(DEFAULT_RATING);
        return deliveryMan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DeliveryMan createUpdatedEntity(EntityManager em) {
        DeliveryMan deliveryMan = new DeliveryMan()
            .vehicle(UPDATED_VEHICLE)
            .numberOfEarnings(UPDATED_NUMBER_OF_EARNINGS)
            .numberOfRides(UPDATED_NUMBER_OF_RIDES)
            .rating(UPDATED_RATING);
        return deliveryMan;
    }

    @BeforeEach
    public void initTest() {
        deliveryMan = createEntity(em);
    }

    @Test
    @Transactional
    void createDeliveryMan() throws Exception {
        int databaseSizeBeforeCreate = deliveryManRepository.findAll().size();
        // Create the DeliveryMan
        restDeliveryManMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deliveryMan)))
            .andExpect(status().isCreated());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeCreate + 1);
        DeliveryMan testDeliveryMan = deliveryManList.get(deliveryManList.size() - 1);
        assertThat(testDeliveryMan.getVehicle()).isEqualTo(DEFAULT_VEHICLE);
        assertThat(testDeliveryMan.getNumberOfEarnings()).isEqualTo(DEFAULT_NUMBER_OF_EARNINGS);
        assertThat(testDeliveryMan.getNumberOfRides()).isEqualTo(DEFAULT_NUMBER_OF_RIDES);
        assertThat(testDeliveryMan.getRating()).isEqualTo(DEFAULT_RATING);
    }

    @Test
    @Transactional
    void createDeliveryManWithExistingId() throws Exception {
        // Create the DeliveryMan with an existing ID
        deliveryMan.setId(1L);

        int databaseSizeBeforeCreate = deliveryManRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeliveryManMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deliveryMan)))
            .andExpect(status().isBadRequest());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDeliveryMen() throws Exception {
        // Initialize the database
        deliveryManRepository.saveAndFlush(deliveryMan);

        // Get all the deliveryManList
        restDeliveryManMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deliveryMan.getId().intValue())))
            .andExpect(jsonPath("$.[*].vehicle").value(hasItem(DEFAULT_VEHICLE)))
            .andExpect(jsonPath("$.[*].numberOfEarnings").value(hasItem(DEFAULT_NUMBER_OF_EARNINGS)))
            .andExpect(jsonPath("$.[*].numberOfRides").value(hasItem(DEFAULT_NUMBER_OF_RIDES)))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)));
    }

    @Test
    @Transactional
    void getDeliveryMan() throws Exception {
        // Initialize the database
        deliveryManRepository.saveAndFlush(deliveryMan);

        // Get the deliveryMan
        restDeliveryManMockMvc
            .perform(get(ENTITY_API_URL_ID, deliveryMan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(deliveryMan.getId().intValue()))
            .andExpect(jsonPath("$.vehicle").value(DEFAULT_VEHICLE))
            .andExpect(jsonPath("$.numberOfEarnings").value(DEFAULT_NUMBER_OF_EARNINGS))
            .andExpect(jsonPath("$.numberOfRides").value(DEFAULT_NUMBER_OF_RIDES))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING));
    }

    @Test
    @Transactional
    void getNonExistingDeliveryMan() throws Exception {
        // Get the deliveryMan
        restDeliveryManMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDeliveryMan() throws Exception {
        // Initialize the database
        deliveryManRepository.saveAndFlush(deliveryMan);

        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();

        // Update the deliveryMan
        DeliveryMan updatedDeliveryMan = deliveryManRepository.findById(deliveryMan.getId()).get();
        // Disconnect from session so that the updates on updatedDeliveryMan are not directly saved in db
        em.detach(updatedDeliveryMan);
        updatedDeliveryMan
            .vehicle(UPDATED_VEHICLE)
            .numberOfEarnings(UPDATED_NUMBER_OF_EARNINGS)
            .numberOfRides(UPDATED_NUMBER_OF_RIDES)
            .rating(UPDATED_RATING);

        restDeliveryManMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDeliveryMan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDeliveryMan))
            )
            .andExpect(status().isOk());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
        DeliveryMan testDeliveryMan = deliveryManList.get(deliveryManList.size() - 1);
        assertThat(testDeliveryMan.getVehicle()).isEqualTo(UPDATED_VEHICLE);
        assertThat(testDeliveryMan.getNumberOfEarnings()).isEqualTo(UPDATED_NUMBER_OF_EARNINGS);
        assertThat(testDeliveryMan.getNumberOfRides()).isEqualTo(UPDATED_NUMBER_OF_RIDES);
        assertThat(testDeliveryMan.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void putNonExistingDeliveryMan() throws Exception {
        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();
        deliveryMan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeliveryManMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deliveryMan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deliveryMan))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDeliveryMan() throws Exception {
        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();
        deliveryMan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryManMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deliveryMan))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDeliveryMan() throws Exception {
        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();
        deliveryMan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryManMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deliveryMan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDeliveryManWithPatch() throws Exception {
        // Initialize the database
        deliveryManRepository.saveAndFlush(deliveryMan);

        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();

        // Update the deliveryMan using partial update
        DeliveryMan partialUpdatedDeliveryMan = new DeliveryMan();
        partialUpdatedDeliveryMan.setId(deliveryMan.getId());

        partialUpdatedDeliveryMan
            .numberOfEarnings(UPDATED_NUMBER_OF_EARNINGS)
            .numberOfRides(UPDATED_NUMBER_OF_RIDES)
            .rating(UPDATED_RATING);

        restDeliveryManMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeliveryMan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeliveryMan))
            )
            .andExpect(status().isOk());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
        DeliveryMan testDeliveryMan = deliveryManList.get(deliveryManList.size() - 1);
        assertThat(testDeliveryMan.getVehicle()).isEqualTo(DEFAULT_VEHICLE);
        assertThat(testDeliveryMan.getNumberOfEarnings()).isEqualTo(UPDATED_NUMBER_OF_EARNINGS);
        assertThat(testDeliveryMan.getNumberOfRides()).isEqualTo(UPDATED_NUMBER_OF_RIDES);
        assertThat(testDeliveryMan.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void fullUpdateDeliveryManWithPatch() throws Exception {
        // Initialize the database
        deliveryManRepository.saveAndFlush(deliveryMan);

        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();

        // Update the deliveryMan using partial update
        DeliveryMan partialUpdatedDeliveryMan = new DeliveryMan();
        partialUpdatedDeliveryMan.setId(deliveryMan.getId());

        partialUpdatedDeliveryMan
            .vehicle(UPDATED_VEHICLE)
            .numberOfEarnings(UPDATED_NUMBER_OF_EARNINGS)
            .numberOfRides(UPDATED_NUMBER_OF_RIDES)
            .rating(UPDATED_RATING);

        restDeliveryManMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeliveryMan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeliveryMan))
            )
            .andExpect(status().isOk());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
        DeliveryMan testDeliveryMan = deliveryManList.get(deliveryManList.size() - 1);
        assertThat(testDeliveryMan.getVehicle()).isEqualTo(UPDATED_VEHICLE);
        assertThat(testDeliveryMan.getNumberOfEarnings()).isEqualTo(UPDATED_NUMBER_OF_EARNINGS);
        assertThat(testDeliveryMan.getNumberOfRides()).isEqualTo(UPDATED_NUMBER_OF_RIDES);
        assertThat(testDeliveryMan.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void patchNonExistingDeliveryMan() throws Exception {
        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();
        deliveryMan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeliveryManMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, deliveryMan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deliveryMan))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDeliveryMan() throws Exception {
        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();
        deliveryMan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryManMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deliveryMan))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDeliveryMan() throws Exception {
        int databaseSizeBeforeUpdate = deliveryManRepository.findAll().size();
        deliveryMan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryManMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(deliveryMan))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DeliveryMan in the database
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDeliveryMan() throws Exception {
        // Initialize the database
        deliveryManRepository.saveAndFlush(deliveryMan);

        int databaseSizeBeforeDelete = deliveryManRepository.findAll().size();

        // Delete the deliveryMan
        restDeliveryManMockMvc
            .perform(delete(ENTITY_API_URL_ID, deliveryMan.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DeliveryMan> deliveryManList = deliveryManRepository.findAll();
        assertThat(deliveryManList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
