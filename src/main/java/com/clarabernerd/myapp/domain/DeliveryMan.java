package com.clarabernerd.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DeliveryMan.
 */
@Entity
@Table(name = "delivery_man")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DeliveryMan implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "vehicle")
    private String vehicle;

    @Column(name = "number_of_earnings")
    private Integer numberOfEarnings;

    @Column(name = "number_of_rides")
    private Integer numberOfRides;

    @Column(name = "rating")
    private String rating;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "deliveryMan")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "deliveryMan", "trader" }, allowSetters = true)
    private Set<Order> orders = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DeliveryMan id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVehicle() {
        return this.vehicle;
    }

    public DeliveryMan vehicle(String vehicle) {
        this.setVehicle(vehicle);
        return this;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public Integer getNumberOfEarnings() {
        return this.numberOfEarnings;
    }

    public DeliveryMan numberOfEarnings(Integer numberOfEarnings) {
        this.setNumberOfEarnings(numberOfEarnings);
        return this;
    }

    public void setNumberOfEarnings(Integer numberOfEarnings) {
        this.numberOfEarnings = numberOfEarnings;
    }

    public Integer getNumberOfRides() {
        return this.numberOfRides;
    }

    public DeliveryMan numberOfRides(Integer numberOfRides) {
        this.setNumberOfRides(numberOfRides);
        return this;
    }

    public void setNumberOfRides(Integer numberOfRides) {
        this.numberOfRides = numberOfRides;
    }

    public String getRating() {
        return this.rating;
    }

    public DeliveryMan rating(String rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DeliveryMan user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Order> getOrders() {
        return this.orders;
    }

    public void setOrders(Set<Order> orders) {
        if (this.orders != null) {
            this.orders.forEach(i -> i.setDeliveryMan(null));
        }
        if (orders != null) {
            orders.forEach(i -> i.setDeliveryMan(this));
        }
        this.orders = orders;
    }

    public DeliveryMan orders(Set<Order> orders) {
        this.setOrders(orders);
        return this;
    }

    public DeliveryMan addOrder(Order order) {
        this.orders.add(order);
        order.setDeliveryMan(this);
        return this;
    }

    public DeliveryMan removeOrder(Order order) {
        this.orders.remove(order);
        order.setDeliveryMan(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DeliveryMan)) {
            return false;
        }
        return id != null && id.equals(((DeliveryMan) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DeliveryMan{" +
            "id=" + getId() +
            ", vehicle='" + getVehicle() + "'" +
            ", numberOfEarnings=" + getNumberOfEarnings() +
            ", numberOfRides=" + getNumberOfRides() +
            ", rating='" + getRating() + "'" +
            "}";
    }
}
