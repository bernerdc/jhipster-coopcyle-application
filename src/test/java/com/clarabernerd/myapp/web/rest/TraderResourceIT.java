package com.clarabernerd.myapp.web.rest;

import static com.clarabernerd.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.clarabernerd.myapp.IntegrationTest;
import com.clarabernerd.myapp.domain.Trader;
import com.clarabernerd.myapp.repository.TraderRepository;
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
 * Integration tests for the {@link TraderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TraderResourceIT {

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

    private static final String ENTITY_API_URL = "/api/traders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TraderRepository traderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTraderMockMvc;

    private Trader trader;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trader createEntity(EntityManager em) {
        Trader trader = new Trader()
            .shopRating(DEFAULT_SHOP_RATING)
            .isOpen(DEFAULT_IS_OPEN)
            .averageDeliveryTime(DEFAULT_AVERAGE_DELIVERY_TIME)
            .openingTime(DEFAULT_OPENING_TIME)
            .closingTime(DEFAULT_CLOSING_TIME)
            .tags(DEFAULT_TAGS);
        return trader;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trader createUpdatedEntity(EntityManager em) {
        Trader trader = new Trader()
            .shopRating(UPDATED_SHOP_RATING)
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .tags(UPDATED_TAGS);
        return trader;
    }

    @BeforeEach
    public void initTest() {
        trader = createEntity(em);
    }

    @Test
    @Transactional
    void createTrader() throws Exception {
        int databaseSizeBeforeCreate = traderRepository.findAll().size();
        // Create the Trader
        restTraderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trader)))
            .andExpect(status().isCreated());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeCreate + 1);
        Trader testTrader = traderList.get(traderList.size() - 1);
        assertThat(testTrader.getShopRating()).isEqualTo(DEFAULT_SHOP_RATING);
        assertThat(testTrader.getIsOpen()).isEqualTo(DEFAULT_IS_OPEN);
        assertThat(testTrader.getAverageDeliveryTime()).isEqualTo(DEFAULT_AVERAGE_DELIVERY_TIME);
        assertThat(testTrader.getOpeningTime()).isEqualTo(DEFAULT_OPENING_TIME);
        assertThat(testTrader.getClosingTime()).isEqualTo(DEFAULT_CLOSING_TIME);
        assertThat(testTrader.getTags()).isEqualTo(DEFAULT_TAGS);
    }

    @Test
    @Transactional
    void createTraderWithExistingId() throws Exception {
        // Create the Trader with an existing ID
        trader.setId(1L);

        int databaseSizeBeforeCreate = traderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTraderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trader)))
            .andExpect(status().isBadRequest());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTraders() throws Exception {
        // Initialize the database
        traderRepository.saveAndFlush(trader);

        // Get all the traderList
        restTraderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trader.getId().intValue())))
            .andExpect(jsonPath("$.[*].shopRating").value(hasItem(DEFAULT_SHOP_RATING)))
            .andExpect(jsonPath("$.[*].isOpen").value(hasItem(DEFAULT_IS_OPEN.booleanValue())))
            .andExpect(jsonPath("$.[*].averageDeliveryTime").value(hasItem(DEFAULT_AVERAGE_DELIVERY_TIME)))
            .andExpect(jsonPath("$.[*].openingTime").value(hasItem(sameInstant(DEFAULT_OPENING_TIME))))
            .andExpect(jsonPath("$.[*].closingTime").value(hasItem(sameInstant(DEFAULT_CLOSING_TIME))))
            .andExpect(jsonPath("$.[*].tags").value(hasItem(DEFAULT_TAGS)));
    }

    @Test
    @Transactional
    void getTrader() throws Exception {
        // Initialize the database
        traderRepository.saveAndFlush(trader);

        // Get the trader
        restTraderMockMvc
            .perform(get(ENTITY_API_URL_ID, trader.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trader.getId().intValue()))
            .andExpect(jsonPath("$.shopRating").value(DEFAULT_SHOP_RATING))
            .andExpect(jsonPath("$.isOpen").value(DEFAULT_IS_OPEN.booleanValue()))
            .andExpect(jsonPath("$.averageDeliveryTime").value(DEFAULT_AVERAGE_DELIVERY_TIME))
            .andExpect(jsonPath("$.openingTime").value(sameInstant(DEFAULT_OPENING_TIME)))
            .andExpect(jsonPath("$.closingTime").value(sameInstant(DEFAULT_CLOSING_TIME)))
            .andExpect(jsonPath("$.tags").value(DEFAULT_TAGS));
    }

    @Test
    @Transactional
    void getNonExistingTrader() throws Exception {
        // Get the trader
        restTraderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTrader() throws Exception {
        // Initialize the database
        traderRepository.saveAndFlush(trader);

        int databaseSizeBeforeUpdate = traderRepository.findAll().size();

        // Update the trader
        Trader updatedTrader = traderRepository.findById(trader.getId()).get();
        // Disconnect from session so that the updates on updatedTrader are not directly saved in db
        em.detach(updatedTrader);
        updatedTrader
            .shopRating(UPDATED_SHOP_RATING)
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .tags(UPDATED_TAGS);

        restTraderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTrader.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTrader))
            )
            .andExpect(status().isOk());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
        Trader testTrader = traderList.get(traderList.size() - 1);
        assertThat(testTrader.getShopRating()).isEqualTo(UPDATED_SHOP_RATING);
        assertThat(testTrader.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
        assertThat(testTrader.getAverageDeliveryTime()).isEqualTo(UPDATED_AVERAGE_DELIVERY_TIME);
        assertThat(testTrader.getOpeningTime()).isEqualTo(UPDATED_OPENING_TIME);
        assertThat(testTrader.getClosingTime()).isEqualTo(UPDATED_CLOSING_TIME);
        assertThat(testTrader.getTags()).isEqualTo(UPDATED_TAGS);
    }

    @Test
    @Transactional
    void putNonExistingTrader() throws Exception {
        int databaseSizeBeforeUpdate = traderRepository.findAll().size();
        trader.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTraderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, trader.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trader))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTrader() throws Exception {
        int databaseSizeBeforeUpdate = traderRepository.findAll().size();
        trader.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trader))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTrader() throws Exception {
        int databaseSizeBeforeUpdate = traderRepository.findAll().size();
        trader.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trader)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTraderWithPatch() throws Exception {
        // Initialize the database
        traderRepository.saveAndFlush(trader);

        int databaseSizeBeforeUpdate = traderRepository.findAll().size();

        // Update the trader using partial update
        Trader partialUpdatedTrader = new Trader();
        partialUpdatedTrader.setId(trader.getId());

        partialUpdatedTrader
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .openingTime(UPDATED_OPENING_TIME)
            .tags(UPDATED_TAGS);

        restTraderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrader.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrader))
            )
            .andExpect(status().isOk());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
        Trader testTrader = traderList.get(traderList.size() - 1);
        assertThat(testTrader.getShopRating()).isEqualTo(DEFAULT_SHOP_RATING);
        assertThat(testTrader.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
        assertThat(testTrader.getAverageDeliveryTime()).isEqualTo(UPDATED_AVERAGE_DELIVERY_TIME);
        assertThat(testTrader.getOpeningTime()).isEqualTo(UPDATED_OPENING_TIME);
        assertThat(testTrader.getClosingTime()).isEqualTo(DEFAULT_CLOSING_TIME);
        assertThat(testTrader.getTags()).isEqualTo(UPDATED_TAGS);
    }

    @Test
    @Transactional
    void fullUpdateTraderWithPatch() throws Exception {
        // Initialize the database
        traderRepository.saveAndFlush(trader);

        int databaseSizeBeforeUpdate = traderRepository.findAll().size();

        // Update the trader using partial update
        Trader partialUpdatedTrader = new Trader();
        partialUpdatedTrader.setId(trader.getId());

        partialUpdatedTrader
            .shopRating(UPDATED_SHOP_RATING)
            .isOpen(UPDATED_IS_OPEN)
            .averageDeliveryTime(UPDATED_AVERAGE_DELIVERY_TIME)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .tags(UPDATED_TAGS);

        restTraderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrader.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrader))
            )
            .andExpect(status().isOk());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
        Trader testTrader = traderList.get(traderList.size() - 1);
        assertThat(testTrader.getShopRating()).isEqualTo(UPDATED_SHOP_RATING);
        assertThat(testTrader.getIsOpen()).isEqualTo(UPDATED_IS_OPEN);
        assertThat(testTrader.getAverageDeliveryTime()).isEqualTo(UPDATED_AVERAGE_DELIVERY_TIME);
        assertThat(testTrader.getOpeningTime()).isEqualTo(UPDATED_OPENING_TIME);
        assertThat(testTrader.getClosingTime()).isEqualTo(UPDATED_CLOSING_TIME);
        assertThat(testTrader.getTags()).isEqualTo(UPDATED_TAGS);
    }

    @Test
    @Transactional
    void patchNonExistingTrader() throws Exception {
        int databaseSizeBeforeUpdate = traderRepository.findAll().size();
        trader.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTraderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, trader.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trader))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTrader() throws Exception {
        int databaseSizeBeforeUpdate = traderRepository.findAll().size();
        trader.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trader))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTrader() throws Exception {
        int databaseSizeBeforeUpdate = traderRepository.findAll().size();
        trader.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(trader)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trader in the database
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTrader() throws Exception {
        // Initialize the database
        traderRepository.saveAndFlush(trader);

        int databaseSizeBeforeDelete = traderRepository.findAll().size();

        // Delete the trader
        restTraderMockMvc
            .perform(delete(ENTITY_API_URL_ID, trader.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Trader> traderList = traderRepository.findAll();
        assertThat(traderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
