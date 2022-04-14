package com.clarabernerd.myapp.web.rest;

import com.clarabernerd.myapp.domain.DeliveryMan;
import com.clarabernerd.myapp.repository.DeliveryManRepository;
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
 * REST controller for managing {@link com.clarabernerd.myapp.domain.DeliveryMan}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DeliveryManResource {

    private final Logger log = LoggerFactory.getLogger(DeliveryManResource.class);

    private static final String ENTITY_NAME = "deliveryMan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DeliveryManRepository deliveryManRepository;

    public DeliveryManResource(DeliveryManRepository deliveryManRepository) {
        this.deliveryManRepository = deliveryManRepository;
    }

    /**
     * {@code POST  /delivery-men} : Create a new deliveryMan.
     *
     * @param deliveryMan the deliveryMan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new deliveryMan, or with status {@code 400 (Bad Request)} if the deliveryMan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/delivery-men")
    public ResponseEntity<DeliveryMan> createDeliveryMan(@RequestBody DeliveryMan deliveryMan) throws URISyntaxException {
        log.debug("REST request to save DeliveryMan : {}", deliveryMan);
        if (deliveryMan.getId() != null) {
            throw new BadRequestAlertException("A new deliveryMan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DeliveryMan result = deliveryManRepository.save(deliveryMan);
        return ResponseEntity
            .created(new URI("/api/delivery-men/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /delivery-men/:id} : Updates an existing deliveryMan.
     *
     * @param id the id of the deliveryMan to save.
     * @param deliveryMan the deliveryMan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deliveryMan,
     * or with status {@code 400 (Bad Request)} if the deliveryMan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the deliveryMan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/delivery-men/{id}")
    public ResponseEntity<DeliveryMan> updateDeliveryMan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DeliveryMan deliveryMan
    ) throws URISyntaxException {
        log.debug("REST request to update DeliveryMan : {}, {}", id, deliveryMan);
        if (deliveryMan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deliveryMan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deliveryManRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DeliveryMan result = deliveryManRepository.save(deliveryMan);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deliveryMan.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /delivery-men/:id} : Partial updates given fields of an existing deliveryMan, field will ignore if it is null
     *
     * @param id the id of the deliveryMan to save.
     * @param deliveryMan the deliveryMan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deliveryMan,
     * or with status {@code 400 (Bad Request)} if the deliveryMan is not valid,
     * or with status {@code 404 (Not Found)} if the deliveryMan is not found,
     * or with status {@code 500 (Internal Server Error)} if the deliveryMan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/delivery-men/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DeliveryMan> partialUpdateDeliveryMan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DeliveryMan deliveryMan
    ) throws URISyntaxException {
        log.debug("REST request to partial update DeliveryMan partially : {}, {}", id, deliveryMan);
        if (deliveryMan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deliveryMan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deliveryManRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DeliveryMan> result = deliveryManRepository
            .findById(deliveryMan.getId())
            .map(existingDeliveryMan -> {
                if (deliveryMan.getVehicle() != null) {
                    existingDeliveryMan.setVehicle(deliveryMan.getVehicle());
                }
                if (deliveryMan.getNumberOfEarnings() != null) {
                    existingDeliveryMan.setNumberOfEarnings(deliveryMan.getNumberOfEarnings());
                }
                if (deliveryMan.getNumberOfRides() != null) {
                    existingDeliveryMan.setNumberOfRides(deliveryMan.getNumberOfRides());
                }
                if (deliveryMan.getRating() != null) {
                    existingDeliveryMan.setRating(deliveryMan.getRating());
                }

                return existingDeliveryMan;
            })
            .map(deliveryManRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deliveryMan.getId().toString())
        );
    }

    /**
     * {@code GET  /delivery-men} : get all the deliveryMen.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of deliveryMen in body.
     */
    @GetMapping("/delivery-men")
    public List<DeliveryMan> getAllDeliveryMen() {
        log.debug("REST request to get all DeliveryMen");
        return deliveryManRepository.findAll();
    }

    /**
     * {@code GET  /delivery-men/:id} : get the "id" deliveryMan.
     *
     * @param id the id of the deliveryMan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the deliveryMan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/delivery-men/{id}")
    public ResponseEntity<DeliveryMan> getDeliveryMan(@PathVariable Long id) {
        log.debug("REST request to get DeliveryMan : {}", id);
        Optional<DeliveryMan> deliveryMan = deliveryManRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(deliveryMan);
    }

    /**
     * {@code DELETE  /delivery-men/:id} : delete the "id" deliveryMan.
     *
     * @param id the id of the deliveryMan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/delivery-men/{id}")
    public ResponseEntity<Void> deleteDeliveryMan(@PathVariable Long id) {
        log.debug("REST request to delete DeliveryMan : {}", id);
        deliveryManRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
