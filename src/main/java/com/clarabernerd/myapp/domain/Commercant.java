package com.clarabernerd.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Commercant.
 */
@Entity
@Table(name = "commercant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Commercant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "shop_rating")
    private String shopRating;

    @Column(name = "is_open")
    private Boolean isOpen;

    @Column(name = "average_delivery_time")
    private Integer averageDeliveryTime;

    @Column(name = "opening_time")
    private ZonedDateTime openingTime;

    @Column(name = "closing_time")
    private ZonedDateTime closingTime;

    @Column(name = "tags")
    private String tags;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "commercant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "livreur", "commercant" }, allowSetters = true)
    private Set<Commande> commandes = new HashSet<>();

    @OneToMany(mappedBy = "commercant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "commercant" }, allowSetters = true)
    private Set<Paiement> paiements = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "commercants" }, allowSetters = true)
    private Cooperative cooperative;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Commercant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShopRating() {
        return this.shopRating;
    }

    public Commercant shopRating(String shopRating) {
        this.setShopRating(shopRating);
        return this;
    }

    public void setShopRating(String shopRating) {
        this.shopRating = shopRating;
    }

    public Boolean getIsOpen() {
        return this.isOpen;
    }

    public Commercant isOpen(Boolean isOpen) {
        this.setIsOpen(isOpen);
        return this;
    }

    public void setIsOpen(Boolean isOpen) {
        this.isOpen = isOpen;
    }

    public Integer getAverageDeliveryTime() {
        return this.averageDeliveryTime;
    }

    public Commercant averageDeliveryTime(Integer averageDeliveryTime) {
        this.setAverageDeliveryTime(averageDeliveryTime);
        return this;
    }

    public void setAverageDeliveryTime(Integer averageDeliveryTime) {
        this.averageDeliveryTime = averageDeliveryTime;
    }

    public ZonedDateTime getOpeningTime() {
        return this.openingTime;
    }

    public Commercant openingTime(ZonedDateTime openingTime) {
        this.setOpeningTime(openingTime);
        return this;
    }

    public void setOpeningTime(ZonedDateTime openingTime) {
        this.openingTime = openingTime;
    }

    public ZonedDateTime getClosingTime() {
        return this.closingTime;
    }

    public Commercant closingTime(ZonedDateTime closingTime) {
        this.setClosingTime(closingTime);
        return this;
    }

    public void setClosingTime(ZonedDateTime closingTime) {
        this.closingTime = closingTime;
    }

    public String getTags() {
        return this.tags;
    }

    public Commercant tags(String tags) {
        this.setTags(tags);
        return this;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Commercant user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Commande> getCommandes() {
        return this.commandes;
    }

    public void setCommandes(Set<Commande> commandes) {
        if (this.commandes != null) {
            this.commandes.forEach(i -> i.setCommercant(null));
        }
        if (commandes != null) {
            commandes.forEach(i -> i.setCommercant(this));
        }
        this.commandes = commandes;
    }

    public Commercant commandes(Set<Commande> commandes) {
        this.setCommandes(commandes);
        return this;
    }

    public Commercant addCommande(Commande commande) {
        this.commandes.add(commande);
        commande.setCommercant(this);
        return this;
    }

    public Commercant removeCommande(Commande commande) {
        this.commandes.remove(commande);
        commande.setCommercant(null);
        return this;
    }

    public Set<Paiement> getPaiements() {
        return this.paiements;
    }

    public void setPaiements(Set<Paiement> paiements) {
        if (this.paiements != null) {
            this.paiements.forEach(i -> i.setCommercant(null));
        }
        if (paiements != null) {
            paiements.forEach(i -> i.setCommercant(this));
        }
        this.paiements = paiements;
    }

    public Commercant paiements(Set<Paiement> paiements) {
        this.setPaiements(paiements);
        return this;
    }

    public Commercant addPaiement(Paiement paiement) {
        this.paiements.add(paiement);
        paiement.setCommercant(this);
        return this;
    }

    public Commercant removePaiement(Paiement paiement) {
        this.paiements.remove(paiement);
        paiement.setCommercant(null);
        return this;
    }

    public Cooperative getCooperative() {
        return this.cooperative;
    }

    public void setCooperative(Cooperative cooperative) {
        this.cooperative = cooperative;
    }

    public Commercant cooperative(Cooperative cooperative) {
        this.setCooperative(cooperative);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Commercant)) {
            return false;
        }
        return id != null && id.equals(((Commercant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Commercant{" +
            "id=" + getId() +
            ", shopRating='" + getShopRating() + "'" +
            ", isOpen='" + getIsOpen() + "'" +
            ", averageDeliveryTime=" + getAverageDeliveryTime() +
            ", openingTime='" + getOpeningTime() + "'" +
            ", closingTime='" + getClosingTime() + "'" +
            ", tags='" + getTags() + "'" +
            "}";
    }
}
