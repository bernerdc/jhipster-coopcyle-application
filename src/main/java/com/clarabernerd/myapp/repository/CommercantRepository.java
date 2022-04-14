package com.clarabernerd.myapp.repository;

import com.clarabernerd.myapp.domain.Commercant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Commercant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommercantRepository extends JpaRepository<Commercant, Long> {}
