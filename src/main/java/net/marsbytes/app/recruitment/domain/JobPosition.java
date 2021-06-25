package net.marsbytes.app.recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A JobPosition.
 */
@Entity
@Table(name = "job_position")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class JobPosition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "jobPosition")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "applications", "jobCategories", "jobPosition", "clientOrganization", "process" }, allowSetters = true)
    private Set<Jobs> jobs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobPosition id(Long id) {
        this.id = id;
        return this;
    }

    public String getCode() {
        return this.code;
    }

    public JobPosition code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public JobPosition name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public JobPosition description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Jobs> getJobs() {
        return this.jobs;
    }

    public JobPosition jobs(Set<Jobs> jobs) {
        this.setJobs(jobs);
        return this;
    }

    public JobPosition addJobs(Jobs jobs) {
        this.jobs.add(jobs);
        jobs.setJobPosition(this);
        return this;
    }

    public JobPosition removeJobs(Jobs jobs) {
        this.jobs.remove(jobs);
        jobs.setJobPosition(null);
        return this;
    }

    public void setJobs(Set<Jobs> jobs) {
        if (this.jobs != null) {
            this.jobs.forEach(i -> i.setJobPosition(null));
        }
        if (jobs != null) {
            jobs.forEach(i -> i.setJobPosition(this));
        }
        this.jobs = jobs;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JobPosition)) {
            return false;
        }
        return id != null && id.equals(((JobPosition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "JobPosition{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
