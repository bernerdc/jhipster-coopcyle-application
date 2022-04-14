package com.clarabernerd.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Payment.
 */
@Entity
@Table(name = "payment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "amount", nullable = false)
    private Integer amount;

    @NotNull
    @Column(name = "paiement_type", nullable = false)
    private String paiementType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "commandes", "paiements" }, allowSetters = true)
    private Client client;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "orders", "payments", "cooperative" }, allowSetters = true)
    private Trader trader;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Payment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAmount() {
        return this.amount;
    }

    public Payment amount(Integer amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getPaiementType() {
        return this.paiementType;
    }

    public Payment paiementType(String paiementType) {
        this.setPaiementType(paiementType);
        return this;
    }

    public void setPaiementType(String paiementType) {
        this.paiementType = paiementType;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Payment client(Client client) {
        this.setClient(client);
        return this;
    }

    public Trader getTrader() {
        return this.trader;
    }

    public void setTrader(Trader trader) {
        this.trader = trader;
    }

    public Payment trader(Trader trader) {
        this.setTrader(trader);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Payment)) {
            return false;
        }
        return id != null && id.equals(((Payment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", paiementType='" + getPaiementType() + "'" +
            "}";
    }
}
