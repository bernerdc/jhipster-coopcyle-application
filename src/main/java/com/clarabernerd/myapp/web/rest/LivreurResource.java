package com.clarabernerd.myapp.web.rest;

import com.clarabernerd.myapp.domain.Livreur;
import com.clarabernerd.myapp.repository.LivreurRepository;
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
 * REST controller for managing {@link com.clarabernerd.myapp.domain.Livreur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LivreurResource {

    private final Logger log = LoggerFactory.getLogger(LivreurResource.class);

    private static final String ENTITY_NAME = "livreur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LivreurRepository livreurRepository;

    public LivreurResource(LivreurRepository livreurRepository) {
        this.livreurRepository = livreurRepository;
    }

    /**
     * {@code POST  /livreurs} : Create a new livreur.
     *
     * @param livreur the livreur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new livreur, or with status {@code 400 (Bad Request)} if the livreur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/livreurs")
    public ResponseEntity<Livreur> createLivreur(@RequestBody Livreur livreur) throws URISyntaxException {
        log.debug("REST request to save Livreur : {}", livreur);
        if (livreur.getId() != null) {
            throw new BadRequestAlertException("A new livreur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Livreur result = livreurRepository.save(livreur);
        return ResponseEntity
            .created(new URI("/api/livreurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /livreurs/:id} : Updates an existing livreur.
     *
     * @param id the id of the livreur to save.
     * @param livreur the livreur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated livreur,
     * or with status {@code 400 (Bad Request)} if the livreur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the livreur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/livreurs/{id}")
    public ResponseEntity<Livreur> updateLivreur(@PathVariable(value = "id", required = false) final Long id, @RequestBody Livreur livreur)
        throws URISyntaxException {
        log.debug("REST request to update Livreur : {}, {}", id, livreur);
        if (livreur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, livreur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!livreurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Livreur result = livreurRepository.save(livreur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, livreur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /livreurs/:id} : Partial updates given fields of an existing livreur, field will ignore if it is null
     *
     * @param id the id of the livreur to save.
     * @param livreur the livreur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated livreur,
     * or with status {@code 400 (Bad Request)} if the livreur is not valid,
     * or with status {@code 404 (Not Found)} if the livreur is not found,
     * or with status {@code 500 (Internal Server Error)} if the livreur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/livreurs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Livreur> partialUpdateLivreur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Livreur livreur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Livreur partially : {}, {}", id, livreur);
        if (livreur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, livreur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!livreurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Livreur> result = livreurRepository
            .findById(livreur.getId())
            .map(existingLivreur -> {
                if (livreur.getVehicleType() != null) {
                    existingLivreur.setVehicleType(livreur.getVehicleType());
                }
                if (livreur.getTotalEarnings() != null) {
                    existingLivreur.setTotalEarnings(livreur.getTotalEarnings());
                }
                if (livreur.getTotalRides() != null) {
                    existingLivreur.setTotalRides(livreur.getTotalRides());
                }
                if (livreur.getTransporterRating() != null) {
                    existingLivreur.setTransporterRating(livreur.getTransporterRating());
                }

                return existingLivreur;
            })
            .map(livreurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, livreur.getId().toString())
        );
    }

    /**
     * {@code GET  /livreurs} : get all the livreurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of livreurs in body.
     */
    @GetMapping("/livreurs")
    public List<Livreur> getAllLivreurs() {
        log.debug("REST request to get all Livreurs");
        return livreurRepository.findAll();
    }

    /**
     * {@code GET  /livreurs/:id} : get the "id" livreur.
     *
     * @param id the id of the livreur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the livreur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/livreurs/{id}")
    public ResponseEntity<Livreur> getLivreur(@PathVariable Long id) {
        log.debug("REST request to get Livreur : {}", id);
        Optional<Livreur> livreur = livreurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(livreur);
    }

    /**
     * {@code DELETE  /livreurs/:id} : delete the "id" livreur.
     *
     * @param id the id of the livreur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/livreurs/{id}")
    public ResponseEntity<Void> deleteLivreur(@PathVariable Long id) {
        log.debug("REST request to delete Livreur : {}", id);
        livreurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
