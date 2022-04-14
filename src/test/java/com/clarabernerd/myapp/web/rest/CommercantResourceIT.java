package com.clarabernerd.myapp.web.rest;

import static com.clarabernerd.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.clarabernerd.myapp.IntegrationTest;
import com.clarabernerd.myapp.domain.Commercant;
import com.clarabernerd.myapp.repository.CommercantRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link CommercantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CommercantResourceIT {

    private static final String DEFAULT_SHOP_RATING = "AAAAAAAAAA";
    private static final String UPDATED_SHOP_RATING = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_OPEN = false;
    private static final Boolean UPDATED_IS_OPEN = true;

    private static final Integer DEFAULT_AVERAGE_DELIVERY_TIME = 1;
    private static final Integer UPDATED_AVERAGE_DELIVERY_TIME = 2;

    private static final ZonedDateTime DEFAULT_OPENING_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OPENING_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CLOSING_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CLOSING_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_TAGS = "AAAAAAAAAA";
    private static final String UPDATED_TAGS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/commercants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommercantRepository commercantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommercantMockMvc;

    private Commercant commercant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commercant createEntity(EntityManager em) {
        Commercant commercant = new Commercant()
            .shopRating(DEFAULT_SHOP_RATING)
            .isOpen(DEFAULT_IS_OPEN)
            .averageDeliveryTime(DEFAULT_AVERAGE_DELIVERY_TIME)
            .openingTime(DEFAULT_OPENING_TIME)
            .closingTime(DEFAULT_CLOSING_TIME)
            .tags(DEFAULT_TAGS);
        return commercant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commercant createUpdatedEntity(EntityManager em) {
        Commercant commercant = new Commercant()
            .shopRating(UPDATED_SHOP_RATING)
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .tags(UPDATED_TAGS);
        return commercant;
    }

    @BeforeEach
    public void initTest() {
        commercant = createEntity(em);
    }

    @Test
    @Transactional
    void createCommercant() throws Exception {
        int databaseSizeBeforeCreate = commercantRepository.findAll().size();
        // Create the Commercant
        restCommercantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercant)))
            .andExpect(status().isCreated());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeCreate + 1);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getShopRating()).isEqualTo(DEFAULT_SHOP_RATING);
        assertThat(testCommercant.getIsOpen()).isEqualTo(DEFAULT_IS_OPEN);
        assertThat(testCommercant.getAverageDeliveryTime()).isEqualTo(DEFAULT_AVERAGE_DELIVERY_TIME);
        assertThat(testCommercant.getOpeningTime()).isEqualTo(DEFAULT_OPENING_TIME);
        assertThat(testCommercant.getClosingTime()).isEqualTo(DEFAULT_CLOSING_TIME);
        assertThat(testCommercant.getTags()).isEqualTo(DEFAULT_TAGS);
    }

    @Test
    @Transactional
    void createCommercantWithExistingId() throws Exception {
        // Create the Commercant with an existing ID
        commercant.setId(1L);

        int databaseSizeBeforeCreate = commercantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommercantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercant)))
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCommercants() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        // Get all the commercantList
        restCommercantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commercant.getId().intValue())))
            .andExpect(jsonPath("$.[*].shopRating").value(hasItem(DEFAULT_SHOP_RATING)))
            .andExpect(jsonPath("$.[*].isOpen").value(hasItem(DEFAULT_IS_OPEN.booleanValue())))
            .andExpect(jsonPath("$.[*].averageDeliveryTime").value(hasItem(DEFAULT_AVERAGE_DELIVERY_TIME)))
            .andExpect(jsonPath("$.[*].openingTime").value(hasItem(sameInstant(DEFAULT_OPENING_TIME))))
            .andExpect(jsonPath("$.[*].closingTime").value(hasItem(sameInstant(DEFAULT_CLOSING_TIME))))
            .andExpect(jsonPath("$.[*].tags").value(hasItem(DEFAULT_TAGS)));
    }

    @Test
    @Transactional
    void getCommercant() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        // Get the commercant
        restCommercantMockMvc
            .perform(get(ENTITY_API_URL_ID, commercant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(commercant.getId().intValue()))
            .andExpect(jsonPath("$.shopRating").value(DEFAULT_SHOP_RATING))
            .andExpect(jsonPath("$.isOpen").value(DEFAULT_IS_OPEN.booleanValue()))
            .andExpect(jsonPath("$.averageDeliveryTime").value(DEFAULT_AVERAGE_DELIVERY_TIME))
            .andExpect(jsonPath("$.openingTime").value(sameInstant(DEFAULT_OPENING_TIME)))
            .andExpect(jsonPath("$.closingTime").value(sameInstant(DEFAULT_CLOSING_TIME)))
            .andExpect(jsonPath("$.tags").value(DEFAULT_TAGS));
    }

    @Test
    @Transactional
    void getNonExistingCommercant() throws Exception {
        // Get the commercant
        restCommercantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCommercant() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();

        // Update the commercant
        Commercant updatedCommercant = commercantRepository.findById(commercant.getId()).get();
        // Disconnect from session so that the updates on updatedCommercant are not directly saved in db
        em.detach(updatedCommercant);
        updatedCommercant
            .shopRating(UPDATED_SHOP_RATING)
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .tags(UPDATED_TAGS);

        restCommercantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCommercant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCommercant))
            )
            .andExpect(status().isOk());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getShopRating()).isEqualTo(UPDATED_SHOP_RATING);
        assertThat(testCommercant.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
        assertThat(testCommercant.getAverageDeliveryTime()).isEqualTo(UPDATED_AVERAGE_DELIVERY_TIME);
        assertThat(testCommercant.getOpeningTime()).isEqualTo(UPDATED_OPENING_TIME);
        assertThat(testCommercant.getClosingTime()).isEqualTo(UPDATED_CLOSING_TIME);
        assertThat(testCommercant.getTags()).isEqualTo(UPDATED_TAGS);
    }

    @Test
    @Transactional
    void putNonExistingCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, commercant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commercant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commercant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommercantWithPatch() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();

        // Update the commercant using partial update
        Commercant partialUpdatedCommercant = new Commercant();
        partialUpdatedCommercant.setId(commercant.getId());

        partialUpdatedCommercant
            .shopRating(UPDATED_SHOP_RATING)
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .tags(UPDATED_TAGS);

        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommercant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommercant))
            )
            .andExpect(status().isOk());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getShopRating()).isEqualTo(UPDATED_SHOP_RATING);
        assertThat(testCommercant.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
        assertThat(testCommercant.getAverageDeliveryTime()).isEqualTo(UPDATED_AVERAGE_DELIVERY_TIME);
        assertThat(testCommercant.getOpeningTime()).isEqualTo(DEFAULT_OPENING_TIME);
        assertThat(testCommercant.getClosingTime()).isEqualTo(DEFAULT_CLOSING_TIME);
        assertThat(testCommercant.getTags()).isEqualTo(UPDATED_TAGS);
    }

    @Test
    @Transactional
    void fullUpdateCommercantWithPatch() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();

        // Update the commercant using partial update
        Commercant partialUpdatedCommercant = new Commercant();
        partialUpdatedCommercant.setId(commercant.getId());

        partialUpdatedCommercant
            .shopRating(UPDATED_SHOP_RATING)
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .tags(UPDATED_TAGS);

        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommercant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommercant))
            )
            .andExpect(status().isOk());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getShopRating()).isEqualTo(UPDATED_SHOP_RATING);
        assertThat(testCommercant.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
        assertThat(testCommercant.getAverageDeliveryTime()).isEqualTo(UPDATED_AVERAGE_DELIVERY_TIME);
        assertThat(testCommercant.getOpeningTime()).isEqualTo(UPDATED_OPENING_TIME);
        assertThat(testCommercant.getClosingTime()).isEqualTo(UPDATED_CLOSING_TIME);
        assertThat(testCommercant.getTags()).isEqualTo(UPDATED_TAGS);
    }

    @Test
    @Transactional
    void patchNonExistingCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, commercant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commercant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commercant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(commercant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommercant() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeDelete = commercantRepository.findAll().size();

        // Delete the commercant
        restCommercantMockMvc
            .perform(delete(ENTITY_API_URL_ID, commercant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
