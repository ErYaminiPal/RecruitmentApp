package net.marsbytes.app.recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Applicant.
 */
@Entity
@Table(name = "applicant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Applicant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "summary")
    private String summary;

    @Column(name = "c_tc")
    private Integer cTC;

    @Column(name = "e_ctc")
    private Integer eCTC;

    @Column(name = "highest_education")
    private String highestEducation;

    @OneToMany(mappedBy = "applicant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "applicant", "jobs" }, allowSetters = true)
    private Set<Application> applications = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Applicant id(Long id) {
        this.id = id;
        return this;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Applicant firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Applicant lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Applicant email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public Applicant phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSummary() {
        return this.summary;
    }

    public Applicant summary(String summary) {
        this.summary = summary;
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getcTC() {
        return this.cTC;
    }

    public Applicant cTC(Integer cTC) {
        this.cTC = cTC;
        return this;
    }

    public void setcTC(Integer cTC) {
        this.cTC = cTC;
    }

    public Integer geteCTC() {
        return this.eCTC;
    }

    public Applicant eCTC(Integer eCTC) {
        this.eCTC = eCTC;
        return this;
    }

    public void seteCTC(Integer eCTC) {
        this.eCTC = eCTC;
    }

    public String getHighestEducation() {
        return this.highestEducation;
    }

    public Applicant highestEducation(String highestEducation) {
        this.highestEducation = highestEducation;
        return this;
    }

    public void setHighestEducation(String highestEducation) {
        this.highestEducation = highestEducation;
    }

    public Set<Application> getApplications() {
        return this.applications;
    }

    public Applicant applications(Set<Application> applications) {
        this.setApplications(applications);
        return this;
    }

    public Applicant addApplication(Application application) {
        this.applications.add(application);
        application.setApplicant(this);
        return this;
    }

    public Applicant removeApplication(Application application) {
        this.applications.remove(application);
        application.setApplicant(null);
        return this;
    }

    public void setApplications(Set<Application> applications) {
        if (this.applications != null) {
            this.applications.forEach(i -> i.setApplicant(null));
        }
        if (applications != null) {
            applications.forEach(i -> i.setApplicant(this));
        }
        this.applications = applications;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Applicant)) {
            return false;
        }
        return id != null && id.equals(((Applicant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Applicant{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", summary='" + getSummary() + "'" +
            ", cTC=" + getcTC() +
            ", eCTC=" + geteCTC() +
            ", highestEducation='" + getHighestEducation() + "'" +
            "}";
    }
}
