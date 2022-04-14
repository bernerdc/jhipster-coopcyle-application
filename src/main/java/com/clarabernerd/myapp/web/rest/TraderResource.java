package com.clarabernerd.myapp.web.rest;

import com.clarabernerd.myapp.domain.Trader;
import com.clarabernerd.myapp.repository.TraderRepository;
import com.clarabernerd.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.clarabernerd.myapp.domain.Trader}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TraderResource {

    private final Logger log = LoggerFactory.getLogger(TraderResource.class);

    private static final String ENTITY_NAME = "trader";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TraderRepository traderRepository;

    public TraderResource(TraderRepository traderRepository) {
        this.traderRepository = traderRepository;
    }

    /**
     * {@code POST  /traders} : Create a new trader.
     *
     * @param trader the trader to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new trader, or with status {@code 400 (Bad Request)} if the trader has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/traders")
    public ResponseEntity<Trader> createTrader(@RequestBody Trader trader) throws URISyntaxException {
        log.debug("REST request to save Trader : {}", trader);
        if (trader.getId() != null) {
            throw new BadRequestAlertException("A new trader cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Trader result = traderRepository.save(trader);
        return ResponseEntity
            .created(new URI("/api/traders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /traders/:id} : Updates an existing trader.
     *
     * @param id the id of the trader to save.
     * @param trader the trader to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trader,
     * or with status {@code 400 (Bad Request)} if the trader is not valid,
     * or with status {@code 500 (Internal Server Error)} if the trader couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/traders/{id}")
    public ResponseEntity<Trader> updateTrader(@PathVariable(value = "id", required = false) final Long id, @RequestBody Trader trader)
        throws URISyntaxException {
        log.debug("REST request to update Trader : {}, {}", id, trader);
        if (trader.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trader.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!traderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Trader result = traderRepository.save(trader);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trader.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /traders/:id} : Partial updates given fields of an existing trader, field will ignore if it is null
     *
     * @param id the id of the trader to save.
     * @param trader the trader to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trader,
     * or with status {@code 400 (Bad Request)} if the trader is not valid,
     * or with status {@code 404 (Not Found)} if the trader is not found,
     * or with status {@code 500 (Internal Server Error)} if the trader couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/traders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Trader> partialUpdateTrader(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Trader trader
    ) throws URISyntaxException {
        log.debug("REST request to partial update Trader partially : {}, {}", id, trader);
        if (trader.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trader.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!traderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Trader> result = traderRepository
            .findById(trader.getId())
            .map(existingTrader -> {
                if (trader.getShopRating() != null) {
                    existingTrader.setShopRating(trader.getShopRating());
                }
                if (trader.getIsOpen() != null) {
                    existingTrader.setIsOpen(trader.getIsOpen());
                }
                if (trader.getAverageDeliveryTime() != null) {
                    existingTrader.setAverageDeliveryTime(trader.getAverageDeliveryTime());
                }
                if (trader.getOpeningTime() != null) {
                    existingTrader.setOpeningTime(trader.getOpeningTime());
                }
                if (trader.getClosingTime() != null) {
                    existingTrader.setClosingTime(trader.getClosingTime());
                }
                if (trader.getTags() != null) {
                    existingTrader.setTags(trader.getTags());
                }

                return existingTrader;
            })
            .map(traderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trader.getId().toString())
        );
    }

    /**
     * {@code GET  /traders} : get all the traders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of traders in body.
     */
    @GetMapping("/traders")
    public List<Trader> getAllTraders() {
        log.debug("REST request to get all Traders");
        return traderRepository.findAll();
    }

    /**
     * {@code GET  /traders/:id} : get the "id" trader.
     *
     * @param id the id of the trader to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the trader, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/traders/{id}")
    public ResponseEntity<Trader> getTrader(@PathVariable Long id) {
        log.debug("REST request to get Trader : {}", id);
        Optional<Trader> trader = traderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(trader);
    }

    /**
     * {@code DELETE  /traders/:id} : delete the "id" trader.
     *
     * @param id the id of the trader to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/traders/{id}")
    public ResponseEntity<Void> deleteTrader(@PathVariable Long id) {
        log.debug("REST request to delete Trader : {}", id);
        traderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
