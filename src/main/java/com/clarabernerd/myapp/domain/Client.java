package com.clarabernerd.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "wallet_balance")
    private Integer walletBalance;

    @Column(name = "order_count")
    private Integer orderCount;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "livreur", "commercant" }, allowSetters = true)
    private Set<Commande> commandes = new HashSet<>();

    @OneToMany(mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "commercant" }, allowSetters = true)
    private Set<Paiement> paiements = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getWalletBalance() {
        return this.walletBalance;
    }

    public Client walletBalance(Integer walletBalance) {
        this.setWalletBalance(walletBalance);
        return this;
    }

    public void setWalletBalance(Integer walletBalance) {
        this.walletBalance = walletBalance;
    }

    public Integer getOrderCount() {
        return this.orderCount;
    }

    public Client orderCount(Integer orderCount) {
        this.setOrderCount(orderCount);
        return this;
    }

    public void setOrderCount(Integer orderCount) {
        this.orderCount = orderCount;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Client user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Commande> getCommandes() {
        return this.commandes;
    }

    public void setCommandes(Set<Commande> commandes) {
        if (this.commandes != null) {
            this.commandes.forEach(i -> i.setClient(null));
        }
        if (commandes != null) {
            commandes.forEach(i -> i.setClient(this));
        }
        this.commandes = commandes;
    }

    public Client commandes(Set<Commande> commandes) {
        this.setCommandes(commandes);
        return this;
    }

    public Client addCommande(Commande commande) {
        this.commandes.add(commande);
        commande.setClient(this);
        return this;
    }

    public Client removeCommande(Commande commande) {
        this.commandes.remove(commande);
        commande.setClient(null);
        return this;
    }

    public Set<Paiement> getPaiements() {
        return this.paiements;
    }

    public void setPaiements(Set<Paiement> paiements) {
        if (this.paiements != null) {
            this.paiements.forEach(i -> i.setClient(null));
        }
        if (paiements != null) {
            paiements.forEach(i -> i.setClient(this));
        }
        this.paiements = paiements;
    }

    public Client paiements(Set<Paiement> paiements) {
        this.setPaiements(paiements);
        return this;
    }

    public Client addPaiement(Paiement paiement) {
        this.paiements.add(paiement);
        paiement.setClient(this);
        return this;
    }

    public Client removePaiement(Paiement paiement) {
        this.paiements.remove(paiement);
        paiement.setClient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return id != null && id.equals(((Client) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", walletBalance=" + getWalletBalance() +
            ", orderCount=" + getOrderCount() +
            "}";
    }
}
