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
 * A Trader.
 */
@Entity
@Table(name = "trader")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Trader implements Serializable {

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

    @OneToMany(mappedBy = "trader")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "deliveryMan", "trader" }, allowSetters = true)
    private Set<Order> orders = new HashSet<>();

    @OneToMany(mappedBy = "trader")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "trader" }, allowSetters = true)
    private Set<Payment> payments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "commercants" }, allowSetters = true)
    private Cooperative cooperative;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Trader id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShopRating() {
        return this.shopRating;
    }

    public Trader shopRating(String shopRating) {
        this.setShopRating(shopRating);
        return this;
    }

    public void setShopRating(String shopRating) {
        this.shopRating = shopRating;
    }

    public Boolean getIsOpen() {
        return this.isOpen;
    }

    public Trader isOpen(Boolean isOpen) {
        this.setIsOpen(isOpen);
        return this;
    }

    public void setIsOpen(Boolean isOpen) {
        this.isOpen = isOpen;
    }

    public Integer getAverageDeliveryTime() {
        return this.averageDeliveryTime;
    }

    public Trader averageDeliveryTime(Integer averageDeliveryTime) {
        this.setAverageDeliveryTime(averageDeliveryTime);
        return this;
    }

    public void setAverageDeliveryTime(Integer averageDeliveryTime) {
        this.averageDeliveryTime = averageDeliveryTime;
    }

    public ZonedDateTime getOpeningTime() {
        return this.openingTime;
    }

    public Trader openingTime(ZonedDateTime openingTime) {
        this.setOpeningTime(openingTime);
        return this;
    }

    public void setOpeningTime(ZonedDateTime openingTime) {
        this.openingTime = openingTime;
    }

    public ZonedDateTime getClosingTime() {
        return this.closingTime;
    }

    public Trader closingTime(ZonedDateTime closingTime) {
        this.setClosingTime(closingTime);
        return this;
    }

    public void setClosingTime(ZonedDateTime closingTime) {
        this.closingTime = closingTime;
    }

    public String getTags() {
        return this.tags;
    }

    public Trader tags(String tags) {
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

    public Trader user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Order> getOrders() {
        return this.orders;
    }

    public void setOrders(Set<Order> orders) {
        if (this.orders != null) {
            this.orders.forEach(i -> i.setTrader(null));
        }
        if (orders != null) {
            orders.forEach(i -> i.setTrader(this));
        }
        this.orders = orders;
    }

    public Trader orders(Set<Order> orders) {
        this.setOrders(orders);
        return this;
    }

    public Trader addOrder(Order order) {
        this.orders.add(order);
        order.setTrader(this);
        return this;
    }

    public Trader removeOrder(Order order) {
        this.orders.remove(order);
        order.setTrader(null);
        return this;
    }

    public Set<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(Set<Payment> payments) {
        if (this.payments != null) {
            this.payments.forEach(i -> i.setTrader(null));
        }
        if (payments != null) {
            payments.forEach(i -> i.setTrader(this));
        }
        this.payments = payments;
    }

    public Trader payments(Set<Payment> payments) {
        this.setPayments(payments);
        return this;
    }

    public Trader addPayment(Payment payment) {
        this.payments.add(payment);
        payment.setTrader(this);
        return this;
    }

    public Trader removePayment(Payment payment) {
        this.payments.remove(payment);
        payment.setTrader(null);
        return this;
    }

    public Cooperative getCooperative() {
        return this.cooperative;
    }

    public void setCooperative(Cooperative cooperative) {
        this.cooperative = cooperative;
    }

    public Trader cooperative(Cooperative cooperative) {
        this.setCooperative(cooperative);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Trader)) {
            return false;
        }
        return id != null && id.equals(((Trader) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Trader{" +
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
