package net.marsbytes.app.recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Process.
 */
@Entity
@Table(name = "process")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Process implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "process")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "process" }, allowSetters = true)
    private Set<Step> steps = new HashSet<>();

    @OneToMany(mappedBy = "process")
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

    public Process id(Long id) {
        this.id = id;
        return this;
    }

    public String getCode() {
        return this.code;
    }

    public Process code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return this.description;
    }

    public Process description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Step> getSteps() {
        return this.steps;
    }

    public Process steps(Set<Step> steps) {
        this.setSteps(steps);
        return this;
    }

    public Process addStep(Step step) {
        this.steps.add(step);
        step.setProcess(this);
        return this;
    }

    public Process removeStep(Step step) {
        this.steps.remove(step);
        step.setProcess(null);
        return this;
    }

    public void setSteps(Set<Step> steps) {
        if (this.steps != null) {
            this.steps.forEach(i -> i.setProcess(null));
        }
        if (steps != null) {
            steps.forEach(i -> i.setProcess(this));
        }
        this.steps = steps;
    }

    public Set<Jobs> getJobs() {
        return this.jobs;
    }

    public Process jobs(Set<Jobs> jobs) {
        this.setJobs(jobs);
        return this;
    }

    public Process addJobs(Jobs jobs) {
        this.jobs.add(jobs);
        jobs.setProcess(this);
        return this;
    }

    public Process removeJobs(Jobs jobs) {
        this.jobs.remove(jobs);
        jobs.setProcess(null);
        return this;
    }

    public void setJobs(Set<Jobs> jobs) {
        if (this.jobs != null) {
            this.jobs.forEach(i -> i.setProcess(null));
        }
        if (jobs != null) {
            jobs.forEach(i -> i.setProcess(this));
        }
        this.jobs = jobs;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Process)) {
            return false;
        }
        return id != null && id.equals(((Process) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Process{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
