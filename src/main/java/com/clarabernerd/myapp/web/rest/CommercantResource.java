package com.clarabernerd.myapp.web.rest;

import com.clarabernerd.myapp.domain.Commercant;
import com.clarabernerd.myapp.repository.CommercantRepository;
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
 * REST controller for managing {@link com.clarabernerd.myapp.domain.Commercant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CommercantResource {

    private final Logger log = LoggerFactory.getLogger(CommercantResource.class);

    private static final String ENTITY_NAME = "commercant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CommercantRepository commercantRepository;

    public CommercantResource(CommercantRepository commercantRepository) {
        this.commercantRepository = commercantRepository;
    }

    /**
     * {@code POST  /commercants} : Create a new commercant.
     *
     * @param commercant the commercant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new commercant, or with status {@code 400 (Bad Request)} if the commercant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/commercants")
    public ResponseEntity<Commercant> createCommercant(@RequestBody Commercant commercant) throws URISyntaxException {
        log.debug("REST request to save Commercant : {}", commercant);
        if (commercant.getId() != null) {
            throw new BadRequestAlertException("A new commercant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Commercant result = commercantRepository.save(commercant);
        return ResponseEntity
            .created(new URI("/api/commercants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /commercants/:id} : Updates an existing commercant.
     *
     * @param id the id of the commercant to save.
     * @param commercant the commercant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commercant,
     * or with status {@code 400 (Bad Request)} if the commercant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the commercant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/commercants/{id}")
    public ResponseEntity<Commercant> updateCommercant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Commercant commercant
    ) throws URISyntaxException {
        log.debug("REST request to update Commercant : {}, {}", id, commercant);
        if (commercant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commercant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commercantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Commercant result = commercantRepository.save(commercant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commercant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /commercants/:id} : Partial updates given fields of an existing commercant, field will ignore if it is null
     *
     * @param id the id of the commercant to save.
     * @param commercant the commercant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commercant,
     * or with status {@code 400 (Bad Request)} if the commercant is not valid,
     * or with status {@code 404 (Not Found)} if the commercant is not found,
     * or with status {@code 500 (Internal Server Error)} if the commercant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/commercants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Commercant> partialUpdateCommercant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Commercant commercant
    ) throws URISyntaxException {
        log.debug("REST request to partial update Commercant partially : {}, {}", id, commercant);
        if (commercant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commercant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commercantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Commercant> result = commercantRepository
            .findById(commercant.getId())
            .map(existingCommercant -> {
                if (commercant.getShopRating() != null) {
                    existingCommercant.setShopRating(commercant.getShopRating());
                }
                if (commercant.getIsOpen() != null) {
                    existingCommercant.setIsOpen(commercant.getIsOpen());
                }
                if (commercant.getAverageDeliveryTime() != null) {
                    existingCommercant.setAverageDeliveryTime(commercant.getAverageDeliveryTime());
                }
                if (commercant.getOpeningTime() != null) {
                    existingCommercant.setOpeningTime(commercant.getOpeningTime());
                }
                if (commercant.getClosingTime() != null) {
                    existingCommercant.setClosingTime(commercant.getClosingTime());
                }
                if (commercant.getTags() != null) {
                    existingCommercant.setTags(commercant.getTags());
                }

                return existingCommercant;
            })
            .map(commercantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commercant.getId().toString())
        );
    }

    /**
     * {@code GET  /commercants} : get all the commercants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of commercants in body.
     */
    @GetMapping("/commercants")
    public List<Commercant> getAllCommercants() {
        log.debug("REST request to get all Commercants");
        return commercantRepository.findAll();
    }

    /**
     * {@code GET  /commercants/:id} : get the "id" commercant.
     *
     * @param id the id of the commercant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the commercant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/commercants/{id}")
    public ResponseEntity<Commercant> getCommercant(@PathVariable Long id) {
        log.debug("REST request to get Commercant : {}", id);
        Optional<Commercant> commercant = commercantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(commercant);
    }

    /**
     * {@code DELETE  /commercants/:id} : delete the "id" commercant.
     *
     * @param id the id of the commercant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/commercants/{id}")
    public ResponseEntity<Void> deleteCommercant(@PathVariable Long id) {
        log.debug("REST request to delete Commercant : {}", id);
        commercantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
