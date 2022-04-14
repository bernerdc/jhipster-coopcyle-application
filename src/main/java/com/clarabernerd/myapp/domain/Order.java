package com.clarabernerd.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "pickup_addr")
    private String pickupAddr;

    @Column(name = "delivery_addr")
    private String deliveryAddr;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "commandes", "paiements" }, allowSetters = true)
    private Client client;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "orders" }, allowSetters = true)
    private DeliveryMan deliveryMan;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "orders", "payments", "cooperative" }, allowSetters = true)
    private Trader trader;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Order id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPickupAddr() {
        return this.pickupAddr;
    }

    public Order pickupAddr(String pickupAddr) {
        this.setPickupAddr(pickupAddr);
        return this;
    }

    public void setPickupAddr(String pickupAddr) {
        this.pickupAddr = pickupAddr;
    }

    public String getDeliveryAddr() {
        return this.deliveryAddr;
    }

    public Order deliveryAddr(String deliveryAddr) {
        this.setDeliveryAddr(deliveryAddr);
        return this;
    }

    public void setDeliveryAddr(String deliveryAddr) {
        this.deliveryAddr = deliveryAddr;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Order client(Client client) {
        this.setClient(client);
        return this;
    }

    public DeliveryMan getDeliveryMan() {
        return this.deliveryMan;
    }

    public void setDeliveryMan(DeliveryMan deliveryMan) {
        this.deliveryMan = deliveryMan;
    }

    public Order deliveryMan(DeliveryMan deliveryMan) {
        this.setDeliveryMan(deliveryMan);
        return this;
    }

    public Trader getTrader() {
        return this.trader;
    }

    public void setTrader(Trader trader) {
        this.trader = trader;
    }

    public Order trader(Trader trader) {
        this.setTrader(trader);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", pickupAddr='" + getPickupAddr() + "'" +
            ", deliveryAddr='" + getDeliveryAddr() + "'" +
            "}";
    }
}
