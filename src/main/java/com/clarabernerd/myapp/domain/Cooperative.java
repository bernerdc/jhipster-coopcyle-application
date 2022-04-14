package com.clarabernerd.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Cooperative.
 */
@Entity
@Table(name = "cooperative")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Cooperative implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "shop_count")
    private Integer shopCount;

    @OneToMany(mappedBy = "cooperative")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "commandes", "paiements", "cooperative" }, allowSetters = true)
    private Set<Commercant> commercants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cooperative id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return this.city;
    }

    public Cooperative city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getShopCount() {
        return this.shopCount;
    }

    public Cooperative shopCount(Integer shopCount) {
        this.setShopCount(shopCount);
        return this;
    }

    public void setShopCount(Integer shopCount) {
        this.shopCount = shopCount;
    }

    public Set<Commercant> getCommercants() {
        return this.commercants;
    }

    public void setCommercants(Set<Commercant> commercants) {
        if (this.commercants != null) {
            this.commercants.forEach(i -> i.setCooperative(null));
        }
        if (commercants != null) {
            commercants.forEach(i -> i.setCooperative(this));
        }
        this.commercants = commercants;
    }

    public Cooperative commercants(Set<Commercant> commercants) {
        this.setCommercants(commercants);
        return this;
    }

    public Cooperative addCommercant(Commercant commercant) {
        this.commercants.add(commercant);
        commercant.setCooperative(this);
        return this;
    }

    public Cooperative removeCommercant(Commercant commercant) {
        this.commercants.remove(commercant);
        commercant.setCooperative(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cooperative)) {
            return false;
        }
        return id != null && id.equals(((Cooperative) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cooperative{" +
            "id=" + getId() +
            ", city='" + getCity() + "'" +
            ", shopCount=" + getShopCount() +
            "}";
    }
}
